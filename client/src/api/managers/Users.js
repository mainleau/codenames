import { Collection } from '../../utils';
import User from '../structures/User';

export default class Users extends Collection {
  constructor(rest, client, options) {
    super();

    Object.defineProperty(this, 'rest', { value: rest });
    Object.defineProperty(this, 'client', { value: client });
    Object.defineProperty(this, 'options', { value: options });
  }

  async fetchMe() {
    const data = await this.rest.get(this.rest.routes.FETCH_ME, this.options);

    return new User(this.client, data);
  }

  async fetchById(id) {
    const data = await this.rest.get(this.rest.routes.FETCH_USER_BY_ID, {
      ...this.options,
      params: [id],
    });

    return new User(this.client, data);
  }

  async fetchStatsByUserId(id) {
    const data = await this.rest.get(this.rest.routes.FETCH_STATS_BY_USER_ID, {
      ...this.options,
      params: [id],
    });

    return data;
  }

  async fetchOwnStats() {
    const data = await this.rest.get(this.rest.routes.FETCH_OWN_STATS, this.options);

    return data;
  }

  putMeOnline() {
    this.rest.post(this.rest.routes.PUT_ME_ONLINE, this.options);
  }
}
