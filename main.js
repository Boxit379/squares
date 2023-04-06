// Variables
let colors = [
    "white", "red", "darkorange", "yellow", "lime", "darkgreen", "deepskyblue", "blue", "darkviolet", "magenta", "black"
]
let achievements = [];

// Functions
function clickSquare(id, click) {
    let square = document.getElementById(id);
    let color = square.style.backgroundColor;
    let colorIndex = colors.indexOf(color);
    colorIndex += click;
    if (colorIndex > colors.length-1) {
        colorIndex = 0;
    } else if (colorIndex < 0) {
        colorIndex = colors.length-1;
    }
    square.style.backgroundColor = colors[colorIndex];
    checkAchievements();
}

function checkAchievements() {
    for (let i = 0; i < achievements.length; i++) {
        let achievement = achievements[i];
        let grid = document.getElementById("grid");
        let squares = grid.children;
        let squaresArray = [];
        for (let j = 0; j < squares.length; j++) {
            let square = squares[j];
            let color = square.style.backgroundColor;
            let colorIndex = colors.indexOf(color);
            squaresArray.push(colorIndex);
        }
        for (let j = 0; j < achievement.conditions.length; j++) {
            let wildcardColor = null;
            let condition = achievement.conditions[j];
            let conditionMet = true;
            for (let j = 0; j < squaresArray.length; j++) {
                if (squaresArray[j] !== condition[j] && condition[j] !== -1) {
                    conditionMet = false;
                    break;
                }
                // If non-wildcard color is wildcard color, fail condition
                if (condition[j] !== -1) {
                    if (wildcardColor != null && squaresArray[j] === wildcardColor) {
                        conditionMet = false;
                        break;
                    }
                }
                if (condition[j] === -1) {
                    if (wildcardColor == null) {
                        wildcardColor = squaresArray[j];
                    } else if (wildcardColor !== squaresArray[j]) {
                        conditionMet = false;
                        break;
                    }
                }
            }
            if (conditionMet) {
                if (achievement.unlocked === false) {
                    achievement.unlocked = true;
                    achievement.solution = squaresArray;
                    save();
                }
                break;
            }
        }
    }
}

function save() {
    // Save achievements to local storage
    let achievementsString = JSON.stringify(achievements);
    localStorage.setItem("achievements", achievementsString);
}

function load() {
    // Load achievements from local storage
    let achievementsString = localStorage.getItem("achievements");
    achievements = JSON.parse(achievementsString);
    // If there are more default achievements than saved achievements, add the new achievements
    if (achievements.length < defaultAchievements.length) {
        for (let i = achievements.length; i < defaultAchievements.length; i++) {
            achievements.push(defaultAchievements[i]);
        }
    }
    // If there are less default achievements than saved achievements, remove the extra achievements
    if (achievements.length > defaultAchievements.length) {
        for (let i = achievements.length; i > defaultAchievements.length; i--) {
            achievements.pop();
        }
    }
}

function openAchievements() {
    document.getElementById("achievementsModal").style.display = "flex";
    for (let i = 0; i < achievements.length; i++) {
        let achievement = achievements[i];
        let achievementDiv = document.createElement("div");
        achievementDiv.className = "achievement";
        achievementDiv.id = "achievement" + achievement.id;
        document.getElementById("achievementsList").appendChild(achievementDiv);
        let icon = document.createElement("div");
        icon.className = "achievementIcon";
        if (achievement.unlocked) {
            for (let j = 0; j < 49; j++) {
                let square = document.createElement("div");
                square.className = "square";
                square.style.backgroundColor = colors[achievement.solution[j]];
                icon.appendChild(square);
            }
        } else {
            for (let j = 0; j < 49; j++) {
                let square = document.createElement("div");
                square.className = "square";
                square.style.backgroundColor = "gray";
                icon.appendChild(square);
            }
        }
        document.getElementById("achievement" + achievement.id).appendChild(icon);
        let name = document.createElement("h2");
        name.className = "achievementName";
        name.innerHTML = achievement.unlocked ? achievement.name : "???";
        name.innerHTML += "<br><span class='achievementHint'>" + achievement.hint + "</span>";
        document.getElementById("achievement" + achievement.id).appendChild(name);
    }
}

function closeAchievements() {
    document.getElementById("achievementsModal").style.display = "none";
    let achievementsList = document.getElementById("achievementsList");
    achievementsList.innerHTML = "";
}

// Classes
class Achievement {
    constructor(id, name, conditions, hint) {
        this.id = id;
        this.name = name;
        this.conditions = conditions;
        this.hint = hint;
        this.unlocked = false;
        this.solution = null;
    }
}

// Achievements
let defaultAchievements = [
    new Achievement(1, "Void",
        [[10,10,10,10,10,10,10,
        10,10,10,10,10,10,10,
        10,10,10,10,10,10,10,
        10,10,10,10,10,10,10,
        10,10,10,10,10,10,10,
        10,10,10,10,10,10,10,
        10,10,10,10,10,10,10]],"Total darkness"),
    new Achievement(2, "Hacker",
        [[10,10,10,10,10,10,10,
            10,4,10,10,10,10,10,
            10,10,4,10,10,10,10,
            10,10,10,4,10,10,10,
            10,10,4,10,10,10,10,
            10,4,10,10,4,4,10,
            10,10,10,10,10,10,10]], "hackGame();"),
    new Achievement(3, "Cross",
        [[1,-1,-1,-1,-1,-1,1,
            -1,1,-1,-1,-1,1,-1,
            -1,-1,1,-1,1,-1,-1,
            -1,-1,-1,1,-1,-1,-1,
            -1,-1,1,-1,1,-1,-1,
            -1,1,-1,-1,-1,1,-1,
            1,-1,-1,-1,-1,-1,1]], "Close me."),
    new Achievement(4, "Rainbow",
        [
        [
            1,2,3,4,5,6,7,
            2,3,4,5,6,7,8,
            3,4,5,6,7,8,9,
            4,5,6,7,8,9,1,
            5,6,7,8,9,1,2,
            6,7,8,9,1,2,3,
            7,8,9,1,2,3,4
        ],
        [
            1,2,3,4,5,6,7,
            1,2,3,4,5,6,7,
            1,2,3,4,5,6,7,
            1,2,3,4,5,6,7,
            1,2,3,4,5,6,7,
            1,2,3,4,5,6,7,
            1,2,3,4,5,6,7
        ],
        [
            1,1,1,1,1,1,1,
            2,2,2,2,2,2,2,
            3,3,3,3,3,3,3,
            4,4,4,4,4,4,4,
            5,5,5,5,5,5,5,
            6,6,6,6,6,6,6,
            7,7,7,7,7,7,7
        ]], "LGBTQ+, and possibly nyan cat"),
    new Achievement(5, "The World Machine",
        [[-1,-1,-1,-1,-1,-1,-1,
            -1,-1,3,3,3,-1,-1,
            -1,3,-1,-1,-1,3,-1,
            -1,3,-1,-1,-1,3,-1,
            -1,3,-1,-1,-1,3,-1,
            -1,-1,3,3,3,-1,-1,
            -1,-1,-1,3,-1,-1,-1]], "You only have one shot.")
]

// Generate Grid
for (let i = 0; i < 49; i++) {
    let square = document.createElement("div");
    square.className = "square";
    square.id = String(i+1);
    square.onclick = function(){clickSquare(i+1,1)};
    square.oncontextmenu = function () {clickSquare(i+1,-1)}
    square.style.backgroundColor = "white";
    document.getElementById("grid").appendChild(square);
}

// Load achievements
if (localStorage.getItem("achievements") != null) {
    load();
} else {
    achievements = defaultAchievements;
}

// Disable Context Menu
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
});

// Log image of hacker achievement to console (use full block character and style with css)
for (let i = 0; i < 7; i++) {
    let styles = [];
    for (let j = 0; j < 7; j++) {
        if (defaultAchievements[1].conditions[0][i*7+j] === 10) {
            styles.push("color: black; font-family: monospace;");
        } else {
            styles.push("color: lime; font-family: monospace;");
        }
    }
    console.log("%c\u25A0 %c\u25A0 %c\u25A0 %c\u25A0 %c\u25A0 %c\u25A0 %c\u25A0", styles[0], styles[1], styles[2], styles[3], styles[4], styles[5], styles[6]);
}