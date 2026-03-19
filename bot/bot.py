"""
Sushi Seven WhatsApp Bot - La Paz
Bot de órdenes por WhatsApp usando Flask + WhatsApp Business API
"""

from flask import Flask, request, jsonify
import json
import os
from menu import MENU, CATEGORIAS, get_menu_text, get_categorias_text

app = Flask(__name__)

# ─── ESTADO DE SESIONES ────────────────────────────────────────────
# En producción usar Redis o DB. Por ahora en memoria.
sesiones = {}

def get_sesion(numero):
    if numero not in sesiones:
        sesiones[numero] = {
            "estado": "inicio",
            "orden": [],
            "nombre": None,
            "direccion": None,
            "categoria_actual": None,
        }
    return sesiones[numero]

def reset_sesion(numero):
    sesiones[numero] = {
        "estado": "inicio",
        "orden": [],
        "nombre": None,
        "direccion": None,
        "categoria_actual": None,
    }

# ─── LÓGICA DEL BOT ────────────────────────────────────────────────
def procesar_mensaje(numero, mensaje):
    """Procesa el mensaje del usuario y retorna la respuesta del bot."""
    msg = mensaje.strip().lower()
    sesion = get_sesion(numero)
    estado = sesion["estado"]

    # Comandos globales
    if msg in ["hola", "hi", "hello", "menu", "menú", "ordenar", "pedir", "buenas", "buenos días", "buenas tardes", "buenas noches"]:
        reset_sesion(numero)
        sesion = get_sesion(numero)
        sesion["estado"] = "esperando_nombre"
        return (
            "¡Hola! 👋 Bienvenido a *Sushi Seven La Paz* 🍣\n\n"
            "Estoy aquí para tomar tu pedido a domicilio.\n\n"
            "¿Cuál es tu nombre?"
        )

    if msg in ["cancelar", "cancel", "salir"]:
        reset_sesion(numero)
        return "Tu pedido fue cancelado. Escribe *hola* para comenzar de nuevo. 👋"

    if msg in ["ver orden", "mi orden", "ver pedido"]:
        if not sesion["orden"]:
            return "Tu orden está vacía. Escribe *menú* para comenzar. 🍱"
        return formatear_orden(sesion)

    # ── FLUJO PRINCIPAL ──────────────────────────────────────────

    # 1. Pedir nombre
    if estado == "esperando_nombre":
        sesion["nombre"] = mensaje.strip().title()
        sesion["estado"] = "menu_principal"
        return (
            f"¡Mucho gusto, *{sesion['nombre']}*! 😊\n\n"
            + get_categorias_text()
        )

    # 2. Menú principal - elegir categoría
    if estado == "menu_principal":
        if msg in CATEGORIAS:
            cat_key, cat_nombre = CATEGORIAS[msg]
            sesion["categoria_actual"] = cat_key
            sesion["estado"] = "eligiendo_platillo"
            items_text = get_menu_text(cat_key)
            return (
                f"{cat_nombre}\n\n"
                f"{items_text}\n\n"
                f"Escribe el *número* del platillo que deseas agregar.\n"
                f"O escribe *0* para volver al menú."
            )
        else:
            return (
                "Por favor elige una categoría válida 😊\n\n"
                + get_categorias_text()
            )

    # 3. Eligiendo platillo
    if estado == "eligiendo_platillo":
        if msg == "0":
            sesion["estado"] = "menu_principal"
            respuesta = get_categorias_text()
            if sesion["orden"]:
                respuesta += f"\n\n🛒 Tienes {len(sesion['orden'])} producto(s) en tu orden.\nEscribe *ver orden* para revisarla o *confirmar* para finalizar."
            return respuesta

        cat_key = sesion["categoria_actual"]
        items = MENU.get(cat_key, [])

        try:
            idx = int(msg) - 1
            if 0 <= idx < len(items):
                item = items[idx]
                sesion["orden"].append({
                    "nombre": item["nombre"],
                    "precio": item["precio"],
                    "cantidad": 1
                })
                sesion["estado"] = "menu_principal"
                total_actual = sum(i["precio"] * i["cantidad"] for i in sesion["orden"])
                return (
                    f"✅ *{item['nombre']}* agregado — ${item['precio']}\n\n"
                    f"Total actual: *${total_actual}*\n\n"
                    f"¿Qué más deseas?\n\n"
                    + get_categorias_text()
                    + "\n\nEscribe *confirmar* para finalizar tu orden."
                )
            else:
                return f"Número no válido. Elige entre 1 y {len(items)}, o *0* para volver."
        except ValueError:
            if msg == "confirmar":
                sesion["estado"] = "esperando_direccion"
                return (
                    f"¡Perfecto! 🎉\n\n"
                    + formatear_orden(sesion)
                    + "\n\n📍 ¿Cuál es tu dirección de entrega?\n_(Incluye calle, número y colonia)_"
                )
            return f"Escribe el número del platillo o *0* para volver al menú."

    # 4. Confirmar orden
    if estado == "menu_principal" and msg == "confirmar":
        if not sesion["orden"]:
            return "Tu orden está vacía. Elige algo del menú primero. 🍱"
        sesion["estado"] = "esperando_direccion"
        return (
            formatear_orden(sesion)
            + "\n\n📍 ¿Cuál es tu dirección de entrega?\n_(Incluye calle, número y colonia)_"
        )

    # 5. Dirección
    if estado == "esperando_direccion":
        sesion["direccion"] = mensaje.strip()
        sesion["estado"] = "esperando_pago"
        return (
            f"📍 Dirección registrada: _{sesion['direccion']}_\n\n"
            f"💳 ¿Cómo deseas pagar?\n\n"
            f"1. Efectivo\n"
            f"2. Tarjeta (al momento de la entrega)\n"
            f"3. Transferencia\n\n"
            f"Escribe el número de tu método de pago."
        )

    # 6. Método de pago
    if estado == "esperando_pago":
        metodos = {"1": "Efectivo", "2": "Tarjeta", "3": "Transferencia"}
        if msg not in metodos and mensaje not in metodos.values():
            return "Elige una opción válida:\n1. Efectivo\n2. Tarjeta\n3. Transferencia"

        metodo = metodos.get(msg, mensaje.title())
        sesion["pago"] = metodo
        sesion["estado"] = "orden_confirmada"

        total = sum(i["precio"] * i["cantidad"] for i in sesion["orden"])
        orden_id = f"SS-{numero[-4:]}-{len(sesiones)}"

        # Aquí iría la integración con Wansoft POS
        guardar_orden(orden_id, sesion)

        return (
            f"🎉 *¡Orden confirmada!*\n\n"
            f"📋 Folio: *{orden_id}*\n"
            f"👤 Cliente: {sesion['nombre']}\n"
            f"📍 Dirección: {sesion['direccion']}\n"
            f"💳 Pago: {metodo}\n"
            f"💰 Total: *${total}*\n\n"
            f"⏱️ Tu pedido llegará en aproximadamente *45-60 minutos*.\n\n"
            f"Gracias por elegir *Sushi Seven* 🍣\n"
            f"¡Escribe *hola* para hacer otro pedido!"
        )

    # Default
    return (
        "No entendí tu mensaje 😅\n\n"
        "Escribe *hola* para comenzar a ordenar\n"
        "o *menú* para ver nuestras opciones. 🍱"
    )

def formatear_orden(sesion):
    if not sesion["orden"]:
        return "Tu orden está vacía."
    lines = [f"🛒 *Orden de {sesion.get('nombre', 'Cliente')}:*\n"]
    total = 0
    for i, item in enumerate(sesion["orden"], 1):
        subtotal = item["precio"] * item["cantidad"]
        total += subtotal
        lines.append(f"{i}. {item['nombre']} x{item['cantidad']} — ${subtotal}")
    lines.append(f"\n💰 *Total: ${total}*")
    return "\n".join(lines)

def guardar_orden(orden_id, sesion):
    """Guarda la orden en un archivo JSON (mock de integración POS)"""
    ordenes_path = "ordenes.json"
    try:
        with open(ordenes_path, "r") as f:
            ordenes = json.load(f)
    except:
        ordenes = []

    ordenes.append({
        "id": orden_id,
        "nombre": sesion["nombre"],
        "direccion": sesion["direccion"],
        "pago": sesion.get("pago"),
        "orden": sesion["orden"],
        "total": sum(i["precio"] * i["cantidad"] for i in sesion["orden"]),
        "sucursal": "La Paz",
        "estado": "recibida"
    })

    with open(ordenes_path, "w") as f:
        json.dump(ordenes, f, ensure_ascii=False, indent=2)

# ─── ENDPOINTS FLASK ───────────────────────────────────────────────
@app.route("/webhook", methods=["GET"])
def verify():
    """Verificación del webhook de Meta/WhatsApp"""
    token = os.getenv("VERIFY_TOKEN", "agentx_sushi_seven_2026")
    if request.args.get("hub.verify_token") == token:
        return request.args.get("hub.challenge")
    return "Token inválido", 403

@app.route("/webhook", methods=["POST"])
def webhook():
    """Recibe mensajes de WhatsApp"""
    data = request.json

    try:
        entry = data["entry"][0]
        changes = entry["changes"][0]
        value = changes["value"]

        if "messages" not in value:
            return jsonify({"status": "ok"})

        msg_data = value["messages"][0]
        numero = msg_data["from"]
        tipo = msg_data.get("type", "text")

        if tipo == "text":
            texto = msg_data["text"]["body"]
        elif tipo == "interactive":
            texto = msg_data["interactive"].get("button_reply", {}).get("title", "")
        else:
            return jsonify({"status": "ok"})

        respuesta = procesar_mensaje(numero, texto)
        enviar_mensaje(numero, respuesta, value["metadata"]["phone_number_id"])

    except Exception as e:
        print(f"Error: {e}")

    return jsonify({"status": "ok"})

def enviar_mensaje(numero, texto, phone_id):
    """Envía mensaje via WhatsApp Business API"""
    import requests as req
    token = os.getenv("WHATSAPP_TOKEN", "")
    url = f"https://graph.facebook.com/v18.0/{phone_id}/messages"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "messaging_product": "whatsapp",
        "to": numero,
        "type": "text",
        "text": {"body": texto}
    }
    req.post(url, json=payload, headers=headers)

# ─── MODO TEST (sin WhatsApp) ───────────────────────────────────────
@app.route("/test", methods=["POST"])
def test():
    """Endpoint de prueba sin necesidad de WhatsApp"""
    data = request.json
    numero = data.get("numero", "5210000000000")
    mensaje = data.get("mensaje", "hola")
    respuesta = procesar_mensaje(numero, mensaje)
    return jsonify({"respuesta": respuesta})

@app.route("/ordenes", methods=["GET"])
def ver_ordenes():
    """Ver todas las órdenes recibidas"""
    try:
        with open("ordenes.json") as f:
            return jsonify(json.load(f))
    except:
        return jsonify([])

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ok", "bot": "Sushi Seven La Paz", "version": "1.0"})

if __name__ == "__main__":
    print("🍣 Sushi Seven Bot - La Paz")
    print("Running on http://localhost:5000")
    print("Test endpoint: POST /test {numero, mensaje}")
    app.run(debug=True, port=5001)
