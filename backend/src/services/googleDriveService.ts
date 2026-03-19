import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { Response } from 'express';
import sharp from 'sharp';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../google-credentials.json'),
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

// Caminho da pasta de cache
const CACHE_DIR = path.join(__dirname, '../../public/uploads/cache');

// Garante que a pasta de cache exista
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * Função para gerar o cache de uma imagem antecipadamente.
 */
export const preCacheImagem = async (fileId: string) => {
  const cachePath = path.join(CACHE_DIR, `${fileId}.webp`);
  
  // Se já existe, não faz nada
  if (fs.existsSync(cachePath)) return;

  try {
    const response = await drive.files.get(
      { fileId, alt: 'media', supportsAllDrives: true },
      { responseType: 'stream' }
    );

    const transformer = sharp()
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 75 });

    await response.data.pipe(transformer).toFile(cachePath);
    console.log(`✓ Pre-cache concluído: ${fileId}`);
  } catch (error: any) {
    console.error(`✗ Erro no pre-cache (${fileId}):`, error.message);
  }
};

/**
 * Streams a file from Google Drive, optimizes with Sharp, caches to disk, and sends to response.
 */
export const getImagemStream = async (fileId: string, res: Response) => {
  const cachePath = path.join(CACHE_DIR, `${fileId}.webp`);

  // 1. Verificar se já existe no cache
  if (fs.existsSync(cachePath)) {
    console.log(`✓ Servindo do Cache Local: ${fileId}`);
    res.setHeader('Content-Type', 'image/webp');
    return fs.createReadStream(cachePath).pipe(res);
  }

  // 2. Se não existir, buscar no Google Drive
  console.log(`⚠ Baixando do Google e Gerando Cache: ${fileId}`);
  try {
    const response = await drive.files.get(
      { fileId, alt: 'media', supportsAllDrives: true },
      { responseType: 'stream' }
    );

    // Transformador Sharp: Redimensiona (1200px), Rotate, WebP (75)
    const transformer = sharp()
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 75 });

    // Definir cabeçalho antes do pipe
    res.setHeader('Content-Type', 'image/webp');

    // Pipeline: Drive -> Sharp -> [Arquivo Cache + Resposta Express]
    const processedStream = response.data.pipe(transformer);

    // Salvar no cache e enviar para a resposta simultaneamente
    processedStream
      .clone() 
      .toFile(cachePath)
      .catch(err => console.error('✗ Erro ao salvar cache:', err));

    processedStream.pipe(res);

  } catch (error: any) {
    console.error('✗ Erro ao buscar imagem:', error.message);
    if (!res.headersSent) {
      res.status(404).send('Erro ao buscar imagem ou arquivo não encontrado.');
    }
  }
};
