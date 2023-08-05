export function getLevel(xp) {
    var level = 0;
    if (xp >= 100) level += 1;
    if (xp >= 250) level += 1;
    if (xp >= 625) level += 1;
    if (xp >= 1500) level += 1;
    if (xp > 2000) {
        level += Math.floor((xp - 2000) / 2000);
    }
    return level;
}