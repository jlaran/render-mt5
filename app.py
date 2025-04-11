from flask import Flask, request, jsonify
from telethon import TelegramClient, events
from dotenv import load_dotenv
import os
import uuid
import threading
import re

load_dotenv()

# === Configuración ===
api_id = int(os.getenv("TELEGRAM_API"))
api_hash = os.getenv("TELEGRAM_API_HASH")
TELEGRAM_CHANNEL_PRUEBA = int(os.getenv("TELEGRAM_CHANNEL_PRUEBA"))
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

WATCHED_CHANNELS = [TELEGRAM_CHANNEL_PRUEBA]

client_telegram = TelegramClient('session', api_id, api_hash)
latest_signal = None

# === FLASK SERVER ===
app = Flask(__name__)

@app.route("/ping", methods=["GET"])
def ping():
    return {"status": "ok", "message": "Bot activo y esperando señales"}

@app.route("/mt5/execute", methods=["GET"])
def mt5_get_signal():
    global latest_signal
    if not latest_signal:
        return "", 204
    signal = latest_signal
    latest_signal = None
    return jsonify(signal)

@app.route("/mt5/report", methods=["POST"])
def mt5_report():
    data = request.json
    print("📩 Reporte recibido de MT5:", data)

    message = f"""✅ *MT5 ejecutó orden:*
• Símbolo: {data.get('symbol')}
• Dirección: {data.get('side')}
• Entrada: {data.get('entry_price')}
• SL: {data.get('sl')}
• TP1: {data.get('tp1', 'N/A')}
• TP2: {data.get('tp2', 'N/A')}
• Ganancia: {data.get('profit', 'N/A')}
"""

    try:
        client_telegram.loop.create_task(
            client_telegram.send_message(TELEGRAM_CHANNEL_PRUEBA, message)
        )
    except Exception as e:
        print("❌ Error al enviar a Telegram:", e)

    return {"status": "ok"}

# === TELEGRAM HANDLER DE EJEMPLO ===
@client_telegram.on(events.NewMessage(chats=WATCHED_CHANNELS))
async def handler(event):
    global latest_signal
    text = event.message.message
    print("📨 Mensaje recibido:", text)

    # Aquí podés meter lógica de parseo como hiciste antes
    if "compra" in text.lower() or "venta" in text.lower():
        signal = {
            "symbol": "BOOM 1000 Index",
            "side": "BUY" if "compra" in text.lower() else "SELL",
            "entry_price": 99300.0,
            "sl": 99000.0,
            "tps": [99400.0, 99500.0],
            "broker": "Deriv",
            "signal_id": str(uuid.uuid4())
        }
        latest_signal = signal
        print("✅ Señal guardada para MT5.")

# === MAIN ===
def start_flask():
    port = int(os.getenv("PORT", 5000))
    print(f"🌐 Flask escuchando en puerto {port}")
    app.run(host="0.0.0.0", port=port)

def main():
    print("🚀 Bot y backend iniciando...")
    flask_thread = threading.Thread(target=start_flask)
    flask_thread.start()
    with client_telegram:
        client_telegram.run_until_disconnected()

if __name__ == "__main__":
    main()
