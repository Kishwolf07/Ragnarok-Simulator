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
function getPointsForLevel(level){
    if(level <= 4) return 3;
    if(level >= 95) return 22;
    return Math.floor((level - 1) / 5) + 3;
}

function getTotalStatPoints(level){
    let total = 48;
    for(let i = 2; i <= level; i++) total += getPointsForLevel(i);
    return total;
}

function getStatCost(value){
    return Math.min(Math.floor((value - 1) / 10) + 2, 11);
}

function getTotalCost(statValue){
    let total = 0;
    for(let i = 1; i < statValue; i++) total += getStatCost(i);
    return total;
}

// ===============================
// DATA TABLES
// ===============================
const jobData = {
    Novice:    { hpFactor: 0,   spFactor: 1, maxJob: 9 }, 
    Swordsman: { hpFactor: 0.7, spFactor: 2, maxJob: 50 },
    Mage:      { hpFactor: 0.3, spFactor: 6, maxJob: 50 },
    Archer:    { hpFactor: 0.5, spFactor: 2, maxJob: 50 },
    Thief:     { hpFactor: 0.5, spFactor: 2, maxJob: 50 },
    Acolyte:   { hpFactor: 0.4, spFactor: 5, maxJob: 50 }, 
    Merchant:  { hpFactor: 0.4, spFactor: 3, maxJob: 50 }
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
    "Novice":   { "Hand": 1.0, "Dagger": 1.3, "One-handed Sword": 1.4, "One-handed Axe": 1.6, "One-handed Mace": 1.4, "Two-handed Mace": 1.4, "Rod & Staff": 1.3, "Two-handed Staff": 1.3},
    "Swordsman":{ "Hand": 0.8, "Dagger": 1.0, "One-handed Sword": 1.1, "Two-handed Sword": 1.2, "One-handed Spear": 1.3, "Two-handed Spear": 1.4, "One-handed Axe": 1.4, "Two-handed Axe": 1.5, "One-handed Mace": 1.3, "Two-handed Mace": 1.4 },
    "Mage":     { "Hand": 1.0, "Dagger": 1.2, "Rod & Staff": 1.4, "Two-handed Staff": 1.4},
    "Archer":   { "Hand": 0.8, "Dagger": 1.2, "Bow": 1.4 },
    "Thief":    { "Hand": 0.8, "Dagger": 1.0, "One-handed Sword": 1.3, "Bow": 1.6},
    "Acolyte":  { "Hand": 0.8, "One-handed Mace": 1.2, "Two-handed Mace": 1.2, "Rod & Staff": 1.2, "Two-handed Staff": 1.2},
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
    let level = parseInt(document.getElementById("baseLevel").value) || 1;
    let job = document.getElementById("job").value;
    let weapon = document.getElementById("weapon").value;
    let jobInfo = jobData[job] || jobData["Novice"];
    let upgradeBonus = 0; 

    const jobLevelInput = document.getElementById("jobLevel");
    if (parseInt(jobLevelInput.value) > jobInfo.maxJob) jobLevelInput.value = jobInfo.maxJob;

    let stats = {
        str: parseInt(document.getElementById("str").value) || 1,
        agi: parseInt(document.getElementById("agi").value) || 1,
        vit: parseInt(document.getElementById("vit").value) || 1,
        int: parseInt(document.getElementById("int").value) || 1,
        dex: parseInt(document.getElementById("dex").value) || 1,
        luk: parseInt(document.getElementById("luk").value) || 1
    };

    let totalPoints = getTotalStatPoints(level);
    let spentPoints = getTotalCost(stats.str) + getTotalCost(stats.agi) + getTotalCost(stats.vit) + 
                      getTotalCost(stats.int) + getTotalCost(stats.dex) + getTotalCost(stats.luk);

    if (changedStatId && spentPoints > totalPoints) {
        stats[changedStatId] -= 1;
        document.getElementById(changedStatId).value = stats[changedStatId];
        spentPoints = getTotalCost(stats.str) + getTotalCost(stats.agi) + getTotalCost(stats.vit) + 
                      getTotalCost(stats.int) + getTotalCost(stats.dex) + getTotalCost(stats.luk);
    }

    let weight = 2000 + (30 * stats.str) + (jobWeightModifier[job] || 0);
    let baseHP = 35 + (level * 5);
    for (let i = 2; i <= level; i++) baseHP += Math.round(jobInfo.hpFactor * i);
    let maxHP = Math.floor(baseHP * (1 + stats.vit * 0.01));
    let maxSP = Math.floor((10 + (level * jobInfo.spFactor)) * (1 + stats.int * 0.01));

    document.getElementById("weight").innerText = weight;
    document.getElementById("hpValue").innerText = maxHP;
    document.getElementById("spValue").innerText = maxSP;
    document.getElementById("statusPoints").innerText = Math.max(totalPoints - spentPoints, 0);

    // --- BATTLE STATS ---

    // ATK
    let baseAtk = (weapon === "Bow") 
        ? (stats.dex + Math.pow(Math.floor(stats.dex / 10), 2) + Math.floor(stats.str / 5) + Math.floor(stats.luk / 5))
        : (stats.str + Math.pow(Math.floor(stats.str / 10), 2) + Math.floor(stats.dex / 5) + Math.floor(stats.luk / 5));
    document.getElementById("atk").innerText = baseAtk + " + " + upgradeBonus;
    
    // MATK
    let matkMin = stats.int + Math.pow(Math.floor(stats.int / 7), 2);
    let matkMax = stats.int + Math.pow(Math.floor(stats.int / 5), 2);
    if(document.getElementById("matk")) document.getElementById("matk").innerText = matkMin + " ~ " + matkMax;
    
    //DEF
    document.getElementById("def").innerText = "0 + " + stats.vit;

    // MDEF
    if(document.getElementById("mdef")) {
        document.getElementById("mdef").innerText = "0 + " + stats.int;
    }
    
    // HIT
    document.getElementById("hit").innerText = level + stats.dex;
    
    // FLEE
    let fleeBase = level + stats.agi;
    let luckyDodge = Math.floor(stats.luk / 10) + 1;
    document.getElementById("flee").innerText = fleeBase + " + " + luckyDodge;
    
    // CRIT
    if(document.getElementById("critical")) document.getElementById("critical").innerText = Math.floor(stats.luk * 0.3) + 1;
    
    // ASPD
    document.getElementById("aspd").innerText = calculateASPD(job, weapon, stats.agi, stats.dex);
}

// ===============================
// RESET SYSTEM
// ===============================
function resetCharacter() {
    document.getElementById("baseLevel").value = 1;
    document.getElementById("jobLevel").value = 1;
    document.getElementById("job").value = "Novice";
    
    const stats = ["str", "agi", "vit", "int", "dex", "luk"];
    stats.forEach(s => {
        document.getElementById(s).value = 1;
    });

    updateWeaponOptions();
    updateCharacterImage();
    updateStats();
}