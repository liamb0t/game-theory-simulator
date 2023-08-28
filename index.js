const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let width = 15;
let height = 15;
let newWidth = 25
let newHeight = 25
let cellSize = height * width;
let cols = Math.floor(canvas.width / width);
let rows = Math.floor(canvas.height / height);

const mouse = {
    x: undefined,
    y: undefined,
    buttons: undefined,
    scrollCounter: 2,
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
let transitionSpeed = 59;
let minRange = 0.25;
let maxRange = 0.75;
let neighbourhoodType = 0;
let r = 0.005;

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
    'hawk': [217, 37, 37],
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
    'hawk': '#F2F2F2', 
    'dove': '##D92525',
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
        let replacingStrat = game.stratArray[randomIndex(pop_distribution)];
        rect.strategy = replacingStrat
        rect.strategyNew = replacingStrat
        rect.color = colorDict[rect.strategy];
        rect.score = 0;
        rect.proposal = parseFloat(Math.random().toFixed(2));
        rect.acceptance = parseFloat(Math.random().toFixed(2));
    });
}
//start game button
document.querySelector('#play-button').onclick = function() {
    if (document.querySelector('#selectGameMenu').value == 2 && popDensEmpty === 0) {
        window.alert("There needs to be at least one empty cell!");
    }
    else {
        start = true;
        z = 2;
    }
}

document.querySelector('#pause-button').onclick = function() {
    start = false;
    z = 1;
}

document.querySelector('#payoff').oninput = function() {
    u = parseFloat(this.value);
}

document.querySelector('#cost').oninput = function() {
    c = parseFloat(this.value);
}

document.querySelector('#draw-button').onclick = function() {
    if (drawMode === false) {
        drawMode = true;
    }
    else {
        drawMode = false;
    }
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
//change the size of a cell
document.querySelector('#cellsize-slider').oninput = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if ((cols * rows) < 100000) {
        if (height && width > 0) {
            newHeight -= 1;
            newWidth -= 1;
        }
    }
    cols = Math.floor(canvas.width/width);
    rows = Math.floor(canvas.height/height);
}

//segregation settings
document.querySelector('#seg-threshold').onchange = function() {
    game.threshold = parseFloat(this.value)/100;
}
//noise parameter
document.querySelector('#noise').onchange = function() {
    r = parseFloat(this.value);
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
    z = 1;
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
    if (this.value == 0) {
        game = new PrisonersDilemma();
        loadConfig('pd')
    }
    if (this.value == 1) {
        game = new RPS();
        loadConfig('rps')
    }
    if (this.value == 2) {
        game = new SegregationModel();
        loadConfig('segregation')
    }
    if (this.value == 3) {
        game = new Ultimatum();
        loadConfig('ulti')
    }
    if (this.value == 4) {
        game = new StagHunt();
        loadConfig('staghunt')
    }
    //hawk-dove
    if (this.value == 5) {
        game = new HawkDove();
        loadConfig('hd')
    }

    start = false;
    updatePopulationDistribution(game.distributions, game.stratArray);
    colors();
}

//change colors of a thing
function colors() {
    let i = 0;
    document.querySelectorAll('.colorpicker').forEach(color => {
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
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    createGame();
    updatePopulationDistribution(game.distributions, game.stratArray);
}

document.querySelector('#rows-input').onchange = function() {
    height = parseInt(canvas.height/this.value);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    createGame();
    updatePopulationDistribution(game.distributions, game.stratArray);
}

document.querySelector('#open-page').onclick = function() {
    document.querySelector('#front-title').style.display = 'none';
    document.querySelector('#editor-container').style.display = 'block';
    document.querySelector('#play-container').style.display = 'block';
    transitionSpeed = 5;
    updatePopulationDistribution(game.distributions, game.stratArray);
    
}
//main code
game.distributions = [0, 0, 1];
createGame();
updatePopulationDistribution(game.distributions, game.stratArray);
animate();