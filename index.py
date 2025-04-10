# bridge_mt5.py
from flask import Flask, request, jsonify

app = Flask(__name__)
latest_signal = None

@app.route('/mt5/execute', methods=['GET'])
def get_latest_signal():
    global latest_signal
    if latest_signal:
        signal = latest_signal
        latest_signal = None  # Consumida
        return jsonify(signal)
    return '', 204  # No hay señal

@app.route('/mt5/signal', methods=['POST'])
def receive_signal():
    global latest_signal
    signal = request.get_json()
    latest_signal = signal
    print("✅ Señal recibida y lista para MT5:", signal)
    return jsonify({"status": "ok"})

@app.route('/ping', methods=['GET'])
def ping():
    return {"status": "ok", "message": "MT5 está conectado correctamente ✅"}, 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3000)
