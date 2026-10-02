const games = [
  {
    name: "Shadow Horizon",
    genre: "Action",
    platform: "PC",
    size: "46.8 GB",
    rating: 4.9,
    seed: "4.2K",
    badge: "Premium",
    description: "Otwarte światy, skok technologiczny i epickie walki w kosmicznej epoce.",
    tags: ["action", "open world", "sci-fi"],
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1000&q=85",
    file: "downloads/shadow-horizon-demo.torrent"
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
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85",
    file: "downloads/iron-empire-demo.torrent"
  },
  {
    name: "Midnight Drift",
    genre: "Sport",
    platform: "PC",
    size: "27.4 GB",
    rating: 4.7,
    seed: "2.9K",
    badge: "Ultra",
    description: "Gry wyścigowe z realistyczną fizyką i międzynarodowym turniejem.",
    tags: ["sport", "race", "simulator"],
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85",
    file: "downloads/midnight-drift-demo.torrent"
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
    image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1000&q=85",
    file: "downloads/abyss-protocol-demo.torrent"
  },
  {
    name: "Dragon Vault",
    genre: "RPG",
    platform: "PC",
    size: "42.6 GB",
    rating: 4.8,
    seed: "4.1K",
    badge: "Elite",
    description: "Legendarne zwoje, mistyczne moce i niestandardowe walki z smokami.",
    tags: ["rpg", "fantasy", "adventure"],
    image: "https://images.unsplash.com/photo-1518709594023-6eab9BAB7c23?auto=format&fit=crop&w=1000&q=85",
    file: "downloads/dragon-vault-demo.torrent"
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
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=85",
    file: "downloads/nightfall-tactics-demo.torrent"
  }
];

const searchInput = document.getElementById("searchInput");
const searchButton = document.querySelector(".search-panel button");
const grid = document.getElementById("gameGrid");
const suggestionsBox = document.getElementById("searchSuggestions");
const tagButtons = document.querySelectorAll(".tag-row button");
let activeCategory = "all";

function getFilteredGames() {
  const query = searchInput.value.trim().toLowerCase();

  return games.filter((game) => {
    const haystack = `${game.name} ${game.genre} ${game.platform} ${game.tags.join(" ")}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesCategory = activeCategory === "all" || game.genre.toLowerCase() === activeCategory.toLowerCase();
    return matchesQuery && matchesCategory;
  });
}

function updateSuggestions() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.remove("visible");
    return;
  }

  const matches = games
    .filter((game) => `${game.name} ${game.genre} ${game.tags.join(" ")}`.toLowerCase().includes(query))
    .slice(0, 5);

  if (!matches.length) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.remove("visible");
    return;
  }

  suggestionsBox.innerHTML = matches
    .map((game) => `<button type="button" class="suggestion-item" data-name="${game.name}">${game.name}</button>`)
    .join("");

  suggestionsBox.classList.add("visible");

  suggestionsBox.querySelectorAll(".suggestion-item").forEach((item) => {
    item.addEventListener("click", () => {
      searchInput.value = item.dataset.name;
      suggestionsBox.classList.remove("visible");
      renderGames(getFilteredGames());
    });
  });
}

function renderGames(items) {
  grid.innerHTML = "";

  items.forEach((game) => {
    const article = document.createElement("article");
    article.className = "game-card";

    article.innerHTML = `
      <div class="game-thumb">
        <img src="${game.image}" alt="Okładka gry ${game.name}" loading="lazy" />
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
          <a class="download-btn" href="${game.file}" download="${game.name.toLowerCase().replace(/\s+/g, "-")}.torrent">Pobierz</a>
        </div>
      </div>
    `;

    grid.appendChild(article);
  });
}

function filterGames() {
  renderGames(getFilteredGames());
  updateSuggestions();
}

searchInput.addEventListener("input", filterGames);
searchButton.addEventListener("click", filterGames);

document.addEventListener("click", (event) => {
  if (!event.target.closest(".suggestion-item") && !event.target.closest("#searchInput")) {
    suggestionsBox.classList.remove("visible");
  }
});

tagButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;
    activeCategory = category;

    tagButtons.forEach((item) => item.classList.toggle("active", item === button));
    filterGames();
  });
});

renderGames(getFilteredGames());

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

const authDialog = document.getElementById("authDialog");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authDescription = document.getElementById("authDescription");
const authMessage = document.getElementById("authMessage");
const authSubmit = document.getElementById("authSubmit");
const authSwitch = document.getElementById("authSwitch");
const accountButton = document.getElementById("accountButton");
const accountAvatar = document.getElementById("accountAvatar");
const accountAvatarImage = document.getElementById("accountAvatarImage");
const accountLabel = document.getElementById("accountLabel");
const profileDialog = document.getElementById("profileDialog");
const profileForm = document.getElementById("profileForm");
const profileEmail = document.getElementById("profileEmail");
const profileNickname = document.getElementById("profileNickname");
const profileMessage = document.getElementById("profileMessage");
const profileAvatarFallback = document.getElementById("profileAvatarFallback");
const profileAvatarPreview = document.getElementById("profileAvatarPreview");
const avatarFile = document.getElementById("avatarFile");
const saveProfile = document.getElementById("saveProfile");
const signupNickname = document.getElementById("signupNickname");
const signupNicknameLabel = document.getElementById("signupNicknameLabel");
let authMode = "login";
let authClient = null;
let selectedAvatarUrl = "";

function getNickname(user) {
  return user.user_metadata?.nickname || user.email?.split("@")[0] || "Gracz";
}

function setAvatar(element, user, imageElement = null) {
  const nickname = getNickname(user);
  element.textContent = nickname.trim().slice(0, 1).toUpperCase();
  if (!imageElement) return;

  imageElement.hidden = !user.user_metadata?.avatar_url;
  element.hidden = Boolean(user.user_metadata?.avatar_url);
  if (user.user_metadata?.avatar_url) imageElement.src = user.user_metadata.avatar_url;
}

function setAuthMode(mode) {
  authMode = mode;
  const signingUp = mode === "signup";
  authTitle.textContent = signingUp ? "Utwórz konto" : "Zaloguj się";
  authDescription.textContent = signingUp
    ? "Załóż konto za pomocą adresu e-mail i hasła."
    : "Zaloguj się, aby zapisać ulubione tytuły.";
  authSubmit.textContent = signingUp ? "Utwórz konto" : "Zaloguj się";
  authSwitch.textContent = signingUp ? "Masz już konto? Zaloguj się" : "Nie masz konta? Utwórz je";
  document.getElementById("authPassword").autocomplete = signingUp ? "new-password" : "current-password";
  signupNickname.hidden = !signingUp;
  signupNickname.required = signingUp;
  signupNicknameLabel.hidden = !signingUp;
  authMessage.textContent = "";
}

function showAuthMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.classList.toggle("error", isError);
}

function updateAccount(user) {
  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.hidden = Boolean(user);
  });
  accountButton.hidden = !user;
  if (user) {
    accountLabel.textContent = getNickname(user);
    accountButton.setAttribute("aria-label", `Otwórz profil: ${getNickname(user)}`);
    setAvatar(accountAvatar, user, accountAvatarImage);
  } else {
    accountLabel.textContent = "";
    accountAvatar.textContent = "";
    accountAvatarImage.hidden = true;
    accountAvatarImage.removeAttribute("src");
  }
}

document.querySelectorAll("[data-auth-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    setAuthMode(button.dataset.authMode);
    authDialog.showModal();
  });
});

document.getElementById("closeAuth").addEventListener("click", () => authDialog.close());
authSwitch.addEventListener("click", () => setAuthMode(authMode === "login" ? "signup" : "login"));

accountButton.addEventListener("click", async () => {
  if (!authClient) return;
  const { data, error } = await authClient.auth.getUser();
  if (error || !data.user) {
    setAuthMode("login");
    authDialog.showModal();
    return;
  }

  const user = data.user;
  profileEmail.value = user.email || "";
  profileNickname.value = getNickname(user);
  profileMessage.textContent = "";
  selectedAvatarUrl = user.user_metadata?.avatar_url || "";
  profileAvatarFallback.hidden = false;
  setAvatar(profileAvatarFallback, user, profileAvatarPreview);
  avatarFile.value = "";
  profileDialog.showModal();
});

document.getElementById("closeProfile").addEventListener("click", () => profileDialog.close());

avatarFile.addEventListener("change", () => {
  const file = avatarFile.files?.[0];
  if (!file) return;
  const supportedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!supportedImageTypes.includes(file.type) || file.size > 2 * 1024 * 1024) {
    avatarFile.value = "";
    profileMessage.textContent = "Wybierz obraz do 2 MB.";
    profileMessage.classList.add("error");
    return;
  }

  profileMessage.textContent = "";
  profileMessage.classList.remove("error");
  const previewUrl = URL.createObjectURL(file);
  profileAvatarPreview.src = previewUrl;
  profileAvatarPreview.hidden = false;
  profileAvatarFallback.hidden = true;
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!authClient) return;

  const nickname = profileNickname.value.trim();
  if (nickname.length < 2) {
    profileMessage.textContent = "Nick musi mieć co najmniej 2 znaki.";
    profileMessage.classList.add("error");
    return;
  }

  saveProfile.disabled = true;
  profileMessage.classList.remove("error");
  profileMessage.textContent = "Zapisywanie profilu…";

  try {
    const { data: userData, error: userError } = await authClient.auth.getUser();
    if (userError || !userData.user) throw userError || new Error("Sesja wygasła. Zaloguj się ponownie.");

    let avatarUrl = selectedAvatarUrl;
    const image = avatarFile.files?.[0];
    if (image) {
      const extension = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" }[image.type];
      const path = `${userData.user.id}/avatar.${extension}`;
      const { error: uploadError } = await authClient.storage.from("avatars").upload(path, image, {
        cacheControl: "3600",
        contentType: image.type,
        upsert: true
      });
      if (uploadError) throw uploadError;
      avatarUrl = authClient.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    }

    const { data, error } = await authClient.auth.updateUser({
      data: { nickname, avatar_url: avatarUrl }
    });
    if (error) throw error;

    updateAccount(data.user);
    profileDialog.close();
  } catch (error) {
    profileMessage.textContent = error.message || "Nie udało się zapisać profilu.";
    profileMessage.classList.add("error");
  } finally {
    saveProfile.disabled = false;
  }
});

document.getElementById("signOutButton").addEventListener("click", async () => {
  const { error } = await authClient.auth.signOut();
  if (error) {
    profileMessage.textContent = error.message;
    profileMessage.classList.add("error");
    return;
  }
  profileDialog.close();
  updateAccount(null);
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!authClient) {
    showAuthMessage("Logowanie nie jest skonfigurowane. Dodaj URL i klucz publiczny Supabase w pliku auth-config.js.", true);
    return;
  }

  const email = authForm.elements.email.value.trim();
  const password = authForm.elements.password.value;
  authSubmit.disabled = true;
  showAuthMessage("Trwa bezpieczne łączenie…");

  const result = authMode === "signup"
    ? await authClient.auth.signUp({ email, password, options: { data: { nickname: signupNickname.value.trim() } } })
    : await authClient.auth.signInWithPassword({ email, password });

  authSubmit.disabled = false;
  if (result.error) {
    showAuthMessage(result.error.message, true);
    return;
  }

  if (authMode === "signup" && !result.data.session) {
    showAuthMessage("Konto utworzone. Sprawdź pocztę i potwierdź adres e-mail.");
    return;
  }

  updateAccount(result.data.user);
  authDialog.close();
  authForm.reset();
});

const authConfig = window.NOVA_SUPABASE_CONFIG;
if (window.supabase && authConfig?.url && authConfig?.anonKey) { 
  authClient = window.supabase.createClient(authConfig.url, authConfig.anonKey);
  authClient.auth.getSession().then(({ data }) => updateAccount(data.session?.user ?? null));
  authClient.auth.onAuthStateChange((_event, session) => updateAccount(session?.user ?? null));
}
