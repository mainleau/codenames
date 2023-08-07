export default {
    REGISTER: '/register',
    LOGIN: '/login',
    
    FETCH_USER_BY_ID: (id) => `/users/${id}`,
    FETCH_ME: '/users/me',
    PUT_ME_ONLINE: '/online',

    FETCH_FRIENDS: '/friends',
    FETCH_FRIEND_REQUESTS: '/friends/requests',
    SEND_FRIEND_REQUEST: (id) => `/friends/requests/${id}`,

    FETCH_GAMES: '/games'
}