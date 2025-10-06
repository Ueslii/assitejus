import {
  generateCredentials,
  hashKeyWithSalt,
} from "../services/securityService.js";
import { supabase } from "../config/supabase.js";
import fs from "fs/promises"; // Usamos a versão de promessas do 'fs'
import path from "path";

export const criarNovoCaso = async (req, res) => {
  console.log("--- NOVO CASO RECEBIDO ---");
  console.log("Dados do corpo (body):", req.body);
  console.log("Arquivos recebidos (files):", req.files);
  try {
    const { nome, cpf, telefone, tipoAcao, relato } = req.body;

    // 1. Gera protocolo e chave de acesso (e seu hash)
    const { protocolo, chaveAcesso } = generateCredentials(tipoAcao);
    const chaveAcessoHash = hashKeyWithSalt(chaveAcesso);

    let url_audio = null;
    let urls_documentos = [];

    // 2. Faz upload dos arquivos para o Supabase Storage
    if (req.files) {
      // Processa o áudio
      if (req.files.audio) {
        const audioFile = req.files.audio[0];
        console.log(
          `Tentando fazer upload do arquivo de áudio: ${audioFile.originalname}`
        ); // <-- Log de intenção

        const filePath = `${protocolo}/${audioFile.filename}`;
        const fileData = await fs.readFile(audioFile.path);

        const { error } = await supabase.storage
          .from("audios") // <-- Verifique se este nome está correto!
          .upload(filePath, fileData, { contentType: audioFile.mimetype });

        if (error) {
          // SE HOUVER UM ERRO NO SUPABASE, ELE SERÁ MOSTRADO AQUI
          console.error("ERRO DO SUPABASE (Áudio):", error);
          throw new Error(`Erro no upload do áudio: ${error.message}`);
        }

        console.log(
          'SUCESSO: Upload do áudio para o bucket "audios" concluído.'
        ); // <-- Log de sucesso

        const { data: publicUrl } = supabase.storage
          .from("audios")
          .getPublicUrl(filePath);
        url_audio = publicUrl.publicUrl;
      }

      // Processa os documentos
      if (req.files.documentos) {
        for (const docFile of req.files.documentos) {
          const docPath = `${protocolo}/${docFile.filename}`;
          const docData = await fs.readFile(docFile.path);

          const { error: docError } = await supabase.storage
            .from("casos_anexos")
            .upload(docPath, docData, { contentType: docFile.mimetype });

          if (docError) throw docError;

          const { data: docPublicUrl } = supabase.storage
            .from("casos_anexos")
            .getPublicUrl(docPath);
          urls_documentos.push(docPublicUrl.publicUrl);
        }
      }
    }

    // 3. Insere os dados na tabela 'casos' do Supabase
    const { data, error: dbError } = await supabase
      .from("casos")
      .insert({
        protocolo,
        chave_acesso_hash: chaveAcessoHash,
        nome_assistido: nome,
        cpf_assistido: cpf,
        telefone_assistido: telefone,
        tipo_acao: tipoAcao,
        relato_texto: relato,
        url_audio,
        urls_documentos,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // 4. Limpa os arquivos temporários do servidor
    if (req.files) {
      for (const key in req.files) {
        for (const file of req.files[key]) {
          await fs.unlink(file.path);
        }
      }
    }

    // 5. Envia a resposta de sucesso para o frontend
    res.status(201).json({ protocolo, chaveAcesso });
  } catch (error) {
    console.error("Erro ao criar novo caso:", error);
    // Limpa arquivos temporários em caso de erro também
    if (req.files) {
      for (const key in req.files) {
        for (const file of req.files[key]) {
          try {
            await fs.unlink(file.path);
          } catch (e) {}
        }
      }
    }
    res.status(500).json({ error: "Falha ao processar a solicitação." });
  }
};
