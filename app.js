const MAX_COPIES = 3;
const MIN_DECK = 20;
const MAP_SIZE = 8;

const cardPool = [
  { name: "Dark Magician", attack: 2500, era: "DM" },
  { name: "Blue-Eyes White Dragon", attack: 3000, era: "DM" },
  { name: "Summoned Skull", attack: 2500, era: "DM" },
  { name: "Elemental HERO Neos", attack: 2500, era: "GX" },
  { name: "Destiny HERO - Malicious", attack: 800, era: "GX" },
  { name: "Cyber Dragon", attack: 2100, era: "GX" },
  { name: "Stardust Dragon", attack: 2500, era: "5D's" },
  { name: "Junk Synchron", attack: 1300, era: "5D's" },
  { name: "Black Rose Dragon", attack: 2400, era: "5D's" },
  { name: "Number 39: Utopia", attack: 2500, era: "ZEXAL" },
  { name: "Gagaga Magician", attack: 1500, era: "ZEXAL" },
  { name: "Brotherhood of the Fire Fist - Bear", attack: 1600, era: "ZEXAL" },
  { name: "Odd-Eyes Pendulum Dragon", attack: 2500, era: "ARC-V" },
  { name: "Performapal Skullcrobat Joker", attack: 1800, era: "ARC-V" },
  { name: "Raidraptor - Vanishing Lanius", attack: 1300, era: "ARC-V" },
  { name: "D/D Savant Kepler", attack: 0, era: "ARC-V" },
  { name: "Shaddoll Dragon", attack: 1900, era: "ARC-V" },
  { name: "Satellarknight Deneb", attack: 1500, era: "ARC-V" },
  { name: "Qliphort Carrier", attack: 1800, era: "ARC-V" },
  { name: "Nekroz of Unicore", attack: 2300, era: "ARC-V" }
];

const ui = {
  cardSearch: document.getElementById("card-search"),
  resetDeck: document.getElementById("reset-deck"),
  poolCount: document.getElementById("pool-count"),
  deckCount: document.getElementById("deck-count"),
  cardPool: document.getElementById("card-pool"),
  deckList: document.getElementById("deck-list"),
  canvas: document.getElementById("game-canvas"),
  startRun: document.getElementById("start-run"),
  gameStatus: document.getElementById("game-status"),
  battle: document.getElementById("battle"),
  battleStatus: document.getElementById("battle-status"),
  drawAttack: document.getElementById("draw-attack"),
  retreat: document.getElementById("retreat")
};

const state = {
  deck: [],
  playerHp: 12,
  playerPos: { x: 0, y: 0 },
  enemies: [],
  battleEnemy: null,
  clears: 0
};

const ctx = ui.canvas.getContext("2d");
const tileSize = ui.canvas.width / MAP_SIZE;

function getFilteredPool() {
  const q = ui.cardSearch.value.trim().toLowerCase();
  return cardPool.filter((card) => card.name.toLowerCase().includes(q));
}

function countCopies(cardName) {
  return state.deck.reduce((count, card) => count + (card.name === cardName ? 1 : 0), 0);
}

function updateDeckCount() {
  ui.deckCount.textContent = `Deck: ${state.deck.length} cards (min ${MIN_DECK})`;
}

function renderPool() {
  const filtered = getFilteredPool();
  ui.poolCount.textContent = `Card Pool: ${filtered.length} cards (Arc-V and earlier)`;
  ui.cardPool.innerHTML = "";
  filtered.forEach((card) => {
    const li = document.createElement("li");
    const copies = countCopies(card.name);
    li.innerHTML = `<div><div class="card-title">${card.name}</div><div class="card-meta">${card.era} • ATK ${card.attack}</div></div>`;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = copies >= MAX_COPIES ? "Maxed" : "Add";
    button.disabled = copies >= MAX_COPIES;
    button.addEventListener("click", () => {
      state.deck.push(card);
      renderDeck();
      renderPool();
    });
    li.appendChild(button);
    ui.cardPool.appendChild(li);
  });
}

function renderDeck() {
  updateDeckCount();
  ui.deckList.innerHTML = "";
  if (!state.deck.length) {
    const li = document.createElement("li");
    li.textContent = "No cards selected.";
    ui.deckList.appendChild(li);
    return;
  }

  const counts = new Map();
  state.deck.forEach((card) => counts.set(card.name, (counts.get(card.name) || 0) + 1));
  [...counts.entries()].forEach(([name, copies]) => {
    const card = cardPool.find((entry) => entry.name === name);
    const li = document.createElement("li");
    li.innerHTML = `<div><div class="card-title">${name} ×${copies}</div><div class="card-meta">${card.era} • ATK ${card.attack}</div></div>`;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Remove";
    button.addEventListener("click", () => {
      const index = state.deck.findIndex((entry) => entry.name === name);
      state.deck.splice(index, 1);
      renderDeck();
      renderPool();
    });
    li.appendChild(button);
    ui.deckList.appendChild(li);
  });
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomDeckCard() {
  if (!state.deck.length) {
    return null;
  }
  return state.deck[randomInt(state.deck.length)];
}

function spawnEnemies() {
  state.enemies = [];
  while (state.enemies.length < 5) {
    const enemy = {
      x: randomInt(MAP_SIZE),
      y: randomInt(MAP_SIZE),
      hp: 4 + randomInt(5)
    };
    if ((enemy.x !== 0 || enemy.y !== 0) && !state.enemies.some((e) => e.x === enemy.x && e.y === enemy.y)) {
      state.enemies.push(enemy);
    }
  }
}

function setStatus(message, danger = false) {
  ui.gameStatus.textContent = message;
  ui.gameStatus.classList.toggle("danger", danger);
}

function drawMap() {
  ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height);

  ctx.strokeStyle = "#1e293b";
  for (let i = 0; i <= MAP_SIZE; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * tileSize, 0);
    ctx.lineTo(i * tileSize, ui.canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * tileSize);
    ctx.lineTo(ui.canvas.width, i * tileSize);
    ctx.stroke();
  }

  state.enemies.forEach((enemy) => {
    ctx.fillStyle = "#f87171";
    ctx.fillRect(enemy.x * tileSize + 8, enemy.y * tileSize + 8, tileSize - 16, tileSize - 16);
  });

  ctx.fillStyle = "#60a5fa";
  ctx.fillRect(
    state.playerPos.x * tileSize + 6,
    state.playerPos.y * tileSize + 6,
    tileSize - 12,
    tileSize - 12
  );
}

function startBattle(enemy) {
  state.battleEnemy = enemy;
  ui.battle.classList.remove("hidden");
  ui.battleStatus.textContent = `Enemy HP: ${enemy.hp} | Your HP: ${state.playerHp}`;
}

function endBattle(won) {
  ui.battle.classList.add("hidden");
  state.battleEnemy = null;
  if (won) {
    const reward = cardPool[randomInt(cardPool.length)];
    if (countCopies(reward.name) < MAX_COPIES) {
      state.deck.push(reward);
      setStatus(`Victory! You found ${reward.name}.`, false);
      renderDeck();
      renderPool();
    } else {
      setStatus("Victory! Reward was maxed, so no new card.", false);
    }
    state.clears += 1;
  }
  if (!state.enemies.length) {
    spawnEnemies();
    setStatus("New floor generated.", false);
  }
  drawMap();
}

function checkPlayerTile() {
  const index = state.enemies.findIndex(
    (enemy) => enemy.x === state.playerPos.x && enemy.y === state.playerPos.y
  );
  if (index >= 0) {
    startBattle(state.enemies[index]);
  } else if (state.enemies.length) {
    setStatus(`HP ${state.playerHp} | Defeat ${state.enemies.length} enemies on this floor.`, false);
  }
}

function movePlayer(dx, dy) {
  if (state.battleEnemy) {
    return;
  }
  const nextX = state.playerPos.x + dx;
  const nextY = state.playerPos.y + dy;
  if (nextX < 0 || nextY < 0 || nextX >= MAP_SIZE || nextY >= MAP_SIZE) {
    return;
  }
  state.playerPos = { x: nextX, y: nextY };
  drawMap();
  checkPlayerTile();
}

function startRun() {
  if (state.deck.length < MIN_DECK) {
    setStatus(`Build at least ${MIN_DECK} cards to start a stable run.`, true);
    return;
  }
  state.playerHp = 12;
  state.playerPos = { x: 0, y: 0 };
  spawnEnemies();
  drawMap();
  setStatus(`Run started. HP ${state.playerHp}.`, false);
}

ui.drawAttack.addEventListener("click", () => {
  if (!state.battleEnemy) {
    return;
  }
  const card = getRandomDeckCard();
  if (!card) {
    setStatus("Deck is empty. Build your deck first.", true);
    return;
  }
  const damage = Math.max(1, Math.ceil(card.attack / 1000));
  state.battleEnemy.hp -= damage;
  if (state.battleEnemy.hp <= 0) {
    state.enemies = state.enemies.filter((enemy) => enemy !== state.battleEnemy);
    endBattle(true);
    return;
  }
  state.playerHp -= 1;
  if (state.playerHp <= 0) {
    state.playerHp = 0;
    ui.battle.classList.add("hidden");
    setStatus("You were defeated. Reset or adjust your deck and try again.", true);
    return;
  }
  ui.battleStatus.textContent = `${card.name} dealt ${damage}. Enemy HP: ${state.battleEnemy.hp} | Your HP: ${state.playerHp}`;
});

ui.retreat.addEventListener("click", () => {
  if (!state.battleEnemy) {
    return;
  }
  state.playerHp -= 1;
  ui.battle.classList.add("hidden");
  if (state.playerHp <= 0) {
    state.playerHp = 0;
    setStatus("You retreated and collapsed. Run over.", true);
    return;
  }
  setStatus(`Retreated. HP ${state.playerHp}. Enemy remains on tile.`, true);
  state.battleEnemy = null;
});

ui.cardSearch.addEventListener("input", renderPool);
ui.resetDeck.addEventListener("click", () => {
  state.deck = [];
  renderDeck();
  renderPool();
  setStatus("Deck reset.", false);
});
ui.startRun.addEventListener("click", startRun);

document.querySelectorAll("[data-move]").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.move;
    if (direction === "up") movePlayer(0, -1);
    if (direction === "down") movePlayer(0, 1);
    if (direction === "left") movePlayer(-1, 0);
    if (direction === "right") movePlayer(1, 0);
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") movePlayer(0, -1);
  if (event.key === "ArrowDown") movePlayer(0, 1);
  if (event.key === "ArrowLeft") movePlayer(-1, 0);
  if (event.key === "ArrowRight") movePlayer(1, 0);
});

renderPool();
renderDeck();
startRun();
