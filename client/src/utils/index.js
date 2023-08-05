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
    if (xp >= 100) level += 1;
    if (xp >= 250) level += 1;
    if (xp >= 625) level += 1;
    if (xp >= 1500) level += 1;
    if (xp > 2000) {
        level += Math.floor((xp - 2000) / 2000);
    }
    return level;
}