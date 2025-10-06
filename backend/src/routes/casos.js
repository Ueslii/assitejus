import express from "express";
import { criarNovoCaso } from "../controllers/casosController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Define que esta rota pode receber um arquivo de áudio e até 10 de documentos
router.post(
  "/novo",
  upload.fields([
    { name: "audio", maxCount: 2 },
    { name: "documentos", maxCount: 10 },
  ]),
  criarNovoCaso
);

export default router;
