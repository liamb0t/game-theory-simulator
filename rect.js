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

        this.calcRGBcolor = function(transitionSpeed) {
            if (this.strategyNew == false) {
                return this.color;
            }
            let r = this.colorRGB[0];
            let g = this.colorRGB[1];
            let b = this.colorRGB[2];
            let newColor = colorDictRGB[this.strategyNew];
            
            if (this.colorRGB[0] > newColor[0] || this.colorRGB[1] > newColor[1] || this.colorRGB[2] > newColor[2]) {
                if (this.colorRGB[0] - 1 >= newColor[0] && this.colorRGB[0] != newColor[0]) {
                    r -= transitionSpeed;
                }
                if (this.colorRGB[1] - 1 >= newColor[1] && this.colorRGB[1] != newColor[1]) {
                    g -= transitionSpeed;
                
                }
                if (this.colorRGB[2] - 1 >= newColor[2] && this.colorRGB[2] != newColor[2]) {
                    b -= transitionSpeed;
                }
            }
            else if (this.colorRGB[0] < newColor[0] || this.colorRGB[1] < newColor[1] || this.colorRGB[2] < newColor[2]) {
                if (this.colorRGB[0] + 1 <= newColor[0] && this.colorRGB[0] != newColor[0]) {
                    r += transitionSpeed;
                }
                if (this.colorRGB[1] + 1 <= newColor[1] && this.colorRGB[1] != newColor[1]) {
                    g += transitionSpeed;
                
                }
                if (this.colorRGB[2] + 1 <= newColor[2] && this.colorRGB[2] != newColor[2]) {
                    b += transitionSpeed;
                }
            }
            this.colorRGB = [r, g, b];
            return `rgb(${r}, ${g}, ${b})`;
          }

        this.draw = function() {
            ctx.beginPath();
            if (document.querySelector('#selectGameMenu').value == 3) {
                let hue = Math.sqrt(this.proposal);
                let a = HSVtoRGB(hue % 1, 1, 1);
                ctx.fillStyle = `rgb(${a[0]}, ${a[1]}, ${a[2]})`;
            }
            else {
                ctx.fillStyle = this.calcRGBcolor(transitionSpeed);
            }
            //ctx.fillStyle = this.color;
            //ctx.shadowColor = '#1C646D';
            //ctx.shadowBlur = 25;
            //ctx.strokeStyle = 'black';
            //ctx.strokeRect(this.x, this.y, this.width, this.height);
            if (this.strategy === 'empty') {
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
            else {
                ctx.rect(this.x, this.y, this.width, this.height);
            }
            
            ctx.fill();
        }

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
                console.log(stratArray[mouse.scrollCounter]);
                this.strategyNew = stratArray[mouse.scrollCounter];
                this.score = 0;
            }
        }

        this.gameBoardSizeChange = function() {
            const newX= newBoard[this.index].x;
            const newY= newBoard[this.index].y;
            
        }
        
        this.findNeighbours = function(gameBoard) {
            let array = [];
                
            array.push(
                [this.x + width, this.y], 
                [this.x - width, this.y], 
                [this.x, this.y + height],
                [this.x , this.y - height],)
            gameBoard.forEach(rect => {
                array.forEach(coord => {
                    if (rect.x == coord[0] && rect.y == coord[1]) {
                        this.neighbours.push(rect);
                    }
                });
            });
            array = [];
            array.push(
                [this.x + width, this.y + height], 
                [this.x - width, this.y + height], 
                [this.x + width, this.y - height],
                [this.x - width, this.y - height])
            gameBoard.forEach(rect => {
                array.forEach(coord => {
                    if (rect.x == coord[0] && rect.y == coord[1]) {
                        this.neighbours.push(rect);
                    }
                });
            });
        }
    }  
}





