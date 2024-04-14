const database = require("../db");
const Sequelize = require("sequelize");
const Chat = require("./chat");

const Usuarios = database.define("usuarios", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false },
  imagem: { type: Sequelize.STRING, allowNull: true },
});

Usuarios.hasMany(Chat, { foreignKey: "enviou_id" });
Usuarios.hasMany(Chat, { foreignKey: "recebeu_id" });

Chat.belongsTo(Usuarios, { foreignKey: "enviou_id" });
Chat.belongsTo(Usuarios, { foreignKey: "recebeu_id" });

module.exports = Usuarios;
