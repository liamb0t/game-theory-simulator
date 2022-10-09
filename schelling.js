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
        this.distributions = [0.3, 0.3, 0.3, 0.1];

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
            const neighbours = this.sliceNeighbours(rect);
            if (rect.counter < neighbours.length/2) {
                let newSpot = rectsArray[Math.floor(Math.random() * rectsArray.length)];
                if (newSpot.strategy === 'empty') {
                    newSpot.strategyNew = rect.strategy;
                    rect.strategyNew = 'empty';
                }
                else {
                    rect.strategyNew = rect.strategy;
                }
            }
        }
    }
}