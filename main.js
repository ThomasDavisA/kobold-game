'use strict';

//global consts
const BASE_KOBOLD_COST = 5;
const BASE_GENERAL_EXP_LEVEL = 20;
const BASE_GENERAL_MULTIPLIER = 1.2;
const BASE_SUB_EXP_LEVEL = 10;
const BASE_SUB_MULTIPLIER = 1.4;
const BASE_LEVEL_POWER_MULTIPLIER = 1.5;
const BASE_POWER_MULTIPLIER = 1.05;
const BASE_CONVERSION_FACTOR = 10;
const BASE_SPRITE_SHADOW_ID = 6;
const PIXEL_WIDTH = 32;
const PIXEL_HEIGHT = 32;
const EQUIPMENT_PIXEL_WIDTH_HEIGHT = 512;
const PIXEL_OFFSET_X = 16;
const GENERIC_TYPES = 3;

//const references?
const COLOR_WOODNICKEL = 'color-wood';


let koboldImg = new Image();
koboldImg = 'kobold_sprites.png';
let kobolds = 0;
let clickBase = 1;
let koboldID = 0;
let inspectTimer = 0;

//Using a global event listener to determine what the click will do
document.getElementById("game-block").addEventListener("click", checkClick);

//add more event listeners
document.getElementById("smith-upgrade").addEventListener("click", upgradeCheck('smith'));
document.getElementById("coin-upgrade").addEventListener("click", upgradeCheck('coin'));
document.getElementById("dungeon-upgrade").addEventListener("click", upgradeCheck('dungeon'));
document.getElementById("trade-upgrade").addEventListener("click", upgradeCheck('trade'));

//document.getElementById("kobold-rest-block").addEventListener("click", checkClick);
//Starting init
let playerStatus = playerInit();


function coinClick() {
    //determine what kinds of coins we can create based on upgrades, and then give coins based on power
    if (playerStatus.coinPurse.platinumCoin >= 1) {//wake the dragon
        let endBox = document.getElementById('end-box');
        endBox.style.top = '50%';

        let endText = document.getElementById('end-text');
        endText.innerHTML = `Congratulations!  You have woken the dragon.  It took you ${playerStatus.timeSpent} seconds to wake him.`;
    } else {
        let coinQuality = 0;
        let coinList = Object.keys(playerStatus.coinPurse);
        playerStatus.coinPurse[coinList[coinQuality]] += playerStatus.clickPower;
    }

}

function upgradeCheck(checkID) {
    //Check to see what we're doing, and then apply it!  Each upgrade only goes up to level 5.
    
    
    switch (checkID) {
        case 'smith':
        
            break;
        case 'coin':
            break;
        case 'dungeon':
            break;
        case 'trade':
            break;
    }
}

//Player factory
function playerInit() {
    let playerStatus = {
        name: "player",
        dragonColor: "green",
        tempId: null,
        timeSpent: 0, //seconds spent in game
        clickPower: 1,
        koboldFood: 0,
        totalValue: 0,
        koboldList: [], //Should contain an array of kobold objs
        monsterList: [], //Array of monsters currently residing in adventure
        coinPurse: {   //Object of Coins
            woodNickel: 100,
            copperCoin: 100,
            brassCoin: 100,
            bronzeCoin: 100,
            ironCoin: 100,
            steelCoin: 100,
            silverCoin: 100,
            electrumCoin: 100,
            goldCoin: 100,
            platinumCoin: 0
        },
        gemPurse: {
            Apatite: 10,
            Beryl: 10,
            Citrine: 10,
            Emerald: 10,
            Garnet: 10,
            Jade: 10,
            Onyx: 10,
            Ruby: 10,
            Sapphire: 10,
            Spinel: 10,
            Topaz: 10,
            Tanzanite: 10,
            Tourmaline: 10
        },
        upgradeCount: {
            smith: 0,
            coin: 0,
            trade: 0,
            adventure: 0,
        },

        itemList: [],
        weaponRack: [],
        armorRack: [],


        getCoinPurse: function () {
            return this.coinPurse;
        },

        removeCoinsPurse: function (newCoinPurse) {
            for (const coinKeys of Object.keys(this.coinPurse)) {
                this.coinPurse[coinKeys] -= newCoinPurse[coinKeys];
            }
        },

        getKoboldList: function () {
            return this.koboldList;
        },


        //refreshed our total coin value and returns it as a value
        updateCoinValue: function () {
            let i = 1;
            this.totalValue = 0;
            for (const purseKey in playerStatus.coinPurse) {
                if (purseKey !== "totalValue") {
                    this.totalValue += (this.coinPurse[purseKey] * i);
                    i = i * BASE_CONVERSION_FACTOR;
                }
            }
            return this.totalValue;
        },

        removeCoins: function (num, type) {
            switch (type) {
                case 'wood':
                    this.coinPurse.woodNickel -= num;
                    break;
                case 'copper':
                    this.coinPurse.copperCoin -= num;
                    break;
                case 'brass':
                    this.coinPurse.brassCoin -= num;
                    break;
                case 'bronze':
                    this.coinPurse.bronzeCoin -= num;
                    break;
                case 'iron':
                    this.coinPurse.ironCoin -= num;
                    break;
                case 'steel':
                    this.coinPurse.steelCoin -= num;
                    break;
                case 'silver':
                    this.coinPurse.silverCoin -= num;
                    break;
                case 'electrum':
                    this.coinPurse.electrumCoin -= num;
                    break;
                case 'gold':
                    this.coinPurse.goldCoin -= num;
                    break;
                case 'platinum':
                    this.coinPurse.platinumCoin -= num;
                    break;
            }
        },

        addCoins: function (koboldCoinPurse) {
            let playerPurse = Object.keys(this.coinPurse);
            for (const coinTypes of playerPurse) {
                this.coinPurse[coinTypes] += koboldCoinPurse[coinTypes];
            }
        },

        giveGem: function () {
            let gemList = Object.keys(playerStatus.gemPurse);
            let newGem = Math.floor(Math.random() * gemList.length);
            playerStatus.gemPurse[gemList[newGem]]++;
            return gemList[newGem];
        },

    }

    return playerStatus;
}

//item factory
function createItem(type = "weapon", sub = "sword", dur = 0, name = "", offsetX = 0, offsetY = 0) {
    return {
        name: name,
        type: type,
        subtype: sub,
        durabilty: dur,
        gem: 0,
        offsetX: offsetX,
        offsetY: offsetY
    };
}

//monster factory
function createMonster(idNum) {
    return {
        name: "slime",
        id: idNum,
        hasActed: false,
        spriteID: 0,
        currentHP: 5,
        maxHP: 5,
        attack: 1,

        getAttack: function () {
            return this.attack;
        },

        takeDamage: function (damage) {
            this.currentHP -= damage;
        },

        checkMonsterAttack: function (koboldTarget) {
            if (!this.hasActed) {
                this.hasActed == true;
                return true;
            }
        },

        checkDeath: function () {
            if (this.currentHP <= 0) {
                return true; //return true if the monster dies
            }
        },

    }
}


function removeYip(event) {
    event.target.remove();
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function buyKobold() {
    //Find the initial value then scale it up based on coin values.  If the players has all of these, give them a koobld.
    let koboldCost = BASE_KOBOLD_COST + Math.floor(Math.pow(1.8, playerStatus.koboldList.length));
    let koboldPurseCost = { ...playerStatus.getCoinPurse() };
    let coinTotalCost = Object.keys(playerStatus.getCoinPurse());
    let coinCostReverse = [];
    for (const coinType of coinTotalCost) {
        //reverse the list
        coinCostReverse.unshift(coinType);
    }

    let exponent = 9;

    for (const coinType of coinCostReverse) {
        koboldPurseCost[coinType] = (Math.floor(koboldCost / (BASE_CONVERSION_FACTOR ** exponent)));
        koboldCost = Math.floor(koboldCost % BASE_CONVERSION_FACTOR ** exponent);

        //koboldCost = koboldCost - (Math.floor(koboldCost / (BASE_CONVERSION_FACTOR ** exponent)));
        exponent--;
    }
    console.log(`KoboldCost: ${koboldCost}`);
    console.log(`Kobold Purse: ${koboldPurseCost}`);

    let tempPurse = { ...playerStatus.getCoinPurse() };
    let coinKeys = Object.keys(tempPurse)
    let coinflag = 0;

    for (const coinType of coinKeys) {
        if (tempPurse[coinType] >= koboldPurseCost[coinType]) {
            coinflag++;
        };
    }

    if (coinflag >= 10) {
        playerStatus.removeCoinsPurse(koboldPurseCost);
        addKobold();
    }

    displayCoinValues();
}

function restartGame() {
    location = location;
    return false;
}

function addKobold() {
    const newKobold = createKobold(playerStatus.koboldList.length); //copy the object to a fresh one
    newKobold.name = koboldNameList[Math.floor(Math.random() * koboldNameList.length)];
    newKobold.id = playerStatus.koboldList.length + 1;
    newKobold.koboldHeadID = Math.floor(Math.random() * GENERIC_TYPES);
    newKobold.koboldEarID = Math.floor(Math.random() * GENERIC_TYPES);
    newKobold.koboldEyesID = Math.floor(Math.random() * GENERIC_TYPES);
    newKobold.koboldMouthID = Math.floor(Math.random() * GENERIC_TYPES);
    newKobold.koboldBodyID = Math.floor(Math.random() * GENERIC_TYPES);
    newKobold.koboldArmID = Math.floor(Math.random() * GENERIC_TYPES);
    newKobold.koboldLegID = Math.floor(Math.random() * GENERIC_TYPES);
    newKobold.koboldTailID = Math.floor(Math.random() * GENERIC_TYPES);
    let newKoboldPosition = playerStatus.koboldList.push(newKobold);
    displayKobold(newKobold, newKoboldPosition); //lets just output the kobold this way
}

//display the monster as a Div element on the DOM.  Combine this function later with displayKobold to just display any entity.
function displayMonster(monster) {
    let monsterDiv = document.createElement("div");
    let monsterDivPortrait = document.createElement("div");
    let monsterDivName = document.createElement("div");
    let monsterHealthBarContainer = document.createElement("div");
    let monsterHealthBar = document.createElement("div");

    let monsterCanvas = document.createElement("canvas");
    monsterCanvas.width = 80;
    monsterCanvas.height = 80;
    monsterCanvas.id = `monster_${monster.id}_canvas`;
    let ctx = monsterCanvas.getContext('2d');
    let monsterImg = new Image();
    monsterImg.src = document.getElementById("monster-sprites").src;
    monsterImg.onload = function () {
        ctx.drawImage(monsterImg, monster.spriteID * 80, 0, 80, 80, 0, 0, 80, 80);

        ctx.save();
    }


    monsterDiv.classList.add("monster-unit");
    monsterDivPortrait.classList.add("kobold-unit-portrait");
    monsterDivName.classList.add("kobold-unit-name");
    monsterHealthBarContainer.classList.add("bar-container");
    monsterHealthBar.classList.add("health-bar");
    monsterHealthBarContainer.appendChild(monsterHealthBar);
    monsterDiv.id = `monster_${monster.id}`;
    monsterDiv.append(monsterCanvas);
    monsterDiv.append(monsterDivName);
    monsterDiv.append(monsterHealthBarContainer);
    document.getElementById('kobold-adventure-block-monsters').appendChild(monsterDiv);
}

//display the kobold as a Div element on the DOM, using its position as an ID to track it
function displayKobold(kobold, pos) {
    let koboldDiv = document.createElement("div");
    let koboldDivPortrait = document.createElement("div");
    let koboldDivName = document.createElement("div");
    let koboldSpeedBarContainer = document.createElement("div");
    let koboldSpeedBar = document.createElement("div");
    let koboldEnergyBarContainer = document.createElement("div");
    let koboldEnergyBar = document.createElement("div");
    let koboldHungerBarContainer = document.createElement("div");
    let koboldHungerBar = document.createElement("div");
    koboldDivName.innerHTML = kobold.name;

    /* Create the kobold using sprite sheet instead */
    let koboldCanvas = document.createElement("canvas");

    koboldCanvas.id = `kobold_${kobold.id}_canvas`;
    let ctx = koboldCanvas.getContext('2d');
    let koboldImg = new Image();
    koboldImg.src = document.getElementById("kobold-sprites").src;

    let tempOffset = 50 - PIXEL_OFFSET_X;
    koboldImg.onload = function () {


        ctx.scale(2, 2);
        ctx.drawImage(koboldImg, kobold.koboldLegID * PIXEL_WIDTH, (6 * PIXEL_HEIGHT), PIXEL_WIDTH, PIXEL_HEIGHT, tempOffset + 6, 32, PIXEL_WIDTH, PIXEL_HEIGHT);
        ctx.drawImage(koboldImg, kobold.koboldArmID * PIXEL_WIDTH, (5 * PIXEL_HEIGHT), PIXEL_WIDTH, PIXEL_HEIGHT, tempOffset + 8, 17, PIXEL_WIDTH, PIXEL_HEIGHT);
        ctx.drawImage(koboldImg, kobold.koboldTailID * PIXEL_WIDTH, (7 * PIXEL_HEIGHT), PIXEL_WIDTH, PIXEL_HEIGHT, tempOffset, 16, PIXEL_WIDTH, PIXEL_HEIGHT);
        ctx.drawImage(koboldImg, kobold.koboldBodyID * PIXEL_WIDTH, (4 * PIXEL_HEIGHT), PIXEL_WIDTH, PIXEL_HEIGHT, tempOffset, 16, PIXEL_WIDTH, PIXEL_HEIGHT);
        ctx.drawImage(koboldImg, kobold.koboldHeadID * PIXEL_WIDTH, 0, PIXEL_WIDTH, PIXEL_HEIGHT, tempOffset, 0, PIXEL_WIDTH, PIXEL_HEIGHT);
        ctx.drawImage(koboldImg, kobold.koboldEarID * PIXEL_WIDTH, (1 * PIXEL_HEIGHT), PIXEL_WIDTH, PIXEL_HEIGHT, tempOffset, 0, PIXEL_WIDTH, PIXEL_HEIGHT);
        ctx.drawImage(koboldImg, kobold.koboldEyesID * PIXEL_WIDTH, (2 * PIXEL_HEIGHT), PIXEL_WIDTH, PIXEL_HEIGHT, tempOffset, 0, PIXEL_WIDTH, PIXEL_HEIGHT);
        ctx.drawImage(koboldImg, kobold.koboldMouthID * PIXEL_WIDTH, (3 * PIXEL_HEIGHT), PIXEL_WIDTH, PIXEL_HEIGHT, tempOffset, 0, PIXEL_WIDTH, PIXEL_HEIGHT);
        ctx.drawImage(koboldImg, kobold.koboldArmID * PIXEL_WIDTH, (5 * PIXEL_HEIGHT), PIXEL_WIDTH, PIXEL_HEIGHT, tempOffset - 8, 17, PIXEL_WIDTH, PIXEL_HEIGHT);
        ctx.drawImage(koboldImg, kobold.koboldLegID * PIXEL_WIDTH, (6 * PIXEL_HEIGHT), PIXEL_WIDTH, PIXEL_HEIGHT, tempOffset - 6, 32, PIXEL_WIDTH, PIXEL_HEIGHT);

        //redraw one more time to recenter the image
        //ctx.drawImage(, 0, 0, 200, 200, 0, 0, 100, 100);

        ctx.save();


        //ctx.drawImage(koboldImg, 0, 0, 80, 150);
    };

    koboldDiv.classList.add("kobold-unit");

    koboldDivPortrait.classList.add("kobold-unit-portrait");
    koboldDivName.classList.add("kobold-unit-name");
    koboldEnergyBarContainer.classList.add("bar-container");
    koboldHungerBarContainer.classList.add("bar-container");
    koboldSpeedBarContainer.classList.add("bar-container");
    koboldEnergyBar.classList.add("energy-bar");
    koboldHungerBar.classList.add("hunger-bar");
    koboldSpeedBar.classList.add("speed-bar");
    koboldEnergyBarContainer.appendChild(koboldEnergyBar);
    koboldHungerBarContainer.appendChild(koboldHungerBar);
    koboldSpeedBarContainer.appendChild(koboldSpeedBar);
    koboldDiv.id = `kobold_${pos}`;
    koboldDiv.append(koboldCanvas);
    koboldDiv.append(koboldDivName);
    koboldDiv.append(koboldSpeedBarContainer);
    koboldDiv.append(koboldEnergyBarContainer);
    koboldDiv.append(koboldHungerBarContainer);
    koboldDiv.addEventListener('click', selectKobold);
    koboldDiv.addEventListener('mouseenter', viewKoboldDetails);
    koboldDiv.addEventListener('mouseleave', removeDetails);
    koboldDiv.addEventListener('animationend', checkKoboldVis);
    document.getElementById('kobold-rest-block').appendChild(koboldDiv);
}

//Selects a kobold when they are clicked and stores it as a value
function selectKobold(event) {
    event.stopPropagation();
    let idReference = this.id.match(/\d+/);
    idReference = idReference[0] - 1; //don't forget, index starts at 0!
    console.log(idReference);
    playerStatus.tempId = this.id;
    console.log(`Clicked ${this.id}! tempID is ${playerStatus.tempId}.`);
    console.log(`My name is ${playerStatus.koboldList[idReference].name} and I am at locations ${playerStatus.koboldList[idReference].presentLocation}!`);
}

//display the kobold in the corner to view stats
function viewKoboldDetails(event) {
    let inspector = document.getElementById("inspector-canvas");
    let destinationCtx = inspector.getContext('2d');
    if (`${event.target.id}_canvas` !== `${destinationCtx.id}_canvas`) {
        destinationCtx.clearRect(0, 0, inspector.width, inspector.height);
    }




    let inspectorStatus = document.getElementById("inspector-stats");
    if (event.target.id.includes('kobold')) {
        let koboldInspected = playerStatus.koboldList[event.target.id.match(/\d+/) - 1]
        destinationCtx.drawImage(document.getElementById(`${event.target.id}_canvas`), 0, 0, inspector.width, inspector.height);
        //timer?
        //inspectTimer = setInterval(viewKoboldDetails(event), 100);



        inspectorStatus.innerHTML = `${koboldInspected.name}`;
        let coinBox = document.createElement("div");
        coinBox.classList.add("inner-block");
        coinBox.id = "coin-box";
        coinBox.innerHTML = `Carrying Capacity: ${koboldInspected.coinCapacity} Current Coins:`;

        let coin = 0;
        let tempCoinPurse = Object.keys(koboldInspected.totalCoin)
        for (const coinType of tempCoinPurse) {
            if (koboldInspected.totalCoin[coinType] > 0) {
                coinBox.innerHTML = `${coinBox.innerHTML} <i class="fas color-${coinType} fa-coins"></i> ${koboldInspected.totalCoin[coinType]}`;
                coin++;
            }
        }

        if (coin === 0) {
            coinBox.innerHTML = `${coinBox.innerHTML} None!`;
        }

        //create the stats view
        let listBox = document.createElement("div");
        listBox.classList.add("inner-block");
        listBox.style.justifyContent = "space-around";
        let listBoxTwo = document.createElement("div");
        listBox.classList.add("inner-block");
        listBoxTwo.classList.add("stat-list");
        let listView = document.createElement("ul");
        listView.classList.add("stat-list");
        let listViewTwo = document.createElement("ul");
        listViewTwo.classList.add("stat-list");
        let listViewThree = document.createElement("ul");
        listViewThree.classList.add("stat-list");

        let viewHunger = document.createElement("ol");
        viewHunger.classList.add("coin-totals");
        viewHunger.id = "view-hunger";
        viewHunger.innerHTML = `<i class="fas fa-leaf"></i>: ${koboldInspected.currentHunger} / ${koboldInspected.maxHunger}`;
        let viewEnergy = document.createElement("ol");
        viewEnergy.classList.add("coin-totals");
        viewEnergy.id = "view-energy";
        viewEnergy.innerHTML = `<i class="fas fa-battery-full"></i>: ${koboldInspected.currentEnergy} / ${koboldInspected.maxEnergy}`;

        let viewGenXP = document.createElement("ol");
        viewGenXP.id = "view-gen-xp";
        viewGenXP.innerHTML = `<i class="fas fa-award"></i>: ${koboldInspected.skills.generalSkills.exp} / ${koboldInspected.skills.generalSkills.nextLevel}`;
        let viewCraftXP = document.createElement("ol");
        viewCraftXP.id = "view-craft-xp";
        viewCraftXP.innerHTML = `<i class="fas fa-hammer"></i>: ${koboldInspected.skills.craftingSkills.exp} / ${koboldInspected.skills.craftingSkills.nextLevel}`;
        let viewTradeXP = document.createElement("ol");
        viewTradeXP.id = "view-trade-xp";
        viewTradeXP.innerHTML = `<i class="fas fa-exchange-alt"></i>: ${koboldInspected.skills.tradingSkills.exp} / ${koboldInspected.skills.tradingSkills.nextLevel}`;
        let viewAdventureXP = document.createElement("ol");
        viewAdventureXP.id = "view-adv-xp";
        viewAdventureXP.innerHTML = `<i class="fas fa-flag"></i>: ${koboldInspected.skills.adventureSkills.exp} / ${koboldInspected.skills.adventureSkills.nextLevel}`;

        let viewWeapon = document.createElement("ol");
        viewWeapon.id = "view-weapon";
        if (koboldInspected.equipWeapon.name) {
            viewWeapon.innerHTML = `Weapon: ${koboldInspected.equipWeapon.name} [${koboldInspected.equipWeapon.durabilty}]`;
        } else {
            viewWeapon.innerHTML = `Weapon: none!`;
        }
        let viewArmor = document.createElement("ol");
        viewArmor.id = "view-armor";
        if (koboldInspected.equipArmor.name) {
            viewArmor.innerHTML = `Armor: ${koboldInspected.equipArmor.name} [${koboldInspected.equipArmor.durabilty}]`;
        } else {
            viewArmor.innerHTML = `Armor: none!`;
        }

        listView.append(viewHunger, viewEnergy);
        listViewTwo.append(viewGenXP, viewCraftXP, viewTradeXP, viewAdventureXP);
        listBoxTwo.append(viewWeapon, viewArmor);
        listBox.append(listView, listViewTwo);
        inspectorStatus.append(coinBox);
        inspectorStatus.append(listBox, listBoxTwo);
    }

    if (event.target.id.includes('armor') || event.target.id.includes('weapon')) {
        destinationCtx.drawImage(document.getElementById(`${event.target.id}`), 0, 0, inspector.width, inspector.height);

        let itemInspected = [];

        if (event.target.id.includes('armor')) {
            itemInspected = playerStatus.armorRack[event.target.id.match(/\d+/)];
        };
        if (event.target.id.includes('weapon')) {
            itemInspected = playerStatus.weaponRack[event.target.id.match(/\d+/)];
        };

        inspectorStatus.innerHTML = `${itemInspected.name}`;

        let listBox = document.createElement("div");
        listBox.classList.add("inner-block");
        listBox.style.justifyContent = "space-around";
        let listView = document.createElement("ul");
        listView.classList.add("stat-list");

        let viewType = document.createElement("ol");
        viewType.classList.add("coin-totals");
        viewType.id = "view-type";
        viewType.innerHTML = `Type: ${itemInspected.type}`;
        let viewDur = document.createElement("ol");
        viewDur.classList.add("coin-totals");
        viewDur.id = "view-durability";
        viewDur.innerHTML = `Durability: ${itemInspected.durabilty}`;

        listView.append(viewType, viewDur);
        listBox.append(listView);
        inspectorStatus.append(listBox);
    }
}

function removeDetails(event) {
    let inspector = document.getElementById("inspector-canvas");
    let destinationCtx = inspector.getContext('2d');
    destinationCtx.clearRect(0, 0, inspector.width, inspector.height);

    let inspectorStatus = document.getElementById("inspector-stats");
    inspectorStatus.innerHTML = "";

    if (playerStatus.tempId) {
        viewKoboldDetails(event);
    }
}

function displayRacks() {
    document.getElementById('armor-rack').innerHTML = "";
    for (const item of playerStatus.armorRack) {
        let armor = document.createElement("canvas");
        armor.id = `${item.type}_${playerStatus.armorRack.indexOf(item)}`
        armor.classList.add("equipment-piece");
        let ctx = armor.getContext('2d');
        let weaponImg = new Image();
        weaponImg.src = document.getElementById("equipment-sprites").src;
        weaponImg.onload = function () {

            ctx.drawImage(weaponImg, item.offsetX, item.offsetY, EQUIPMENT_PIXEL_WIDTH_HEIGHT, EQUIPMENT_PIXEL_WIDTH_HEIGHT, 0, 0, armor.width, armor.height);

            ctx.save();
        };
        //theRack.style.backgroundPosition = `-${item.offsetX}px -${item.offsetY}px`;
        armor.addEventListener('mouseenter', viewKoboldDetails);
        armor.addEventListener('mouseleave', removeDetails);
        document.getElementById('armor-rack').append(armor);
    };

    document.getElementById('weapon-rack').innerHTML = "";
    for (const item of playerStatus.weaponRack) {
        let weapon = document.createElement("canvas");
        weapon.id = `${item.type}_${playerStatus.weaponRack.indexOf(item)}`
        weapon.classList.add("equipment-piece");
        let ctx = weapon.getContext('2d');
        let weaponImg = new Image();
        weaponImg.src = document.getElementById("equipment-sprites").src;
        weaponImg.onload = function () {

            ctx.drawImage(weaponImg, item.offsetX, item.offsetY, EQUIPMENT_PIXEL_WIDTH_HEIGHT, EQUIPMENT_PIXEL_WIDTH_HEIGHT, 0, 0, weapon.width, weapon.height);

            ctx.save();
        };
        //theRack.style.backgroundPosition = `-${item.offsetX}px -${item.offsetY}px`;
        weapon.addEventListener('mouseenter', viewKoboldDetails);
        weapon.addEventListener('mouseleave', removeDetails);
        document.getElementById('weapon-rack').append(weapon);
    };
}

function checkClick(event) {
    //Find out what we clicked.  If its a kobold, we get the id.  If its an area, we move them.
    //if we click somewhere a kobold can't move and they are selected, deselect them.

    switch (event.target.id) {
        case 'coin-create-button':
        case 'coin-button-icon':
            coinClick();
            break;
        case 'player-dragon':
            dragonSnooze();
            break;
        case 'outside-block':
        case 'kobold-rest-block':
        case 'kobold-coin-block':
        case 'kobold-smith-block':
        case 'kobold-cook-block':
        case 'kobold-equip-area':
        case 'kobold-camp-block':
            if (playerStatus.tempId) {
                let temp = getIDFromDiv(playerStatus.tempId)
                moveKobold(playerStatus.tempId, event.target.id);
                playerStatus.koboldList[temp].setWorkLocation(event.target.id);
                playerStatus.koboldList[temp].isTrading = false;
                playerStatus.koboldList[temp].isStillTrading = false;
                playerStatus.tempId = null;
                removeDetails();
            }
            console.log(`Clicked ${event.target.id}!`);
            break;
        default:
            console.log(`Clicked ${event.target.id}~`);
            if (playerStatus.tempId) { playerStatus.tempId = null; }
    }
}

function dragonSnooze() {
    //create a random span of zzz that drifts off in one direction and fades away
}

function moveKobold(idRef, newArea) {
    //store our kobold in a temp variable
    let tempID = getIDFromDiv(idRef);
    if (newArea !== playerStatus.koboldList[tempID].nextLocation) {//Is this where the Kobold already is?
        playerStatus.koboldList[tempID].nextLocation = newArea;
        playerStatus.koboldList[tempID].isMoving = true;
        document.getElementById(idRef).className = "kobold-unit-move-out";
    }
}

//get the ID number from a kobold div
function getIDFromDiv(ref) {
    return Number(ref.match(/\d+/)) - 1;
}


//Makes the kobobld visible/invisible when their transition finishes
function checkKoboldVis(event) {

    let tempKobold = document.getElementById(event.target.id);
    let tempID = getIDFromDiv(event.target.id);
    if (playerStatus.koboldList[tempID].isMoving == true) {
        if (playerStatus.koboldList[tempID].nextLocation) {//is there a new location to go to?
            document.getElementById(event.target.id).remove();
            document.getElementById(playerStatus.koboldList[tempID].nextLocation).append(tempKobold);
            document.getElementById(event.target.id).className = "kobold-unit-move-in";
            playerStatus.koboldList[tempID].presentLocation = playerStatus.koboldList[tempID].nextLocation;
            playerStatus.koboldList[tempID].nextLocation = "";
        } else {
            document.getElementById(event.target.id).className = "kobold-unit";
            playerStatus.koboldList[tempID].isMoving = false;
        }
    }
}

function displayCoinValues() {
    let koboldCost = BASE_KOBOLD_COST + Math.floor(Math.pow(1.8, playerStatus.koboldList.length));
    let koboldPurseCost = { ...playerStatus.getCoinPurse() };
    let coinTotalCost = Object.keys(playerStatus.getCoinPurse());
    let coinCostReverse = [];
    for (const coinType of coinTotalCost) {
        //reverse the list
        coinCostReverse.unshift(coinType);
    }

    let exponent = 9;

    for (const coinType of coinCostReverse) {
        koboldPurseCost[coinType] = (Math.floor(koboldCost / (BASE_CONVERSION_FACTOR ** exponent)));
        koboldCost = Math.floor(koboldCost % BASE_CONVERSION_FACTOR ** exponent);
        exponent--;
    }

    let costMessage = "";
    for (const element of coinTotalCost) {
        if (koboldPurseCost[element] > 0) {
            costMessage = `${costMessage}  <i class="fas color-${element} fa-coins"></i>: ${koboldPurseCost[element]}`;
        }
    };
    document.getElementById('kobold-cost').innerHTML = "<br> Cost: " + costMessage;

    let playerPurse = playerStatus.getCoinPurse();
    document.getElementById('coin-count-wood').innerHTML = `<i class="fas color-woodNickel fa-coins"></i>: ${playerPurse.woodNickel}`;
    document.getElementById('coin-count-copper').innerHTML = `<i class="fas color-copperCoin fa-coins"></i>: ${playerPurse.copperCoin}`;
    document.getElementById('coin-count-brass').innerHTML = `<i class="fas color-brassCoin fa-coins"></i>: ${playerPurse.brassCoin}`;
    document.getElementById('coin-count-bronze').innerHTML = `<i class="fas color-bronzeCoin fa-coins"></i>: ${playerPurse.bronzeCoin}`;
    document.getElementById('coin-count-iron').innerHTML = `<i class="fas color-ironCoin fa-coins"></i>: ${playerPurse.ironCoin}`;
    document.getElementById('coin-count-steel').innerHTML = `<i class="fas color-steelCoin fa-coins"></i>: ${playerPurse.steelCoin}`;
    document.getElementById('coin-count-silver').innerHTML = `<i class="fas color-silverCoin fa-coins"></i>: ${playerPurse.silverCoin}`;
    document.getElementById('coin-count-electrum').innerHTML = `<i class="fas color-electrumCoin fa-coins"></i>: ${playerPurse.electrumCoin}`;
    document.getElementById('coin-count-gold').innerHTML = `<i class="fas color-goldCoin fa-coins"></i>: ${playerPurse.goldCoin}`;
    document.getElementById('coin-count-platinum').innerHTML = `<i class="fas color-platinumCoin fa-coins"></i>: ${playerPurse.platinumCoin}`;


    for (const element of Object.keys(playerStatus.gemPurse)) {
        document.getElementById(`gem-count-${element}`).innerHTML = `<i class="fas color-${element} fa-gem"></i>: ${playerStatus.gemPurse[element]}`;
    }
}


function returnRandomGem() {
    let gemList = Object.keys(playerStatus.gemPurse);
    let gemsNotZero = [];
    for (const gemType of gemList) {
        if (playerStatus.gemPurse[gemType] > 0) {
            gemsNotZero.push(gemType);
        }
    }
    let selectedGem = Math.floor(Math.random() * gemsNotZero.length);

    return gemList[selectedGem];
}

window.setInterval(function () {
    
    for (const kobold of playerStatus.koboldList) {
        kobold.koboldTick();

        /*
        if (kobold.isMoving == 0) {

            let koboldGenXPTotal = 0;

            if (kobold.presentLocation === 'kobold-coin-block') {
                

            if (kobold.presentLocation === 'outside-block') {
                
            }

            if (kobold.presentLocation == 'kobold-hoard-block') {


            }


            if (kobold.presentLocation == 'kobold-cook-block') {
               
            }


            if (kobold.presentLocation == 'kobold-smith-block') {
                
            }

            //Check for equipment, and get equipment!  If the kobold is fully equipped, go to the adventure zone!  Otherwise, go back to rest.
            if (kobold.presentLocation == 'kobold-equip-area') {
               
            }


            //let checkKoboldAdv = document.getElementById('kobold-adventure-block-kobolds').querySelectorAll('.kobold-unit');

            //Time for adventure -- Check for monsters and fight them, running away if
            //any piece of equipment breaks on us.  If we defeat a monster, we get loot.
            if (kobold.presentLocation == 'kobold-adventure-block-kobolds') {
                
            }

            if (kobold.presentLocation == 'kobold-rest-block') {
                
            }

            //Check Energy and Hunger -- Energy takes priority over Hunger
            if (kobold.currentHunger <= 0) {
                if (kobold.currentEnergy <= 0) {
                    console.log(`${kobold.id} is tired!`);
                    moveKobold(`kobold_${kobold.id}`, 'kobold-rest-block', `kobold_${kobold.id}`);
                }
                console.log(`${kobold.id} is hungry!`);
                if (kobold.presentLocation !== 'kobold-cook-block') {
                    moveKobold(`kobold_${kobold.id}`, 'kobold-cook-block', `kobold_${kobold.id}`);
                }
            }
            if (kobold.currentEnergy <= 0) {
                console.log(`${kobold.id} is tired!`);
                moveKobold(`kobold_${kobold.id}`, 'kobold-rest-block', `kobold_${kobold.id}`);
            }

            kobold.currentEnergy -= 1;
            kobold.currentHunger -= 1;
            kobold.giveXP('general', 1 + koboldGenXPTotal);

            
        } else {
     
        }
        */
    }

    //Does the player have enough coins to wake the dragon?
    if (playerStatus.coinPurse.platinumCoin >= 1) {
        document.getElementById("coin-create-button").innerHTML = "Wake the dragon!";
    }

    for (const monster of playerStatus.monsterList) {
        //Update monster HP here -- there's no where else to update it right now!
        document.getElementById(`monster_${monster.id}`).children[2].children[0].style.width = Math.floor((monster.currentHP / monster.maxHP) * 100) + "%";
    }


    //update all displays as well
    playerStatus.updateCoinValue();

    displayCoinValues();
    document.getElementById('kobold-cook-food-count').innerHTML = `${playerStatus.koboldFood} <i class="fas fa-leaf"></i>`

    playerStatus.timeSpent++;
}, 1);