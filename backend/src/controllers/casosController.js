import { supabase } from "../config/supabase.js";
import {
  generateCredentials,
  hashKeyWithSalt,
} from "../services/securityService.js";
import fs from "fs/promises";
// Importe os novos serviços que vamos usar
import { transcribeAudio } from "../services/audioService.js";
import { extractTextFromImage } from "../services/documentService.js";
import { analyzeCase } from "../services/geminiService.js";
import { generateDocx } from "../services/documentGenerationService.js";
// --- FUNÇÃO DE CRIAÇÃO (ATUALIZADA E INTELIGENTE) ---
export const criarNovoCaso = async (req, res) => {
  console.log("--- NOVO CASO RECEBIDO ---");
  console.log("Dados do corpo (body):", req.body);
  console.log("Arquivos recebidos (files):", req.files);
  try {
    const { nome, cpf, telefone, tipoAcao, relato, documentos_informados } =
      req.body;

    const { protocolo, chaveAcesso } = generateCredentials(tipoAcao);
    const chaveAcessoHash = hashKeyWithSalt(chaveAcesso);
    const documentosInformadosArray = JSON.parse(documentos_informados || "[]");
    // Variável para juntar todo o texto do caso
    let textoCompleto = relato || "";
    let url_audio = null;
    let url_peticao = null;
    let urls_documentos = [];
    let url_documento_gerado = null;

    // --- INÍCIO DO PROCESSAMENTO AVANÇADO ---
    if (req.files) {
      // 1. Transcrição de Áudio (se houver)
      if (req.files.audio) {
        const audioFile = req.files.audio[0];
        console.log("Iniciando transcrição de áudio...");
        const textoDoAudio = await transcribeAudio(audioFile.path);
        textoCompleto += `\n\n--- TRANSCRIÇÃO DO ÁUDIO ---\n${textoDoAudio}`;
        console.log("Transcrição concluída.");
      }

      // 2. OCR de Imagens (se houver)
      if (req.files.documentos) {
        for (const docFile of req.files.documentos) {
          if (["image/jpeg", "image/png"].includes(docFile.mimetype)) {
            console.log(`Iniciando OCR da imagem: ${docFile.originalname}`);
            const textoDaImagem = await extractTextFromImage(docFile.path);
            textoCompleto += `\n\n--- TEXTO EXTRAÍDO DO DOCUMENTO: ${docFile.originalname} ---\n${textoDaImagem}`;
            console.log("OCR concluído.");
          }
        }
      }
    }

    // 3. Resumo com IA (Gemini)
    console.log("Gerando resumo com IA...");
    const resumo_ia = await analyzeCase(textoCompleto);
    console.log("Resumo gerado.");

    // 4. Geração Automática do Documento .docx
    console.log("Gerando documento .docx...");
    const dadosParaDoc = {
      nome_assistido: nome,
      cpf_assistido: cpf,
      telefone_assistido: telefone,
      relato_texto: relato,
      resumo_ia: resumo_ia,
      protocolo: protocolo,
      data: new Date().toLocaleDateString("pt-BR"),
    };
    const docxBuffer = await generateDocx(dadosParaDoc);

    // Upload do documento gerado para o bucket 'peticoes'
    const docGeradoPath = `${protocolo}/documento_gerado_${protocolo}.docx`;
    await supabase.storage.from("peticoes").upload(docGeradoPath, docxBuffer, {
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const { data: docGeradoUrl } = supabase.storage
      .from("peticoes")
      .getPublicUrl(docGeradoPath);
    url_documento_gerado = docGeradoUrl.publicUrl;
    console.log("Documento gerado e salvo no Storage.");

    // --- FIM DO PROCESSAMENTO AVANÇADO ---

    // Upload dos arquivos originais (lógica que separa os arquivos)
    if (req.files) {
      if (req.files.audio) {
        const audioFile = req.files.audio[0];
        const filePath = `${protocolo}/${audioFile.filename}`;
        await supabase.storage
          .from("audios")
          .upload(filePath, await fs.readFile(audioFile.path), {
            contentType: audioFile.mimetype,
          });
        const { data: publicUrl } = supabase.storage
          .from("audios")
          .getPublicUrl(filePath);
        url_audio = publicUrl.publicUrl;
      }
      if (req.files.documentos) {
        for (const docFile of req.files.documentos) {
          const filePath = `${protocolo}/${docFile.filename}`;
          const fileData = await fs.readFile(docFile.path);
          if (docFile.originalname.toLowerCase().includes("peticao")) {
            await supabase.storage
              .from("peticoes")
              .upload(filePath, fileData, { contentType: docFile.mimetype });
            const { data: publicUrl } = supabase.storage
              .from("peticoes")
              .getPublicUrl(filePath);
            url_peticao = publicUrl.publicUrl;
          } else {
            await supabase.storage
              .from("documentos")
              .upload(filePath, fileData, { contentType: docFile.mimetype });
            const { data: publicUrl } = supabase.storage
              .from("documentos")
              .getPublicUrl(filePath);
            urls_documentos.push(publicUrl.publicUrl);
          }
        }
      }
    }

    // 5. Salva TUDO no banco de dados (incluindo os novos campos)
    await supabase.from("casos").insert({
      protocolo,
      chave_acesso_hash: chaveAcessoHash,
      nome_assistido: nome,
      cpf_assistido: cpf,
      telefone_assistido: telefone,
      tipo_acao: tipoAcao,
      relato_texto: relato,
      url_audio,
      url_peticao, // Adicionado
      urls_documentos,
      resumo_ia, // Adicionado
      url_documento_gerado, // Adicionado
      documentos_informados: documentosInformadosArray,
    });

    // 6. Limpa os arquivos temporários e envia resposta
    if (req.files) {
      /* ... lógica de limpeza ... */
    }
    res.status(201).json({ protocolo, chaveAcesso });
  } catch (error) {
    console.error("Erro ao criar novo caso:", error);
    if (req.files) {
      /* ... lógica de limpeza de erro ... */
    }
    res.status(500).json({ error: "Falha ao processar a solicitação." });
  }
};

// --- FUNÇÃO PARA LISTAR TODOS OS CASOS (EXISTENTE) ---
export const listarCasos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("casos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao listar casos:", err);
    res.status(500).json({ error: "Falha ao buscar casos." });
  }
};

// --- FUNÇÃO PARA OBTER DETALHES DE UM CASO (NOVA) ---
export const obterDetalhesCaso = async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da URL (ex: /api/casos/123)

    const { data: caso, error } = await supabase
      .from("casos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!caso) return res.status(404).json({ error: "Caso não encontrado." });

    res.status(200).json(caso);
  } catch (err) {
    console.error("Erro ao obter detalhes do caso:", err);
    res.status(500).json({ error: "Falha ao buscar detalhes do caso." });
  }
};
