export default {
    async test(_, res) {
        return res.status(200).send({
            MESSAGE: "It's Working. 👍🏻",
        });
    },

    async getAllSamples(_, res, database) {
        await database.getSamples(_, res);
    }
}