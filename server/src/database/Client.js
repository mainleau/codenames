import Database from './Database.js';
import FriendshipManager from './storages/FriendshipStorage.js';
import GameManager from './storages/GameStorage.js';
import UserManager from './storages/UserStorage.js';
import WordManager from './storages/WordStorage.js';

export default class Client extends Database {
  constructor() {
    super();

    this.users = new UserManager(this);
    this.friendships = new FriendshipManager(this);
    this.words = new WordManager(this);
    this.games = new GameManager(this);
  }
}
