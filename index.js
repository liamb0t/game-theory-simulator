const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let width = 25;
let height = 25;
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
let u = 0.55;
let c = 0.5;
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
let mobilityProb;
let reproProb;
let selectionProb;
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
    'A': [242, 92, 5],
    'B': [217, 50, 50],
    'C': [13, 13, 13], 
    'proposer': [160, 205, 96],
    'responder': [56, 24, 76],
    'stag': [160, 205, 96],
    'hare': [56, 24, 76],
    'hawk': [160, 205, 96],
    'dove': [56, 24, 76],
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
    'A': '#F25C05',
    'B': '#D93232',
    'C': '#0D0D0D',
    'proposer': '#A0CD60', 
    'responder': '#38184C',
    'stag': '#A0CD60',  
    'hare': '#38184C',
    'hawk': '#A0CD60', 
    'dove': '#38184C',
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

document.querySelector('#neighbours-menu').onchange = function() {
    game.neighbourhoodType = parseInt(this.value);
}
 
//pop density + slider stuff
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

//segregation settings
document.querySelector('#seg-threshold').oninput = function() {
    game.threshold = parseFloat(this.value);
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
    else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (event.deltaY < 0 && (cols * rows) < 100000) {
            //scrolling up, increases cells
            if (height && width > 0) {
                newHeight -= 1;
                newWidth -= 1;
            }
        }
        if (event.deltaY > 0) {
            //scrolling down, decreases cells
            newHeight += 1;
            newWidth += 1;
        }
        cols = Math.floor(canvas.width/width);
        rows = Math.floor(canvas.height/height);
        
    }
})
    
document.querySelector('#update-rules-menu').onchange = function() {
    updateRule = parseInt(this.value);
}

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
    updatePopulationDistribution(game.distributions, game.stratArray);
}
//game select menu
document.querySelector('#selectGameMenu').onchange = function() {
    let p;
    if (this.value == 0) {
        transitionSpeed = 15;
        game = new PrisonersDilemma();
        p = document.querySelector('#game-info-pd')
    }
    if (this.value == 1) {
        transitionSpeed = 30;
        game = new RPS();
        p = document.querySelector('#game-info-rps')
    }
    if (this.value == 2) {
        transitionSpeed = 10;
        game = new SegregationModel();
        p = document.querySelector('#game-info-schelling')
    }
    if (this.value == 3) {
        transitionSpeed = 10;
        game = new Ultimatum();
        p = document.querySelector('#game-info-ulti')
    }
    //stag-hunt
    if (this.value == 4) {
        transitionSpeed = 10;
        game = new StagHunt();
        p = document.querySelector('#game-info-stag')
    }
    //hawk-dove
    if (this.value == 5) {
        transitionSpeed = 10;
        game = new HawkDove();
        p = document.querySelector('#game-info-hd')
    }
    start = false;
    stratArray = game.stratArray;
    updatePopulationDistribution(game.distributions, game.stratArray);
    document.querySelectorAll('.game-info').forEach(p => {
        p.style.display = 'none';
    });
    p.style.display = 'block';
}

document.querySelector('#open-page').onclick = function() {
    document.querySelector('#front-title').style.display = 'none';
    document.querySelector('#editor-container').style.display = 'block';
    document.querySelector('#play-container').style.display = 'block';
    game.distributions = [0.5, 0.5, 0];
    transitionSpeed = 5;
    updatePopulationDistribution(game.distributions, game.stratArray);
    
}
//main code
createGame();
updatePopulationDistribution(game.distributions, game.stratArray);
animate();