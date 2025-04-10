const express = require('express');
const app = express();

app.use(express.json());

let latestSignal = null;

// 🧪 Ping
app.get('/ping', (req, res) => {
  res.json({ status: "ok", message: "MT5 está conectado correctamente ✅" });
});

// 📥 Recibir señal desde el bot
app.post('/mt5/signal', (req, res) => {
  latestSignal = req.body;
  console.log("✅ Señal recibida:", latestSignal);
  res.json({ status: "ok", message: "Señal guardada" });
});

// 📤 Enviar señal a MT5 (una sola vez)
app.get('/mt5/execute', (req, res) => {
  if (!latestSignal) {
    return res.status(204).send(); // No Content
  }

  const signal = latestSignal;
  latestSignal = null; // consumirla
  res.json(signal);
});

// Escucha puerto asignado por Render o 5000 en local
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor corriendo en puerto ${PORT}`);
});