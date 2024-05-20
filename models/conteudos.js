const { data } = require("autoprefixer");
const database = require("../db");
const Sequelize = require("sequelize");

const Conteudos = database.define("conteudos", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  id_disciplina: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: "disciplinas", key: "id" },
  },
  descricao: { type: Sequelize.STRING, allowNull: false },
  arquivo: { type: Sequelize.STRING, allowNull: true },
  id_conteudo: { type: Sequelize.INTEGER, allowNull: false },
  data: { type: Sequelize.STRING, allowNull: false },
});

module.exports = Conteudos;
