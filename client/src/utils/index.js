import Collection from '../../vendor/@discordjs/collection.min.js';
import io from '../../vendor/socket.io/socket.io.min.js';

export {
    Collection,
    io
}

export function isUUID(string) {
    const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    return regex.test(string);
}

export function getLevel(xp) {
    var level = 0;
    const XPTiers = [200, 350, 500, 650, 750, 850, 950, 1050, 1150, 1250,
    1350, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900];
    var level = XPTiers.reduce((prev, curr) => prev += xp > curr ? 1 : 0, 0);
    if (xp > 2000) {
        level += Math.floor((xp - 2000) / 2000);
    }
    return level;
}