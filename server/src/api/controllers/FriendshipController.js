export default class FriendshipController {
    constructor(client) {
        this.client = client;
    }

    async fetchByUserId(req, res, next) {
        const { id } = req;

        var friends;
        try {
            var friends = await this.client.friendships.fetchByUserId(id);
        } catch (error) {
            return next(error);
        }

        return res.send(friends);
    }

    async request(req, res, next) {
        const { id } = req;
        const receiver = req.params.id;

        let updatedFriendship;
        try {
            const friendship = await this.client.friendships.fetchRequestsByUserId(id);
            const request = friendship.find(
                friendship =>
                    friendship.sender === receiver || friendship.receiver === receiver,
            );

            if (!request) {
                updatedFriendship = await this.client.friendships.create({
                    sender: id,
                    receiver,
                });
            }

            if (request.status === 1) {
                return next(new Error('ALREADY_FRIENDS'));
            }

            if (request.status === 0 && request.sender === id) {
                return next(new Error('FRIENDSHIP_ALREADY_REQUESTED'));
            }

            if (request.status === 0 && request.receiver === id) {
                updatedFriendship = await this.client.friendships.update({
                    sender: request.sender,
                    receiver: request.receiver,
                    status: 1,
                });
            }
        } catch (error) {
            return next(error);
        }

        return res.send(updatedFriendship);
    }

    async fetchRequestsByUserId(req, res, next) {
        const { id } = req;

        let requests;
        try {
            const friendships = await this.client.friendships.fetchRequestsByUserId(id);
            requests = friendships.filter(friendship => friendship.status === 0);
        } catch (error) {
            return next(error);
        }

        return res.send(requests);
    }
}
