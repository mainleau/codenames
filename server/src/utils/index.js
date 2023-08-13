export function getLevel(xp) {
    let level = 1;
    if (xp >= 100) level += 1;
    if (xp >= 250) level += 1;
    if (xp >= 625) level += 1;
    if (xp >= 1500) level += 1;
    if (xp > 2000) {
        level += Math.floor((xp - 2000) / 2000);
    }
    return level;
}

export function getDeltaPoints(myRating, opponentRating, myGameResult) {
    if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
        return 0;
    }
    
    var myChanceToWin = 1 / ( 1 + Math.pow(10, (opponentRating - myRating) / 400));

    return Math.round(64 * (myGameResult - myChanceToWin));
}

export function getTeamAveragePoints(points) {
    return (points.reduce((a, b) => a + b, 0) / points.length) || 1200;
}