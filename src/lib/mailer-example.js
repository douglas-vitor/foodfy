/*
REQUISITOS:
1. Ter uma conta no site https://mailtrap.io/
2. Configurar este arquivo com seus dados de autenticação
3. Renomear este arquivo para mailer.js para que a aplicação comece a utiliza-lo.
*/

const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "",
        pass: ""
    }
});