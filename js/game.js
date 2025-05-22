let currentStep = 0;
let questionReward = null;
let playerStats = { hp: 12, energy: 5, cash: 0, rp: 0, xp: 0, rep: 0, heat: 0 };
let enemyHP = 10;

const icon = k => ({ hp: '❤️', energy: '⚡', cash: '💵', rp: '🧠', xp: '⭐', rep: '📢', heat: '🔥' }[k] || '');

function renderBar(current, max, className) {
  const pct = Math.max(0, (current / max) * 100);
  return `<div class='bar-container'><div class='bar ${className}' style='width:${pct}%;'></div></div>`;
}
setTimeout(() => {
  document.getElementById("memorial").classList.add("show");
}, 300);

function render() {
  const el = document.getElementById("game");
  el.innerHTML = "";

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
      html += `<p>${icon(k)} ${k.toUpperCase()}: ${questionReward[k] >= 0 ? "+" : ""}${questionReward[k]}</p>`;
      playerStats[k] = (playerStats[k] || 0) + questionReward[k];
    }
    html += `<button onclick="nextQuestion()">➡️ Continue</button></div>`;
    el.innerHTML = html;
  } else if (currentStep === 6) {
    renderCombat();
  } else if (currentStep === 7) {
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
}

function renderSummary() {
  const el = document.getElementById("game");
  let html = `<div class="reward-box"><h3>🏁 Prologue Complete</h3>`;
  for (let k in playerStats) {
    html += `<p>${icon(k)} ${k.toUpperCase()}: ${playerStats[k]}</p>`;
  }
  html += `<p>📲 Redirecting to Burner OS...</p></div>`;
  el.innerHTML = html;
  setTimeout(() => window.location.href = "/p/burner-os.html", 3000);
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

window.onload = render;
