// ui-handler.js

function initUI() {
  updateHUD();
  document.getElementById("btnSell").addEventListener("click", () => performAction("Sell"));
  document.getElementById("btnFight").addEventListener("click", () => performAction("Fight"));
  document.getElementById("btnRest").addEventListener("click", () => performAction("Rest"));
}

function updateHUD() {
  document.getElementById("playerName").textContent = gameData.player.name;
  document.getElementById("cash").textContent = `$${gameData.player.cash}`;
  document.getElementById("hp").textContent = `${gameData.player.hp}`;
  document.getElementById("xp").textContent = `${gameData.player.xp}`;
  document.getElementById("level").textContent = gameData.player.level;
  document.getElementById("heat").textContent = gameData.player.heat;
  document.getElementById("energy").textContent = gameData.player.energy;
}

function renderInventory() {
  const container = document.getElementById("inventory");
  container.innerHTML = "";
  gameData.player.inventory.forEach(item => {
    const el = document.createElement("div");
    el.textContent = item.name;
    container.appendChild(el);
  });
}

function showMessage(msg) {
  const log = document.getElementById("log");
  const entry = document.createElement("div");
  entry.textContent = msg;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}
