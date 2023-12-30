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
        'payoff': 0.85,
        'strats' : [
            'Cooperator',
            'Defector',
            'none'
        ],
        'population': [0.50, 0.50, 0, 0],
        'transitionSpeed': 0.2,
        'selfinteract': true,
        'display': {
            'editor': 'block',
            'util': 'block',
            'seg': 'none',
            'input-bi': 'block',
            'input-tri': 'none',
            'cost': 'none',
            'noise': 'none'
        },
        'colorpicker': '.colorpicker-2'
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
        'population': [0.33, 0.33, 0.33, 0],
        'transitionSpeed': 0.2,
        'display': {
            'editor': 'block',
            'util': 'none',
            'seg': 'none',
            'input-bi': 'none',
            'input-tri': 'block',
            'cost': 'none',
        },
        'colorpicker': '.colorpicker'
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
        'population': [0.33, 0.33, 0.20, 0.14],
        'transitionSpeed': 0.2,
        'display': {
            'editor': 'none',
            'util': 'none',
            'seg': 'block',
            'input-bi': 'none',
            'input-tri': 'block',
            'cost': 'none',
        },
        'colorpicker': '.colorpicker'
    },
    'ulti': {
        'info':'In the Ultimatum Game, two players must decide how to split a sum of money. Player one proposes a division, and player two can either accept or reject the offer. If rejected, both players receive nothing. This game highlights the tension between fairness and self-interest, as unfair proposals risk rejection.',
        'payoff': 1.3,
        'strats' : [
            'Rock',
            'Paper',
            'Scissors'
        ],
        'population': [0.33, 0.33, 0.24, 0.10],
        'transitionSpeed': 0.2,
        'display': {
            'editor': 'none',
            'util': 'none',
            'seg': 'block',
            'input-bi': 'none',
            'input-tri': 'block',
            'cost': 'none',
        },
    },
    'stag': {
        'info':'In the Stag Hunt, players must choose between hunting a stag (cooperative strategy with a high payoff) or a hare (selfish strategy with a lower payoff). The game illustrates the dilemma of cooperation, where individuals must trust others to choose the mutually beneficial option rather than pursuing immediate personal gain.',
        'payoff': 1.3,
        'strats' : [
            'Stag',
            'Hare',
            'none'
        ],
        'population': [0.33, 0.33, 0.24, 0.10],
        'transitionSpeed': 0.2,
        'display': {
            'editor': 'block',
            'util': 'block',
            'seg': 'none',
            'input-bi': 'block',
            'input-tri': 'none',
            'cost': 'block',
        },
        'colorpicker': '.colorpicker-2'
    },
    'hd': {
        'info':'The Hawk-Dove Game models strategic interactions where individuals can choose between aggressive (Hawk) or passive (Dove) behaviors. Hawks always fight for resources, while Doves avoid conflict. The game explores the balance between competition and cooperation within a population.',
        'payoff': 1.3,
        'strats' : [
            'Hawk',
            'Dove',
            'none'
        ],
        'population': [0.33, 0.33, 0.24, 0.10],
        'transitionSpeed': 0.2,
        'display': {
            'editor': 'block',
            'util': 'block',
            'seg': 'none',
            'input-bi': 'block',
            'input-tri': 'none',
            'cost': 'block',
        },
        'colorpicker': '.colorpicker-2'
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

    document.querySelector('#popsimple-span1').innerHTML = config['strats'][0]
    document.querySelector('#popsimple-span2').innerHTML = config['strats'][1]
    document.querySelector('#popsimple-span3').innerHTML = config['strats'][2]

    document.querySelector('#pop-density-slider1').value = config['population'][0]
    document.querySelector('#pop-density-slider2').value = config['population'][1]
    document.querySelector('#pop-density-slider3').value = config['population'][2]

    document.querySelector('#tri-slider1').value = config['population'][0]
    document.querySelector('#tri-slider2').value = config['population'][1]
    document.querySelector('#tri-slider3').value = config['population'][2]
    document.querySelector('#tri-slider4').value = config['population'][3]

    document.querySelector('#selfInteractionsBtn').checked = config['selfinteract']
    document.querySelector('#editor-rules').style.display = config['display']['editor']
    document.querySelector('#utility-functions').style.display = config['display']['util']
    document.querySelector('.cost-container').style.display = config['display']['cost']
    document.querySelector('#noise-container').style.display = config['display']['noise']
    document.querySelector('#segregation-rules').style.display = config['display']['seg']
    document.querySelector('#bi-input-games-div').style.display = config['display']['input-bi']
    document.querySelector('#tri-input-games-div').style.display = config['display']['input-tri']

    document.querySelector('#stat-label-1').innerHTML = config['strats'][0]
    document.querySelector('#stat-label-2').innerHTML = config['strats'][1]

    if (config['strats'].length > 2 && game != 'pd') {
        document.querySelector('#stat-container-3').style.display = 'block'
        document.querySelector('#stat-label-3').innerHTML = config['strats'][2]
    }
    else {
        document.querySelector('#stat-container-3').style.display = 'none'
    }

    if (game === 'hd') {
        document.querySelector('.payoff-slider-text').innerHTML = 'Payoff from Resource'
    }

    if (game === 'pd') {
        document.querySelector('.payoff-slider-text').innerHTML = 'Payoff from Defecting'
    }

    colors(config['colorpicker'])

    return config['population']
}

