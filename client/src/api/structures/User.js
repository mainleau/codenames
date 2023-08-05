export default class User {
    constructor({
        id,
        username,
        xp,
        level,
        gold,
        gems
    }) {
        this.id = id;
        this.username = username;
        this.xp = xp;
        this.level = level;
        this.gold = gold;
        this.gems = gems;
    }
}