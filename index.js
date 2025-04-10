const express = require('express');
const app = express();

app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ status: "ok", message: "todo bien 🔁" });
});

app.get('/', (req, res) => {
  res.send("🌐 Servidor en línea");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});