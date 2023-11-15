configSettings = {
    'pd': {
        'info':`
        Two criminals, Alice and Bob, are arrested. Separated by police, each is given two options:
        1. Betray the other (Defector): If one betrays and the other stays silent, the betrayer goes free while the other gets 10 years.
        2. Stay silent (Cooperator): If both stay silent, they each get 1 year.
        3. If both betray, they each get 3 years.
        
        Individually, betrayal seems the best option. Collectively, staying silent is optimal. 
        The Prisoner's Dilemma illustrates the tension between individual incentives and collective well-being. 
        In many real-world situations, people face similar dilemmas where what's best for an individual might not be best for the group, and vice versa.
        `,
        'payoff': 0.75,
        'strats' : [
            'Cooperator',
            'Defector',
            'none'
        ],
        'population': [0.33, 0.33, 0.34, 0],
        'transitionSpeed': 15,
        'selfinteract': true,
        'display': {
            'editor': 'block',
            'util': 'block',
            'seg': 'none',
            'input-bi': 'block',
            'input-tri': 'none',
            'cost': 'none',
        }
        ,
    },
    'rps': {
        'info':`Players occupy lattice points and play Rock, Paper, or Scissors.
        1. Rock crushes Scissors.
        2. Scissors cuts Paper.
        3. Paper covers Rock.

        Each move defeats one and is defeated by another. No single move is dominant; the optimal choice depends on predicting an opponent's move. It exemplifies the unpredictability in zero-sum games.
        
        `,
        'payoff': 1.3,
        'strats' : [
            'Rock',
            'Paper',
            'Scissors'
        ],
        'population': [0.33, 0.33, 0.34, 0],
        'transitionSpeed': 30,
        'display': {
            'editor': 'block',
            'util': 'none',
            'seg': 'none',
            'input-bi': 'none',
            'input-tri': 'block',
            'cost': 'none',
        }
        ,
    },
    'segregation': {
        'info':`Individuals of two types (e.g., A & B) are placed on a grid. Each individual prefers to have at least a certain percentage of their own type as neighbors. However, they don't necessarily prefer complete segregation.

        When individuals find themselves uncomfortable (i.e., their neighborhood has too many of the other type), they move to a new spot.
        
        Surprisingly, even mild preferences for like-neighbors can lead to significant large-scale segregation. This model illustrates how small individual biases can result in unintended collective outcomes.`
        ,
        'payoff': 1.3,
        'strats' : [
            'Rock',
            'Paper',
            'Scissors'
        ],
        'population': [0.33, 0.33, 0.24, 0.10],
        'transitionSpeed': 10,
        'display': {
            'editor': 'none',
            'util': 'none',
            'seg': 'block',
            'input-bi': 'none',
            'input-tri': 'block',
            'cost': 'none',
        }
        ,
    },
    'ulti': {
        'info':'The prisoners dilemma is an interesting game',
        'payoff': 1.3,
        'strats' : [
            'Rock',
            'Paper',
            'Scissors'
        ],
        'population': [0.33, 0.33, 0.24, 0.10],
        'transitionSpeed': 10,
        'display': {
            'editor': 'none',
            'util': 'none',
            'seg': 'block',
            'input-bi': 'none',
            'input-tri': 'block',
            'cost': 'none',
        }
        ,
    },
    'stag': {
        'info':'The prisoners dilemma is an interesting game',
        'payoff': 1.3,
        'strats' : [
            'Stag',
            'Hare',
            'none'
        ],
        'population': [0.33, 0.33, 0.24, 0.10],
        'transitionSpeed': 10,
        'display': {
            'editor': 'none',
            'util': 'none',
            'seg': 'block',
            'input-bi': 'none',
            'input-tri': 'block',
            'cost': 'none',
        }
        ,
    },
    'hd': {
        'info':'The prisoners dilemma is an interesting game',
        'payoff': 1.3,
        'strats' : [
            'Hawk',
            'Dove',
            'none'
        ],
        'population': [0.33, 0.33, 0.24, 0.10],
        'transitionSpeed': 10,
        'display': {
            'editor': 'block',
            'util': 'block',
            'seg': 'none',
            'input-bi': 'block',
            'input-tri': 'none',
            'cost': 'block',
        }
        ,
    },
}

// sets the initial values of variables and displays when the game is loaded    
loadConfig = (game) => {
    const config = configSettings[game]
    transitionSpeed  = config['transitionSpeed'];
    selfInteractions = config['selfinteract']
    document.querySelector('.game-info').innerHTML = config['info'];
    document.querySelector('#payoff').value = config['payoff']
    document.querySelector('#pop-span1').innerHTML = config['strats'][0]
    document.querySelector('#pop-span2').innerHTML = config['strats'][1]
    document.querySelector('#pop-span3').innerHTML = config['strats'][2]
    document.querySelector('#selfInteractionsBtn').checked = config['selfinteract']
    document.querySelector('#editor-rules').style.display = config['display']['editor']
    document.querySelector('#utility-functions').style.display = config['display']['util']
    document.querySelector('#cost').style.display = config['display']['cost']
    document.querySelector('#segregation-rules').style.display = config['display']['seg']
    document.querySelector('#bi-input-games-div').style.display = config['display']['input-bi']
    document.querySelector('#tri-input-games-div').style.display = config['display']['input-tri']
}

