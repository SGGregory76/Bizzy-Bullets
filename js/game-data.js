// game-data.js

const gameData = {
player: {
name: "Player",
level: 1,
xp: 0,
cash: 100,
rep: 0,
heat: 0,
energy: 100,
hp: 100,
atk: 10,
def: 5,
inventory: \[],
skills: {
dealing: 1,
crafting: 1,
stealth: 1,
shooting: 1
},
equipped: {
weapon: null,
armor: null
}
},
locations: \[
{
id: "corner",
name: "Street Corner",
actions: \["Sell", "Watch", "Fight"]
},
{
id: "warehouse",
name: "Warehouse Lab",
actions: \["Craft", "Store", "Rest"]
},
{
id: "trap",
name: "Trap House",
actions: \["Trade", "Sleep", "Upgrade"]
}
],
items: \[
{
id: "weed",
name: "Weed",
type: "drug",
value: 50,
potency: 1
},
{
id: "pill\_press",
name: "Pill Press",
type: "equipment",
value: 200,
effect: "enables crafting"
},
{
id: "lighter",
name: "Lighter",
type: "tool",
value: 5
},
{
id: "brass\_knuckles",
name: "Brass Knuckles",
type: "weapon",
value: 100,
atkBoost: 5
},
{
id: "leather\_jacket",
name: "Leather Jacket",
type: "armor",
value: 75,
defBoost: 3
},
{
id: "9mm\_pistol",
name: "9mm Pistol",
type: "weapon",
value: 300,
atkBoost: 10
},
{
id: "kevlar\_vest",
name: "Kevlar Vest",
type: "armor",
value: 250,
defBoost: 7
}
],
actions: {
Sell: {
description: "Sell street drugs for cash.",
xp: 10,
heat: 1,
rewards: {
cash: 50
}
},
Craft: {
description: "Use tools and drugs to create more powerful products.",
xp: 20,
heat: 2
},
Rest: {
description: "Restore energy and reduce heat.",
xp: 5,
heat: -2
},
Fight: {
description: "Engage in a street fight to gain XP and loot.",
xp: 25,
energyCost: 20,
heat: 3,
requires: \["weapon"],
damageRange: \[10, 25],
reward: {
cash: 75,
itemDropChance: 0.4
}
}
},
enemies: \[
{
id: "street\_thug",
name: "Street Thug",
hp: 60,
atk: 8,
def: 3,
xpReward: 15,
cashReward: 40
},
{
id: "gang\_member",
name: "Gang Member",
hp: 100,
atk: 12,
def: 6,
xpReward: 30,
cashReward: 100
}
]
};
