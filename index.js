const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let width = 7;
let height = 7;
let newWidth = 25
let newHeight = 25
let cellSize = height * width;
let cols = Math.floor(canvas.width / width);
let rows = Math.floor(canvas.height / height);

const mouse = {
    x: undefined,
    y: undefined,
    buttons: undefined,
    target: undefined
}

let generations = 0;
let u = 1.75;
let c = 0.5;
let start = false;
let wanderX = 5;
let wanderY = 5;
let game = new PrisonersDilemma(); 
let drawMode = false;
let z = 0.2;
let popDensA = 0.5;
let popDensB = 0.5;
let popDensC = 0;
let popDensEmpty = 0;
let mobilityProb;
let reproProb;
let selectionProb;
let updateRule = 0;
let selfInteractions = false;
let transitionSpeed = 1
let minRange = 0.25;
let maxRange = 0.75;
let neighbourhoodType = 0;
let r = 0.005;
let displayStyle = 2
let borderSize = 0
let thingToDrawCounter = 0

let colorDictRGB = {
    'Cu': [160, 205, 96], 
    'Du': [56, 24, 76],
    'wasCu': [31, 8, 2], 
    'wasDu': [206, 240, 157],
    'empty': [28, 100, 109],
    'rock': [242, 5, 116],
    'paper': [4, 217, 217],
    'scissors': [171, 217, 4],
    'A': [242, 92, 5],
    'B': [217, 50, 50],
    'C': [13, 13, 13], 
    'proposer': [160, 205, 96],
    'responder': [56, 24, 76],
    'stag': [160, 205, 96],
    'hare': [56, 24, 76],
    'hawk': [240, 7, 7],
    'dove': [242, 242, 242],
}

let colorDict = {
    'Cu': '#A0CD60', 
    'Du': '#38184C',
    'wasCu': '#1F0802', 
    'wasDu': '#CEF09D',
    'empty': '#1C646D', 
    'rock': '#F20574', 
    'paper': '#04D9D9',
    'scissors': '#ABD904',
    'A': '#F25C05',
    'B': '#D93232',
    'C': '#0D0D0D',
    'proposer': '#A0CD60', 
    'responder': '#38184C',
    'stag': '#A0CD60',  
    'hare': '#38184C',
    'hawk': '#f00707', 
    'dove': '#F4F4F4',
}

let popData = {
    'Cu': 0, 
    'Du': 0,
    'wasCu': 0, 
    'wasDu': 0,
    'empty': 0,
    'rock': 0,
    'paper': 0,
    'scissors': 0,
    'A': 0,
    'B': 0,
    'C': 0, 
    'proposer': 0,
    'responder': 0,
    'stag': 0,
    'hare': 0,
    'hawk': 0,
    'dove': 0,
}

let stratArray = game.stratArray;
let rectsArray = [];

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    mouse.buttons = event.buttons;
})

window.addEventListener('click', function(event) {
    mouse.target = event.target
})

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = 0; i < rectsArray.length; i++) {
        if (start) {
            game.playGame(rectsArray[i], 1);
        }
        rectsArray[i].update();
        popData[rectsArray[i].strategy] = 0;
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
            popData[rectsArray[i].strategy] += 1;
            //rectsArray[i].color = colorDict[rectsArray[i].strategy];
        }
        generations += 1;
    }
    if (generations % 5 === 0) {
        document.querySelector('#coop-counter').innerHTML = (popData[game.stratArray[0]]/(cols*rows) * 100).toFixed(2);
        document.querySelector('#defect-counter').innerHTML = (popData[game.stratArray[1]]/(cols*rows) * 100).toFixed(2);
        document.querySelector('#generation-counter').innerHTML = generations
        document.querySelector('#stat-counter-3').innerHTML = (100 - ((popData[game.stratArray[0]]/(cols*rows) * 100) + (popData[game.stratArray[1]]/(cols*rows) * 100))).toFixed(2)
    }
}

function createGame() {
    let array = [];
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
            let newRect = new Rect(x * width, y * height, width, height);
            array.push(newRect);
        }    
    }
    array.forEach(rect => {
        rect.findNeighbours(array);
    });
    rectsArray = array;
}

function updatePopulationDistribution(probabilities, strategies) {
    const pop_distribution = createDistribution(strategies, 
        probabilities, 
        10);
    rectsArray.forEach(rect => {
        let randomStrat = game.stratArray[randomIndex(pop_distribution)];
        rect.strategy = randomStrat
        rect.strategyNew = randomStrat
        rect.color = colorDict[rect.strategy];
        rect.score = 0;
        rect.proposal = parseFloat(Math.random().toFixed(2));
        rect.acceptance = parseFloat(Math.random().toFixed(2));
    });
}

//start game button
document.querySelector('#play-button').onclick = function() {
    if (document.querySelector('#selectGameMenu').value == 2 && document.querySelector('#tri-slider4').value === 0) {
        window.alert("There needs to be at least one empty cell!");
    }   
    else {
        start = true;
        z = 0.52;
    }
}

document.querySelector('#pause-button').onclick = function() {
    start = false;
    z = 0.2;
}

document.querySelector('#payoff').oninput = function() {
    u = parseFloat(this.value);
}

document.querySelector('#cost').oninput = function() {
    c = parseFloat(this.value);
}

document.querySelector('#draw-button').onclick = function() {

    if (thingToDrawCounter + 1 < game.stratArray.length) {
        thingToDrawCounter += 1
    }
    else {
        thingToDrawCounter = 0
    }

    console.log(colorDictRGB[stratArray[thingToDrawCounter]])
    document.querySelector('#draw-square').style.backgroundColor = colorDict[game.stratArray[thingToDrawCounter]]
}

document.querySelector('#neighbours-menu').onchange = function() {
    neighbourhoodType = parseInt(this.value);
}
 
//pop density + slider stuff
document.querySelector('#pop-density-slider1').oninput = function() {
   popDensA = parseFloat(this.value);
   popDensB = parseFloat(1 - this.value - popDensEmpty);
   document.querySelector('#pop-density-slider2').value = popDensB;
   updatePopulationDistribution([popDensA, popDensB, popDensEmpty], game.stratArray);
}

document.querySelector('#pop-density-slider2').oninput = function() {
    popDensB = parseFloat(this.value);
    popDensA = parseFloat(1 - this.value - popDensEmpty);
    document.querySelector('#pop-density-slider1').value = popDensA;
    updatePopulationDistribution([popDensA, popDensB, popDensEmpty], game.stratArray);
}

document.querySelector('#pop-density-slider3').oninput = function() {
    let delta = parseFloat(popDensEmpty - this.value);
    popDensEmpty = parseFloat(this.value);
    popDensA += delta/2;
    popDensB += delta/2;
    document.querySelector('#pop-density-slider1').value = popDensA;
    document.querySelector('#pop-density-slider2').value = popDensB;
    updatePopulationDistribution([popDensA, popDensB, popDensEmpty], game.stratArray);
}

//slider settings for biological stuff
const slider1 = document.querySelector('#bio-slider1');
const slider2 = document.querySelector('#bio-slider2');
const slider3 = document.querySelector('#bio-slider3');

slider1.oninput = function() {
    slider2.value = 1 - (parseFloat(this.value) + parseFloat(slider3.value));
    slider3.value = 1 - (parseFloat(this.value) + parseFloat(slider2.value));
    game.bioSettings = [parseFloat(slider1.value), parseFloat(slider2.value), parseFloat(slider3.value)];
}

slider2.oninput = function() {
    slider1.value = 1 - (parseFloat(this.value) + parseFloat(slider3.value));
    slider3.value = 1 - (parseFloat(this.value) + parseFloat(slider1.value));
    game.bioSettings = [parseFloat(slider1.value), parseFloat(slider2.value), parseFloat(slider3.value)];
}

slider3.oninput = function() {
    slider1.value = 1 - (parseFloat(this.value) + parseFloat(slider2.value));
    slider2.value = 1 - (parseFloat(this.value) + parseFloat(slider1.value));
    game.bioSettings = [parseFloat(slider1.value), parseFloat(slider2.value), parseFloat(slider3.value)];
}

//slider settings for tri input games
const slider4 = document.querySelector('#tri-slider1');
const slider5 = document.querySelector('#tri-slider2');
const slider6 = document.querySelector('#tri-slider3');
const slider7 = document.querySelector('#tri-slider4');

slider4.oninput = function() {
    slider5.value = parseFloat(1 - this.value - slider6.value - popDensEmpty);
    slider6.value = parseFloat(1 - this.value - slider5.value - popDensEmpty);
    popDensA = parseFloat(slider4.value);
    popDensB = parseFloat(slider5.value);
    popDensC = parseFloat(slider6.value);
    updatePopulationDistribution([popDensA, popDensB, popDensC, popDensEmpty], game.stratArray);
}

slider5.oninput = function() {
    slider4.value = parseFloat(1 - this.value - slider6.value - popDensEmpty);
    slider6.value = parseFloat(1 - this.value - slider4.value - popDensEmpty);
    popDensA = parseFloat(slider4.value);
    popDensB = parseFloat(slider5.value);
    popDensC = parseFloat(slider6.value);
    updatePopulationDistribution([popDensA, popDensB, popDensC, popDensEmpty], game.stratArray);
}

slider6.oninput = function() {
    slider4.value = parseFloat(1 - this.value - slider5.value - popDensEmpty);
    slider5.value = parseFloat(1 - this.value - slider4.value - popDensEmpty);
    popDensA = parseFloat(slider4.value);
    popDensB = parseFloat(slider5.value);
    popDensC = parseFloat(slider6.value);
    updatePopulationDistribution([popDensA, popDensB, popDensC, popDensEmpty], game.stratArray);
}
//controls empty cells for three strat games
slider7.oninput = function() {
    let delta = parseFloat(popDensEmpty - this.value);
    popDensEmpty = parseFloat(this.value);
    popDensA += delta/3;
    popDensB += delta/3;
    popDensC += delta/3;
    slider4.value = popDensA;
    slider5.value = popDensB;
    slider6.value = popDensC;
    updatePopulationDistribution([popDensA, popDensB, popDensC, popDensEmpty], game.stratArray);
}

//segregation settings
document.querySelector('#seg-threshold').onchange = function() {
    game.threshold = parseFloat(this.value)/100;
}
//noise parameter
document.querySelector('#noise').onchange = function() {
    r = parseFloat(this.value);
}

document.querySelector('#update-rules-menu').onchange = function() {
    updateRule = parseInt(this.value);
    if (updateRule === 2) {
        document.querySelector('#bio-proportions').style.display = 'block';
    }
    else {
        document.querySelector('#bio-proportions').style.display = 'none';
    }
}
//self interactions button
document.querySelector('#selfInteractionsBtn').onclick = function() {
    if (selfInteractions === false) {
        selfInteractions = true;
    }
    else {
        selfInteractions = false;
    }
}

//reset the games game board
document.querySelector('#reset-button').onclick = function() {
    start = false;
    generations = 0
    z = 0.2;
    if (game.stratArray.length === 3) {
        updatePopulationDistribution([popDensA, popDensB, popDensEmpty], game.stratArray);
    }
    else {
        updatePopulationDistribution([popDensA, popDensB, popDensC, popDensEmpty], game.stratArray);
    }
}
//game select menu
document.querySelector('#selectGameMenu').onchange = function() {
    if (this.value != 100) {
        const selectMenu = document.querySelector('#selectGameMenu');
        selectMenu[0].style.display = 'none';
    }
    let config;
    if (this.value == 0) {
        game = new PrisonersDilemma();
        config = loadConfig('pd')
    }
    if (this.value == 1) {
        game = new RPS();
        config = loadConfig('rps')
    }
    if (this.value == 2) {
        game = new SegregationModel();
        config = loadConfig('segregation')
    }
    if (this.value == 3) {
        game = new Ultimatum();
        config = loadConfig('ulti')
    }
    if (this.value == 4) {
        game = new StagHunt();
        config = loadConfig('stag')
    }
    //hawk-dove
    if (this.value == 5) {
        game = new HawkDove();
        config = loadConfig('hd')
    }
    start = false;
    updatePopulationDistribution(config, game.stratArray);
    generations = 0
    document.querySelector('#draw-square').style.backgroundColor = colorDict[game.stratArray[0]]
    thingToDrawCounter = 0
}

//change colors of a thing
function colors(colorPicker) {
    let i = 0;
    document.querySelectorAll(colorPicker).forEach(color => {
        color.dataset.strat = game.stratArray[i];
        color.value = colorDict[color.dataset.strat];
        color.onchange = function() {
            const newColor = hexToRGB(color.value);
            colorDictRGB[color.dataset.strat] = newColor;
        }
        i += 1;
    });
}
//change the size of the grid
document.querySelector('#cols-input').onchange = function() {
    width = parseInt(canvas.width/this.value);
    cols = Math.floor(canvas.width / width);
    createGame();
    updatePopulationDistribution(game.distributions, game.stratArray);
}

document.querySelector('#rows-input').onchange = function() {
    height = parseInt(canvas.height/this.value);
    rows = Math.floor(canvas.height / height);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    createGame();
    updatePopulationDistribution(game.distributions, game.stratArray);
}

document.querySelector('#center-page span').onclick = function() {
    document.querySelector('canvas').style.display = 'block'
    document.querySelector('#front-title').style.display = 'none';
    document.querySelector('#editor-container').style.display = 'block';
    document.querySelector('#play-container').style.display = 'block';
    updatePopulationDistribution(game.distributions, game.stratArray);
    
}
//main code
game.distributions = [0, 0, 1];
createGame();
updatePopulationDistribution(game.distributions, game.stratArray);
animate();

//code for changing the display 

document.querySelector('#display-style').onchange = function() {
    displayStyle = parseInt(this.value)
    if (displayStyle === 1) {
        borderSize = 0
        z = 0
    }
    else {
        borderSize = -5
        z = 0.2
    }
}

document.querySelector('#cellsize-slider').oninput = function() {
    borderSize = parseInt(this.value)
}

document.querySelector('#blend-slider').oninput = function() {
    transitionSpeed = this.value
}

document.querySelector('#toggle-stats-btn').onchange = function() {
    const statsDisplay = document.querySelector('#stats-container')
    statsDisplay.style.display === 'block' ? statsDisplay.style.display = 'none' : statsDisplay.style.display = 'block'
}

// document.querySelector('#toggle-editor').onclick = function() {
    
//     const isToggled = this.dataset.isopen
//     const editor = document.querySelector('#editor-container')

//     if (isToggled === 'true') {
//         editor.style.display = 'none'
//         this.dataset.isopen = 'false'
//     }
//     else if (isToggled === 'false') {
//         editor.style.display = 'block'
//         this.dataset.isopen = 'true'
//     }
// }