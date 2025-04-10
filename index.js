const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.json());

let derivSignal = null;
let weltradeSignal = null;

const chatid = process.env.CHAT_ID
const token = process.env.BOT_TOKEN

// ✅ Verifica conexión
app.get('/ping', (req, res) => {
  res.json({ status: "ok", message: "Servidor MT5 en línea ✅" });
});

// ✅ BOT ENVÍA señal para Deriv
app.post('/mt5/deriv/signal', (req, res) => {
  derivSignal = req.body;
  console.log("📥 Señal Deriv recibida:", derivSignal);
  res.json({ status: "ok" });
});

// ✅ MT5 CONSULTA señal para Deriv
app.get('/mt5/deriv/execute', (req, res) => {
  if (!derivSignal) return res.status(204).send(); // No Content
  const signal = derivSignal;
  derivSignal = null; // consumirla
  res.json(signal);
});

// ✅ BOT ENVÍA señal para Weltrade
app.post('/mt5/weltrade/signal', (req, res) => {
  weltradeSignal = req.body;
  console.log("📥 Señal Weltrade recibida:", weltradeSignal);
  res.json({ status: "ok" });
});

// ✅ MT5 CONSULTA señal para Weltrade
app.get('/mt5/weltrade/execute', (req, res) => {
  if (!weltradeSignal) return res.status(204).send(); // No Content
  const signal = weltradeSignal;
  weltradeSignal = null; // consumirla
  res.json(signal);
});

app.post('/mt5/report', (req, res) => {
  const report = req.body;
  console.log("📨 Reporte recibido desde MT5:", report);

  // Aquí podés reenviarlo a Telegram si querés
  res.json({ status: "ok" });
});

app.post('/mt5/report', async (req, res) => {
  const report = req.body;
  console.log("📨 Reporte desde MT5:", report);

//   const message = `
// ✅ Orden ejecutada en MT5:
// • Símbolo: ${report.symbol}
// • Dirección: ${report.side}
// • Entrada: ${report.entry_price}
// • SL: ${report.sl}
// • TP1: ${report.tp1}
// • TP2: ${report.tp2}
//   `.trim();

  const message = "Listo!!";

  console.log(message);

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatid,
      text: message
    });

    console.log(` Token ${token}`);
    console.log(` chatid ${chatid}`);

    res.json({ status: "ok" });
  } catch (e) {
    console.error("❌ Error enviando a Telegram:", e.message);
    res.status(500).send("Error");
  }
});

// 🟢 Inicia servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
