const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Verificação do Webhook
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "paulistana_token_verificacao";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFICADO");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recebimento de mensagens
app.post("/webhook", (req, res) => {
  console.log("MENSAGEM RECEBIDA:", JSON.stringify(req.body, null, 2));
  fs.appendFileSync("mensagens_recebidas.txt", JSON.stringify(req.body) + "\n");
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
