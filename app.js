// ===== Juegos JC: buscador + filtros + contadores (localStorage) =====

// ---- Datos de juegos (añade/quita aquí) ----
const GAMES = [
  {
    id: "infinity-evolution",
    name: "Infinity Evolution",
    version: "1.0",
    updated: "2026-02-27",
    popularity: 120, // "popularidad" base (fácil de cambiar)
    tags: ["acción", "evolución", "progresión"],
    href: "./game/index.html",
    desc: "Evolución progresiva y poderes que cambian reglas."
  },
  {
    id: "banana-state",
    name: "Banana State",
    version: "0.4",
    updated: "2026-02-20",
    popularity: 60,
    tags: ["casual", "humor", "arcade"],
    href: "./banana/index.html",
    desc: "Plátanos, caos y risas. Fácil de jugar, difícil de soltar."
  },
  {
    id: "definitive-evolution",
    name: "Definitive Evolution",
    version: "0.8",
    updated: "2026-02-22",
    popularity: 80,
    tags: ["acción", "bosses", "mejoras"],
    href: "./definitive/index.html",
    desc: "Más fuego, más profundidad, más decisiones."
  },
  {
    id: "campana-clicker",
    name: "Campana Clicker",
    version: "1.2",
    updated: "2026-02-18",
    popularity: 90,
    tags: ["clicker", "idle", "farm"],
    href: "./campana/index.html",
    desc: "Click, mejoras y dopamina legal (casi)."
  },
  {
    id: "mini-zelda-3d",
    name: "Mini Zelda 3D",
    version: "0.2",
    updated: "2026-02-10",
    popularity: 35,
    tags: ["aventura", "3d", "exploración"],
    href: "./zelda/index.html",
    desc: "Explora, encuentra y mejora. Pequeño pero con alma."
  }
];

// ---- Helpers ----
const $ = (sel) => document.querySelector(sel);

function parseVersion(v){
  // "1.2" -> 1.02 aprox (vale para ordenar)
  const [a="0", b="0"] = String(v).split(".");
  return Number(a) + Number(b)/100;
}

function formatDate(iso){
  // 2026-02-27 -> 27/02/2026
  const [y,m,d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// ---- Contadores locales (por navegador) ----
function bumpCounter(key){
  const cur = Number(localStorage.getItem(key) || "0");
  const next = cur + 1;
  localStorage.setItem(key, String(next));
  return next;
}
function getCounter(key){
  return Number(localStorage.getItem(key) || "0");
}

// Contador de visitas de la página principal (local)
const siteVisits = bumpCounter("jc_site_visits");
$("#siteVisits").textContent = siteVisits;

// Año
$("#year").textContent = new Date().getFullYear();

// ---- Tags dinámicos ----
const allTags = Array.from(new Set(GAMES.flatMap(g => g.tags))).sort();
let activeTag = "todos";

function renderTagFilters(){
  const wrap = $("#tagFilters");
  wrap.innerHTML = "";

  const makeChip = (label, value) => {
    const btn = document.createElement("button");
    btn.className = "chip2" + (activeTag === value ? " active" : "");
    btn.type = "button";
    btn.textContent = label;
    btn.addEventListener("click", () => {
      activeTag = value;
      renderTagFilters();
      renderGames();
    });
    return btn;
  };

  wrap.appendChild(makeChip("Todos", "todos"));
  allTags.forEach(t => wrap.appendChild(makeChip(t, t)));
}

// ---- Render games ----
function renderGames(){
  const q = $("#q").value.trim().toLowerCase();
  const sort = $("#sort").value;

  let list = [...GAMES];

  // filtro por tag
  if(activeTag !== "todos"){
    list = list.filter(g => g.tags.includes(activeTag));
  }

  // buscador (nombre, version, tags, desc)
  if(q){
    list = list.filter(g => {
      const hay = [
        g.name, g.version, g.desc,
        g.tags.join(" "),
        `v${g.version}`
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  // ordenar
  list.sort((a,b) => {
    if(sort === "popular"){
      // popularidad base + visitas locales del juego
      const av = a.popularity + getCounter(`jc_game_open_${a.id}`);
      const bv = b.popularity + getCounter(`jc_game_open_${b.id}`);
      return bv - av;
    }
    if(sort === "new"){
      return new Date(b.updated) - new Date(a.updated);
    }
    if(sort === "version"){
      return parseVersion(b.version) - parseVersion(a.version);
    }
    // name
    return a.name.localeCompare(b.name);
  });

  const grid = $("#gamesGrid");
  grid.innerHTML = "";

  if(list.length === 0){
    const empty = document.createElement("div");
    empty.className = "card empty";
    empty.innerHTML = `<h3>No hay resultados</h3><p>Prueba otro nombre o quita filtros.</p>`;
    grid.appendChild(empty);
    return;
  }

  list.forEach(g => {
    const opens = getCounter(`jc_game_open_${g.id}`);
    const card = document.createElement("article");
    card.className = "card game-card";
    card.innerHTML = `
      <div class="game-head">
        <img src="./logo.png?v=4" class="game-icon" alt="Logo Juegos JC">
        <div class="game-titles">
          <h3>${g.name}</h3>
          <div class="meta">
            <span class="badge">v${g.version}</span>
            <span class="badge">Actualizado: ${formatDate(g.updated)}</span>
          </div>
        </div>
      </div>

      <p class="game-desc">${g.desc}</p>

      <div class="tags">
        ${g.tags.map(t => `<span class="tag">${t}</span>`).join("")}
      </div>

      <div class="game-bottom">
        <div class="opens">
          <span class="badge">Aperturas (local): <b>${opens}</b></span>
        </div>
        <a class="btn primary open-btn" href="${g.href}" data-game="${g.id}">▶ Abrir</a>
      </div>
    `;
    grid.appendChild(card);
  });

  // evento de aperturas
  document.querySelectorAll(".open-btn").forEach(a => {
    a.addEventListener("click", () => {
      const id = a.getAttribute("data-game");
      bumpCounter(`jc_game_open_${id}`);
      // Nota: no hacemos render aquí porque te vas a otra página.
    });
  });
}

renderTagFilters();
renderGames();

// listeners
$("#q").addEventListener("input", renderGames);
$("#sort").addEventListener("change", renderGames);
