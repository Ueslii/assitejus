import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const transcribeAudio = async (audioPath) => {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      language: "pt",
    });
    return transcription.text;
  } catch (error) {
    console.error("Erro na transcrição:", error);
    throw new Error("Falha ao transcrever áudio");
  }
};
