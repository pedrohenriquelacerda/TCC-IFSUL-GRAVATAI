const express = require("express");
const router = express.Router();
const passport = require("passport");
var GoogleStrategy = require('passport-google-oauth20').Strategy;


router.get("/", (req, res, next) => {
  let mensagemErro = null;
  let mensagemSucesso = null;
  if (req.query.erro == 1) {
    mensagemErro = "É necessário realizar login";
  } else if (req.query.erro == 2) {
    mensagemErro = "Email e/ou senha incorretos!";
  } else if (req.query.erro == 4) {
    mensagemErro = "Erro ao realizar login!";
  } else if (req.query.erro == 0){
    mensagemSucesso = "Cadastro realizado com sucesso";
  } else if (req.query.erro == 3){
    mensagemErro = "Email já utilizado na conta Google. Entre utilizando a conta Google!";
  }

  res.render("login", { title: "Login", mensagemErro, mensagemSucesso});
});

router.get("/google", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })(req, res, next);

  console.log(res.data);
});



router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login?erro=2", 
  })
);

module.exports = router;
