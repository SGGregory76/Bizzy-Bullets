function updateHUD() {
  document.getElementById("cash").textContent = "$" + gameData.player.cash;
  document.getElementById("hp").textContent = gameData.player.hp;
}
