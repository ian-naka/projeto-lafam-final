import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/conn';

class Registro extends Model {
  public id!: number;
  public titulo!: string;
  public resumo!: string;
  public descricao!: string;
  public thumb!: string;
  public galeria!: string[]; // Array de strings (URLs)
  public categoria!: 'Flora' | 'Funga' | 'Biomas' | 'Arqueologia' | 'Fauna';
  public tags!: string;
  public localidade!: string;
  public especie?: string;
  public familia?: string;
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