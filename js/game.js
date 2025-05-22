// Initialize player state
let prologueData = {};
let currentStep = 0;
let questionReward = null;
let enemyHP = 10;
let playerInventory = [];

let playerStats = {
  hp: 12, energy: 5, cash: 0, rp: 0, xp: 0, rep: 0, heat: 0
};

const icon = k => ({
  hp: '❤️', energy: '⚡', cash: '💵',
  rp: '🧠', xp: '⭐', rep: '📢', heat: '🔥'
}[k] || '');

function renderBar(current, max, className) {
  const pct = Math.max(0, (current / max) * 100);
  return `<div class='bar-container'><div class='bar ${className}' style='width:${pct}%;'></div></div>`;
}

function render() {
  const el = document.getElementById("game");

  if (!prologueData.questions) {
    el.innerHTML = `<p>⚠️ Prologue data not loaded.</p>`;
    return;
  }

  if (currentStep === 0) {
    el.innerHTML = `<div class="question-box">
      <h2>${prologueData.npc.portrait} ${prologueData.npc.name}</h2>
      <p>"${prologueData.npc.intro}"</p>
      <button onclick="nextQuestion()">📱 Continue</button>
    </div>`;
  } else if (currentStep <= prologueData.questions.length && !questionReward) {
    const q = prologueData.questions[currentStep - 1];
    let html = `<div class="question-box"><h3>Q${currentStep}</h3><p>💬 ${q.npcLine}</p><p>${q.text}</p>`;
    q.options.forEach((opt, i) => {
      html += `<button onclick="choose(${i})">${opt.label}</button>`;
    });
    html += "</div>";
    el.innerHTML = html;
  } else if (questionReward) {
    let html = `<div class="question-result-box"><h3>✅ Result</h3>`;
    for (let k in questionReward) {
      if (k === "item") {
        playerInventory.push(questionReward[k]);
        html += `<p>🎁 Item Gained: ${questionReward[k]}</p>`;
      } else {
        playerStats[k] = (playerStats[k] || 0) + questionReward[k];
        html += `<p>${icon(k)} ${k.toUpperCase()}: ${questionReward[k] >= 0 ? "+" : ""}${questionReward[k]}</p>`;
      }
    }
    html += `<button onclick="nextQuestion()">➡️ Continue</button></div>`;
    el.innerHTML = html;
  } else if (currentStep === prologueData.questions.length + 1) {
    renderCombat();
  } else {
    renderSummary();
  }
}

function renderCombat() {
  const el = document.getElementById("game");
  let html = `<div class="combat-ui">
    <h3>🥊 Combat: ${prologueData.combat.enemy}</h3>
    <p>❤️ You: ${playerStats.hp}</p>${renderBar(playerStats.hp, 12, 'hp')}
    <p>⚡ Energy: ${playerStats.energy}</p>${renderBar(playerStats.energy, 5, 'energy')}
    <p>💀 Enemy HP: ${enemyHP}</p>${renderBar(enemyHP, 10, 'hp')}
    <div id="combat-log">🗨️ Ready to fight</div>
    <button onclick="combatTurn()">👊 Attack (⚡ -1)</button>
    <button onclick="useItem()">🎒 Use Item</button>
    <button onclick="useSkill()">🎯 Use Skill</button>
  </div>`;
  el.innerHTML = html;
}

function combatTurn() {
  if (playerStats.energy < prologueData.combat.energyCost) {
    document.getElementById("combat-log").innerText = "⚠️ Not enough energy!";
    return;
  }

  playerStats.energy -= prologueData.combat.energyCost;
  enemyHP -= prologueData.combat.playerAtk;
  playerStats.hp -= prologueData.combat.enemyAtk;

  if (enemyHP <= 0) {
    // Reward display before continuing
    let html = `<div class='question-result-box'><h3>🏆 Combat Rewards</h3>`;
    for (let k in prologueData.combat.reward) {
      playerStats[k] = (playerStats[k] || 0) + prologueData.combat.reward[k];
      html += `<p>${icon(k)} ${k.toUpperCase()}: +${prologueData.combat.reward[k]}</p>`;
    }
    html += `<button onclick="nextQuestion()">➡️ Continue</button></div>`;
    document.getElementById("game").innerHTML = html;
  } else if (playerStats.hp <= 0) {
    document.getElementById("game").innerHTML = `
      <div class='game-over-box'>
        <h3>💀 Game Over</h3>
        <p>You were defeated!</p>
        <button onclick='location.reload()'>🔁 Restart</button>
      </div>`;
  } else {
    document.getElementById("combat-log").innerText =
      `⚡ You hit for ${prologueData.combat.playerAtk}. 💀 Enemy hit for ${prologueData.combat.enemyAtk}`;
    renderCombat();
  }
}

function renderSummary() {
  const el = document.getElementById("game");
  let html = `<div class="reward-box"><h3>🏁 Prologue Complete</h3>`;
  for (let k in playerStats) {
    html += `<p>${icon(k)} ${k.toUpperCase()}: ${playerStats[k]}</p>`;
  }
  if (playerInventory.length) {
    html += `<p>🎒 Inventory: ${playerInventory.join(", ")}</p>`;
  }
  html += `<p>📲 Redirecting to Burner OS...</p></div>`;
  el.innerHTML = html;

  // Save to localStorage
  localStorage.setItem("bb_save", JSON.stringify(playerStats));
  localStorage.setItem("bb_inventory", JSON.stringify(playerInventory));
  setTimeout(() => window.location.href = "https://bizzybullets.blogspot.com/p/burner-os.html?m=1", 3000);
}

function useItem() {
  alert("🧰 Inventory system coming soon!");
}

function useSkill() {
  alert("🧠 Skill system coming soon!");
}

function choose(i) {
  questionReward = prologueData.questions[currentStep - 1].options[i].outcomes;
  render();
}

function nextQuestion() {
  questionReward = null;
  currentStep++;
  render();
}

window.onload = function () {
  fetch("https://raw.githubusercontent.com/SGGregory76/Bizzy-Bullets/main/json/prologue.json")
    .then(res => res.json())
    .then(json => {
      prologueData = json;
      render();
    });
};
