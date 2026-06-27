import 'dotenv/config';
import bcrypt from 'bcryptjs';
import sequelize, { conexaoBanco } from '../db/conn';
import Admin from '../models/Admin';
import Registro from '../models/Registro';
import { encriptar } from '../helpers/criptoHelper';

async function bootstrapInicial() {
  const nome = process.env.ADMIN_INICIAL_NOME;
  const email = process.env.ADMIN_INICIAL_EMAIL;
  const senha = process.env.ADMIN_INICIAL_SENHA;

  if (!nome || !email || !senha) {
    throw new Error('Defina ADMIN_INICIAL_NOME, ADMIN_INICIAL_EMAIL e ADMIN_INICIAL_SENHA no .env para executar o bootstrap inicial.');
  }

  await conexaoBanco();
  await sequelize.sync({ alter: true });

  console.log('Modelos carregados:', Admin.name, Registro.name);

  const emailEncriptado = encriptar(email);
  const adminExistente = await Admin.findOne({ where: { email: emailEncriptado } });

  if (adminExistente) {
    console.log('Administrador inicial já existe. Nenhuma alteração foi necessária.');
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const senhaHash = await bcrypt.hash(senha, salt);

  await Admin.create({
    nome,
    email: emailEncriptado,
    senha: senhaHash,
  });

  console.log('Administrador inicial criado com sucesso.');
}

bootstrapInicial()
  .catch((error) => {
    console.error('Falha no bootstrap inicial:', error);
    process.exit(1);
  })
  .finally(async () => {
    await sequelize.close();
  });
