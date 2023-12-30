class HawkDove {
    constructor() {
        //0 = NEUMANN NEIGHBOURHOOD, 1 = MOORE NEIGHBOURHOOD, 2 = ?
        this.stratArray = [
            'hawk',
            'dove',
            'empty'
        ]
        this.distributions = [0.5, 0.5];
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
            let neighbours = this.sliceNeighbours(rect);
            let score = 0;
            if (selfInteractions) {
                if (rect.strategy == 'hawk' ) {
                    score += (u - c)/2;
                }
                if (rect.strategy == 'dove' ) {
                    score += u/2;
                }
            }
            
            neighbours.forEach(neighbour => {
                //mutual cooperation
                if (neighbour.strategy == 'hawk' && rect.strategy == 'hawk') {
                    score += (u - c)/2;
                }
                //suckers payoff cooperation
                if (neighbour.strategy == 'dove' && rect.strategy == 'dove') {
                    score += u/2;
                }
                if (neighbour.strategy == 'dove' && rect.strategy == 'hawk') {
                    score += u;
                }
            });
            rect.score = score;
        }
        //updates double buffer strategies (***stratNew)
        this.updateRandomly = function(rect) {
            if (generations % 1 === 0) {
                let neighbours = this.sliceNeighbours(rect); 
                let neighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
            
                if (rect.score < neighbour.score) {
                    rect.strategyNew = neighbour.strategy;
                }
                else {
                    rect.strategyNew = rect.strategy;
                }
            }
        }

        this.updateDeterministic = function(rect) {
            if (generations % 1 === 0) {
                let bestStrat = undefined;
                let highScore = -999;
                const neighbours = this.sliceNeighbours(rect); 
                neighbours.forEach(neighbour => {
                    if (neighbour.score > highScore) {
                        highScore = neighbour.score;
                        bestStrat = neighbour.strategy;
                    }
                });
                if (rect.score < highScore) {
                    rect.strategyNew = bestStrat;
                }
            }
        }

        this.updateBiological = function(rect) {
            let probabilityArray = [0.1, 0.5, 0.4];
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
                    neighbour.strategyNew = player.strategy;
                }
            }
            if (decision === 2) {
                //exchange!
                if (player.strategy != 'empty' && neighbour.strategy != 'empty') {
                    const neighbourStrat = neighbour.strategy;
                    neighbour.strategy = player.strategy;
                    player.strategy = neighbourStrat;
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
        }
    }
}