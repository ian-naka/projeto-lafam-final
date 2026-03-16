import multer from 'multer';

// configurando o multer para usar memory storage (buffer temporário em memória)
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export default upload;
