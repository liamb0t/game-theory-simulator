const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const width = 35;
const height = 35;
const cellSize = height * width;
const cols = Math.floor(canvas.width / width);
const rows = Math.floor(canvas.height / height);

const mouse = {
    x: undefined,
    y: undefined,
    buttons: undefined,
    scrollCounter: 2,
}

let generations = 0;
let u = 0.71;
let start = false;
let wanderX = 5;
let wanderY = 5;
let game = new PrisonersDilemma(); 
let drawMode = false;
let z = 1;
let popDensA = 0.5;
let popDensB = 0.5;
let popDensC = 0.5;
let popDensEmpty = 0;
let updateRule = 0;
let selfInteractions = false;
let transitionSpeed = 7;
let minRange = 0.25;
let maxRange = 0.75;

let colorDictRGB = {
    'Cu': [160, 205, 96], 
    'Du': [56, 24, 76],
    'wasCu': [31, 8, 2], 
    'wasDu': [206, 240, 157],
    'empty': [28, 100, 109],
    'rock': [160, 205, 96],
    'paper': [206, 240, 157],
    'scissors': [56, 24, 76],
    'A': [160, 205, 96],
    'B': [56, 24, 76],
    'C': [31, 8, 2], 
}

let colorDict = {
    'Cu': '#A0CD60', 
    'Du': '#38184C',
    'wasCu': '#1F0802', 
    'wasDu': '#CEF09D',
    'empty': '#1C646D', 
    'rock': '#1F0802', 
    'paper': '#CEF09D',
    'scissors': '#38184C',
    'A': '#A0CD60',
    'B': '#38184C',
    'C': '#1F0802',
}

let stratArray = game.stratArray;
let rectsArray = [];

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    mouse.buttons = event.buttons;
    //console.log(mouse)
})

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = 0; i < rectsArray.length; i++) {
        if (start) {
            game.playGame(rectsArray[i], 1);
        }
        rectsArray[i].update();
       
    }
    if (start) {
        for (var i = 0; i < rectsArray.length; i++) {
            if (rectsArray[i].strategy != 'empty') {
                game.updateStrategies(rectsArray[i], updateRule);
            }
        }
        //updating double buffer needs to be refactored
        for (var i = 0; i < rectsArray.length; i++) {
            rectsArray[i].strategy = rectsArray[i].strategyNew;
            //rectsArray[i].color = colorDict[rectsArray[i].strategy];
        }
        generations += 1;
    }
    document.querySelector('#gen-counter').innerHTML = generations;
}

function createGame() {
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
            let newRect = new Rect(x * width, y * height, width, height);
            rectsArray.push(newRect);
        }    
    }
    rectsArray.forEach(rect => {
        rect.findNeighbours();
    });
}

function updatePopulationDistribution(probabilities, strategies) {
    const pop_distribution = createDistribution(strategies, 
        probabilities, 
        10);
    rectsArray.forEach(rect => {
        let replacingStrat = game.stratArray[randomIndex(pop_distribution)];
        rect.strategy = replacingStrat
        rect.strategyNew = replacingStrat
        rect.color = colorDict[rect.strategy];
        rect.score = 0;
    });
}

createGame();
animate();

document.querySelector('#play-button').onclick = function() {
    start = true;
    z = 2;
}

document.querySelector('#pause-button').onclick = function() {
    start = false;
    z = 1;
}

document.querySelector('#payoff').oninput = function() {
    u = parseFloat(this.value);
    document.querySelector('#payoff-counter').innerHTML = u;
}

document.querySelector('#draw-button').onclick = function() {
    if (drawMode === false) {
        drawMode = true;
    }
    else {
        drawMode = false;
    }
}

document.querySelector('#neumann-button').onclick = function() {
    game.neighbourhoodType = 0;
}

document.querySelector('#moore-button').onclick = function() {
    game.neighbourhoodType = 1;
}
//pop density
document.querySelector('#pop-density-slider1').oninput = function() {
   popDensA = parseFloat(this.value);
   popDensB = parseFloat(1 - this.value);
   document.querySelector('#pop-density-slider2').value = popDensB;
   updatePopulationDistribution([popDensA, popDensB, popDensEmpty], game.stratArray);
}

document.querySelector('#pop-density-slider2').oninput = function() {
    popDensB = parseFloat(this.value);
    popDensA = parseFloat(1 - this.value);
    document.querySelector('#pop-density-slider1').value = popDensA;
    updatePopulationDistribution([popDensA, popDensB, popDensEmpty], game.stratArray);
}

//mousewheel scroll functions
window.addEventListener('wheel', function(event){
    if (drawMode === true) {
        if (event.deltaY < 0 && mouse.scrollCounter < stratArray.length) {
            mouse.scrollCounter += 1;
        }
        if (event.deltaY > 0 && mouse.scrollCounter > 0) {
            mouse.scrollCounter -= 1;
        }
        document.querySelector('#draw-mode-icon').src = `img/draw-mode-icon-${mouse.scrollCounter}.png`;
    }
})
    
document.querySelectorAll('.updateRulesBtns').forEach(function(button) {
    button.onclick = function() {
        updateRule = parseInt(button.value);
    }
})

document.querySelector('#selfInteractionsBtn').onclick = function() {
    if (selfInteractions === false) {
        selfInteractions = true;
    }
    else {
        selfInteractions = false;
    }
}

document.querySelector('#maxRangeCounter').onclick = function() {
    if (this.value > minRange) {
        maxRange = parseFloat(this.value);
    }
}
//reset the games game board
document.querySelector('#reset-button').onclick = function() {
    start = false;
    updatePopulationDistribution(game.distributions, game.stratArray)
}

document.querySelector('#minRangeCounter').onclick = function() {
    if (this.value < maxRange) {
        minRange = parseFloat(this.value);
    }
}

document.querySelector('#selectGameMenu').onchange = function() {
    if (this.value == 0) {
        transitionSpeed = 15;
        game = new PrisonersDilemma();
        stratArray = game.stratArray;
        updatePopulationDistribution(game.distributions, game.stratArray);
    }
    if (this.value == 1) {
        transitionSpeed = 30;
        game = new RPS();
        stratArray = game.stratArray;
        updatePopulationDistribution(game.distributions, game.stratArray);
    }
    if (this.value == 2) {
        transitionSpeed = 10;
        game = new SegregationModel();
        stratArray = game.stratArray;
        updatePopulationDistribution(game.distributions, game.stratArray);
    }
    start = false;
}