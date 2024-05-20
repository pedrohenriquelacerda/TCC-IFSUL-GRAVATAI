const database = require("../db");
const Sequelize = require("sequelize");
const Chat = require("./chat");
const Conteudos = require("./conteudos");

const Disciplinas = database.define("disciplinas", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome: { type: Sequelize.STRING, allowNull: false },
  descricao: { type: Sequelize.STRING, allowNull: false },
  imagem: { type: Sequelize.STRING, allowNull: true },
  id_conteudo: { type: Sequelize.INTEGER, allowNull: false },
});

Conteudos.belongsTo(Disciplinas, { foreignKey: "id_disciplina" });

module.exports = Disciplinas;
