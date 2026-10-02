const games = [
  {
    name: "Shadow Horizon",
    genre: "Action",
    platform: "PC / PS5",
    size: "46.8 GB",
    rating: 4.9,
    seed: "4.2K",
    badge: "Premium",
    description: "Otwarte światy, skok technologiczny i epickie walki w kosmicznej epoce.",
    tags: ["action", "open world", "sci-fi"],
    file: "downloads/shadow-horizon-demo.txt"
  },
  {
    name: "Iron Empire",
    genre: "RPG",
    platform: "PC",
    size: "38.2 GB",
    rating: 4.8,
    seed: "3.6K",
    badge: "New",
    description: "Buduj imperium, rozwijaj armię i przejmuj strategiczne strefy wpływów.",
    tags: ["rpg", "strategy", "war"],
    file: "downloads/iron-empire-demo.txt"
  },
  {
    name: "Midnight Drift",
    genre: "Sport",
    platform: "PC / XBOX",
    size: "27.4 GB",
    rating: 4.7,
    seed: "2.9K",
    badge: "Ultra",
    description: "Gry wyścigowe z realistyczną fizyką i międzynarodowym turniejem.",
    tags: ["sport", "race", "simulator"],
    file: "downloads/midnight-drift-demo.txt"
  },
  {
    name: "Abyss Protocol",
    genre: "Survival",
    platform: "PC",
    size: "51.1 GB",
    rating: 4.9,
    seed: "5.1K",
    badge: "Hot",
    description: "Przetrwanie w głębinach kosmosu z nieprzewidywalnym charakterem przeciwników.",
    tags: ["survival", "horror", "sci-fi"],
    file: "downloads/abyss-protocol-demo.txt"
  },
  {
    name: "Dragon Vault",
    genre: "RPG",
    platform: "PC / PS5",
    size: "42.6 GB",
    rating: 4.8,
    seed: "4.1K",
    badge: "Elite",
    description: "Legendarne zwoje, mistyczne moce i niestandardowe walki z smokami.",
    tags: ["rpg", "fantasy", "adventure"],
    file: "downloads/dragon-vault-demo.txt"
  },
  {
    name: "Nightfall Tactics",
    genre: "Strategy",
    platform: "PC",
    size: "31.0 GB",
    rating: 4.7,
    seed: "2.4K",
    badge: "Trend",
    description: "Taktyczne starcia z rozbudowanym systemem jednostek i nagradzania za każdą decyzję.",
    tags: ["strategy", "tactical", "simulation"],
    file: "downloads/nightfall-tactics-demo.txt"
  }
];

const searchInput = document.getElementById("searchInput");
const grid = document.getElementById("gameGrid");

function renderGames(items) {
  grid.innerHTML = "";

  items.forEach((game) => {
    const article = document.createElement("article");
    article.className = "game-card";

    article.innerHTML = `
      <div class="game-thumb" style="background: linear-gradient(135deg, rgba(20, 26, 35, 0.2), rgba(12, 19, 29, 0.7)), url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80') center/cover no-repeat;">
        <span class="badge premium">${game.badge}</span>
      </div>
      <div class="card-body">
        <div class="card-topline">
          <span class="genre">${game.genre}</span>
          <span class="rating">★ ${game.rating}</span>
        </div>
        <h4>${game.name}</h4>
        <p>${game.description}</p>
        <div class="meta-row">
          <span>${game.size}</span>
          <span>${game.seed} seed</span>
        </div>
        <div class="download-row">
          <div class="progress-bar tiny"><span></span></div>
          <a class="download-btn" href="${game.file}" download="${game.name.toLowerCase().replace(/\s+/g, "-")}.txt">Pobierz</a>
        </div>
      </div>
    `;

    grid.appendChild(article);
  });
}

function filterGames() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = games.filter((game) => {
    const haystack = `${game.name} ${game.genre} ${game.platform} ${game.tags.join(" ")}`.toLowerCase();
    return haystack.includes(query);
  });

  renderGames(filtered);
}

searchInput.addEventListener("input", filterGames);

document.querySelector(".search-panel button").addEventListener("click", filterGames);

renderGames(games);

const canvas = document.getElementById("webCanvas");
const ctx = canvas.getContext("2d");
const mouse = { x: 0, y: 0, active: false, radius: 90 };
let nodes = [];
let links = [];

function createWeb() {
  const cols = 12;
  const rows = 8;
  const spacingX = 140;
  const spacingY = 110;
  nodes = [];
  links = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const offset = row % 2 === 0 ? 55 : 0;
      const x = col * spacingX + offset + 80;
      const y = row * spacingY + 110;
      nodes.push({ x, y, baseX: x, baseY: y });
    }
  }

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 145 && (Math.abs(a.x - b.x) < 180 || Math.abs(a.y - b.y) < 150)) {
        links.push({ a, b, brokenUntil: 0 });
      }
    }
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  createWeb();
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared));
  const projectionX = x1 + t * dx;
  const projectionY = y1 + t * dy;
  const diffX = px - projectionX;
  const diffY = py - projectionY;
  return Math.sqrt(diffX * diffX + diffY * diffY);
}

function drawWeb() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const now = performance.now();

  nodes.forEach((node) => {
    const dx = mouse.x - node.x;
    const dy = mouse.y - node.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (mouse.active && distance < mouse.radius) {
      const force = (mouse.radius - distance) / mouse.radius;
      const angle = Math.atan2(dy, dx);
      node.x += Math.cos(angle + Math.PI) * force * 2.7;
      node.y += Math.sin(angle + Math.PI) * force * 2.7;
    } else {
      node.x += (node.baseX - node.x) * 0.035;
      node.y += (node.baseY - node.y) * 0.035;
    }
  });

  links.forEach((link) => {
    const dx = link.a.x - link.b.x;
    const dy = link.a.y - link.b.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const isNearMouse = mouse.active && distanceToSegment(mouse.x, mouse.y, link.a.x, link.a.y, link.b.x, link.b.y) < mouse.radius * 0.75;

    if (isNearMouse && now > link.brokenUntil) {
      link.brokenUntil = now + 2000 + Math.random() * 2200;
    }

    if (now < link.brokenUntil) {
      return;
    }

    const alpha = 0.22 + (1 - distance / 180) * 0.4;
    ctx.beginPath();
    ctx.moveTo(link.a.x, link.a.y);
    ctx.lineTo(link.b.x, link.b.y);
    ctx.strokeStyle = `rgba(103, 209, 255, ${alpha})`;
    ctx.lineWidth = 1.05;
    ctx.stroke();
  });

  nodes.forEach((node) => {
    const glow = mouse.active && Math.hypot(mouse.x - node.x, mouse.y - node.y) < mouse.radius * 0.9;

    ctx.beginPath();
    ctx.arc(node.x, node.y, glow ? 2.7 : 1.8, 0, Math.PI * 2);
    ctx.fillStyle = glow ? "rgba(255,255,255,0.95)" : "rgba(103, 209, 255, 0.9)";
    ctx.fill();
  });
}

function animate() {
  drawWeb();
  requestAnimationFrame(animate);
}

window.addEventListener("pointermove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.active = true;
});

window.addEventListener("pointerleave", () => {
  mouse.active = false;
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animate();
