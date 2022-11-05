class SegregationModel {
    constructor() {
        //0 = NEUMANN NEIGHBOURHOOD, 1 = MOORE NEIGHBOURHOOD, 2 = ?
        this.neighbourhoodType = 0;
        this.stratArray = [
            'A',
            'B',
            'C',
            'empty'
        ]
        this.distributions = [0.3, 0.3, 0.35, 0.05];
        this.threshold = 0.5;

        this.sliceNeighbours = function(rect) {
            let neighbours = undefined;
            if (this.neighbourhoodType === 0) {
                neighbours = rect.neighbours.slice(0, 4);
            }
            else if (this.neighbourhoodType === 1) {
                neighbours = rect.neighbours;
            }
            return neighbours;
        }

        this.playGame = function(rect) {
            rect.counter = 0;
            const neighbours = this.sliceNeighbours(rect);
            neighbours.forEach(neighbour => {
                if (neighbour.strategy === rect.strategy) {
                    rect.counter += 1;
                }
            });
        }

        this.updateStrategies = function(rect, updateRule) {
            const player = rectsArray[Math.floor(Math.random() * rectsArray.length)]
            const neighbours = this.sliceNeighbours(player);
            if (player.counter/neighbours.length < this.threshold) {
                let newSpot = rectsArray[Math.floor(Math.random() * rectsArray.length)];
                while (newSpot.strategy !== 'empty') {
                    newSpot = rectsArray[Math.floor(Math.random() * rectsArray.length)];
                }
                newSpot.strategy = player.strategy;
                newSpot.strategyNew = player.strategy;
                player.strategy = 'empty';
                player.strategyNew = 'empty';
            }
        }

        this.findEmptySpots = function(arr) {
            let emptySpots = [];
            rectsArray.forEach(rect => {
                if (rect.strategy === 'empty') {
                    emptySpots.push(rect);
                }
            });
            return emptySpots;
        }
    }
}