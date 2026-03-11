// ===============================
// CHARACTER IMAGE (FIXED - G FORMAT + ICON + FADE)
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
        genderSymbol.classList.remove("bounce");
        void genderSymbol.offsetWidth;
        genderSymbol.classList.add("bounce");
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
    if(level<=4) return 3;
    if(level>=95) return 22;
    return Math.floor((level-1)/5)+3;
}

function getTotalStatPoints(level){
    let total=48;
    for(let i=2;i<=level;i++) total+=getPointsForLevel(i);
    return total;
}

function getStatCost(value){
    return Math.min(Math.floor((value-1)/10)+2,11);
}

function getTotalCost(statValue){
    let total=0;
    for(let i=1;i<statValue;i++) total+=getStatCost(i);
    return total;
}

// ===============================
// JOB DATA
// ===============================
const jobData = {
    Novice:    { hpFactor: 0,   spFactor: 1 },
    Swordsman: { hpFactor: 0.7, spFactor: 2 },
    Mage:      { hpFactor: 0.3, spFactor: 6 },
    Archer:    { hpFactor: 0.5, spFactor: 2 },
    Thief:     { hpFactor: 0.5, spFactor: 2 },
    Acolyte:   { hpFactor: 0.4, spFactor: 5 }, 
    Merchant:  { hpFactor: 0.4, spFactor: 3 }
};

const jobWeapons={
    Novice:["Hand","Dagger","One-handed Sword","One-handed Axe","One-handed Mace","Two-handed Mace","Rod & Staff","Two-handed Staff"],
    Swordsman:["Hand","Dagger","One-handed Sword","Two-handed Sword","One-handed Spear","Two-handed Spear","One-handed Axe","Two-handed Axe","One-handed Mace","Two-handed Mace"],
    Magician:["Hand","Dagger","Rod & Staff","Two-handed Staff"],
    Archer:["Hand","Dagger","Bow"],
    Thief:["Hand","Dagger","One-handed Sword","One-handed Axe","Bow"],
    Acolyte:["Hand","One-handed Mace","Two-handed Mace","Rod & Staff","Two-handed Staff"],
    Merchant:["Hand","Dagger","One-handed Sword","One-handed Axe","Two-handed Axe","One-handed Mace","Two-handed Mace"]
};


// ===============================
// BTBA MATRIX (Base Time Between Attacks)
// ===============================
const jobWeaponBTBA = {
    "Novice":   { "Hand": 1.0, "Dagger": 1.3, "One-handed Sword": 1.4,"One-handed Axe": 1.6, "One-handed Mace": 1.4, "Two-handed Mace": 1.4, "Rod & Staff": 1.3, "Two-handed Staff": 1.3},
    "Swordsman":{ "Hand": 0.8, "Dagger": 1.0, "One-handed Sword": 1.1, "Two-handed Sword": 1.2, "One-handed Spear": 1.3, "Two-handed Spear": 1.4, "One-handed Axe": 1.4, "Two-handed Axe": 1.5, "One-handed Mace": 1.3, "Two-handed Mace": 1.4 },
    "Magician": { "Hand": 1.0, "Dagger": 1.2, "Rod & Staff": 1.4, "Two-handed Staff": 1.4},
    "Archer":   { "Hand": 0.8, "Dagger": 1.2, "Bow": 1.4 },
    "Thief":    { "Hand": 0.8, "Dagger": 1.0, "One-handed Sword": 1.3, "Bow": 1.6},
    "Acolyte":  { "Hand": 0.8, "One-handed Mace": 1.2, "Two-handed Mace": 1.2, "Rod & Staff": 1.2, "Two-handed Staff": 1.2},
    "Merchant": { "Hand": 0.8, "Dagger": 1.2, "One-handed Sword": 1.4, "One-handed Axe": 1.4, "Two-handed Axe": 1.5, "One-handed Mace": 1.4, "Two-handed Mace": 1.4}
};

//JOB WEIGHT
const jobWeightModifier = {
    "Novice": 0,
    "Swordsman": 800,
    "Mage": 400,
    "Archer": 600,
    "Thief": 400,
    "Acolyte": 400,
    "Merchant": 800
};


function calculateASPD(job, weapon, agi, dex) {
    const btba = (jobWeaponBTBA[job] && jobWeaponBTBA[job][weapon]) ? jobWeaponBTBA[job][weapon] : 1.0;
    let WD = 50 * btba; // Official Base Weapon Delay

    let delayReductionAGI = Math.round(WD * agi / 25);
    let delayReductionDEX = Math.round(WD * dex / 100);

    let adjustedDelay = WD - Math.floor((delayReductionAGI + delayReductionDEX) / 10);
    let aspd = 200 - adjustedDelay;

    return Math.min(Math.max(aspd, 0), 190);
}

// ===============================
// UPDATE WEAPON OPTIONS
// ===============================
function updateWeaponOptions(){
    const job=document.getElementById("job").value;
    const weaponSelect=document.getElementById("weapon");
    weaponSelect.innerHTML="";
    const allowed=jobWeapons[job]||["Hand"];
    allowed.forEach(w=>{
        let option=document.createElement("option");
        option.value=w;
        option.textContent=w;
        weaponSelect.appendChild(option);
    }); 
}

// ===============================
// MAIN STAT CALCULATION
// ===============================
function updateStats() {
    let level = parseInt(document.getElementById("baseLevel").value) || 1;
    let job = document.getElementById("job").value;
    let weapon = document.getElementById("weapon").value;
    let str = parseInt(document.getElementById("str").value) || 1;
    let agi = parseInt(document.getElementById("agi").value) || 1;
    let vit = parseInt(document.getElementById("vit").value) || 1;
    let intStat = parseInt(document.getElementById("int").value) || 1;
    let dex = parseInt(document.getElementById("dex").value) || 1;
    let luk = parseInt(document.getElementById("luk").value) || 1;

    // --- WEIGHT ---
    let wgtJob = jobWeightModifier[job] || 0;
    document.getElementById("weight").innerText = 2000 + (30 * str) + wgtJob;

    // --- HP CALCULATION---
    let jobInfo = jobData[job] || jobData["Novice"];
    let baseHP = 35 + (level * 5); 
    for (let i = 2; i <= level; i++) {
        baseHP += Math.round(jobInfo.hpFactor * i);
    }
    let maxHP = Math.floor(baseHP * (1 + vit * 0.01));

    // --- SP CALCULATION ---
    let baseSP = 10 + (level * jobInfo.spFactor);
    let maxSP = Math.floor(baseSP * (1 + intStat * 0.01));

    // --- DOM UPDATES ---
    // HP Display
    document.getElementById("hpValue").innerText = maxHP;
    let hpPercent = Math.min((maxHP / 20000) * 100, 100).toFixed(0);
    document.getElementById("hpText").innerText = hpPercent + "%";
    document.getElementById("hpBar").style.width = hpPercent + "%";

    // SP Display 
    document.getElementById("spValue").innerText = maxSP; 
    let spPercent = Math.min((maxSP / 5000) * 100, 100).toFixed(0);
    document.getElementById("spText").innerText = spPercent + "%";
    document.getElementById("spBar").style.width = spPercent + "%";

    // --- OTHER STATS ---
    document.getElementById("strReq").innerText = getStatCost(str);
    document.getElementById("agiReq").innerText = getStatCost(agi);
    document.getElementById("vitReq").innerText = getStatCost(vit);
    document.getElementById("intReq").innerText = getStatCost(intStat);
    document.getElementById("dexReq").innerText = getStatCost(dex);
    document.getElementById("lukReq").innerText = getStatCost(luk);

    let totalPoints = getTotalStatPoints(level);
    let spentPoints = getTotalCost(str) + getTotalCost(agi) + getTotalCost(vit) + getTotalCost(intStat) + getTotalCost(dex) + getTotalCost(luk);
    document.getElementById("statusPoints").innerText = Math.max(totalPoints - spentPoints, 0);

    let atkBase = str + Math.floor(Math.pow(Math.floor(str/10),2));
    let atkBonus = ["Archer","Thief"].includes(job) ? Math.floor(dex/5) : Math.floor(dex/5) + Math.floor(luk/5);
    document.getElementById("atk").innerText = atkBase + " + " + atkBonus;

    let matkMin = intStat + Math.floor(Math.pow(Math.floor(intStat/7),2));
    let matkMax = intStat + Math.floor(Math.pow(Math.floor(intStat/5),2));
    document.getElementById("matk").innerText = matkMin + "~" + matkMax;

    document.getElementById("hit").innerText = level + dex;
    document.getElementById("critical").innerText = Math.floor(luk*0.3)+1;
    document.getElementById("def").innerText = "0 + " + Math.floor(vit*0.8);
    document.getElementById("mdef").innerText = "0 + " + intStat;
    document.getElementById("flee").innerText = (level + agi) + " + " + (1 + Math.floor(luk/5));
    document.getElementById("aspd").innerText = calculateASPD(job, weapon, agi, dex);
    
    document.getElementById("hpRegen").innerText = Math.floor(maxHP/200) + Math.floor(vit/5);
    document.getElementById("spRegen").innerText = Math.floor(maxSP/100) + Math.floor(intStat/6) + 1;
}