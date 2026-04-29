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
- Адреса: Київ, вул. Хрещатик 22, Пн–Сб 10:00–20:00
- Email: st8006161@stud.duikt.edu.ua

Каталог платівок:
- Dark Side of the Moon — Pink Floyd, Класика, 1 200 грн (Хіт)
- Kind of Blue — Miles Davis, Джаз, 980 грн
- Abbey Road — The Beatles, Рок, 1 100 грн (Вінтаж)
- Rumours — Fleetwood Mac, Інді, 870 грн
- In the Wee Small Hours — Frank Sinatra, Джаз, 750 грн (Вінтаж)
- Punisher — Phoebe Bridgers, Інді, 950 грн (Новинка)
- Blonde on Blonde — Bob Dylan, Фолк, 1 050 грн (Вінтаж)

Програвачі:
- Audio-Technica AT-LP60: 3 500 грн — ідеальний старт
- Audio-Technica AT-LP120: 8 500 грн (ТОП) — для серйозного слухача
- Pro-Ject Debut Carbon: 14 200 грн (Аудіофіл) — преміум рівень
- Rega Planar 1: 11 000 грн — британська якість

Аксесуари:
- Щітка для чистки вінілу: 350 грн
- Конверти для зберігання (25 шт): 180 грн

Доставка і оплата:
- Нова Пошта та Укрпошта, 1–3 дні, безкоштовно від 1500 грн
- Оплата: картка, готівка, частинами (Monobank, ПриватБанк, 4 платежі від 1000 грн)
- Повернення: 14 днів з моменту отримання, кошти повертаємо за 3 дні

Статті блогу:
- "Як вибрати перший вініловий програвач" (Гід) — що шукати при покупці, на що звернути увагу, яких помилок уникати
- "10 інді-альбомів, які варто мати на вінілі" (Музика) — Phoebe Bridgers, Bon Iver та інші, що звучать тепло і живо на вінілі
- "Догляд за платівками: повне керівництво" (Поради) — чистка, зберігання, транспортування для довгого життя колекції
- "Pro-Ject vs Audio-Technica: що краще для дому?" (Техніка) — порівняння за якістю звуку, зручністю та ціною
- "Джаз на вінілі: куди почати слухати" (Музика) — список 12 джазових альбомів для знайомства з жанром
- "Як зберігати велику колекцію вінілу" (Колекція) — стелажі, конверти, температура, вологість

FAQ:
- Чи є б/у платівки? Так, є вінтажний розділ з оцінкою стану (VG, VG+, NM, Mint)
- Як чистити платівки? Антистатична щітка перед програванням, раз на місяць — дистильована вода + ізопропіловий спирт 10%
- Доставка за кордон? Наразі тільки по Україні

Правила відповідей:
- Закінчуй відповідь крапкою або знаком оклику, без будь-яких додаткових символів, НЕ .WidthSpace чи інші незрозумілі речі
- Відповідай коротко (2–4 речення), по-дружньому
- Якщо питання англійською — відповідай англійською, польською — польською, іншою мовою — тією ж мовою
- Якщо питання про музику — давай конкретні рекомендації альбомів/артистів з каталогу
- Не використовуй markdown, зірочки чи символи форматування
- Якщо не знаєш — скажи чесно і запропонуй написати на st8006161@stud.duikt.edu.ua, Відповідай тільки звичайним текстом, без спеціальних символів, ієрогліфів чи незвичайних знаків"""



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
        resp = jsonify({"reply": reply, "ok": True})
        resp.headers['Content-Type'] = 'application/json; charset=utf-8'
        return resp

    except Exception as e:
        print(f"Groq error: {e}")
        return jsonify({
            "reply": "Вибачте, виникла технічна помилка. Напишіть нам на st8006161@stud.duikt.edu.ua, і ми допоможемо!",
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
