createDistribution = (array, weights, size) => {
    const distribution = [];
    const sum = weights.reduce((a, b) => a + b);
    const quant = size / sum;
    for (let i = 0; i < array.length; ++i) {
        const limit = quant * weights[i];
        for (let j = 0; j < limit; ++j) {
            distribution.push(i);
        }
    }
    return distribution;
};

randomIndex = (distribution) => {
    const index = Math.floor(distribution.length * Math.random());  // random index
    return distribution[index];  
};	

convertScoreToInteger = (limit, score) => {
    if (score === 0) {
        return -limit;
    }
    else {
        const b = parseInt((limit - score)/limit);
    return parseInt(score + (limit * b));
    }   
}

