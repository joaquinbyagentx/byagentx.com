"""
AgentX Lead Capture Server
Recibe leads del formulario de byagentx.com y los notifica a Joaquin via email
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from agentmail import AgentMail
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Permite requests desde byagentx.com

AGENTMAIL_API_KEY = os.getenv("AGENTMAIL_API_KEY", "am_us_359cf37e79e6c908048399a0b1b8a33ace5ce3f21753ef1a53a74589de1ec4bc")
client = AgentMail(api_key=AGENTMAIL_API_KEY)

LEADS_FILE = "leads.json"

def save_lead(lead):
    try:
        with open(LEADS_FILE, "r") as f:
            leads = json.load(f)
    except:
        leads = []
    leads.append(lead)
    with open(LEADS_FILE, "w") as f:
        json.dump(leads, f, ensure_ascii=False, indent=2)

@app.route("/lead", methods=["POST", "OPTIONS"])
def capture_lead():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.json or {}
    name = data.get("name", "Unknown")
    email = data.get("email", "")
    biz_type = data.get("type", "Not specified")
    message = data.get("message", "")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M CST")

    # Guardar lead
    lead = {"name": name, "email": email, "type": biz_type, "message": message, "timestamp": timestamp}
    save_lead(lead)

    # Notificar a Joaquin por email
    try:
        client.inboxes.messages.send(
            inbox_id="joaquin@byagentx.com",
            to=["joaquin@byagentx.com"],
            subject=f"🔥 Nuevo lead: {name} — {biz_type}",
            text=f"""Nuevo lead en byagentx.com

Nombre: {name}
Contacto: {email}
Industria: {biz_type}
Mensaje: {message}
Fecha: {timestamp}

---
Responder a: {email}
"""
        )
    except Exception as e:
        print(f"Error enviando email: {e}")

    # Respuesta automática al cliente
    if "@" in email:
        try:
            client.inboxes.messages.send(
                inbox_id="joaquin@byagentx.com",
                to=[email],
                subject="We received your request — AgentX",
                text=f"""Hi {name},

Thanks for reaching out to AgentX!

We received your request and will get back to you within 24 hours with a custom proposal for your business.

In the meantime, feel free to reply to this email if you have any questions.

— Joaquin
joaquin@byagentx.com
byagentx.com"""
            )
        except Exception as e:
            print(f"Error auto-reply: {e}")

    return jsonify({"ok": True}), 200

@app.route("/leads", methods=["GET"])
def ver_leads():
    try:
        with open(LEADS_FILE) as f:
            return jsonify(json.load(f))
    except:
        return jsonify([])

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "AgentX Lead Capture"})

if __name__ == "__main__":
    print("🚀 AgentX Lead Server running on port 4444")
    app.run(host="0.0.0.0", port=4444, debug=False)
