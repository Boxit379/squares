// Variables
colors = [
    "white", "red", "darkorange", "yellow", "lime", "darkgreen", "deepskyblue", "blue", "darkviolet", "magenta", "black"
]

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
    let newColor = colors[colorIndex];
    square.style.backgroundColor = newColor;
    checkAchievements();
}

function checkAchievements() {
    for (let i = 0; i < achievements.length; i++) {
        let achievement = achievements[i];
        let grid = document.getElementById("grid");
        let squares = grid.children;
        let squaresArray = [];
        let wildcardColor = null;
        for (let j = 0; j < squares.length; j++) {
            let square = squares[j];
            let color = square.style.backgroundColor;
            let colorIndex = colors.indexOf(color);
            squaresArray.push(colorIndex);
        }
        let condition = achievement.condition;
        let conditionMet = true;
        for (let j = 0; j < squaresArray.length; j++) {
            if (squaresArray[j] != condition[j] && condition[j] != -1) {
                conditionMet = false;
                break;
            }
            // If non-wildcard color is wildcard color, fail condition
            if (condition[j] != -1) {
                if (wildcardColor != null && squaresArray[j] == wildcardColor) {
                    conditionMet = false;
                    break;
                }
            }
            if (condition[j] == -1) {
                if (wildcardColor == null) {
                    wildcardColor = squaresArray[j];
                } else if (wildcardColor != squaresArray[j]) {
                    conditionMet = false;
                    break;
                }
            }
        }
        if (conditionMet) {
            if (achievement.unlocked == false) {
                achievement.unlocked = true;
                console.log("Achievement Unlocked: " + achievement.name);
                save();
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

// Classes
class Achievement {
    constructor(id, name, condition) {
        this.id = id;
        this.name = name;
        this.condition = condition;
        this.unlocked = false;
    }
}

// Achievements
let defaultAchievements = [
    new Achievement(1, "Void",
        [10,10,10,10,10,10,10,
        10,10,10,10,10,10,10,
        10,10,10,10,10,10,10,
        10,10,10,10,10,10,10,
        10,10,10,10,10,10,10,
        10,10,10,10,10,10,10,
        10,10,10,10,10,10,10]),
    new Achievement(2, "Pride",
        [1,2,3,4,5,6,7,
        2,3,4,5,6,7,8,
        3,4,5,6,7,8,9,
        4,5,6,7,8,9,1,
        5,6,7,8,9,1,2,
        6,7,8,9,1,2,3,
        7,8,9,1,2,3,4]),
    new Achievement(3, "The World Machine",
        [-1,-1,-1,-1,-1,-1,-1,
            -1,-1,3,3,3,-1,-1,
            -1,3,-1,-1,-1,3,-1,
            -1,3,-1,-1,-1,3,-1,
            -1,3,-1,-1,-1,3,-1,
            -1,-1,3,3,3,-1,-1,
            -1,-1,-1,3,-1,-1,-1])
]

// Generate Grid
for (let i = 0; i < 49; i++) {
    let square = document.createElement("div");
    square.className = "square";
    square.id = i+1;
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

// Log unlocked achievements
for (let i = 0; i < achievements.length; i++) {
    let achievement = achievements[i];
    if (achievement.unlocked) {
        console.log("Achievement Unlocked: " + achievement.name);
    }
}

// Disable Context Menu
document.addEventListener('contextmenu', event => event.preventDefault());