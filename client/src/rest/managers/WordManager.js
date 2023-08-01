import { Collection } from '../../util';
export default class WordManager extends Collection {
    constructor(routes, options) {
        super();

        Object.defineProperty(this, 'routes', { value: routes });
        Object.defineProperty(this, 'options', { value: options });
    }

    async fetch({ count, random }) {
        const response = await fetch(
            this.options.baseURL + this.routes.FETCH_WORDS.apply(null, [count, random])
        );

        return response;
    }

}