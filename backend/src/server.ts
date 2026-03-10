import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sequelize from './db/conn';

//importa models
import Admin from './models/Admin';
import Registro from './models/Registro';


//importa controller
import authRoutes from './routes/authRoutes'

import { conexaoBanco } from './db/conn';

const app: Application = express();

//middleware de seguranca para esconder cabecalhos sensiveis
app.use(helmet()); 
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || 'http://localhost:5173' 
}));

app.use(express.json()); //permite ler o body em json
app.use(cookieParser()); //manipulacao dos HttpOnly Cookies para o JWT

//protecao contra ataques
const limite = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutos
    max: 200, //limite de 200 requisicoes por ip
    message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
//app.use(limite);

const PORT = process.env.PORT || 3000;

app.use('/auth', authRoutes)

//testa conexao com o banco
conexaoBanco().then(async () => {
    console.log("Verificando modelo:", Admin.name); 
    console.log('Verificando modelo:', Registro.name)
    await sequelize.sync({ force: false }); 
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta: ${PORT}`);
    });
});