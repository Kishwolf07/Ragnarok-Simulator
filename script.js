// ===============================
// CHARACTER IMAGE
// ===============================
function updateCharacterImage() {
    const job = document.getElementById("job").value;
    const genderToggle = document.getElementById("genderToggle");
    const genderSymbol = document.querySelector(".gender-symbol");
    const characterGif = document.querySelector(".character-gif");

    const isFemale = genderToggle && genderToggle.checked;

    if (genderSymbol) {
        genderSymbol.textContent = isFemale ? "♀" : "♂";
        genderSymbol.classList.remove("male-icon", "female-icon");
        genderSymbol.classList.add(isFemale ? "female-icon" : "male-icon");
    }

    const jobFile = job.toLowerCase();
    const genderSuffix = isFemale ? "G" : "";
    const gifSrc = `jobs/${jobFile}${genderSuffix}.gif`;

    if (characterGif) {
        characterGif.style.opacity = 0;
        setTimeout(() => {
            characterGif.src = gifSrc;
            characterGif.style.opacity = 1;
        }, 200);
    }
}

// ===============================
// STAT POINT SYSTEM
// ===============================
function getPointsForLevel(level) {
    if (level <= 4) return 3;
    if (level >= 95) return 22;
    return Math.floor((level - 1) / 5) + 3;
}

function getTotalStatPoints(level) {
    let total = 48;
    for (let i = 2; i <= level; i++) {
        let pointsToAdd = getPointsForLevel(i);
        if (level === 99 && i === 99) {
            total += (pointsToAdd - 1);
        } else {
            total += pointsToAdd;
        }
    }
    return total;
}

// JOB BONUSES DATA
const jobBonuses = {
    "Swordsman": { 1: [0,0,0,0,0,0], 2: [1,0,0,0,0,0], 6: [1,0,1,0,0,0], 10: [1,0,1,0,1,0], 14: [2,0,1,0,1,0], 18: [2,0,2,0,1,0], 22: [2,0,2,0,2,0], 26: [2,0,2,0,2,1], 30: [3,0,2,0,2,1], 33: [3,0,3,0,2,1], 36: [3,0,3,0,3,1], 40: [4,0,3,0,3,1], 42: [4,0,4,0,3,1], 44: [4,0,4,0,3,2], 46: [4,1,4,0,3,2], 47: [5,1,4,0,3,2], 49: [6,1,4,0,3,2], 50: [7,2,4,0,3,2] },
    "Mage": { 1: [0,0,0,0,0,0], 2: [0,0,0,1,0,0], 6: [0,0,0,1,1,0], 10: [0,0,0,1,2,0], 14: [0,0,0,2,2,0], 18: [0,1,0,2,2,0], 22: [0,1,0,3,2,0], 26: [0,2,0,3,2,0], 30: [0,2,0,3,2,1], 33: [0,2,0,4,2,1], 36: [0,2,0,4,3,1], 38: [0,2,0,5,3,1], 40: [0,3,0,5,3,1], 42: [0,3,0,5,3,2], 44: [0,3,0,6,3,2], 46: [0,3,0,7,3,2], 47: [0,4,0,7,3,2], 49: [0,4,0,7,3,3], 50: [0,4,0,8,3,3] },
    "Archer": { 1: [0,0,0,0,0,0], 2: [0,0,0,0,1,0], 6: [1,0,0,0,1,0], 10: [1,0,0,1,1,0], 14: [1,0,0,1,2,0], 18: [1,0,0,1,3,0], 22: [1,0,0,1,3,1], 26: [1,1,0,1,3,1], 30: [1,1,0,1,4,1], 33: [1,2,0,1,4,1], 36: [1,2,0,1,5,1], 38: [2,2,0,1,5,1], 40: [3,2,0,1,5,1], 42: [3,2,0,1,6,1], 44: [3,2,0,1,6,2], 46: [3,2,1,1,6,2], 47: [3,2,1,2,6,2], 49: [3,3,1,2,6,2], 50: [3,3,1,2,7,2] },
    "Merchant": { 1: [0,0,0,0,0,0], 2: [0,0,1,0,0,0], 6: [0,0,1,0,1,0], 10: [1,0,1,0,1,0], 14: [1,0,1,0,2,0], 18: [1,0,2,0,2,0], 22: [2,0,2,0,2,0], 26: [2,0,2,1,2,0], 30: [2,0,3,1,2,0], 33: [2,1,3,1,2,0], 36: [2,1,3,1,2,1], 38: [2,1,3,1,3,1], 40: [3,1,3,1,3,1], 42: [3,1,3,1,4,1], 44: [4,1,3,1,4,1], 46: [4,1,3,1,4,2], 47: [4,1,4,1,4,2], 49: [5,1,4,1,4,2], 50: [5,1,4,1,5,2] },
    "Thief": { 1: [0,0,0,0,0,0], 2: [0,1,0,0,0,0], 6: [1,1,0,0,0,0], 10: [1,1,0,0,1,0], 14: [1,1,1,0,1,0], 18: [1,1,1,1,1,0], 22: [1,1,1,1,2,0], 26: [1,1,1,1,2,1], 30: [2,1,1,1,2,1], 33: [2,2,1,1,2,1], 36: [2,3,1,1,2,1], 38: [3,3,1,1,2,1], 40: [3,3,1,1,2,2], 42: [3,3,1,1,3,2], 44: [3,3,2,1,3,2], 46: [3,3,2,1,3,3], 47: [4,3,2,1,3,3], 49: [4,3,2,1,4,3], 50: [4,4,2,1,4,3] },
    "Acolyte": { 1: [0,0,0,0,0,0], 2: [0,0,0,0,0,1], 6: [0,0,1,0,0,1], 10: [0,0,1,1,0,1], 14: [0,0,1,1,1,1], 18: [0,0,1,1,1,2], 22: [0,1,1,1,1,2], 26: [1,1,1,1,1,2], 30: [1,1,2,1,1,2], 36: [1,1,2,2,2,2], 38: [1,1,2,2,2,3], 40: [1,2,2,2,2,3], 42: [2,2,2,2,2,3], 44: [2,2,3,2,2,3], 46: [2,2,3,3,3,3], 49: [3,2,3,3,3,3], 50: [3,2,3,3,3,4] }
};

//bonus fomula
function getBonusForJobLevel(job, level) {
    const classData = jobBonuses[job] || { 1: [0, 0, 0, 0, 0, 0] };
    const sortedLevels = Object.keys(classData).map(Number).sort((a, b) => a - b);
    let activeLevel = 1;
    for (let l of sortedLevels) { if (l <= level) activeLevel = l; else break; }
    return classData[activeLevel];
}

//StatCost
function getStatCost(currentValue) {
    if (currentValue < 11) return 2;
    if (currentValue < 21) return 3;
    if (currentValue < 31) return 4;
    if (currentValue < 41) return 5;
    if (currentValue < 51) return 6;
    if (currentValue < 61) return 7;
    if (currentValue < 71) return 8;
    if (currentValue < 81) return 9;
    if (currentValue < 91) return 10;
    return 11;
}

//total cost
function getTotalCost(statValue) {
    let total = 0;
    for (let i = 1; i < statValue; i++) total += getStatCost(i);
    return total;
}

// ===============================
// REGEN & HP CALCULATIONS
// ===============================
function calculateBaseHP(level, hpFactor) {
    let baseHP = 35 + (level * 5);
    for (let i = 2; i <= level; i++) baseHP += Math.round(hpFactor * i);
    return baseHP;
}

function calculateHPRegen(maxHP, vit, job) {
    let hpr = Math.floor(maxHP / 200) + Math.floor(vit / 5);
    if (job === "Novice") hpr += 1;
    return Math.max(1, hpr);
}

function calculateSPRegen(maxSP, int) {
    let spr = 1 + Math.floor(maxSP / 100) + Math.floor(int / 6);
    if (int >= 120) spr += Math.floor(int / 2 - 56);
    return Math.floor(spr);
}

// ===============================
// DATA TABLES
// ===============================
const jobData = {
    Novice: { hpFactor: 0, spFactor: 1, maxJob: 9 },
    Swordsman: { hpFactor: 0.7, spFactor: 2, maxJob: 50 },
    Mage: { hpFactor: 0.3, spFactor: 6, maxJob: 50 },
    Archer: { hpFactor: 0.5, spFactor: 2, maxJob: 50 },
    Thief: { hpFactor: 0.5, spFactor: 2, maxJob: 50 },
    Acolyte: { hpFactor: 0.4, spFactor: 5, maxJob: 50 },
    Merchant: { hpFactor: 0.4, spFactor: 3, maxJob: 50 }
};

const jobWeapons = {
    Novice: ["Hand","Dagger","One-handed Sword","One-handed Axe","One-handed Mace","Two-handed Mace","Rod & Staff","Two-handed Staff"],
    Swordsman: ["Hand","Dagger","One-handed Sword","Two-handed Sword","One-handed Spear","Two-handed Spear","One-handed Axe","Two-handed Axe","One-handed Mace","Two-handed Mace"],
    Mage: ["Hand","Dagger","Rod & Staff","Two-handed Staff"],
    Archer: ["Hand","Dagger","Bow"],
    Thief: ["Hand","Dagger","One-handed Sword","One-handed Axe","Bow"],
    Acolyte: ["Hand","One-handed Mace","Two-handed Mace","Rod & Staff","Two-handed Staff"],
    Merchant: ["Hand","Dagger","One-handed Sword","One-handed Axe","Two-handed Axe","One-handed Mace","Two-handed Mace"]
};

const jobWeaponBTBA = {
    "Novice": { "Hand": 1.0, "Dagger": 1.3, "One-handed Sword": 1.4, "One-handed Axe": 1.6, "One-handed Mace": 1.4, "Two-handed Mace": 1.4, "Rod & Staff": 1.3, "Two-handed Staff": 1.3},
    "Swordsman": { "Hand": 0.8, "Dagger": 1.0, "One-handed Sword": 1.1, "Two-handed Sword": 1.2, "One-handed Spear": 1.3, "Two-handed Spear": 1.4, "One-handed Axe": 1.4, "Two-handed Axe": 1.5, "One-handed Mace": 1.3, "Two-handed Mace": 1.4 },
    "Mage": { "Hand": 1.0, "Dagger": 1.2, "Rod & Staff": 1.4, "Two-handed Staff": 1.4},
    "Archer": { "Hand": 0.8, "Dagger": 1.2, "Bow": 1.4 },
    "Thief": { "Hand": 0.8, "Dagger": 1.0, "One-handed Sword": 1.3, "Bow": 1.6},
    "Acolyte": { "Hand": 0.8, "One-handed Mace": 1.2, "Two-handed Mace": 1.2, "Rod & Staff": 1.2, "Two-handed Staff": 1.2},
    "Merchant": { "Hand": 0.8, "Dagger": 1.2, "One-handed Sword": 1.4, "One-handed Axe": 1.4, "Two-handed Axe": 1.5, "One-handed Mace": 1.4, "Two-handed Mace": 1.4}
};

const jobWeightModifier = { "Novice": 0, "Swordsman": 800, "Mage": 400, "Archer": 600, "Thief": 400, "Acolyte": 400, "Merchant": 800 };

// ===============================
// CALCULATIONS
// ===============================
function calculateASPD(job, weapon, agi, dex) {
    const btba = (jobWeaponBTBA[job] && jobWeaponBTBA[job][weapon]) ? jobWeaponBTBA[job][weapon] : 1.0;
    let WD = 50 * btba;
    let drAgi = Math.round(WD * agi / 25);
    let drDex = Math.round(WD * dex / 100);
    let aspd = 200 - (WD - Math.floor((drAgi + drDex) / 10));
    return Math.min(Math.max(aspd, 0), 190);
}

function updateWeaponOptions(){
    const job = document.getElementById("job").value;
    const weaponSelect = document.getElementById("weapon");
    weaponSelect.innerHTML = "";
    (jobWeapons[job] || ["Hand"]).forEach(w => {
        let option = document.createElement("option");
        option.value = w; option.textContent = w;
        weaponSelect.appendChild(option);
    }); 
}

// ===============================
// MAIN UPDATE FUNCTION
// ===============================

function updateStats(changedStatId) {

    //Validation for Base Level
    const baseLevelInput = document.getElementById("baseLevel");
    let level = parseInt(baseLevelInput.value) || 1;
    
    if (level > 99) { level = 99; baseLevelInput.value = 99; } 
    else if (level < 1) { level = 1; baseLevelInput.value = 1; }

    let jobLevel = parseInt(document.getElementById("jobLevel").value) || 1;
    let job = document.getElementById("job").value;
    let weapon = document.getElementById("weapon").value;
    let jobInfo = jobData[job] || jobData["Novice"];

    if (parseInt(document.getElementById("jobLevel").value) > jobInfo.maxJob) {
        document.getElementById("jobLevel").value = jobInfo.maxJob;
    }

    // Calculate effective stats
    // We use Math.max(1, ...) to ensure stats never drop below 1
    let rawStats = {
        str: Math.max(1, parseInt(document.getElementById("str").value) || 1),
        agi: Math.max(1, parseInt(document.getElementById("agi").value) || 1),
        vit: Math.max(1, parseInt(document.getElementById("vit").value) || 1),
        int: Math.max(1, parseInt(document.getElementById("int").value) || 1),
        dex: Math.max(1, parseInt(document.getElementById("dex").value) || 1),
        luk: Math.max(1, parseInt(document.getElementById("luk").value) || 1)
    };

    //Point Validation & Automatic Rollback
    let totalPoints = getTotalStatPoints(level);
    let spentPoints = getTotalCost(rawStats.str) + getTotalCost(rawStats.agi) + getTotalCost(rawStats.vit) + 
                      getTotalCost(rawStats.int) + getTotalCost(rawStats.dex) + getTotalCost(rawStats.luk);

    // If points are exceeded, force the changed stat down until it is valid
    if (changedStatId && spentPoints > totalPoints) {
        let el = document.getElementById(changedStatId);
        // This loop aggressively lowers the value until it fits the points
        while (spentPoints > totalPoints && parseInt(el.value) > 1) {
            el.value = parseInt(el.value) - 1;
            rawStats[changedStatId] = parseInt(el.value);
            spentPoints = getTotalCost(rawStats.str) + getTotalCost(rawStats.agi) + getTotalCost(rawStats.vit) + 
                          getTotalCost(rawStats.int) + getTotalCost(rawStats.dex) + getTotalCost(rawStats.luk);
        }
        // Proceed with the new corrected values
    }

    //bonus calculation
    const bonuses = getBonusForJobLevel(job, jobLevel);
    const bonusIds = ["strBonus", "agiBonus", "vitBonus", "intBonus", "dexBonus", "lukBonus"];
    bonusIds.forEach((id, index) => { document.getElementById(id).innerText = bonuses[index]; });

    let stats = {
        str: rawStats.str + bonuses[0],
        agi: rawStats.agi + bonuses[1],
        vit: rawStats.vit + bonuses[2],
        int: rawStats.int + bonuses[3],
        dex: rawStats.dex + bonuses[4],
        luk: rawStats.luk + bonuses[5]
    };

   //required cost
    const statKeys = ['str', 'agi', 'vit', 'int', 'dex', 'luk'];
    statKeys.forEach(key => { document.getElementById(key + "Req").innerText = getStatCost(rawStats[key]); });

    //weight
    let weight = 2000 + (30 * stats.str) + (jobWeightModifier[job] || 0);
    let baseHP = calculateBaseHP(level, jobInfo.hpFactor);
    let maxHP = Math.floor(baseHP * (1 + stats.vit * 0.01));
    let maxSP = Math.floor((10 + (level * jobInfo.spFactor)) * (1 + stats.int * 0.01));

    //hp,sp value
    document.getElementById("weight").innerText = weight;
    document.getElementById("hpValue").innerText = maxHP;
    document.getElementById("spValue").innerText = maxSP;

    const hpPercent = Math.min((maxHP / 20000) * 100, 100);
    const spPercent = Math.min((maxSP / 5000) * 100, 100);
    const hpBar = document.getElementById("hpBar");
    const spBar = document.getElementById("spBar");
    hpBar.style.width = hpPercent + "%";
    hpBar.querySelector("span").innerText = Math.floor(hpPercent) + "%";
    spBar.style.width = spPercent + "%";
    spBar.querySelector("span").innerText = Math.floor(spPercent) + "%";
    
    //hp,sp regen
    document.getElementById("hpRegen").innerText = calculateHPRegen(maxHP, stats.vit, job);
    document.getElementById("spRegen").innerText = calculateSPRegen(maxSP, stats.int);
    document.getElementById("statusPoints").innerText = Math.max(totalPoints - spentPoints, 0);


    //status information
    let baseAtk = (weapon === "Bow") 
        ? (stats.dex + Math.pow(Math.floor(stats.dex / 10), 2) + Math.floor(stats.str / 5) + Math.floor(stats.luk / 5))
        : (stats.str + Math.pow(Math.floor(stats.str / 10), 2) + Math.floor(stats.dex / 5) + Math.floor(stats.luk / 5));
    document.getElementById("atk").innerText = baseAtk + " + 0";
    
    let matkMin = stats.int + Math.pow(Math.floor(stats.int / 7), 2);
    let matkMax = stats.int + Math.pow(Math.floor(stats.int / 5), 2);
    document.getElementById("matk").innerText = matkMin + " ~ " + matkMax;
    
    document.getElementById("def").innerText = "0 + " + stats.vit;
    document.getElementById("mdef").innerText = "0 + " + stats.int;
    document.getElementById("hit").innerText = level + stats.dex;
    document.getElementById("flee").innerText = (level + stats.agi) + " + " + (Math.floor(stats.luk / 10) + 1);
    document.getElementById("critical").innerText = Math.floor(stats.luk * 0.3) + 1;
    document.getElementById("aspd").innerText = calculateASPD(job, weapon, stats.agi, stats.dex);
}

//reset button function
function resetCharacter() {
    document.getElementById("baseLevel").value = 1;
    document.getElementById("jobLevel").value = 1;
    document.getElementById("job").value = "Novice";
    const stats = ["str", "agi", "vit", "int", "dex", "luk"];
    stats.forEach(s => document.getElementById(s).value = 1);
    updateWeaponOptions();
    updateCharacterImage();
    updateStats();
}