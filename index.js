const express = require('express');
const app = express();
app.use(express.json());

let derivSignal = null;
let weltradeSignal = null;

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

// 🟢 Inicia servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
