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

window.combatTurn = function () {
  if (playerStats.energy < prologueData.combat.energyCost) {
    document.getElementById("combat-log").innerText = "⚠️ Not enough energy!";
    return;
  }
  playerStats.energy -= prologueData.combat.energyCost;
  enemyHP -= prologueData.combat.playerAtk;
  playerStats.hp -= prologueData.combat.enemyAtk;

  if (enemyHP <= 0) {
    for (let k in prologueData.combat.reward) {
      playerStats[k] = (playerStats[k] || 0) + prologueData.combat.reward[k];
    }
    currentStep++;
    render();
  } else if (playerStats.hp <= 0) {
    document.getElementById("combat-log").innerText = "💀 You were defeated!";
    setTimeout(() => window.location.href = "/p/burner-os.html", 2000);
  } else {
    document.getElementById("combat-log").innerText =
      `⚡ You hit for ${prologueData.combat.playerAtk}. 💀 Enemy hit for ${prologueData.combat.enemyAtk}`;
    renderCombat();
  }
};


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
