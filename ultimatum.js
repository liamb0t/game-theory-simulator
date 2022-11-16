class Ultimatum {

    constructor() {
        this.stratArray = [
            'proposer',
            'responder',
            'empty',
        ]
        this.distributions = [0.4, 0.4, 0.2];
        this.bioSettings = [0.1, 0.5, 0.4];
        this.sliceNeighbours = function(rect) {
            let neighbours = undefined;
            if (neighbourhoodType === 0) {
                neighbours = rect.neighbours.slice(0, 4);
            }
            else if (neighbourhoodType === 1) {
                neighbours = rect.neighbours;
            }
            return neighbours;
        }
        
        this.playGame = function(rect) {
            let score = 0;
            const player = rectsArray[Math.floor(Math.random() * rectsArray.length)];
            if (selfInteractions) {
                if (player.proposal >= player.acceptance) {
                    score += 1 - player.proposal;
                }
            }
            player.neighbours.forEach(neighbour => {
                if (player.proposal >= neighbour.acceptance) {
                    neighbour.score += player.proposal;
                    score += 1 - player.proposal;
                }
            });
            player.score += score;
        };

        this.updateDeterministic = function(rect) {
            if (generations % 1 === 0) {
                let bestPlayer = undefined;
                let highScore = 0;
                const neighbours = this.sliceNeighbours(rect); 
                neighbours.forEach(neighbour => {
                    if (neighbour.score >= highScore) {
                        highScore = neighbour.score;
                        bestPlayer = neighbour;
                    }
                });
                if (rect.score < highScore) {
                    rect.proposal = bestPlayer.proposal;
                    rect.acceptance = bestPlayer.acceptance
                }
            }
        }

        this.updateRandomly = function(rect) {
            if (generations % 1 === 0) {
                let neighbours = this.sliceNeighbours(rect); 
                let neighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
            
                if (rect.score < neighbour.score) {
                    rect.proposal = neighbour.proposal;
                    rect.acceptance = neighbour.acceptance;
                }
                else {
                    rect.strategyNew = rect.strategy;
                }
            }
        }

        this.updateBiological = function(rect) {
            let probabilityArray = this.bioSettings;
            const distribution = createDistribution([0, 1, 2], 
                probabilityArray, 
                10);
            const decision = randomIndex(distribution);
            let player = rectsArray[Math.floor(Math.random() * rectsArray.length)]
            let neighbours = this.sliceNeighbours(player); 
            let neighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
           
            if (decision === 0) {
                //selection!
                if (player.score > neighbour.score && neighbour.strategy != 'empty' && player.strategy != 'empty') {
                    neighbour.strategy = 'empty';
                    neighbour.strategyNew = 'empty';
                }
            }
            if (decision === 1) {
                //reproduction!
                if (player.strategy != 'empty' && neighbour.strategy === 'empty') {
                    neighbour.proposal = player.proposal;
                    neighbour.acceptance = player.acceptance;
                }
            }
            if (decision === 2) {
                //exchange!
                if (player.strategy != 'empty' && neighbour.strategy != 'empty') {
                    const neighbourProp = neighbour.proposal;
                    const neighbourAcc = neighbour.acceptance;
                    neighbour.proposal = player.proposal;
                    neighbour.acceptance = player.acceptance;
                    player.proposal = neighbourProp;
                    player.acceptance = neighbourAcc;
                }
            }
        }

        this.updateStrategies = function(rect, updateRule) {
            if (updateRule === 0) {
                this.updateDeterministic(rect);
            }
            if (updateRule === 1) {
                this.updateRandomly(rect);
            }
            if (updateRule === 2) {
                this.updateBiological(rect);
            }
            //if noise
            if (r) {
                const r1 = randomFloat(-r, r);
                const r2 = randomFloat(-r, r);
                rect.proposal += r1;
                rect.acceptance += r2
            }
        }
    }    
}