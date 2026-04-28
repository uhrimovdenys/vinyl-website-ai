from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
import json
import datetime
from groq import Groq

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

SYSTEM_PROMPT = """Ти — VinylBot, дружній асистент вінілового магазину "denysvinyl.com".

Про магазин:
- Магазин вінтажних та сучасних інді платівок — відібрана колекція
- Жанри: вінтажний рок, джаз, класика, сучасне інді, експериментальна музика
- Програвачі: Audio-Technica AT-LP60 (3500 грн), AT-LP120 (8500 грн), Pro-Ject Debut Carbon (14200 грн), Rega Planar 1 (11000 грн)
- Доставка: Нова Пошта та Укрпошта, 1–3 дні, безкоштовно від 1500 грн
- Повернення: 14 днів з моменту отримання
- Оплата: картка, готівка, частинами (Mono, Приват)
- Адреса: Київ, вул. Хрещатик 22, Пн–Сб 10:00–20:00
- Email: info@denysvinyl.com

Правила відповідей:
- Відповідай коротко (2–4 речення), по-дружньому
- Якщо питання англійською — відповідай англійською
- Якщо питання про музику — давай конкретні рекомендації альбомів/артистів
- Не використовуй markdown, зірочки чи дужки у відповідях
- Якщо не знаєш — скажи чесно і запропонуй написати на email"""

ANALYTICS_FILE = "analytics.json"

def load_analytics():
    try:
        with open(ANALYTICS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return {"total_requests": 0, "topics": {}, "daily": {}}

def save_analytics(data):
    try:
        with open(ANALYTICS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except:
        pass

def track_request(message):
    data = load_analytics()
    data["total_requests"] += 1
    today = datetime.date.today().isoformat()
    data["daily"][today] = data["daily"].get(today, 0) + 1
    topic = message[:30].strip()
    data["topics"][topic] = data["topics"].get(topic, 0) + 1
    save_analytics(data)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        body = request.get_json()
        messages = body.get("messages", [])
        user_message = messages[-1]["content"] if messages else ""

        track_request(user_message)

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # безкоштовна модель
            messages=[{"role": "system", "content": SYSTEM_PROMPT}] + messages,
            max_tokens=500,
            temperature=0.7,
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply, "ok": True})

    except Exception as e:
        print(f"Groq error: {e}")
        return jsonify({
            "reply": "Вибачте, виникла технічна помилка. Напишіть нам на info@denysvinyl.com",
            "ok": False
        }), 500

@app.route("/api/analytics", methods=["GET"])
def analytics():
    data = load_analytics()
    return jsonify(data)

@app.route("/api/contact", methods=["POST"])
def contact():
    body = request.get_json()
    name = body.get("name", "").strip()
    email = body.get("email", "").strip()
    message = body.get("message", "").strip()

    if not all([name, email, message]):
        return jsonify({"ok": False, "error": "Заповніть всі поля"}), 400

    # Тут можна додати відправку email через smtplib
    print(f"[CONTACT] {name} <{email}>: {message}")

    track_request(f"contact: {name}")
    return jsonify({"ok": True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
