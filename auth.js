const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const Usuario = require("./models/usuarios");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require('dotenv').config();

module.exports = function (passport) {
  async function findUser(email) {
    let dadosBanco = await Usuario.findAll({
      raw: true,
      where: {
        email: email,
      },
    });
    if (dadosBanco.length > 0) return dadosBanco[0];
    else return null;
  }

  passport.serializeUser((user, done) => {
    done(null, { nome: user.nome, id: user.id, imagem: user.imagem });
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await Usuario.findAll({
        where: {
          id: id,
        },
      });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  /* 
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "senha" },
      async (email, senha, done) => {
        try {
          const user = await findUser(email);
          // usuário inexistente
          if (!user) {
            return done(null, false);
          }
          // comparando as senhas
          const isValid = bcrypt.compareSync(senha, user.senha);
          if (!isValid) return done(null, false);
          return done(null, user);
        } catch (err) {
          done(err, false);
        }
      }
    )
  );
  */

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await findUser(profile.emails[0].value);

          // Verifique se o e-mail termina com "edu.br"
          const isAcademicoEmail = profile.emails[0].value.endsWith(
            "edu.br"
          );

          if (!isAcademicoEmail) {
            return done(
              new Error("Somente e-mails acadêmicos são permitidos."),
              null
            );
          }

          if (existingUser) {
            // Se o usuário já existe, retorne o usuário existente
            return done(null, existingUser);
          } else {
            const newUser = {
              nome: profile.displayName,
              email: profile.emails[0].value,
              imagem: profile.photos[0].value,
            };

            const userInstance = await Usuario.create(newUser);

            return done(null, userInstance.toJSON());
          }
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
};
