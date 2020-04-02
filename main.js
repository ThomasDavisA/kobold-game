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

//Create Kobold Factory
function createKobold(id) {
    return {
        name: "test",
        koboldID: id, //This is also a reference to the div element
        koboldHeadID: 0,
        headRGB: [0, 0, 0],
        koboldEyesID: 0,
        eyesRGB: [255, 255, 255],
        koboldEarID: 0,
        earRGB: [0, 0, 0],
        koboldMouthID: 0,
        mouthRGB: [255, 255, 255],
        koboldBodyID: 0,
        bodyRGB: [0, 0, 0],
        koboldArmID: 0,
        armRGB: [0, 0, 0],
        koboldLegID: 0,
        legRGB: [0, 0, 0],
        koboldTailID: 0,
        tailRGB: [0, 0, 0],
        isCustom: false,
        isMoving: false,
        isTrading: false,
        isStillTrading: false,
        presentLocation: "kobold-rest-block",
        nextLocation: "",
        workLocation: "",
        currentEnergy: 500,
        maxEnergy: 500,
        currentHunger: 100,
        maxHunger: 100,
        totalCoin: {   //Object of Coins
            woodNickel: 0,
            copperCoin: 0,
            brassCoin: 0,
            bronzeCoin: 0,
            ironCoin: 0,
            steelCoin: 0,
            silverCoin: 0,
            electrumCoin: 0,
            goldCoin: 0,
            platinumCoin: 0
        },
        coinCapacity: 20,

        //Skill of the kobold
        skills: {
            //General: Cooking, Resting, Hauling
            generalSkills: {
                level: 1,
                exp: 0,
                nextLevel: BASE_GENERAL_EXP_LEVEL,
                bonus: 0,
                perkChance: 5,
                special: ""
            },
            //Trading: Outside skills
            tradingSkills: {
                level: 1,
                exp: 0,
                nextLevel: BASE_SUB_EXP_LEVEL,
                bonus: 0,
                perkChance: 5,
                special: ""
            },
            //Crafting: Coins, smithing
            craftingSkills: {
                level: 90,
                exp: 0,
                nextLevel: BASE_SUB_EXP_LEVEL,
                special: "",
                coinBonus: 0,
                smithBonus: 0,
                bonus: 120,
                perkChance: 5,
                smithing: {
                    currentProgress: 0,
                    maxProgress: 50,
                    weaponsMade: 0,
                    armorMade: 0,
                    itemsMade: 0
                }
            },
            //Adventure: Adventure and spelunking
            adventureSkills: {
                level: 1,
                exp: 0,
                damage: 0,
                durabiltyProcChance: 0,
                dodgeChance: 0,
                nextLevel: BASE_SUB_EXP_LEVEL,
                perkChance: 5,
                special: ""
            },
        },
        equipArmor: {},
        equipWeapon: {},

        koboldYip: function (type, num, id) {
            //pre-check - is the id a number?  if it is, lets convert it to access the DOM
            if (typeof id == 'number') { id = `kobold_${id}`; }

            //Check for the type of yip, then take the number and show it
            let koboldDivYip = document.createElement("div");
            let koboldBox = document.getElementById(id).getBoundingClientRect();
            let koboldElement = document.getElementById(id).parentNode;
            koboldDivYip.addEventListener("animationend", removeYip);
            koboldDivYip.style.top = koboldBox.top + "px";
            koboldDivYip.style.left = koboldBox.left - 20 + "px";
            koboldDivYip.style.width = koboldBox.width + 40 + "px";
            koboldDivYip.className = "kobold-yip";
            koboldDivYip.id = "kobold-yip-temp";
            if (type == "coin") {
                if (typeof (num) === 'number') {
                    koboldDivYip.innerHTML = `+${num} <i class="fas color-woodNickel fa-coins"></i>  !`;
                } else {
                    let coin = 0;
                    let tempCoinPurse = Object.keys(num)
                    for (const coinType of tempCoinPurse) {
                        if (num[coinType] > 0) {
                            koboldDivYip.innerHTML = `${koboldDivYip.innerHTML} <i class="fas color-${coinType} fa-coins"></i> ${num[coinType]}`;
                            coin++;
                        }
                    }
                    if (coin === 0) {
                        koboldDivYip.innerHTML = `None!`;
                    }

                    koboldDivYip.innerHTML = `+${koboldDivYip.innerHTML}!`;
                }
                koboldDivYip.style.color = "rgba(154, 205, 50, 1)";
            };

            if (type === 'take') {
                if (typeof (num) === 'number') {
                    koboldDivYip.innerHTML = `+${num} <i class="fas color-woodNickel fa-coins"></i>  !`;
                } else {
                    let coin = 0;
                    let tempCoinPurse = Object.keys(num)
                    for (const coinType of tempCoinPurse) {
                        if (num[coinType] > 0) {
                            koboldDivYip.innerHTML = `${koboldDivYip.innerHTML} <i class="fas color-${coinType} fa-coins"></i> ${num[coinType]}`;
                            coin++;
                        }
                    }
                    if (coin === 0) {
                        koboldDivYip.innerHTML = `None!`;
                    }

                    koboldDivYip.innerHTML = `-${koboldDivYip.innerHTML}!`;
                }
                koboldDivYip.style.color = "rgba(178, 34, 34, 1)";
            }

            if (type == 'gem_crush') {
                koboldDivYip.innerHTML = `Crushed ${num}!`;
                koboldDivYip.style.color = "rgba(154, 205, 50, 1)";
            }

            if (type == 'gem_equip') {
                koboldDivYip.innerHTML = `Gemmed <i class="fas color-${num} fa-gem"></i>!`;
                koboldDivYip.style.color = "rgba(154, 205, 50, 1)";
            }

            if (type == "craft") {
                koboldDivYip.innerHTML = `+${num} <i class="fas fa-hammer"></i>`;
                koboldDivYip.style.color = "rgba(154, 205, 50, 1)";
            }

            if (type == "overCap") {
                koboldDivYip.innerHTML = `Full!`;
                koboldDivYip.style.color = "rgba(178, 34, 34, 1)";
            };
            if (type == "levelup") {
                let levelType = ""; //find what kind of level is it 0- general 1- trading 2- crafting 3- adventuring
                switch (num) {
                    case 0:
                        levelType = `<i class="fas fa-award"></i>`;
                        break;
                    case 1:
                        levelType = `<i class="fas fa-exchange-alt"></i>`;
                        break;
                    case 2:
                        levelType = `<i class="fas fa-hammer"></i>`;
                        break;
                    case 3:
                        levelType = `<i class="fas fa-flag"></i>`;
                        break;
                    default:
                        levelType = "blank";
                }
                koboldDivYip.innerHTML = `${levelType} Level up!`;
                koboldDivYip.style.fontSize = "20px";
                koboldDivYip.style.color = "rgba(154, 205, 50, 1)";
            };

            if (type == "food") {

                if (num < 0) {
                    koboldDivYip.innerHTML = `${num} <i class="fas fa-leaf"></i>`;
                    koboldDivYip.style.color = "rgba(178, 34, 34, 1)";
                } else {
                    koboldDivYip.innerHTML = `+${num} <i class="fas fa-leaf"></i>`;
                    koboldDivYip.style.color = "rgba(154, 205, 50, 1)";
                }
            }

            if (type == 'energy') {
                koboldDivYip.innerHTML = `+${num} <i class="fas fa-battery-full"></i>`;
                koboldDivYip.style.color = "rgba(154, 205, 50, 1)";
            }
            if (type == 'gem') {
                koboldDivYip.innerHTML = `+${num} <i class="fas fa-gem"></i>`;
                koboldDivYip.style.color = "rgba(154, 205, 50, 1)";
            }

            if (type == 'item') {
                switch (num) {
                    case 0:
                        koboldDivYip.innerHTML = `Weapon Crafted!`;
                        break;
                    case 1:
                    case 2:
                        koboldDivYip.innerHTML = `Armor Crafted!`;
                        break;

                    //koboldDivYip.innerHTML = `Item Crafted!`;
                    //break;
                }
                koboldDivYip.style.color = "rgba(55, 55, 55, 1)";
            }

            if (type === 'damage') {
                koboldDivYip.innerHTML = `-${num}!`;
                koboldDivYip.style.color = "rgba(178, 34, 34, 1)";
            }

            if (type == 'break') {
                //right now, we pass num as a string, but lets fix this later
                koboldDivYip.innerHTML = `+${num} broke!`;
                koboldDivYip.style.color = "rgba(178, 34, 34, 1)";
            }

            if (type == 'error') {
                //num is a string, again, oops
                koboldDivYip.style.color = "rgba(178, 34, 34, 1)";
                if (num === 'not_enough_cap') {
                    koboldDivYip.innerHTML = `Can't carry enough coins!`;
                }
                if (num === 'too_many_weapons') {
                    koboldDivYip.innerHTML = `Too many weapons!`;
                }
                if (num === 'too_many_armors') {
                    koboldDivYip.innerHTML = `Too many armors!`;
                }
                if (num === 'no_equip') {
                    koboldDivYip.innerHTML = `Not enough equipment!`;
                }
                if (num === 'no_coin') {
                    koboldDivYip.innerHTML = `Not enough coins!`;
                }

            }

            koboldElement.append(koboldDivYip);
        },

        setWorkLocation: function (work) {
            this.workLocation = work;
        },

        reduceDur: function (type) {
            switch (type) {
                case 'weapon':
                    this.equipWeapon.durabilty--;
                    break;
                case 'armor':
                    this.equipArmor.durabilty--;
                    break;
            }
        },

        emptyPurse: function () {
            let coinKeys = Object.keys(this.totalCoin);
            for (const coinTypes of coinKeys) {
                this.totalCoin[coinTypes] = 0;
            }
        },

        checkEquipment: function () {
            //check if anything broke -- true means to run!
            let retreatFlag = false;
            if (this.equipArmor.durabilty <= 0) {
                this.koboldYip('break', this.equipArmor.name, this.id);
                this.equipArmor = {};
                retreatFlag = true;
            }
            if (this.equipWeapon.durabilty <= 0) {
                this.koboldYip('break', this.equipWeapon.name, this.id);
                this.equipWeapon = {};
                retreatFlag = true;
            }

            return retreatFlag;
        },

        giveXP: function (typeOfSkill, num) {
            switch (String(typeOfSkill)) {
                case 'general':
                    this.skills.generalSkills.exp += num;
                    break;
                case 'trading':
                    this.skills.tradingSkills.exp += num;
                    break;
                case 'crafting':
                    this.skills.craftingSkills.exp += num;
                    break;
                case 'adventuring':
                    this.skills.adventureSkills.exp += num;
                    break;
            }
            this.levelUpCheck();
        },

        //Checks for any level ups. We give new skills, stats, and other things here.
        levelUpCheck: function () {
            for (const category in this.skills) {

                if (this.skills[category].exp >= this.skills[category].nextLevel) {
                    this.coinCapacity += 1;
                    this.skills[category].level += 1;
                    this.skills[category].exp = this.skills[category].exp - this.skills[category].nextLevel; //retain overflow xp
                    if (Math.floor(Math.random() * 100) <= this.skills[category].perkChance && this.skills[category].special === "") { //roll for perk
                        this.skills[category].special = Math.floor(Math.random * `${category}PerkList`.length);
                        switch (this.skills[category].special) {
                            //long list of perks, wee -- add more here when the time comes
                            case 'active':
                                this.maxEnergy += 20;
                                break;
                            case 'fat':
                                this.maxHunger += 20;
                                break;
                            case 'extra kobold':
                                this.skills.generalSkills.bonus += 10;
                                break;
                            case 'crafty':
                                this.skills.craftingSkills.bonus += 10;
                                break;
                            case 'coin-minter':
                                this.skills.craftingSkills.coinBonus += 10;
                                break;
                            case 'smither':
                                this.skills.craftingSkills.smithBonus += 10;
                                break;
                            case 'yipper':
                                this.skills.tradingSkills.bonus += 10;
                                break;
                            case 'sneaky':
                                this.skills.adventureSkills.durabiltyProcChance += 5;
                                break;
                            case 'strong':
                                this.skills.adventureSkills.damage += 1;
                                break;
                            case 'dodge':
                                this.skills.adventureSkills.dodgeChance += 10;
                                break;

                        }
                    } else {
                        this.skills[category].perkChance += 1;
                    }
                    if (category !== 'generalSkills') { //Is this general level or not?
                        this.maxEnergy += 2;
                        this.maxHunger += 2;
                        this.skills[category].nextLevel = Math.floor(BASE_SUB_MULTIPLIER * (this.skills[category].level ** BASE_SUB_MULTIPLIER) + BASE_SUB_EXP_LEVEL);

                    } else {
                        this.skills[category].bonus += 3;
                        this.maxEnergy += 1;
                        this.maxHunger += 1;
                        this.skills[category].nextLevel = Math.floor(BASE_GENERAL_MULTIPLIER * (this.skills[category].level ** BASE_GENERAL_MULTIPLIER) + BASE_GENERAL_EXP_LEVEL);

                    }

                    //Add chance for perk here in the future
                    //note: only one perk per category of skill!  Do not allow perk if perk already exists.
                    let keys = Object.keys(this.skills);
                    this.koboldYip("levelup", Object.keys(this.skills).indexOf(category), this.id);
                }
            }
        }
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
    koboldEnergyBar.classList.add("energy-bar");
    koboldHungerBar.classList.add("hunger-bar");
    koboldEnergyBarContainer.appendChild(koboldEnergyBar);
    koboldHungerBarContainer.appendChild(koboldHungerBar);
    koboldDiv.id = `kobold_${pos}`;
    koboldDiv.append(koboldCanvas);
    koboldDiv.append(koboldDivName);
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
    //update each second for every kobold on the map
    let koboldMoving = 0;
    let koboldNotMoving = 0;
    for (const kobold of playerStatus.koboldList) {
        if (kobold.isMoving == 0) {

            let koboldGenXPTotal = 0;

            if (kobold.presentLocation === 'kobold-coin-block') {
                let woodNickel = 'woodNickel';
                let qualityLevel = 0;
                let coinList = Object.keys(playerStatus.coinPurse);
                let gemsHeld = Object.values(playerStatus.gemPurse).reduce((acc, val) => acc + val);

                //Check for a gem chance first, so we can crush a gem for a chance of higher quality coins, up to 8 times
                let gemCrushChance = Math.floor((Math.random() * 100) + ((kobold.skills.craftingSkills.level + kobold.skills.craftingSkills.bonus) / 2));
                if (gemsHeld > 0 && gemCrushChance > 90) {
                    let gemCrushMessage = '';
                    let gemLoop = true;
                    while (gemLoop) {
                        let gemToCrush = returnRandomGem();
                        playerStatus.gemPurse[gemToCrush] -= 1;
                        gemCrushMessage = `${gemCrushMessage} <i class="fas color-${gemToCrush} fa-gem"></i>`;
                        qualityLevel++;
                        gemCrushChance = Math.floor((Math.random() * 100) + ((kobold.skills.craftingSkills.bonus) / 3));
                        if ((gemsHeld > 0 && gemCrushChance > 90) || qualityLevel >= 8) {
                            gemLoop = true;
                        } else {
                            gemLoop = false;
                        }
                    }
                    kobold.koboldYip("gem_crush", gemCrushMessage, `kobold_${kobold.id}`);
                }
                //kobold should make coin based on level and get exp
                let coinQuality = coinList[qualityLevel];
                let koboldCoinCreate = Math.floor((kobold.skills.craftingSkills.level + kobold.skills.generalSkills.level + kobold.skills.craftingSkills.bonus) / 2);

                if ((kobold.totalCoin[coinQuality] + koboldCoinCreate) >= kobold.coinCapacity) {
                    kobold.koboldYip("overCap", null, `kobold_${kobold.id}`);
                    kobold.totalCoin[coinQuality] = kobold.coinCapacity;
                    moveKobold(`kobold_${kobold.id}`, 'kobold-hoard-block');
                } else {
                    kobold.koboldYip("coin", koboldCoinCreate, `kobold_${kobold.id}`);
                    kobold.totalCoin[coinQuality] += koboldCoinCreate;
                }

                console.log(`${kobold.name} has ${kobold.totalCoin} coin`);
                kobold.giveXP('crafting', Math.floor(koboldCoinCreate + (koboldCoinCreate * qualityLevel) / BASE_CONVERSION_FACTOR) + 1);
            }

            if (kobold.presentLocation === 'outside-block') {
                //kobold to trade coins out for higher value ones at a cost
                //currently 100% efficient, but will include cost variable later
                const TRADE_FACTOR = 1.2;
                let coinsHeld = Object.values(kobold.totalCoin).reduce((acc, val) => acc + val);
                //Lets make sure they even have coins, and if they don't, run back to the hoard to get some!
                if (kobold.isTrading === false && coinsHeld < (10 * TRADE_FACTOR)) {
                    if (kobold.coinCapacity < 10 * TRADE_FACTOR) {
                        kobold.koboldYip('error', 'not_enough_cap', kobold.id)
                        kobold.workLocation = 'kobold-rest-block';
                        moveKobold(`kobold_${kobold.id}`, 'kobold-rest-block');
                    } else {
                        kobold.isTrading = true;
                        kobold.isStillTrading = true;
                        kobold.workLocation = `outside-block`;
                        kobold.koboldYip('error', 'no_coin', kobold.id)
                        moveKobold(`kobold_${kobold.id}`, 'kobold-hoard-block');
                    }

                }

                if (kobold.isTrading === true || coinsHeld >= (10 * TRADE_FACTOR)) {
                    let tradedOnce = false;
                    let tradeExponent = 0;
                    let koboldCoinKeys = Object.keys(kobold.totalCoin);
                    let totalTrades = 0;
                    for (const coinTypes of koboldCoinKeys) {
                        if (kobold.totalCoin[coinTypes] >= 10 * TRADE_FACTOR) {
                            let coinTypeFind = Object.keys(kobold.totalCoin).indexOf(coinTypes) + 1;
                            let coinTypeUp = Object.keys(kobold.totalCoin)[coinTypeFind];
                            kobold.koboldYip('take', kobold.totalCoin, `kobold_${kobold.id}`);
                            if (coinTypeFind <= 10) {
                                //So long as the coin type is not plat, we don't convert plat
                                while (kobold.totalCoin[coinTypes] >= (10 * TRADE_FACTOR)) {
                                    kobold.totalCoin[coinTypes] -= (10 * TRADE_FACTOR);
                                    kobold.totalCoin[coinTypeUp] += 1;
                                    totalTrades++;
                                }
                                tradedOnce = true;
                                tradeExponent = Object.keys(kobold.totalCoin).indexOf(coinTypes);
                            }

                            kobold.koboldYip('coin', kobold.totalCoin, `kobold_${kobold.id}`);
                        }
                    };

                    if (tradedOnce) {
                        //create trade exp
                        kobold.isTrading = false;
                        kobold.giveXP('trading', Math.floor(kobold.skills.tradingSkills.bonus + totalTrades * BASE_SUB_MULTIPLIER));
                        moveKobold(`kobold_${kobold.id}`, 'kobold-hoard-block');
                    }
                }
            }

            if (kobold.presentLocation == 'kobold-hoard-block') {
                //drop off your coins and go back to where you came!
                if (kobold.isTrading === false) {
                    playerStatus.addCoins(kobold.totalCoin);
                    kobold.koboldYip('coin', kobold.totalCoin, 'coin-gem-block');
                    kobold.koboldYip('take', kobold.totalCoin, `kobold_${kobold.id}`);
                    kobold.emptyPurse();
                    kobold.giveXP('general', kobold.coinCapacity);
                    if (kobold.isStillTrading === true) {
                        kobold.isTrading = true;
                        continue;
                    } else {
                        moveKobold(`kobold_${kobold.id}`, kobold.workLocation);
                    }
                } else {
                    //gather coins for trading
                    let coinPurse = playerStatus.getCoinPurse();
                    let coinKeys = Object.keys(coinPurse).reverse();
                    let hasCoinFlag = false;
                    //start from most expensive coin and work your way down
                    for (const coinTypes of coinKeys) {
                        if (coinPurse[coinTypes] >= 20 && kobold.coinCapacity >= 20 && hasCoinFlag === false && coinTypes !== 'totalValue') {
                            if (kobold.coinCapacity > coinPurse[coinTypes]) {
                                kobold.totalCoin[coinTypes] += coinPurse[coinTypes];
                                coinPurse[coinTypes] = 0;
                            } else {
                                kobold.totalCoin[coinTypes] = kobold.coinCapacity;
                                coinPurse[coinTypes] -= kobold.coinCapacity;
                            }
                            kobold.koboldYip('take', kobold.totalCoin, 'coin-gem-block');
                            kobold.koboldYip('coin', kobold.totalCoin, `kobold_${kobold.id}`);
                            moveKobold(`kobold_${kobold.id}`, kobold.workLocation);
                            hasCoinFlag = true;
                        }
                    }

                    if (!hasCoinFlag) {
                        //we failed to gather coins, so lets stop trading and go back to rest.
                        kobold.isStillTrading = false;
                        kobold.isTrading = false;
                        kobold.workLocation = `kobold-rest-block`;
                        kobold.koboldYip('error', 'no_coins', `kobold_${kobold.id}`);
                        moveKobold(`kobold_${kobold.id}`, `kobold-rest-block`);
                    }

                }

            }


            if (kobold.presentLocation == 'kobold-cook-block') {
                //cook food here!  Let's make sure they are here for work.
                let foodMade = 0;
                if (kobold.workLocation == 'kobold-cook-block') {
                    foodMade += 5 + kobold.skills.generalSkills.bonus + Math.floor(kobold.skills.generalSkills.level * BASE_GENERAL_MULTIPLIER);
                    playerStatus.koboldFood += foodMade;
                    koboldGenXPTotal += 5;
                }

                //Lets eat!
                let foodChange = Math.floor((kobold.skills.generalSkills.level * BASE_LEVEL_POWER_MULTIPLIER) + 2);
                if (playerStatus.koboldFood < foodChange) { //Oh no, not enough food!  Make a little food.
                    foodMade += (kobold.skills.generalSkills.level + kobold.skills.generalSkills.bonus); //lower bonus since not working here
                    playerStatus.koboldFood += foodMade;
                    kobold.koboldYip('food', foodMade, `kobold-cook-food-count`);
                } else {
                    if (Math.floor(kobold.skills.generalSkills.level * BASE_LEVEL_POWER_MULTIPLIER) + kobold.currentHunger >= kobold.maxHunger) {
                        playerStatus.koboldFood -= (kobold.maxHunger - kobold.currentHunger);
                        kobold.koboldYip('food', (kobold.maxHunger - kobold.currentHunger), `kobold_${kobold.id}`);
                        kobold.koboldYip('food', ((kobold.maxHunger - kobold.currentHunger) * -1), `kobold-cook-block`);
                        kobold.koboldYip('food', foodMade, `kobold-cook-food-count`);
                        kobold.currentHunger = kobold.maxHunger;
                        if (kobold.workLocation !== 'kobold-cook-block') {
                            moveKobold(`kobold_${kobold.id}`, kobold.workLocation);
                        }
                    } else {
                        kobold.currentHunger += foodChange;
                        kobold.koboldYip('food', foodChange, `kobold_${kobold.id}`);
                        playerStatus.koboldFood -= foodChange;
                        kobold.koboldYip('food-eat', (foodChange * -1), `kobold-cook-block`);
                        kobold.koboldYip('food', foodMade, `kobold-cook-food-count`);
                    }
                }
            }


            if (kobold.presentLocation == 'kobold-smith-block') {
                //Time to build a weapon/armor/item!
                let koboldBuild = Math.floor((kobold.skills.craftingSkills.level + kobold.skills.craftingSkills.bonus + kobold.skills.craftingSkills.smithBonus) * BASE_LEVEL_POWER_MULTIPLIER);
                let koboldBuildMin = kobold.skills.craftingSkills.level + kobold.skills.craftingSkills.bonus + 5;
                let koboldBuildMax = kobold.skills.craftingSkills.level + kobold.skills.generalSkills.level + kobold.skills.generalSkills.bonus + kobold.skills.craftingSkills.bonus + kobold.skills.craftingSkills.smithBonus;
                kobold.giveXP('crafting', koboldBuild);
                kobold.koboldYip('craft', koboldBuild, `kobold_${kobold.id}`);
                kobold.skills.craftingSkills.smithing.currentProgress += koboldBuild;
                let itemOffsetX = 0;
                let itemOffsetY = 0;
                let throwAwayflag = false;
                let weaponArray = [];
                let armorArray = [];
                if (kobold.skills.craftingSkills.smithing.currentProgress >= kobold.skills.craftingSkills.smithing.maxProgress) {
                    let koboldItemTypeCheck = Math.floor(Math.random() * 3);
                    let itemType = koboldItemTypeCheck;
                    let itemName = "";
                    switch (koboldItemTypeCheck) {
                        case 0:
                            if (playerStatus.weaponRack.length >= 15) {
                                throwAwayflag = true;
                            }
                            itemType = "sword";
                            weaponArray = weaponList[Math.floor(Math.random() * weaponList.length)]
                            itemOffsetX = EQUIPMENT_PIXEL_WIDTH_HEIGHT * Math.floor(Math.random() * 5);
                            switch (weaponArray.subtype) {
                                case 'sword':
                                    itemOffsetY = 0;
                                    break;
                                case 'knife':
                                    itemOffsetY = EQUIPMENT_PIXEL_WIDTH_HEIGHT * 1;
                                    break;
                                case 'polearm':
                                    itemOffsetY = EQUIPMENT_PIXEL_WIDTH_HEIGHT * 2;
                                    break;
                                case 'bow':
                                    itemOffsetY = EQUIPMENT_PIXEL_WIDTH_HEIGHT * 3;
                                    break;
                                case 'club':
                                    itemOffsetY = EQUIPMENT_PIXEL_WIDTH_HEIGHT * 4;
                                    break;
                                default:
                                    itemOffsetY = 0;
                            }
                            //itemOffsetY = 512 * Math.floor(Math.random * 5);
                            kobold.skills.craftingSkills.smithing.weaponsMade++;
                            itemName = weaponArray.name;
                            break;
                        case 1:
                        case 2:
                            if (playerStatus.armorRack.length >= 15) {
                                throwAwayflag = true;
                            }
                            itemType = 'armor';
                            armorArray = armorList[Math.floor(Math.random() * armorList.length)];
                            itemOffsetX = EQUIPMENT_PIXEL_WIDTH_HEIGHT * Math.floor(Math.random() * 5);
                            switch (armorArray.subtype) {
                                case 'armor':
                                    itemOffsetY = EQUIPMENT_PIXEL_WIDTH_HEIGHT * 5;
                                    break;
                                case 'shield':
                                    itemOffsetX = EQUIPMENT_PIXEL_WIDTH_HEIGHT * Math.floor(Math.random() * 3);
                                    itemOffsetY = EQUIPMENT_PIXEL_WIDTH_HEIGHT * 6;
                            }

                            kobold.skills.craftingSkills.smithing.armorMade++;
                            itemName = armorArray.name;
                            break;
                        default:
                    }
                    let itemDurabilty = Math.floor(Math.random() * (koboldBuildMax - koboldBuildMin + 1) + koboldBuildMin);

                    //generate a prefix and suffix if skill is high enough
                    //see if we gem it as well
                    if (Math.random() * (kobold.skills.craftingSkills.level + kobold.skills.generalSkills.level) > 10) {
                        itemName = `${prefixList[Math.floor(Math.random() * prefixList.length)]} ${itemName}`;
                        itemDurabilty += Math.floor(Math.random() * (kobold.skills.craftingSkills.level + kobold.skills.craftingSkills.bonus));
                    };
                    if (Math.random() * (kobold.skills.craftingSkills.level + kobold.skills.generalSkills.level) > 20) {
                        let suffixName = suffixList[Math.floor(Math.random() * suffixList.length)];
                        itemDurabilty += Math.floor(Math.random() * (kobold.skills.craftingSkills.level + kobold.skills.craftingSkills.bonus + kobold.skills.craftingSkills.smithBonus));
                        if (suffixName.charAt(0) == `'`) {
                            itemName = `${itemName}${suffixName}`;
                        } else {
                            itemName = `${itemName} ${suffixName}`;
                        }
                    };

                    let gemsHeld = Object.values(playerStatus.gemPurse).reduce((acc, val) => acc + val);
                    if ((Math.random() * (kobold.skills.craftingSkills.level + kobold.skills.craftingSkills.bonus) > 90) && gemsHeld > 0) {
                        let gem = returnRandomGem();
                        playerStatus.gemPurse[gem] -= 1;
                        itemName = `<i class="fas color-${gem} fa-gem"></i> ${itemName} <i class="fas color-${gem} fa-gem"></i>`;
                        itemDurabilty += (kobold.skills.generalSkills.bonus + kobold.skills.craftingSkills.bonus) * 2;
                        kobold.koboldYip('gem_equip', gem, kobold.id);
                    };

                    kobold.skills.craftingSkills.smithing.currentProgress = 0;

                    if (itemType === "sword") {
                        if (throwAwayflag) {
                            kobold.koboldYip('error', 'too_many_weapons', kobold.id)
                        } else {
                            playerStatus.weaponRack.push(createItem(weaponArray.type, weaponArray.subtype, itemDurabilty, itemName, itemOffsetX, itemOffsetY));

                            displayRacks();
                        }
                    };

                    if (itemType === "armor") {
                        if (throwAwayflag) {
                            kobold.koboldYip('error', 'too_many_armors', kobold.id)
                        } else {
                            playerStatus.armorRack.push(createItem(armorArray.type, armorArray.subtype, itemDurabilty, itemName, itemOffsetX, itemOffsetY));

                            displayRacks();
                        }
                    };

                    //playerStatus.itemList.push(createItem(itemType, itemDurabilty, itemName));

                    kobold.koboldYip('item', itemType, 'kobold-camp-block');
                }
            }

            //Check for equipment, and get equipment!  If the kobold is fully equipped, go to the adventure zone!  Otherwise, go back to rest.
            if (kobold.presentLocation == 'kobold-equip-area') {
                if (isEmpty(kobold.equipWeapon) || isEmpty(kobold.equipArmor)) {
                    let returnToCamp = false;

                    if (isEmpty(kobold.equipArmor)) {
                        let armorPickUp = playerStatus.armorRack.length - 1;
                        if (armorPickUp < 0) {
                            kobold.koboldYip('error', 'no_equip', kobold.id);
                            returnToCamp = true;
                        } else {
                            kobold.equipArmor = playerStatus.armorRack[armorPickUp];
                            playerStatus.armorRack.splice(armorPickUp, 1);
                            displayRacks();
                        }
                    }
                    if (isEmpty(kobold.equipWeapon)) {
                        let weaponPickUp = playerStatus.weaponRack.length - 1;
                        if (weaponPickUp < 0) {
                            kobold.koboldYip('error', 'no_equip', kobold.id);
                            returnToCamp = true;
                        } else {
                            kobold.equipWeapon = playerStatus.weaponRack[weaponPickUp];
                            playerStatus.weaponRack.splice(weaponPickUp, 1);
                            displayRacks();
                        }

                    }

                    if (returnToCamp) {
                        kobold.workLocation = 'kobold-rest-block';
                        moveKobold(`kobold_${kobold.id}`, 'kobold-rest-block');
                    }
                } else { //We're equipped, lets go to the adventure!
                    moveKobold(`kobold_${kobold.id}`, 'kobold-adventure-block-kobolds');
                }
            }


            //let checkKoboldAdv = document.getElementById('kobold-adventure-block-kobolds').querySelectorAll('.kobold-unit');

            //Time for adventure -- Check for monsters and fight them, running away if
            //any piece of equipment breaks on us.  If we defeat a monster, we get loot.
            if (kobold.presentLocation == 'kobold-adventure-block-kobolds') {
                let checkKoboldAdv = document.getElementById('kobold-adventure-block-kobolds').querySelectorAll('.kobold-unit');
                let tankKobold = checkKoboldAdv[checkKoboldAdv.length - 1];
                let checkMonsters = document.getElementById('kobold-adventure-block-monsters').querySelectorAll('.monster-unit');
                let koboldAdvXP = 0;
                //check for a monster
                //if there is none, generate one!
                if (checkMonsters.length == 0) {
                    let newMonster = createMonster(playerStatus.monsterList.length);
                    playerStatus.monsterList.push(newMonster);
                    displayMonster(playerStatus.monsterList[0]);
                    checkMonsters = document.getElementById('kobold-adventure-block-monsters').querySelectorAll('.monster-unit');
                }

                let monsterArrayEnd = checkMonsters.length - 1;
                //attack the monster
                //We check death here before monster attacks to allow kobold to not take a hit
                playerStatus.monsterList[monsterArrayEnd].takeDamage(1 + kobold.skills.adventureSkills.damage);
                kobold.koboldYip('damage', 1 + kobold.skills.adventureSkills.damage, `monster_${playerStatus.monsterList[monsterArrayEnd].id}`);
                if (playerStatus.monsterList[monsterArrayEnd].checkDeath()) {
                    //give loot and delete the monster!
                    let gemMessage = playerStatus.giveGem();
                    document.getElementById(`monster_${monsterArrayEnd}`).remove();
                    playerStatus.monsterList.splice(checkMonsters.length - 1, 1);
                    kobold.koboldYip('gem', gemMessage, `kobold_${kobold.id}`)
                    checkMonsters = document.getElementById('kobold-adventure-block-monsters').querySelectorAll('.monster-unit');
                    koboldAdvXP += (kobold.skills.adventureSkills.level + kobold.skills.generalSkills.bonus + kobold.skills.generalSkills.level);
                }

                //subtract weapon dur
                kobold.reduceDur('weapon');

                //monster attacks! (if they are alive)
                let tankID = tankKobold.id.match(/\d+/) - 1;
                if (checkMonsters.length > 0) {
                    if (playerStatus.monsterList[monsterArrayEnd].checkMonsterAttack()) {
                        playerStatus.koboldList[tankID].reduceDur('armor');
                    }
                    koboldAdvXP += playerStatus.monsterList[monsterArrayEnd].attack;
                }

                //check for equipment break
                if (kobold.checkEquipment()) {
                    moveKobold(`kobold_${kobold.id}`, 'kobold-equip-area');
                    koboldAdvXP += (kobold.skills.adventureSkills.level + kobold.skills.generalSkills.bonus);
                }

                kobold.giveXP('adventuring', koboldAdvXP);
            }

            if (kobold.presentLocation == 'kobold-rest-block') {
                //sleepy times, sleep to recover energy, any kobold out of energy
                //will immediately be placed here
                let energyRecover = Math.floor(Math.random() * ((3 + kobold.skills.generalSkills.bonus) * BASE_LEVEL_POWER_MULTIPLIER));
                kobold.currentEnergy += energyRecover;
                //Full on energy?  back to work!
                if (kobold.currentEnergy >= kobold.maxEnergy) {
                    kobold.currentEnergy = kobold.maxEnergy;
                    if (kobold.workLocation !== 'kobold-rest-block') {
                        moveKobold(`kobold_${kobold.id}`, kobold.workLocation);
                    }
                }

                if (kobold.currentEnergy != kobold.maxEnergy) {
                    kobold.koboldYip('energy', energyRecover, `kobold_${kobold.id}`)
                }
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

            //update kobold energy and hunger
            document.getElementById(`kobold_${kobold.id}`).children[2].children[0].style.width = Math.floor((kobold.currentEnergy / kobold.maxEnergy) * 100) + "%";
            document.getElementById(`kobold_${kobold.id}`).children[3].children[0].style.width = Math.floor((kobold.currentHunger / kobold.maxHunger) * 100) + "%";
        } else {
     
        }

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
}, 1000);