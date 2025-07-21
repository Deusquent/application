const { Prisma } = require("../../generated/prisma");
const bcrypt = require("bcrypt");

module.exports = Prisma.defineExtension({
    name: "hashPassword",
    model: {
        User: {
            async create({ args, query }) {
                if (args.data.password) {
                    args.data.password = await bcrypt.hash(args.data.password, 10);
                }
                return query(args);
            }
        }
    }
});