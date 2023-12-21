class Rect {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.width = width - 5;
        this.height = height - 5;
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

        this.calcRGBcolor = transitionSpeed => {
            if (!this.strategyNew) {
                return;
            }

            const [r, g, b] = this.colorRGB;
            const newColor = colorDictRGB[this.strategyNew];

            this.colorRGB = [r + (newColor[0] - r > 0 ? 1 : -1) * transitionSpeed,
                             g + (newColor[1] - g > 0 ? 1 : -1) * transitionSpeed,
                             b + (newColor[2] - b > 0 ? 1 : -1) * transitionSpeed];

            return `rgb(${this.colorRGB[0]}, ${this.colorRGB[1]}, ${this.colorRGB[2]})`;
        };

        this.draw = () => {
            ctx.beginPath();
            if (document.querySelector('#selectGameMenu').value == 3) {
                const hue = Math.sqrt(this.proposal);
                const [r, g, b] = xtoRGB(hue % 1, 1, 1);
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            } else {
                ctx.fillStyle = this.calcRGBcolor(transitionSpeed);
            }
    
            if (this.strategy === 'empty') {
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            } else {
                ctx.rect(this.x, this.y, this.width, this.height);
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
                    if (this.height > height - 5 && this.width > width - 5) {
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
            if (drawMode === true) {
                this.handleClick();
            }
            //update cell
            this.draw();
        }

        this.handleClick = function() {
            if (mouse.buttons !== 1) return;

            if ((mouse.x >= this.x && mouse.x <= this.x + this.width) && (mouse.y >= this.y && mouse.y <= this.y + this.height)) {
                //console.log('width', mouse.x, this.x + this.width);
                //console.log('height', mouse.y, this.y + this.height)
               
                this.strategy = stratArray[mouse.scrollCounter];
                this.strategyNew = stratArray[mouse.scrollCounter];
                this.score = 0;
            }
        }

        this.gameBoardSizeChange = function() {
            const newX= newBoard[this.index].x;
            const newY= newBoard[this.index].y;
        }
        
        this.findNeighbours = function(gameBoard) {
            const offsets = [
                [width, 0],
                [-width, 0],
                [0, height],
                [0, -height],
                [width, height],
                [-width, height],
                [width, -height],
                [-width, -height],
            ];
            
            for (const [offsetX, offsetY] of offsets) {
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





