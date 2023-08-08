export default class User {
    constructor(client, {
        id,
        username,
        flags,
        xp,
        level,
        gold,
        gems
    }) {
        this.client = client;

        this.id = id;
        this.username = username;
        this.flags = flags;
        this.xp = xp;
        this.level = level;
        this.gold = gold;
        this.gems = gems;
        this.stats = null;
    }

    get XPUntilNextLevel() {
        const XPTiers = [200, 350, 500, 650, 750, 850, 950, 1050, 1150, 1250,
        1350, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 2000];
        var level = XPTiers.reduce((prev, curr) => prev += this.xp > curr ? 1 : 0, 0);
        return level === 22 ? 2000 - this.xp : XPTiers[level] - this.xp;
    }

    async fetchStats() {
        this.stats = await this.client.users.fetchStatsByUserId(this.id); 
    }
}