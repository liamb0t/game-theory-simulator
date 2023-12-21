# Evolutionary Game Theory Visualizer

I created this visualizer as a personal project, extending on work from my university studies. 
It serves as my first project to learn JavaScript. The visualizer focuses on famous games from game theory, 
where each cell on the grid represents an agent playing a game with its neighbors. 
After each generation, cells update their strategies based on their performance in the previous game. 
This dynamic process produces interesting patterns and visuals under certain conditions.

## The Games

## Prisoner's Dilemma ##
The classic game where cells can either cooperate or defect. In a standard two-player game, defection is the best strategy. However, in a population of players, the best strategy depends on the payoff structure.

### Rock Paper Scissors
Players cycle between strategies because there is no dominant strategy in rock-paper-scissors. This results in fascinating swirling patterns.

### Segregation
More famous in economics than in game theory, players choose to move to an empty space if they are dissatisfied with the percentage of similar types of players in their neighborhood.

### Ultimatum Game
*(Game description missing)*

### Stag Hunt
*(Game description missing)*

### Hawk Dove
*(Game description missing)*

## The Rules

Players can update their strategies based on three separate rules:
- **Deterministic Rule:** Players strictly copy the strategy of the player in their neighborhood who achieved the highest payoff in the previous generation.
- **Probabilistic Rule:** Players select a random player from their neighborhood and copy their strategy if the randomly chosen player has a higher payoff otherwise their strategy remains the same.
- **Biological Rule:** There are three types of update processes a strategy can evolve by: Reproduction (an empty cell is occupied by an adjacent strategy), Selection (a weaker cell adopts a stronger strategy), Exchange (two cells swap strategies). 

**Self-interaction:** In some games you can choose if players play the games with the themselves. For a example, a cooperator could interact with themselves, leading to a higher score.
## The World

The world is a simple 2-D grid, with each cell representing a player. 
Players have randomly assigned strategies at the beginning given the intial population distribution. 
Player neighborhoods consist of either the 4 (Von-Neumann) or 8 (Moore) adjacent cells next to them.
