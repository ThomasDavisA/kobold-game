
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