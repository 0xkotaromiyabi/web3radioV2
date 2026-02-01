const { PrismaClient } = require('@prisma/client');
const { withAccelerate } = require('@prisma/extension-accelerate');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL
  }).$extends(withAccelerate());
} else {
  // In development, we might not want accelerate or we want to keep the connection alive
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      accelerateUrl: process.env.DATABASE_URL
    }).$extends(withAccelerate());
  }
  prisma = global.prisma;
}

module.exports = prisma;
