const express = require("express");
const router = express.Router();
const passport = require("passport");
const Disciplina = require("../models/disciplinas");
const Conteudos = require("../models/conteudos");

router.get("/", (req, res, next) => {
    res.render("monitoria/listar", { title: "Monitoria" });
    }
);

module.exports = router;