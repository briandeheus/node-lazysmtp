var mail = require("./index").mail;
console.log("mail:", mail);
mail     = new mail("lol.net", true);
mail.start();
