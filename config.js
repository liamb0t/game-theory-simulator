configSettings = {
    'pd': {
        'info':'The prisoners dilemma is an interesting game',
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
        'info':'The prisoners dilemma is an interesting game',
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

