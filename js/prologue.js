let data = {};
let state = {
  step: 0,
  enemyHP: 10,
  inventory: [],
  stats: { hp: 12, energy: 5, cash: 0, rp: 0, xp: 0, rep: 0, heat: 0 },
  reward: null
};

const icons = { hp: '❤️', energy: '⚡', cash: '💵', rp: '🧠', xp: '⭐', rep: '📢', heat: '🔥' };

function icon(k) { return icons[k] || ''; }

function bar(current, max, cls) {
  const pct = Math.max(0, (current / max) * 100);
  return `<div class='bar-container'><div class='bar ${cls}' style='width:${pct}%;'></div></div>`;
}

function showInventory() {
  return state.inventory.length ? `<div class='inventory-bar'>🎒 Inventory: ${state.inventory.join(", ")}</div>` : "";
}

function render() {
  const game = document.getElementById("game");
  if (!game || !data.questions) return;

  if (state.step === 0) {
    game.innerHTML = `<div class='question-box'><h2>${data.npc.portrait} ${data.npc.name}</h2><p>${data.npc.intro}</p><button onclick='next()'>📱 Continue</button></div>`;
  } else if (state.step <= data.questions.length && !state.reward) {
    const q = data.questions[state.step - 1];
    let html = `<div class='question-box'><h3>Q${state.step}</h3><p>💬 ${q.npcLine}</p><p>${q.text}</p>`;
    q.options.forEach((opt, i) => html += `<button onclick='choose(${i})'>${opt.label}</button>`);
    html += `</div>`;
    game.innerHTML = html;
  } else if (state.reward) {
    let html = `<div class='question-result-box'><h3>✅ Result</h3>`;
    for (let k in state.reward) {
      if (k === "item") {
        state.inventory.push(state.reward[k]);
        html += `<p>🎁 Item Gained: ${state.reward[k]}</p>`;
      } else {
        state.stats[k] = (state.stats[k] || 0) + state.reward[k];
        html += `<p>${icon(k)} ${k.toUpperCase()}: ${state.reward[k] >= 0 ? "+" : ""}${state.reward[k]}</p>`;
      }
    }
    html += `<button onclick='next()'>➡️ Continue</button></div>` + showInventory();
    game.innerHTML = html;
  } else if (state.step === data.questions.length + 1) {
    game.innerHTML = `<div class='combat-ui'>
      <h3>🥊 Combat: ${data.combat.enemy}</h3>
      <p>❤️ You: ${state.stats.hp}</p>${bar(state.stats.hp, 12, 'hp')}
      <p>⚡ Energy: ${state.stats.energy}</p>${bar(state.stats.energy, 5, 'energy')}
      <p>💀 Enemy HP: ${state.enemyHP}</p>${bar(state.enemyHP, 10, 'hp')}
      <div id='combat-log'>🗨️ Ready to fight</div>
      <button onclick='fight()'>👊 Attack (⚡ -1)</button>
      <button onclick='alert("🧰 Inventory system coming soon!")'>🎒 Use Item</button>
      <button onclick='alert("🧠 Skill system coming soon!")'>🎯 Use Skill</button>
    </div>` + showInventory();
  } else {
    localStorage.setItem("bb_save", JSON.stringify(state.stats));
    game.innerHTML = `<div class='reward-box'><h3>🏁 Prologue Complete</h3>
      ${Object.keys(state.stats).map(k => `<p>${icon(k)} ${k.toUpperCase()}: ${state.stats[k]}</p>`).join('')}
      ${state.inventory.length ? `<p>🎒 Inventory: ${state.inventory.join(", ")}</p>` : ""}
      <p>📲 Redirecting to Burner OS...</p></div>`;
    setTimeout(() => window.location.href = "https://bizzybullets.blogspot.com/p/burner-os.html?m=1", 3000);
  }
}

window.choose = i => {
  state.reward = data.questions[state.step - 1].options[i].outcomes;
  render();
};

window.next = () => {
  state.reward = null;
  state.step++;
  render();
};

window.fight = () => {
  const c = data.combat;
  if (state.stats.energy < c.energyCost) {
    document.getElementById("combat-log").innerText = "⚠️ Not enough energy!";
    return;
  }
  state.stats.energy -= c.energyCost;
  state.enemyHP -= c.playerAtk;
  state.stats.hp -= c.enemyAtk;

  if (state.enemyHP <= 0) {
    for (let k in c.reward) state.stats[k] = (state.stats[k] || 0) + c.reward[k];
    state.step++;
    render();
  } else if (state.stats.hp <= 0) {
    document.getElementById("game").innerHTML = `<div class='game-over-box'><h3>💀 Game Over</h3><p>You were defeated!</p><button onclick='location.reload()'>🔁 Reset Game</button></div>`;
  } else {
    document.getElementById("combat-log").innerText = `⚡ You hit for ${c.playerAtk}. 💀 Enemy hit for ${c.enemyAtk}`;
    render();
  }
};

// Load JSON and initialize
fetch('game/prologue.json') // <-- update path as needed
  .then(res => res.json())
  .then(json => {
    data = json;
    render();
  });
