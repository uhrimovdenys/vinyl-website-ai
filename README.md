# denysvinyl.com

Вініловий магазин з AI чат-ботом на базі Groq (безкоштовно).

## Структура файлів

```
denysvinyl/
├── app.py                  ← Flask сервер + Groq API
├── requirements.txt        ← Python залежності
├── analytics.json          ← автоматично створюється
├── templates/
│   └── index.html          ← HTML розмітка
└── static/
    ├── style.css           ← всі стилі
    ├── script.js           ← логіка, дані, чатбот
    └── vinyl.gif           ← СЮДИ ПОКЛАДИ СВОЮ ГІФКУ
```

## Швидкий старт

### 1. Отримай безкоштовний Groq API ключ
Зареєструйся на https://console.groq.com → "Create API Key"

### 2. Встанови залежності
```bash
pip install -r requirements.txt
```

### 3. Встав свій ключ
Відкрий `app.py`, знайди рядок:
```python
client = Groq(api_key=os.environ.get("GROQ_API_KEY", "YOUR_GROQ_API_KEY_HERE"))
```
Заміни `YOUR_GROQ_API_KEY_HERE` на свій ключ.

Або через змінну середовища (безпечніше):
```bash
# Windows
set GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx

# Mac/Linux
export GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
```

### 4. Додай гіфку вінілу
Поклади файл `vinyl.gif` (або .png/.webp) у папку `static/`.
Якщо файл має іншу назву — відредагуй рядок в `index.html`:
```html
<img src="/static/vinyl.gif" .../>
```

### 5. Запусти сервер
```bash
python app.py
```

Відкрий у браузері: http://localhost:5000

## Аналітика

Статистика запитів до чат-бота зберігається у `analytics.json`.
Переглянути через API: http://localhost:5000/api/analytics

## Зміна контенту

Всі дані (товари, FAQ, статті блогу) знаходяться у `static/script.js`
у верхній частині файлу — масиви `PRODUCTS`, `FAQS`, `BLOG_POSTS`.
Редагуй їх без торкання до логіки.

## Groq модель

У `app.py` використовується `llama-3.3-70b-versatile` — безкоштовна і швидка.
Альтернативи: `llama-3.1-8b-instant` (ще швидша), `mixtral-8x7b-32768`.
