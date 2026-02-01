module.exports = {
    schema: './prisma/schema.prisma',
    datasource: {
        url: process.env.DIRECT_URL,
    },
};
