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

// caminho da pasta de cache
const CACHE_DIR = path.join(__dirname, '../../public/uploads/cache');

// garante que a pasta de cache exista
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}


//função para gerar o cache de uma imagem antecipadamente.
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
      .resize({ width: 2048, withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 90, effort: 4 });

    // tratamento de erro no download/transformação
    response.data.on('error', (err: any) => console.error(`✗ Erro no stream do Drive (${fileId}):`, err.message));
    transformer.on('error', (err: any) => console.error(`✗ Erro no Sharp (${fileId}):`, err.message));

    await response.data.pipe(transformer).toFile(cachePath);
    console.log(`✓ Pre-cache concluído: ${fileId}`);
  } catch (error: any) {
    console.error(`✗ Erro no pre-cache (${fileId}):`, error.message);
  }
};


 // google drive -> sharp -> cache -> resposta

export const getImagemStream = async (fileId: string, res: Response) => {
  const cachePath = path.join(CACHE_DIR, `${fileId}.webp`);

  // verifica se ja existe no cache
  if (fs.existsSync(cachePath)) {
    console.log(`✓ Servindo do Cache Local: ${fileId}`);
    res.setHeader('Content-Type', 'image/webp');
    return fs.createReadStream(cachePath).pipe(res);
  }

  // se não existir, buscar no Google Drive
  console.log(`⚠ Baixando do Google e Gerando Cache: ${fileId}`);
  try {
    const response = await drive.files.get(
      { fileId, alt: 'media', supportsAllDrives: true },
      { responseType: 'stream' }
    );

    //transformador sharp otimizado para qualidade e desempenho, focado em telas modernas de alta resolução
    const transformer = sharp()
      .rotate()
      .resize({ width: 2560, withoutEnlargement: true, fit: 'inside' })
      .sharpen({ sigma: 1.2, m1: 0, m2: 2 })
      .webp({
        quality: 95, 
        effort: 4,   
        smartSubsample: true 
      });

    //tratamento de erro no download do drive
    response.data.on('error', (err: any) => {
      console.error('✗ Erro no stream do Google Drive:', err.message);
      if (!res.headersSent) res.status(503).send('Erro na origem dos dados.');
    });

    //tratamento de erro no sharp
    transformer.on('error', (err: any) => {
      console.error('✗ Erro no processamento Sharp:', err.message);
      if (!res.headersSent) res.status(500).send('Erro ao processar imagem.');
    });

    //definir cabeçalho antes do pipe
    res.setHeader('Content-Type', 'image/webp');

    //pipeline: Drive -> Sharp -> [Arquivo Cache + Resposta Express]
    const processedStream = response.data.pipe(transformer);

    //salvar no cache e enviar para a resposta simultaneamente
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

 // obtem o stream da imagem original diretamente do Drive
 
export const getImagemOriginalStream = async (fileId: string, res: Response): Promise<void> => {
    try {
        const response = await drive.files.get(
            { fileId, alt: 'media', supportsAllDrives: true },
            { responseType: 'stream' }
        );

        //define headers básicos
        res.setHeader('Content-Type', 'image/jpeg'); // Fallback comum
        res.setHeader('Cache-Control', 'public, max-age=3600');

        const dataStream = response.data as any;

        dataStream
            .on('error', (err: any) => {
                console.error('✗ Erro no stream do Google Drive (Original):', err);
                if (!res.headersSent) res.status(500).send('Erro no processamento da imagem original.');
            })
            .pipe(res);

    } catch (error: any) {
        console.error('✗ Erro ao buscar imagem original no Google Drive:', error.message);
        if (!res.headersSent) {
            res.status(error.code || 500).send(error.message || 'Erro ao buscar imagem original.');
        }
    }
};
