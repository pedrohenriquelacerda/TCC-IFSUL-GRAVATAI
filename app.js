var createError = require("http-errors");
var express = require("express");
var path = require("path");
require('dotenv').config();
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const googleRouter = require("./routes/google");
const loginRouter = require("./routes/login");

var app = express();

// Middleware de autenticação
function authenticationMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.logged = true;
    res.locals.id = req.session.passport.user.id;
    res.locals.imagem = req.session.passport.user.imagem;
    res.locals.nome = req.session.passport.user.nome;
    return next();
  }
  if (req.path == "/google/callback") return next();
  if (req.path === "/login") return next(); // Evita redirecionamento se já estiver na página de login
  res.redirect("/login?erro=1");
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

// Configuração de sessão
app.use(
  session({
    store: new MySQLStore({
      host: "localhost",
      port: "3306",
      user: "root",
      password: "",
      database: "monif",
    }),
    secret: "2C44-4D44-WppQ38S",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }, //30min
  })
);

// Inicialização do Passport
require("./auth")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Middleware para configurar variável global
app.use((req, res, next) => {
  res.locals.title = "Erro";
  res.locals.logged = false;
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/google", googleRouter);
app.use("/login", loginRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
