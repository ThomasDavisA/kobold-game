
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
        energyCurrentTick: 0,
        energyTickSpeed: 400,
        currentHunger: 100,
        maxHunger: 100,
        hungercurrentTick: 0,
        hungerTickSpeed: 200,
        currentTick: 0,
        koboldTickSpeed: 2000,
        tickMultiplier: 3,
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
        coinCapacity: 30,

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
                damage: 1,
                bonus: 0,
                durabiltyProcChance: 0,
                dodgeChance: 0,
                nextLevel: BASE_SUB_EXP_LEVEL,
                perkChance: 5,
                special: ""
            },
        },
        equipArmor: {},
        equipWeapon: {},

        koboldTick: function () {
            this.energyCurrentTick++;
            this.hungercurrentTick++;
            if (this.energyCurrentTick >= this.energyTickSpeed) {
                this.koboldEnergyTick();
            }
            if (this.hungercurrentTick >= this.hungerTickSpeed) {
                this.koboldHungerTick();
            }
            if (this.isMoving) {
                return;
            }
            this.currentTick += 1 * this.tickMultiplier;
            if (this.presentLocation === 'kobold-cook-block' && this.currentHunger < this.maxHunger) {
                this.currentTick += 1 * 20;
            }
            if (this.currentTick >= this.koboldTickSpeed) {

                this.currentTick = 0;
                this.giveXP('general', 1);
                this.koboldCheckLocation();
            }
            document.getElementById(`kobold_${this.id}`).children[2].children[0].style.width = Math.floor((this.currentTick / this.koboldTickSpeed) * 100) + "%";
        },

        koboldEnergyTick: function () {
            this.energyCurrentTick = 0;
            if (this.presentLocation !== 'kobold-rest-block') {
                this.currentEnergy--;
            }
            document.getElementById(`kobold_${this.id}`).children[3].children[0].style.width = Math.floor((this.currentEnergy / this.maxEnergy) * 100) + "%";
            if (this.currentEnergy <= 0) {
                moveKobold(`kobold_${this.id}`, 'kobold-rest-block', `kobold_${this.id}`);
            }
        },

        koboldHungerTick: function () {
            this.hungercurrentTick = 0;
            if (this.presentLocation !== 'kobold-cook-block') {
                this.currentHunger--;
            }
            document.getElementById(`kobold_${this.id}`).children[4].children[0].style.width = Math.floor((this.currentHunger / this.maxHunger) * 100) + "%";
            if (this.currentHunger <= 0 && this.currentEnergy >= 10 && this.presentLocation !== 'kobold-cook-block') {
                moveKobold(`kobold_${this.id}`, 'kobold-cook-block', `kobold_${this.id}`);
            }
        },

        koboldCheckLocation: function () {
            switch (this.presentLocation) {
                case 'kobold-coin-block':
                    this.koboldCraftCoins();
                    break;
                case 'outside-block':
                    this.koboldTradeCoins();
                    break;
                case 'kobold-hoard-block':
                    this.koboldHoard();
                    break;
                case 'kobold-cook-block':
                    this.koboldCookAndEat();
                    break;
                case 'kobold-rest-block':
                    this.koboldRest();
                    break;
                case 'kobold-smith-block':
                    this.koboldSmithItem();
                    break;
                case 'kobold-equip-area':
                    this.koboldCheckEquip();
                    break;
                case 'kobold-adventure-block-kobolds':
                    this.koboldAdventureTime();
                    break;
            }
        },

        koboldCraftCoins: function () {
            let qualityLevel = playerStatus.upgradeCount.coin;
            let coinList = Object.keys(playerStatus.coinPurse);
            let gemsHeld = Object.values(playerStatus.gemPurse).reduce((acc, val) => acc + val);

            //Check for a gem chance first, so we can crush a gem for a chance of higher quality coins, up to 8 times
            let gemCrushChance = Math.floor((Math.random() * 100) + ((this.skills.craftingSkills.level + this.skills.craftingSkills.bonus) / 2));
            if (gemsHeld > 0 && gemCrushChance >= 90) {
                let gemCrushMessage = '';
                let gemLoop = true;
                while (gemLoop) {
                    let gemToCrush = returnRandomGem();
                    playerStatus.gemPurse[gemToCrush] -= 1;
                    gemCrushMessage = `${gemCrushMessage} <i class="fas color-${gemToCrush} fa-gem"></i>`;
                    qualityLevel++;
                    gemCrushChance = Math.floor((Math.random() * 100) + ((this.skills.craftingSkills.bonus) / 3));
                    if ((gemsHeld > 0 && gemCrushChance >= 90) && qualityLevel <= 8) {
                        gemLoop = true;
                    } else {
                        gemLoop = false;
                    }
                }
                this.koboldYip("gem_crush", gemCrushMessage, `kobold_${this.id}`);
            }
            //kobold should make coin based on level and get exp
            let coinQuality = coinList[qualityLevel];
            let koboldCoinCreate = Math.floor((this.skills.craftingSkills.level + this.skills.generalSkills.level + this.skills.craftingSkills.bonus) / 2);

            if ((this.totalCoin[coinQuality] + koboldCoinCreate) >= this.coinCapacity) {
                this.koboldYip("overCap", null, `kobold_${this.id}`);
                this.totalCoin[coinQuality] = this.coinCapacity;
                moveKobold(`kobold_${this.id}`, 'kobold-hoard-block');
            } else {
                this.koboldYip("coin", koboldCoinCreate, `kobold_${this.id}`);
                this.totalCoin[coinQuality] += koboldCoinCreate;
            }
            this.giveXP('crafting', Math.floor(koboldCoinCreate + (koboldCoinCreate * qualityLevel) / BASE_CONVERSION_FACTOR) + 1);
        },

        koboldTradeCoins: function () {
            //kobold to trade coins out for higher value ones at a cost
            //currently 100% efficient, but will include cost variable later
            let coinsHeld = Object.values(this.totalCoin).reduce((acc, val) => acc + val);
            //Lets make sure they even have coins, and if they don't, run back to the hoard to get some!
            if (this.isTrading === false && coinsHeld < (BASE_CONVERSION_FACTOR * TRADE_FACTOR)) {
                if (this.coinCapacity < BASE_CONVERSION_FACTOR * TRADE_FACTOR) {
                    this.koboldYip('error', 'not_enough_cap', this.id)
                    this.workLocation = 'kobold-rest-block';
                    moveKobold(`kobold_${this.id}`, 'kobold-rest-block');
                } else {
                    this.isTrading = true;
                    this.isStillTrading = true;
                    this.workLocation = `outside-block`;
                    this.koboldYip('error', 'no_coin', this.id)
                    moveKobold(`kobold_${this.id}`, 'kobold-hoard-block');
                }

            }

            if (this.isTrading === true || coinsHeld >= (BASE_CONVERSION_FACTOR * TRADE_FACTOR)) {
                let tradedOnce = false;
                let tradeExponent = 0;
                let koboldCoinKeys = Object.keys(this.totalCoin);
                let totalTrades = 0;
                let tradePenalty = (Math.floor(Math.random() * 100) + 100) - ((40 * playerStatus.upgradeCount.trade) + (this.skills.tradingSkills.bonus))
                let tradeValue = 0;
                if (tradePenalty <= 0) {
                    tradeValue = Math.floor((Math.abs(tradePenalty / 100) * BASE_CONVERSION_FACTOR) - BASE_CONVERSION_FACTOR);
                } else {
                    tradeValue = Math.floor(((tradePenalty / 100) * BASE_CONVERSION_FACTOR) + BASE_CONVERSION_FACTOR);
                }
                
                for (const coinTypes of koboldCoinKeys) {
                    if (this.totalCoin[coinTypes] >= tradeValue) {
                        let coinTypeFind = Object.keys(this.totalCoin).indexOf(coinTypes) + 1;
                        let coinTypeUp = Object.keys(this.totalCoin)[coinTypeFind];
                        this.koboldYip('take', this.totalCoin, `kobold_${this.id}`);
                        if (coinTypeFind <= 10) {
                            //So long as the coin type is not plat, we don't convert plat
                            while (this.totalCoin[coinTypes] >= (tradeValue)) {
                                this.totalCoin[coinTypes] -= tradeValue;
                                this.totalCoin[coinTypeUp] += 1;
                                totalTrades++;
                            }
                            tradedOnce = true;
                            tradeExponent = Object.keys(this.totalCoin).indexOf(coinTypes);
                        }

                        this.koboldYip('coin', this.totalCoin, `kobold_${this.id}`);
                    }
                };

                if (tradedOnce) {
                    //create trade exp
                    this.isTrading = false;
                    this.giveXP('trading', Math.floor(totalTrades * BASE_SUB_MULTIPLIER));
                    moveKobold(`kobold_${this.id}`, 'kobold-hoard-block');
                }
            }
        },

        koboldHoard: function () {
            //drop off your coins and go back to where you came!
            if (this.isTrading === false) {
                playerStatus.addCoins(this.totalCoin);
                this.koboldYip('coin', this.totalCoin, 'coin-gem-block');
                this.koboldYip('take', this.totalCoin, `kobold_${this.id}`);
                this.emptyPurse();
                this.giveXP('general', this.coinCapacity);
                if (this.isStillTrading === true) {
                    this.isTrading = true;
                    return;
                } else {
                    moveKobold(`kobold_${this.id}`, this.workLocation);
                }
            } else {
                //gather coins for trading
                let coinPurse = playerStatus.getCoinPurse();
                let coinKeys = Object.keys(coinPurse).reverse();
                let hasCoinFlag = false;
                //start from most expensive coin and work your way down
                for (const coinTypes of coinKeys) {
                    if (coinPurse[coinTypes] >= COIN_TRADE_TOTAL && this.coinCapacity >= COIN_TRADE_TOTAL && hasCoinFlag === false && coinTypes !== 'totalValue') {
                        if (this.coinCapacity > coinPurse[coinTypes]) {
                            this.totalCoin[coinTypes] += coinPurse[coinTypes];
                            coinPurse[coinTypes] = 0;
                        } else {
                            this.totalCoin[coinTypes] = this.coinCapacity;
                            coinPurse[coinTypes] -= this.coinCapacity;
                        }
                        this.koboldYip('take', this.totalCoin, 'coin-gem-block');
                        this.koboldYip('coin', this.totalCoin, `kobold_${this.id}`);
                        moveKobold(`kobold_${this.id}`, this.workLocation);
                        hasCoinFlag = true;
                    }
                }

                if (!hasCoinFlag) {
                    //we failed to gather coins, so lets stop trading and go back to rest.
                    this.isStillTrading = false;
                    this.isTrading = false;
                    this.workLocation = `kobold-rest-block`;
                    this.koboldYip('error', 'no_coins', `kobold_${this.id}`);
                    moveKobold(`kobold_${this.id}`, `kobold-rest-block`);
                }

            }
        },

        koboldCookAndEat: function () {
            //cook food here!  Let's make sure they are here for work.
            let foodMade = 0;
            if (this.workLocation == 'kobold-cook-block') {
                foodMade += Math.floor(this.skills.generalSkills.bonus + (Math.random() * (this.skills.generalSkills.level * BASE_GENERAL_MULTIPLIER)) / 2) + 1;
                playerStatus.koboldFood += foodMade;
                this.giveXP('general', foodMade);
                this.koboldYip('food', foodMade, `kobold-cook-food-count`);
            }

            //Lets eat!
            let foodChange = Math.floor((this.skills.generalSkills.level * BASE_LEVEL_POWER_MULTIPLIER) + 2);
            let stomachDiff = this.maxHunger - this.currentHunger;
            if (playerStatus.koboldFood < foodChange) { //Oh no, not enough food!  Make a little food.
                foodMade += (this.skills.generalSkills.level); //lower bonus since not working here
                playerStatus.koboldFood += foodMade;
                if (foodMade > 0) {
                    this.koboldYip('food', foodMade, `kobold-cook-food-count`);
                }
            } else {
                if (foodChange > stomachDiff) {
                    if (stomachDiff > 0) {
                        playerStatus.koboldFood -= stomachDiff;
                        this.koboldYip('food', (stomachDiff), `kobold_${this.id}`);
                        this.koboldYip('food', ((stomachDiff) * -1), `kobold-cook-block`);
                        this.currentHunger = this.maxHunger;
                    }

                    if (this.workLocation === '') {
                        this.workLocation = 'kobold-cook-block';
                    }

                    if (this.workLocation !== 'kobold-cook-block') {
                        moveKobold(`kobold_${this.id}`, this.workLocation);
                    }
                } else {
                    this.currentHunger += foodChange;
                    this.koboldYip('food', foodChange, `kobold_${this.id}`);
                    playerStatus.koboldFood -= foodChange;
                    this.koboldYip('food-eat', (foodChange * -1), `kobold-cook-block`);
                }
                document.getElementById(`kobold_${this.id}`).children[4].children[0].style.width = Math.floor((this.currentHunger / this.maxHunger) * 100) + "%";
            }
        },

        koboldRest: function () {
            //sleepy times, sleep to recover energy, any kobold out of energy
            //will immediately be placed here
            let energyRecover = Math.floor(Math.random() * ((3 + this.skills.generalSkills.bonus) * BASE_LEVEL_POWER_MULTIPLIER));
            this.currentEnergy += energyRecover;
            //Full on energy?  back to work!
            if (this.currentEnergy >= this.maxEnergy) {
                this.currentEnergy = this.maxEnergy;
                if (this.workLocation !== 'kobold-rest-block') {
                    moveKobold(`kobold_${this.id}`, this.workLocation);
                }
            }

            if (this.currentEnergy !== this.maxEnergy) {
                this.koboldYip('energy', energyRecover, `kobold_${this.id}`)
            }
            document.getElementById(`kobold_${this.id}`).children[3].children[0].style.width = Math.floor((this.currentEnergy / this.maxEnergy) * 100) + "%";
        },

        koboldSmithItem: function () {
            //Time to build a weapon/armor/item!
            let koboldBuild = Math.floor((Math.random() * (this.skills.craftingSkills.level + this.skills.craftingSkills.bonus) + this.skills.craftingSkills.smithBonus) * BASE_LEVEL_POWER_MULTIPLIER);
            let koboldBuildMin = this.skills.craftingSkills.level + this.skills.craftingSkills.bonus + 5;
            let koboldBuildMax = this.skills.craftingSkills.level + this.skills.generalSkills.level + this.skills.generalSkills.bonus + this.skills.craftingSkills.bonus + this.skills.craftingSkills.smithBonus;
            this.giveXP('crafting', koboldBuild);
            this.koboldYip('craft', koboldBuild, `kobold_${this.id}`);
            this.skills.craftingSkills.smithing.currentProgress += koboldBuild;
            let itemOffsetX = 0;
            let itemOffsetY = 0;
            let throwAwayflag = false;
            let weaponArray = [];
            let armorArray = [];
            if (this.skills.craftingSkills.smithing.currentProgress >= this.skills.craftingSkills.smithing.maxProgress) {
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
                        this.skills.craftingSkills.smithing.weaponsMade++;
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

                        this.skills.craftingSkills.smithing.armorMade++;
                        itemName = armorArray.name;
                        break;
                    default:
                }
                let itemDurabilty = Math.floor(Math.random() * (koboldBuildMax - koboldBuildMin + 1) + koboldBuildMin);

                itemDurability = itemDurabilty + (playerStatus.upgradeCount.smith * Math.floor(Math.random() * 20));
                //generate a prefix and suffix if skill is high enough
                //see if we gem it as well
                if (Math.random() * (this.skills.craftingSkills.level + this.skills.generalSkills.level) > 10) {
                    itemName = `${prefixList[Math.floor(Math.random() * prefixList.length)]} ${itemName}`;
                    itemDurabilty += Math.floor(Math.random() * (this.skills.craftingSkills.level + this.skills.craftingSkills.bonus));
                };
                if (Math.random() * (this.skills.craftingSkills.level + this.skills.generalSkills.level) > 20) {
                    let suffixName = suffixList[Math.floor(Math.random() * suffixList.length)];
                    itemDurabilty += Math.floor(Math.random() * (this.skills.craftingSkills.level + this.skills.craftingSkills.bonus + this.skills.craftingSkills.smithBonus));
                    if (suffixName.charAt(0) == `'`) {
                        itemName = `${itemName}${suffixName}`;
                    } else {
                        itemName = `${itemName} ${suffixName}`;
                    }
                };

                if (!throwAwayflag) {
                    let gemsHeld = Object.values(playerStatus.gemPurse).reduce((acc, val) => acc + val);
                    if (gemsHeld > 0) {
                        if ((Math.random() * (this.skills.craftingSkills.level + this.skills.craftingSkills.bonus) > 90) && gemsHeld > 0) {
                            let gem = returnRandomGem();
                            playerStatus.gemPurse[gem] -= 1;
                            itemName = `<p><i class="fas color-${gem} fa-gem gemmed"></i> ${itemName} <i class="fas color-${gem} fa-gem gemmed"></i></p>`;
                            itemDurabilty += (this.skills.generalSkills.bonus + this.skills.craftingSkills.bonus) * 2;
                            this.koboldYip('gem_equip', gem, this.id);
                        };
                    };

                };


                this.skills.craftingSkills.smithing.currentProgress = 0;

                if (itemType === "sword") {
                    if (throwAwayflag) {
                        this.koboldYip('error', 'too_many_weapons', this.id)
                    } else {
                        playerStatus.weaponRack.push(createItem(weaponArray.type, weaponArray.subtype, itemDurabilty, itemName, itemOffsetX, itemOffsetY));

                        displayRacks();
                    }
                };

                if (itemType === "armor") {
                    if (throwAwayflag) {
                        this.koboldYip('error', 'too_many_armors', this.id)
                    } else {
                        playerStatus.armorRack.push(createItem(armorArray.type, armorArray.subtype, itemDurabilty, itemName, itemOffsetX, itemOffsetY));

                        displayRacks();
                    }
                };

                //playerStatus.itemList.push(createItem(itemType, itemDurabilty, itemName));

                this.koboldYip('item', itemType, 'kobold-camp-block');
            }
        },

        koboldCheckEquip: function () {
            if (isEmpty(this.equipWeapon) || isEmpty(this.equipArmor)) {
                let returnToCamp = false;

                if (isEmpty(this.equipArmor)) {
                    let armorPickUp = playerStatus.armorRack.length - 1;
                    if (armorPickUp < 0) {
                        this.koboldYip('error', 'no_equip', this.id);
                        returnToCamp = true;
                    } else {
                        this.equipArmor = playerStatus.armorRack[armorPickUp];
                        playerStatus.armorRack.splice(armorPickUp, 1);
                        displayRacks();
                    }
                }
                if (isEmpty(this.equipWeapon)) {
                    let weaponPickUp = playerStatus.weaponRack.length - 1;
                    if (weaponPickUp < 0) {
                        this.koboldYip('error', 'no_equip', this.id);
                        returnToCamp = true;
                    } else {
                        this.equipWeapon = playerStatus.weaponRack[weaponPickUp];
                        playerStatus.weaponRack.splice(weaponPickUp, 1);
                        displayRacks();
                    }

                }

                if (returnToCamp) {
                    this.workLocation = 'kobold-rest-block';
                    moveKobold(`kobold_${this.id}`, 'kobold-rest-block');
                }
            } else { //We're equipped, lets go to the adventure!
                moveKobold(`kobold_${this.id}`, 'kobold-adventure-block-kobolds');
            }
        },

        koboldAdventureTime: function () {
            let checkMonsters = document.getElementById('kobold-adventure-block-monsters').querySelectorAll('.monster-unit');
            let koboldAdvXP = 0;
            //check for a monster
            //if there is none, generate one!
            if (checkMonsters.length == 0) {
                //generate a random amount of monsters
                let numMonster = Math.floor(Math.random() * 4) + 1;
                for (let i = 0; i < numMonster; i++) {
                    let newMonster = createMonster(playerStatus.monsterList.length);
                    playerStatus.monsterList.push(newMonster);
                    displayMonster(playerStatus.monsterList[i]);
                }

                checkMonsters = document.getElementById('kobold-adventure-block-monsters').querySelectorAll('.monster-unit');
            }

            let monsterArrayEnd = checkMonsters.length - 1;
            //attack the monster
            //formula is (random (damage + level)) + (bonus + 1)  <- max, to min
            let koboldAttack = Math.floor((Math.random() * (this.skills.adventureSkills.damage + this.skills.adventureSkills.level)) + this.skills.adventureSkills.bonus + 1)
            playerStatus.monsterList[monsterArrayEnd].takeDamage(koboldAttack);
            this.koboldYip('damage', koboldAttack, `monster_${playerStatus.monsterList[monsterArrayEnd].id}`);
            koboldAdvXP += koboldAttack;
            if (playerStatus.monsterList[monsterArrayEnd].checkDeath()) {
                //give loot and delete the monster!
                let gemMessage = playerStatus.giveGem();
                document.getElementById(`monster_${monsterArrayEnd}`).remove();
                playerStatus.monsterList.splice(checkMonsters.length - 1, 1);
                this.koboldYip('gem', gemMessage, `kobold_${this.id}`)
                checkMonsters = document.getElementById('kobold-adventure-block-monsters').querySelectorAll('.monster-unit');
                koboldAdvXP += (this.skills.adventureSkills.level + this.skills.generalSkills.bonus + this.skills.generalSkills.level);
            }

            //subtract weapon dur
            this.reduceDur('weapon', koboldAttack);

            //check for equipment break
            this.checkEquipment();

            this.giveXP('adventuring', koboldAdvXP);
        },

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

        reduceDur: function (type, num) {
            if (num <= 0) {
                num = 1;
            }
            switch (type) {
                case 'weapon':
                    this.equipWeapon.durabilty -= num;
                    break;
                case 'armor':
                    this.equipArmor.durabilty -= num;
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

            //check for equipment break
            if (retreatFlag === true) {
                moveKobold(`kobold_${this.id}`, 'kobold-equip-area');
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
                    this.koboldTickSpeed -= 1;
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
                        this.skills[category].bonus += 2;
                        this.maxEnergy += 2;
                        this.currentEnergy += 2;
                        this.maxHunger += 2;
                        this.currentHunger += 2;
                        this.skills[category].nextLevel = Math.floor(BASE_SUB_MULTIPLIER * (this.skills[category].level ** BASE_SUB_MULTIPLIER) + BASE_SUB_EXP_LEVEL);

                    } else {
                        this.skills[category].bonus += 1;
                        this.maxEnergy += 1;
                        this.currentEnergy +=1
                        this.maxHunger += 1;
                        this.currentHunger += 1;
                        this.coinCapacity += 2;
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