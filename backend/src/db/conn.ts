import { Sequelize } from 'sequelize';
import 'dotenv/config';

//credenciais do env ou padrao de desenvolvimento
const dbName = process.env.DB_NAME || 'lafam_db';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';

//inicializacao do sequelize
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'mysql',
    timezone: '-03:00', //ajusta o fuso
    logging: false, //configuracao para o terminal nao ficar poluido
});

//teste de conexao antes de subir o servidor
export async function conexaoBanco() {
    try {
        await sequelize.authenticate();
        console.log('Conectamos no MySQL com Sequelize!');
    } catch (error) {
        console.error('Erro ao conectar no MySQL:', error);
        process.exit(1); //se nao se conectar no banco, derruba a aplicacao
    }
}

export default sequelize;