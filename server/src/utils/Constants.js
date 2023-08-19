export const USER_FLAGS = {
    DEFAULT: 0x00,
    BETA_ACCESS: 0x01,
    EARLY_BIRD: 0x02,
    MASTER: 0x04,
    GRAND_MASTER: 0x08,
    GUARDIAN: 0x10,
    ADMINISTRATOR: 0x20,
    BANNED: 0x40,
};

export const PLAYER_FLAGS = {
    DEFAULT: 0x00,
    HOST: 0x01,
    CO_HOST: 0x02,
};

export const GAME_MODES = {
    QUICK_GAME: 0x00,
    CUSTOM_GAME: 0x01,
    RANKED_GAME: 0x02,
    TOURNAMENT_GAME: 0x04,
    EVENT_GAME: 0x08,
};

export const GAME_STATES = {
    LOBBY: 0x00,
    STARTED: 0x01,
    ENDED: 0x02,
    STARTING: 0x04,
};

export const GAME_ROLES = {
    OPERATIVE: 0x00,
    SPYMASTER: 0x01,
    SPECTATOR: 0x02,
};

export const GAME_PRIVACY = {
    PUBLIC: 0x00,
    PRIVATE: 0x01,
    INVITES_ALLOWED: 0x02,
    FRIENDS_ALLOWED: 0x04,
    SPECTATORS_ALLOWED: 0x08,
    PASSWORD_PROTECTED: 0x10,
};

export const GAME_RULES = {
    NONE: 0x00,
    RANDOM_ROLE: 0x01,
    RANDOM_TEAM: 0x02,
    SHOW_WORDS_BEFORE_GAME_STARTED: 0x04,
    SHOW_REMAINING_CLUES: 0x08,
    NICKNAMES_ALLOWED: 0x10,
    TEAM_ROLE_LOCK: 0x20,
    TEAM_ROLE_LOCK_WHEN_STARTED: 0x40,
};
