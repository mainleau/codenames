export default class User {
    constructor({
        id,
        username,
        xp,
        gold,
        gems
    }) {
        this.id = id;
        this.username = username;
        this.xp = xp;
        this.gold = gold;
        this.gems = gems;
    }
}