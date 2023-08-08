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
    const XPTiers = [200, 350, 500, 650, 750, 850, 950, 1050, 1150, 1250,
        1350, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 2000];
    var value = XPTiers.slice(0).reduce((prev, curr, _, arr) => {
        if(xp < prev + curr) arr.splice(1);
        prev += curr;
        return curr
    }, 0);
    var level = XPTiers.indexOf(value);
    if (xp > 2000) {
        level += Math.floor((xp - 2000) / 2000);
    }
    return level;
}