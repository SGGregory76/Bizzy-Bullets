// game-engine.js

function updatePlayerStat(stat, amount) {
  gameData.player[stat] += amount;
  if (stat === "hp" && gameData.player.hp > 100) gameData.player.hp = 100;
  if (gameData.player.hp <= 0) handlePlayerDefeat();
}

function equipItem(itemId) {
  const item = gameData.items.find(i => i.id === itemId);
  if (!item) return;

  if (item.type === "weapon") {
    gameData.player.equipped.weapon = item;
    gameData.player.atk = 10 + (item.atkBoost || 0);
  } else if (item.type === "armor") {
    gameData.player.equipped.armor = item;
    gameData.player.def = 5 + (item.defBoost || 0);
  }
}

function performAction(actionId) {
  const action = gameData.actions[actionId];
  if (!action) return;

  if (action.energyCost && gameData.player.energy < action.energyCost) {
    console.log("Not enough energy.");
    return;
  }

  updatePlayerStat("xp", action.xp || 0);
  updatePlayerStat("heat", action.heat || 0);
  updatePlayerStat("energy", -(action.energyCost || 0));

  if (action.rewards?.cash) updatePlayerStat("cash", action.rewards.cash);

  if (actionId === "Fight") runCombat();
}

function runCombat() {
  const enemy = getRandomEnemy();
  console.log(`Encountered ${enemy.name}`);

  while (enemy.hp > 0 && gameData.player.hp > 0) {
    const damageToEnemy = Math.max(0, gameData.player.atk - enemy.def);
    enemy.hp -= damageToEnemy;

    const damageToPlayer = Math.max(0, enemy.atk - gameData.player.def);
    gameData.player.hp -= damageToPlayer;

    console.log(`You dealt ${damageToEnemy} to ${enemy.name}.`);
    console.log(`${enemy.name} dealt ${damageToPlayer} to you.`);
  }

  if (gameData.player.hp <= 0) {
    handlePlayerDefeat();
  } else {
    console.log(`Defeated ${enemy.name}!`);
    updatePlayerStat("xp", enemy.xpReward);
    updatePlayerStat("cash", enemy.cashReward);
  }
}

function getRandomEnemy() {
  const enemies = gameData.enemies;
  return JSON.parse(JSON.stringify(enemies[Math.floor(Math.random() * enemies.length)]));
}

function handlePlayerDefeat() {
  console.log("You were defeated. Losing some cash and resetting HP.");
  updatePlayerStat("cash", -50);
  gameData.player.hp = 100;
  gameData.player.energy = 100;
}

function levelUpCheck() {
  const xp = gameData.player.xp;
  const newLevel = Math.floor(xp / 100) + 1;
  if (newLevel > gameData.player.level) {
    gameData.player.level = newLevel;
    console.log(`You leveled up to Level ${newLevel}!`);
    gameData.player.hp = 100;
    gameData.player.energy = 100;
  }
}

function updateHUD() {
  document.getElementById("cash").textContent = `$${gameData.player.cash}`;
  document.getElementById("hp").textContent = `${gameData.player.hp} HP`;
  document.getElementById("xp").textContent = `${gameData.player.xp} XP`;
  document.getElementById("level").textContent = `Level ${gameData.player.level}`;
}
