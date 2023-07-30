import Collection from '../vendor/@discordjs/collection.min.js';
import io from '../vendor/socket.io/socket.io.min.js';

export {
    Collection,
    io
}

export function isUUID(string) {
    const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    return regex.test(string);
}