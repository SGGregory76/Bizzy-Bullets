let prologueData = {};
let currentStep = 0;
let playerStats = { hp: 12, energy: 5, cash: 0, rp: 0, xp: 0, rep: 0, heat: 0 };
let playerInventory = { energyDrink: 1, medKit: 1 };
let triesLeft, stashLocation, stashFound, enemyHP;

function icon(k) {
  return { hp: '❤️', energy: '⚡', cash: '💵', rp: '🧠', xp: '⭐', rep: '📢', heat: '🔥' }[k] || '';
}

function render() {
  const container = document.getElementById('game');
  container.innerHTML = '';

  if (currentStep === 0) {
    container.innerHTML = `<div class="question-box">
      <h1>${prologueData.npc.portrait} ${prologueData.npc.name}</h1>
      <p>"${prologueData.npc.intro}"</p>
      <button onclick="nextQuestion()">📱 Continue</button>
    </div>`;
  } else if (currentStep <= 5) {
    const q = prologueData.questions[currentStep - 1];
    let html = `<div class="question-box"><h3>Q${currentStep}</h3><p>${q.text}</p>`;
    q.options.forEach((opt, i) => {
      html += `<button onclick="choose(${i})">${opt.label}</button>`;
    });
    html += '</div>';
    container.innerHTML = html;
  } else if (currentStep === 6) {
    renderCombat();
  } else if (currentStep === 7) {
    renderCombatResult();
  } else if (currentStep === 8) {
    renderStash();
  } else if (currentStep === 9) {
    renderStashResult();
  } else {
    renderReward();
  }
}

function nextQuestion() {
  currentStep++;
  render();
}

function choose(optIndex) {
  const outcomes = prologueData.questions[currentStep - 1].options[optIndex].outcomes;
  for (let k in outcomes) {
    playerStats[k] = (playerStats[k] || 0) + outcomes[k];
  }
  currentStep++;
  render();
}

function renderCombat() {
  enemyHP = prologueData.combat.enemyStats.hp;
  const html = `<div class="combat-ui">
    <h3>👊 Boss Fight: ${prologueData.combat.enemy}</h3>
    <p>❤️ You: ${playerStats.hp} | ⚡ Energy: ${playerStats.energy}</p>
    <p>💀 Enemy: ${enemyHP}</p>
    <button onclick="combatTurn()">👊 Attack (⚡ -${prologueData.combat.playerStats.energyCost})</button>
    <button onclick="useEnergy()">⚡ Use Energy Drink (${playerInventory.energyDrink})</button>
    <button onclick="useMedKit()">🩹 Use Med Kit (${playerInventory.medKit})</button>
  </div>`;
  document.getElementById('game').innerHTML = html;
}

function combatTurn() {
  if (playerStats.energy < prologueData.combat.playerStats.energyCost) {
    alert("You're out of energy!");
    return;
  }
  playerStats.energy -= prologueData.combat.playerStats.energyCost;
  enemyHP -= prologueData.combat.playerStats.atk;
  playerStats.hp -= prologueData.combat.enemyStats.atk;

  if (enemyHP <= 0) {
    for (let k in prologueData.combat.reward) {
      playerStats[k] = (playerStats[k] || 0) + prologueData.combat.reward[k];
    }
    currentStep++;
    render();
  } else if (playerStats.hp <= 0) {
    for (let k in prologueData.combat.failPenalty) {
      playerStats[k] = (playerStats[k] || 0) + prologueData.combat.failPenalty[k];
    }
    playerStats = { hp: 12, energy: 5, cash: 0, rp: 0, xp: 0, rep: 0, heat: 0 };
    playerInventory = { energyDrink: 1, medKit: 1 };
    currentStep = 0;
    alert("You lost the fight! Stats reset.");
    render();
  } else {
    renderCombat();
  }
}

function useEnergy() {
  if (playerInventory.energyDrink > 0) {
    playerStats.energy += 3;
    playerInventory.energyDrink--;
    renderCombat();
  } else {
    alert("No energy drinks left!");
  }
}

function useMedKit() {
  if (playerInventory.medKit > 0) {
    playerStats.hp += 5;
    playerInventory.medKit--;
    renderCombat();
  } else {
    alert("No med kits left!");
  }
}

function renderCombatResult() {
  let html = `<div class="combat-result-box"><h3>🥊 Combat Complete</h3>`;
  for (let k in prologueData.combat.reward) {
    html += `<p>${icon(k)} ${k.toUpperCase()}: +${prologueData.combat.reward[k]}</p>`;
  }
  html += `<button onclick="nextQuestion()">➡️ Continue</button></div>`;
  document.getElementById('game').innerHTML = html;
}

function renderStash() {
  triesLeft = prologueData.stashGame.maxTries;
  stashLocation = Math.floor(Math.random() * 9);
  stashFound = false;

  let html = `<div class="stash-grid"><h3>🎯 Find the Stash</h3><p>Tries left: ${triesLeft}</p><div class="grid">`;
  for (let i = 0; i < 9; i++) {
    html += `<button class="grid-cell" id="cell-${i}" onclick="pickCell(${i}, this)">❓</button>`;
  }
  html += '</div></div>';
  document.getElementById('game').innerHTML = html;
}

function pickCell(i, el) {
  if (el.disabled) return;
  el.disabled = true;
  triesLeft--;
  if (i === stashLocation) {
    el.innerText = '💰';
    stashFound = true;
    Object.entries(prologueData.stashGame.reward).forEach(([k, v]) => playerStats[k] += v);
  } else {
    el.innerText = '❌';
  }
  document.querySelector(".stash-grid p").innerText = `Tries left: ${triesLeft}`;
  if (triesLeft <= 0 || stashFound) {
    setTimeout(() => { currentStep++; render(); }, 1000);
  }
}

function renderStashResult() {
  const html = `<div class="stash-result-box">
    <h3>${stashFound ? '💰 You Found the Stash!' : '🚫 You Failed to Find the Stash'}</h3>
    <p>${stashFound ? 'Nice pull. Bonus XP and Cash awarded.' : 'Better luck next time.'}</p>
    <button onclick="nextQuestion()">➡️ Continue</button>
  </div>`;
  document.getElementById('game').innerHTML = html;
}

function renderReward() {
  let html = `<div class="reward-box"><h3>🏆 Mission Complete</h3>`;
  for (let k in playerStats) {
    html += `<p>${icon(k)} ${k.toUpperCase()}: ${playerStats[k]}</p>`;
  }
  html += `<p>📦 Inventory: ⚡ Drinks (${playerInventory.energyDrink}) 🩹 Med Kits (${playerInventory.medKit})</p>`;
  html += `<p>📲 Launching Burner OS...</p></div>`;
  document.getElementById('game').innerHTML = html;
  setTimeout(() => { window.location.href = '/p/burner-os.html'; }, 3000);
}

fetch('prologueData.json')
  .then(res => res.json())
  .then(data => {
    prologueData = data;
    render();
  });
