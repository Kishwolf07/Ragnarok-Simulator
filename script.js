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
const jobData={
    Novice:{hpFactor:5,spFactor:3},
    Swordsman:{hpFactor:12,spFactor:2},
    Mage:{hpFactor:3,spFactor:10},
    Archer:{hpFactor:8,spFactor:4},
    Thief:{hpFactor:7,spFactor:3},
    Acolyte:{hpFactor:6,spFactor:8},
    Merchant:{hpFactor:9,spFactor:3}
};

// ===============================
// JOB WEAPONS
// ===============================
const jobWeapons={
    Novice:["Hand","Dagger","One-handed Sword","One-handed Axe","One-handed Mace","Two-handed Mace","Rod & Staff","Two-handed Staff"],
    Swordsman:["Hand","Dagger","One-handed Sword","Two-handed Sword","One-handed Spear","Two-handed Spear","One-handed Axe","Two-handed Axe","One-handed Mace","Two-handed Mace"],
    Mage:["Hand","Dagger","Rod & Staff","Two-handed Staff"],
    Archer:["Hand","Dagger","Bow"],
    Thief:["Hand","Dagger","One-handed Sword","One-handed Axe","Bow"],
    Acolyte:["Hand","One-handed Mace","Two-handed Mace","Rod & Staff","Two-handed Staff"],
    Merchant:["Hand","Dagger","One-handed Sword","One-handed Axe","Two-handed Axe","One-handed Mace","Two-handed Mace"]
};

// ===============================
// WEAPON BASE ASPD
// ===============================
const weaponDelay = {
    "Hand": 50,
    "Dagger": 65,
    "One-handed Sword": 70,
    "One-handed Axe": 80,
    "One-handed Mace": 70,
    "Two-handed Mace": 70,
    "Rod & Staff": 65,
    "Two-handed Staff": 65,
    "Bow": 70,
    "Staff": 60,
    "One-handed Spear": 70,
    "Two-handed Spear": 75,
    "Two-handed Sword": 80,
    "Two-handed Axe": 80
};  

function calculateASPD(weapon, agi, dex) {
    let WD = weaponDelay[weapon] || 50;

    // Official formula: round intermediate
    let delayReductionAGI = Math.round(WD * agi / 25);
    let delayReductionDEX = Math.round(WD * dex / 100);

    let adjustedDelay = WD - Math.floor((delayReductionAGI + delayReductionDEX) / 10);

    let aspd = 200 - adjustedDelay;

    // Cap to official max/min
    if (aspd > 190) aspd = 190;
    if (aspd < 0) aspd = 0;

    return aspd;
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
function updateStats(){

    let level = parseInt(document.getElementById("baseLevel").value) || 1;
    if(level < 1) level = 1;
    if(level > 99) level = 99;
    document.getElementById("baseLevel").value = level;

    let jobLevel = parseInt(document.getElementById("jobLevel").value) || 1;
    if(jobLevel < 1) jobLevel = 1;
    if(jobLevel > 50) jobLevel = 50;
    document.getElementById("jobLevel").value = jobLevel;

    let str=parseInt(document.getElementById("str").value)||1;
    let agi=parseInt(document.getElementById("agi").value)||1;
    let vit=parseInt(document.getElementById("vit").value)||1;
    let intStat=parseInt(document.getElementById("int").value)||1;
    let dex=parseInt(document.getElementById("dex").value)||1;
    let luk=parseInt(document.getElementById("luk").value)||1;
    let job=document.getElementById("job").value;
    let weapon=document.getElementById("weapon").value;

    // ===============================
    // STAT COST DISPLAY
    // ===============================
    document.getElementById("strReq").innerText=getStatCost(str);
    document.getElementById("agiReq").innerText=getStatCost(agi);
    document.getElementById("vitReq").innerText=getStatCost(vit);
    document.getElementById("intReq").innerText=getStatCost(intStat);
    document.getElementById("dexReq").innerText=getStatCost(dex);
    document.getElementById("lukReq").innerText=getStatCost(luk);

    // ===============================
    // STAT POINTS
    // ===============================
    let totalPoints=getTotalStatPoints(level);

    let spentPoints=
        getTotalCost(str)+
        getTotalCost(agi)+
        getTotalCost(vit)+
        getTotalCost(intStat)+
        getTotalCost(dex)+
        getTotalCost(luk);

    document.getElementById("statusPoints").innerText=Math.max(totalPoints-spentPoints,0);

    // ===============================
    // ATK
    // ===============================
    let atkBase = str + Math.floor(Math.pow(Math.floor(str/10),2)); // STR bonus squared
    let atkBonus = 0;
    if(["Archer","Thief"].includes(job)) atkBonus = Math.floor(dex/5); // Bow/Dex bonus
    else atkBonus = Math.floor(dex/5) + Math.floor(luk/5); // Melee bonus
    document.getElementById("atk").innerText = atkBase + " + " + atkBonus;

    // ===============================
    // MATK
    // ===============================
    let matkMin = intStat + Math.floor(Math.pow(Math.floor(intStat/7),2));
    let matkMax = intStat + Math.floor(Math.pow(Math.floor(intStat/5),2));
    document.getElementById("matk").innerText = matkMin + "~" + matkMax;

    // ===============================
    // HIT / CRIT
    // ===============================
    document.getElementById("hit").innerText = level + dex;
    document.getElementById("critical").innerText = Math.floor(luk*0.3)+1;

    // ===============================
    // DEF / MDEF
    // ===============================
    let vitDef = Math.floor(vit*0.8); // Soft DEF scaling
    document.getElementById("def").innerText = "0 + " + vitDef;

    let intMdef = intStat; // Soft MDEF scaling
    document.getElementById("mdef").innerText = "0 + " + intMdef;

    // ===============================
    // FLEE
    // ===============================
    let flee = level + agi;
    let perfectDodge = 1 + Math.floor(luk/5); // Corrected from /10
    document.getElementById("flee").innerText = flee + " + " + perfectDodge;

    // ===============================
    // ASPD
    // ===============================
    // ===============================
    
    let aspd = calculateASPD(weapon, agi, dex);
    document.getElementById("aspd").innerText = aspd;

    // ===============================
    // EXTRA STATS
    // ===============================
    let weight = str*30;

    // ===============================
    // HP / SP
    // ===============================
    let jobInfo = jobData[job] || jobData["Novice"];

    let baseHP = 35 + level*jobInfo.hpFactor;
    let maxHP = Math.floor(baseHP*(1 + vit*0.008)); // 0.8% per VIT

    let baseSP = 10 + level*jobInfo.spFactor;
    let maxSP = Math.floor(baseSP*(1 + intStat*0.01)); // 1% per INT

    // ===============================
    // REGEN
    // ===============================
    let hpRegen = Math.floor(maxHP/200) + Math.floor(vit/5);
    let spRegen = Math.floor(maxSP/100) + Math.floor(intStat/6) + 1;

    // ===============================
    // BARS
    // ===============================
    let maxPossibleHP = 20000;
    let maxPossibleSP = 5000;

    let hpPercent = Math.min((maxHP/maxPossibleHP)*100,100);
    let spPercent = Math.min((maxSP/maxPossibleSP)*100,100);

    document.getElementById("hpBar").style.width = hpPercent+"%";
    document.getElementById("spBar").style.width = spPercent+"%";

    // ===============================
    // DISPLAY VALUES
    // ===============================
    document.getElementById("hp").innerText = maxHP;
    document.getElementById("sp").innerText = maxSP;
    document.getElementById("hpRegen").innerText = hpRegen;
    document.getElementById("spRegen").innerText = spRegen;
    document.getElementById("weight").innerText = weight;
}