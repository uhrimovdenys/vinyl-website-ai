/* ══════════════════════════════════════
   denysvinyl.com — script.js
   Логіка: роутинг, дані, чатбот (Groq через Flask)
══════════════════════════════════════ */

// ─────────────────────────────────────
// ДАНІ — редагуй як завгодно
// ─────────────────────────────────────

const PRODUCTS = [
  {
    id: 1, cat: 'vinyl',
    emoji: '🎸',
    name: 'Dark Side of the Moon',
    artist: 'Pink Floyd',
    genre: 'Класика',
    price: '1 200 грн',
    badge: 'Хіт'
  },
  {
    id: 2, cat: 'vinyl',
    emoji: '🎷',
    name: 'Kind of Blue',
    artist: 'Miles Davis',
    genre: 'Джаз',
    price: '980 грн',
    badge: null
  },
  {
    id: 3, cat: 'vinyl',
    emoji: '🎹',
    name: 'Abbey Road',
    artist: 'The Beatles',
    genre: 'Рок',
    price: '1 100 грн',
    badge: 'Вінтаж'
  },
  {
    id: 4, cat: 'player',
    emoji: '📻',
    name: 'Audio-Technica AT-LP120',
    artist: 'Програвач',
    genre: 'Програвач',
    price: '8 500 грн',
    badge: 'ТОП'
  },
  {
    id: 5, cat: 'vinyl',
    emoji: '🌿',
    name: 'Rumours',
    artist: 'Fleetwood Mac',
    genre: 'Інді',
    price: '870 грн',
    badge: null
  },
  {
    id: 6, cat: 'player',
    emoji: '🎛️',
    name: 'Pro-Ject Debut Carbon',
    artist: 'Програвач',
    genre: 'Програвач',
    price: '14 200 грн',
    badge: 'Аудіофіл'
  },
  {
    id: 7, cat: 'acc',
    emoji: '🧹',
    name: 'Щітка для чистки вінілу',
    artist: 'Аксесуар',
    genre: 'Догляд',
    price: '350 грн',
    badge: null
  },
  {
    id: 8, cat: 'vinyl',
    emoji: '🌙',
    name: 'In the Wee Small Hours',
    artist: 'Frank Sinatra',
    genre: 'Джаз',
    price: '750 грн',
    badge: 'Вінтаж'
  },
  {
    id: 9, cat: 'acc',
    emoji: '📦',
    name: 'Конверти для зберігання',
    artist: 'Аксесуар (25 шт)',
    genre: 'Зберігання',
    price: '180 грн',
    badge: null
  },
  {
    id: 10, cat: 'player',
    emoji: '🔊',
    name: 'Rega Planar 1',
    artist: 'Програвач',
    genre: 'Програвач',
    price: '11 000 грн',
    badge: null
  },
  {
    id: 11, cat: 'vinyl',
    emoji: '🎸',
    name: 'Phoebe Bridgers — Punisher',
    artist: 'Phoebe Bridgers',
    genre: 'Інді',
    price: '950 грн',
    badge: 'Новинка'
  },
  {
    id: 12, cat: 'vinyl',
    emoji: '🎵',
    name: 'Blonde on Blonde',
    artist: 'Bob Dylan',
    genre: 'Фолк',
    price: '1 050 грн',
    badge: 'Вінтаж'
  },
];

const FAQS = [
  {
    q: 'Як здійснюється доставка?',
    a: 'Доставляємо Новою Поштою та Укрпоштою по всій Україні. Термін — 1–3 робочі дні. При замовленні від 1500 грн — безкоштовна доставка.'
  },
  {
    q: 'Чи можна повернути товар?',
    a: 'Так, протягом 14 днів з моменту отримання. Товар має бути у первинному стані. Повернення коштів — протягом 3 робочих днів після отримання товару назад.'
  },
  {
    q: 'Як перевірити якість запису вінілу?',
    a: 'Всі платівки в магазині перевірені та мають оцінку стану (VG, VG+, NM, Mint). Ми детально описуємо кожен примірник. Нові платівки завжди запаковані у захисні конверти.'
  },
  {
    q: 'Який програвач вибрати для початківця?',
    a: 'Рекомендуємо Audio-Technica AT-LP60 або AT-LP120 — надійні, прості у налаштуванні, з вбудованим підсилювачем. Для наступного рівня — Pro-Ject Debut Carbon.'
  },
  {
    q: 'Чи є б/у платівки?',
    a: 'Так, є розділ вінтажного вінілу з оцінкою стану. Ціни нижчі за нові, але якість звуку при правильному зберіганні залишається відмінною.'
  },
  {
    q: 'Як правильно чистити платівки?',
    a: 'Для щоденного використання — антистатична щітка перед кожним програванням. Раз на місяць — чистка з розчином (дистильована вода + ізопропіловий спирт 10%). Зберігайте вертикально у конвертах.'
  },
  {
    q: 'Чи є оплата частинами?',
    a: 'Так, доступна оплата частинами через Monobank та ПриватБанк. Без переплат на 4 платежі для суми від 1000 грн.'
  },
  {
    q: 'Чи є доставка за кордон?',
    a: 'Наразі доставка тільки по Україні. Слідкуйте за оновленнями в Instagram — плануємо відкрити міжнародну доставку.'
  },
];

const BLOG_POSTS = [
  {
    emoji: '🎵',
    tag: 'Гід',
    title: 'Як вибрати перший вініловий програвач',
    excerpt: 'Розповідаємо що шукати при покупці першого програвача, на що звернути увагу і яких помилок уникати.',
    date: '12 лист 2024',
    time: '7 хв'
  },
  {
    emoji: '🎸',
    tag: 'Музика',
    title: '10 інді-альбомів, які варто мати на вінілі',
    excerpt: 'Від Phoebe Bridgers до Bon Iver — ці записи звучать так, як задумали автори: тепло, живо, об\'ємно.',
    date: '5 лист 2024',
    time: '5 хв'
  },
  {
    emoji: '🧹',
    tag: 'Поради',
    title: 'Догляд за платівками: повне керівництво',
    excerpt: 'Чистка, зберігання, транспортування — все що потрібно знати, щоб ваша колекція жила десятиліттями.',
    date: '28 жовт 2024',
    time: '6 хв'
  },
  {
    emoji: '📻',
    tag: 'Техніка',
    title: 'Pro-Ject vs Audio-Technica: що краще для дому?',
    excerpt: 'Детальне порівняння двох популярних брендів за якістю звуку, зручністю та ціною.',
    date: '15 жовт 2024',
    time: '8 хв'
  },
  {
    emoji: '🎷',
    tag: 'Музика',
    title: 'Джаз на вінілі: куди почати слухати',
    excerpt: 'Список із 12 джазових альбомів для тих, хто хоче відкрити для себе цей жанр через аналоговий звук.',
    date: '3 жовт 2024',
    time: '4 хв'
  },
  {
    emoji: '💿',
    tag: 'Колекція',
    title: 'Як зберігати велику колекцію вінілу',
    excerpt: 'Стелажі, конверти, температура, вологість — практичні поради від досвідчених колекціонерів.',
    date: '20 вер 2024',
    time: '5 хв'
  },
];

// ─────────────────────────────────────
// РОУТИНГ СТОРІНОК
// ─────────────────────────────────────

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === id);
  });

  closeMenu();
  window.scrollTo(0, 0);
}

// ─────────────────────────────────────
// МОБІЛЬНЕ МЕНЮ
// ─────────────────────────────────────

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

function closeMenu() {
  document.getElementById('navLinks').classList.remove('open');
}

// ─────────────────────────────────────
// РЕНДЕР КАТАЛОГУ
// ─────────────────────────────────────

function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  const list = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.cat === filter);

  grid.innerHTML = list.map(p => `
    <div class="product-card" data-cat="${p.cat}">
      <div class="product-img">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        ${p.emoji}
      </div>
      <div class="product-info">
        <div class="product-genre">${p.genre}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-artist">${p.artist}</div>
        <div class="product-footer">
          <span class="product-price">${p.price}</span>
          <button class="add-btn" onclick="addToCart('${p.name}')">+ Кошик</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

function addToCart(name) {
  if (!document.getElementById('chatWindow').classList.contains('open')) {
    toggleChat();
  }
  setTimeout(() => {
    addBotMsg(`🛒 "${name}" — хороший вибір! Для оформлення замовлення напишіть нам або зателефонуйте. Можу допомогти з будь-якими питаннями.`);
  }, 400);
}

// ─────────────────────────────────────
// РЕНДЕР FAQ
// ─────────────────────────────────────

function renderFaq() {
  document.getElementById('faqList').innerHTML = FAQS.map((f, i) => `
    <div class="faq-item" id="faq-${i}">
      <button class="faq-q" onclick="toggleFaq(${i})">
        <span>${f.q}</span>
        <span class="faq-arrow">+</span>
      </button>
      <div class="faq-a">${f.a}</div>
    </div>
  `).join('');
}

function toggleFaq(i) {
  document.getElementById('faq-' + i).classList.toggle('open');
}

// ─────────────────────────────────────
// РЕНДЕР БЛОГУ
// ─────────────────────────────────────

function renderBlog() {
  document.getElementById('blogGrid').innerHTML = BLOG_POSTS.map(b => `
    <div class="blog-card">
      <div class="blog-img">${b.emoji}</div>
      <div class="blog-content">
        <div class="blog-tag">${b.tag}</div>
        <div class="blog-title">${b.title}</div>
        <div class="blog-excerpt">${b.excerpt}</div>
        <div class="blog-meta">
          <span>${b.date}</span>
          <span>⏱ ${b.time} читання</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ─────────────────────────────────────
// ФОРМА КОНТАКТІВ
// ─────────────────────────────────────

async function submitContact() {
  const name    = document.getElementById('cName').value.trim();
  const email   = document.getElementById('cEmail').value.trim();
  const message = document.getElementById('cMsg').value.trim();
  const out     = document.getElementById('formMsg');

  if (!name || !email || !message) {
    out.style.display = 'block';
    out.style.color   = '#ff4444';
    out.textContent   = 'Будь ласка, заповніть всі поля.';
    return;
  }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    const data = await res.json();

    if (data.ok) {
      out.style.display = 'block';
      out.style.color   = 'var(--orange)';
      out.textContent   = '✓ Дякуємо! Ми зв\'яжемося з вами найближчим часом.';
      document.getElementById('cName').value  = '';
      document.getElementById('cEmail').value = '';
      document.getElementById('cMsg').value   = '';
    } else {
      throw new Error(data.error);
    }
  } catch (e) {
    out.style.display = 'block';
    out.style.color   = '#ff4444';
    out.textContent   = 'Помилка відправки. Напишіть напряму на info@denysvinyl.com';
  }
}

// ─────────────────────────────────────
// АНАЛІТИКА (локальна)
// ─────────────────────────────────────

function trackEvent(topic) {
  try {
    const raw  = localStorage.getItem('vinylbot_analytics');
    const data = raw ? JSON.parse(raw) : { requests: 0, topics: {} };
    data.requests++;
    data.topics[topic] = (data.topics[topic] || 0) + 1;
    localStorage.setItem('vinylbot_analytics', JSON.stringify(data));
  } catch (e) {}
}

// ─────────────────────────────────────
// CHATBOT
// ─────────────────────────────────────

let chatOpen    = false;
let chatHistory = [];  // { role, content }[]
let greetingShown = false;

function toggleChat() {
  chatOpen = !chatOpen;
  const win = document.getElementById('chatWindow');
  win.classList.toggle('open', chatOpen);

  if (chatOpen && !greetingShown) {
    greetingShown = true;
    setTimeout(() => {
      addBotMsg('Привіт! 🎵 Я VinylBot — допоможу з вибором вінілу, програвача або відповім на питання про магазин. Чим можу допомогти?');
    }, 300);
  }

  if (chatOpen) {
    setTimeout(() => document.getElementById('chatInput').focus(), 400);
  }
}

function addBotMsg(text) {
  const msgs = document.getElementById('chatMsgs');
  const div  = document.createElement('div');
  div.className   = 'msg bot';
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMsg(text) {
  const msgs = document.getElementById('chatMsgs');
  const div  = document.createElement('div');
  div.className   = 'msg user';
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatMsgs');
  const div  = document.createElement('div');
  div.className = 'msg typing';
  div.id        = 'typingIndicator';
  div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

async function sendMsg() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text) return;

  input.value = '';
  addUserMsg(text);
  trackEvent(text.slice(0, 30));

  // Додаємо до історії
  chatHistory.push({ role: 'user', content: text });

  showTyping();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory })
    });

    removeTyping();

    if (!res.ok) throw new Error('Server error');

    const data = await res.json();
    const reply = data.reply;

    chatHistory.push({ role: 'assistant', content: reply });
    addBotMsg(reply);

    // Ховаємо швидкі кнопки після першого діалогу
    document.getElementById('quickReplies').style.display = 'none';

  } catch (err) {
    removeTyping();
    addBotMsg('Вибачте, виникла технічна помилка. Напишіть нам на info@denysvinyl.com або зателефонуйте.');
    console.error('Chat error:', err);
  }
}

function quickAsk(text) {
  document.getElementById('chatInput').value = text;
  sendMsg();
}

// ─────────────────────────────────────
// ІНІЦІАЛІЗАЦІЯ
// ─────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderFaq();
  renderBlog();
  showPage('home');
});
