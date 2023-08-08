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
        var value = XPTiers.slice(0).reduce((prev, curr, _, arr) => {
            if(xp < prev + curr) arr.splice(1);
            prev += curr;
            return curr
        }, 0);
        var level = XPTiers.indexOf(value);
        if (xp > 2000) {
            level += Math.floor((xp - 2000) / 2000);
        }
        return level === 22 ? 2000 - this.xp : XPTiers[level] - this.xp;
    }

    async fetchStats() {
        this.stats = await this.client.users.fetchStatsByUserId(this.id); 
    }
}