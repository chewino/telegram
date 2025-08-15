const BOT_TOKEN = 8140644618:AAFv23xyA5qajo9kWKyvJqW7ALs2NuSK7U4;   // de @BotFather
CHAT_ID=-1002824825805
SITE_ID=MLM
QUERIES=nintendo switch oled|6000;ssd 1tb|1000

// Ajusta consultas separando por ; (más simple para env var)
const RAW_QUERIES = process.env.QUERIES ?? "nintendo switch oled|6000;ssd 1tb|1000";
const QUERIES = RAW_QUERIES.split(";").map(s => {
  const [q, max] = s.split("|");
  return { q, maxPrice: Number(max) };
});

const seen = new Set();
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function searchDeals({ q, maxPrice }) {
  const url = `https://api.mercadolibre.com/sites/${SITE_ID}/search?q=${encodeURIComponent(q)}&limit=20&sort=price_asc`;
  const res = await fetch(url);
  const data = await res.json();
  const fresh = [];
  for (const it of (data.results ?? [])) {
    if (it.price <= maxPrice && !seen.has(it.id)) {
      seen.add(it.id);
      fresh.push(it);
    }
  }
  return fresh;
}

async function sendToTelegram(text) {
  const tg = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  await fetch(tg, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text })
  });
}

function mx(n){ return new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(n); }
function msg(it){
  const lugar = it.address?.state_name ? `📍 ${it.address.state_name}\n` : "";
  return `🛒 ${it.title}\n💵 ${mx(it.price)}\n${lugar}🔗 ${it.permalink}`;
}

async function cycle(){
  for (const q of QUERIES){
    try{
      const items = await searchDeals(q);
      for (const it of items){
        await sendToTelegram(msg(it));
        await sleep(800);
      }
    } catch(e){ console.error("Error con", q.q, e.message); }
  }
}

console.log("Bot activo en Railway. Corre cada 10 min...");
cycle();
setInterval(cycle, 10*60*1000);
const BOT_TOKEN = process.env.BOT_TOKEN;   // de @BotFather
const CHAT_ID   = process.env.CHAT_ID;     // ej. @ofertas_mx
const SITE_ID   = process.env.SITE_ID ?? "MLM";

// Ajusta consultas separando por ; (más simple para env var)
const RAW_QUERIES = process.env.QUERIES ?? "nintendo switch oled|6000;ssd 1tb|1000";
const QUERIES = RAW_QUERIES.split(";").map(s => {
  const [q, max] = s.split("|");
  return { q, maxPrice: Number(max) };
});

const seen = new Set();
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function searchDeals({ q, maxPrice }) {
  const url = `https://api.mercadolibre.com/sites/${SITE_ID}/search?q=${encodeURIComponent(q)}&limit=20&sort=price_asc`;
  const res = await fetch(url);
  const data = await res.json();
  const fresh = [];
  for (const it of (data.results ?? [])) {
    if (it.price <= maxPrice && !seen.has(it.id)) {
      seen.add(it.id);
      fresh.push(it);
    }
  }
  return fresh;
}

async function sendToTelegram(text) {
  const tg = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  await fetch(tg, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text })
  });
}

function mx(n){ return new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(n); }
function msg(it){
  const lugar = it.address?.state_name ? `📍 ${it.address.state_name}\n` : "";
  return `🛒 ${it.title}\n💵 ${mx(it.price)}\n${lugar}🔗 ${it.permalink}`;
}

async function cycle(){
  for (const q of QUERIES){
    try{
      const items = await searchDeals(q);
      for (const it of items){
        await sendToTelegram(msg(it));
        await sleep(800);
      }
    } catch(e){ console.error("Error con", q.q, e.message); }
  }
}

console.log("Bot activo en Railway. Corre cada 10 min...");
cycle();
setInterval(cycle, 10*60*1000);
