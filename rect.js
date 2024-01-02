class Rect {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.width = width;
        this.height = height;
        this.maxHeight = height;
        this.maxWidth = width;
        this.strategy = stratArray[Math.floor(Math.random() * (stratArray.length - 1))];
        this.neighbours = [];
        this.score = 0;
        this.strategyNew = false;
        this.color = colorDict[this.strategy];
        this.colorRGB = colorDictRGB[this.strategy];
        this.counter = 0;
        this.proposal = parseFloat(Math.random().toFixed(2));
        this.acceptance = parseFloat(Math.random().toFixed(2));
        this.wasDu = false
        this.wasCu = false

        this.calcRGBcolor = transitionSpeed => {
            if (!this.strategyNew) {
                return;
            }
            
            const [r1, g1, b1] = this.colorRGB;
            const [r2, g2, b2] = colorDictRGB[this.strategyNew];
            
            this.colorRGB = [
                Math.round((r2 - r1) * transitionSpeed + r1), 
                Math.round((g2 - g1) * transitionSpeed + g1),
                Math.round((b2 - b1) * transitionSpeed + b1)
            ]

            return `rgb(${this.colorRGB[0]}, ${ this.colorRGB[1]}, ${ this.colorRGB[2]})`;
        };

        this.draw = () => {
            ctx.beginPath();
            if (document.querySelector('#selectGameMenu').value == 3) {
                const hue = Math.sqrt(this.proposal);
                const [r, g, b] = HSVtoRGB(hue % 1, 1, 1);
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            } else {
                ctx.fillStyle = this.calcRGBcolor(transitionSpeed);
            }
    
            if (this.strategy === 'empty') {
                
                if (displayStyle === 1) {
                    ctx.strokeRect(this.originalX, this.originalY, this.width + borderSize, this.height + borderSize);
                }
                else {
                    ctx.strokeRect(this.x, this.y, this.width + borderSize, this.height + borderSize);
                }
               
            } else {
                if (displayStyle === 1) {
                    ctx.rect(this.originalX, this.originalY, this.width + borderSize, this.height + borderSize);
                }
                else {
                    ctx.rect(this.x, this.y, this.width + borderSize, this.height + borderSize);
                }
            }
            ctx.fill();
        };

        this.update = function() {
        
            //interactivity

            if (this.height > newHeight && this.width > newWidth) {
                this.height -= 0.3;
                this.width -= 0.3;
            }
            if (drawMode === false) {
                if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
                    if (this.height < height && this.width < width) {
                        this.height += 1;
                        this.width += 1;
                    }
                }
                else {
                    if (this.height > height - borderSize && this.width > width - borderSize) {
                        this.height -= 0.3;
                        this.width -= 0.3;
                    }
                }
            }

            let dx = (Math.random() - 0.5) * z;
            let dy = (Math.random() - 0.5) * z;
            
            if (this.x + dx < this.originalX + wanderX && this.x + dx > this.originalX - wanderX) {
                this.x += dx;
            }
            if (this.y + dy < this.originalY + wanderY && this.y + dy > this.originalY - wanderY) {
                this.y += dy;
            }
            //drawing cells with mouse
            this.handleClick();
            
            //update cell
            this.draw();
        }

        this.handleClick = function() {

            if (mouse.target != canvas) {
                return
            }

            if (mouse.buttons !== 1) return;
        
            // Adjust the clickable area by adding or subtracting values
            var expandedX = this.x - 15; // Adjust as needed
            var expandedY = this.y - 15; // Adjust as needed
            var expandedWidth = this.width + 50; // Adjust as needed
            var expandedHeight = this.height + 50; // Adjust as needed
        
            if (
                (mouse.x >= expandedX && mouse.x <= expandedX + expandedWidth) &&
                (mouse.y >= expandedY && mouse.y <= expandedY + expandedHeight)
            ) {
                this.strategy = game.stratArray[thingToDrawCounter];
                this.strategyNew = game.stratArray[thingToDrawCounter];
                this.score = 0;
            }
        }
        

        this.gameBoardSizeChange = function() {
            const newX= newBoard[this.index].x;
            const newY= newBoard[this.index].y;
        }
        
        this.findNeighbours = function(gameBoard) {
            const directions = [
                [width, 0],
                [-width, 0],
                [0, height],
                [0, -height],
                [width, height],
                [-width, height],
                [width, -height],
                [-width, -height],
            ];
            
            for (const [offsetX, offsetY] of directions) {
                const targetX = this.x + offsetX;
                const targetY = this.y + offsetY;
        
                const neighbor = gameBoard.find(rect => rect.x === targetX && rect.y === targetY);
        
                if (neighbor) {
                    this.neighbours.push(neighbor);
                }
            }
        };
    }  
}





