export default {
    REQUEST: '/request',
    LOGIN: '/login',
    REGISTER: '/register',

    FETCH_USER_BY_ID: id => `/users/${id}`,
    FETCH_ME: '/users/me',
    FETCH_STATS_BY_USER_ID: id => `/users/${id}/stats`,
    FETCH_OWN_STATS: '/users/me/stats',
    PUT_ME_ONLINE: '/online',

    FETCH_FRIENDS: '/friends',
    FETCH_FRIEND_REQUESTS: '/friends/requests',
    SEND_FRIEND_REQUEST: id => `/friends/requests/${id}`,

    FETCH_PUBLIC_GAMES: '/list/public',
    FETCH_FRIEND_GAMES: '/list/friends',
};
