// Example snippet
function performAction(actionId) {
  const action = gameData.actions[actionId];
  gameData.player.xp += action.xp || 0;
  gameData.player.heat += action.heat || 0;
  // Apply rewards, penalties, etc.
}
