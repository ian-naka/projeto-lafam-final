import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/conn';

class Registro extends Model {
  declare id: number;
  declare titulo: string;
  declare resumo: string;
  declare descricao: string;
  declare thumb: string;
  declare galeria: string[]; // Array de strings (URLs)
  declare categoria: 'Flora' | 'Funga' | 'Biomas' | 'Arqueologia' | 'Fauna';
  declare tags: string;
  declare localidade: string;
  declare especie?: string;
  declare familia?: string;
}

Registro.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, //garante link exclusivo
    },
    resumo: {
      type: DataTypes.STRING(500), //500 caracteres para resumo
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thumb: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    galeria: {
      type: DataTypes.JSON, //salva o url do objeto json em um Array
      allowNull: true,
    },
    categoria: {
      type: DataTypes.ENUM('Flora', 'Funga', 'Biomas', 'Arqueologia', 'Fauna'),
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    localidade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    especie: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    familia: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Registro',
    tableName: 'registros',
  }
);

export default Registro;