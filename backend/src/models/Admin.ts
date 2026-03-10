import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/conn';

//estrutura da tabela admins
class Admin extends Model {
  declare id: number;
  declare nome: string;
  declare email: string;
  declare senha: string;
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, //e-mail exclusivo a um admin
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'admins', //nome da tabela no banco
  }
);

export default Admin;