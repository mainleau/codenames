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
            1350, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900];
    
        var level = 1;
        var treshold = 0;
        while (xp >= treshold + XPTiers[level - 1]) {
            treshold += XPTiers[level - 1]
            level++;
        }
        var total = XPTiers.reduce((a, b) => a + b, 0)
        if(this.xp > total) treshold += (Math.floor((this.xp - treshold) / 2000)) * 2000;
        return treshold - this.xp;
    }

    async fetchStats() {
        this.stats = await this.client.users.fetchStatsByUserId(this.id); 
    }
}