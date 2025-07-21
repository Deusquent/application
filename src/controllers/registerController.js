const { PrismaClient } = require('../../generated/prisma');
const bcrypt = require('bcrypt');
const hashPasswordExtension = require('../../services/extension/hashPasswordExtension');
const prisma = new PrismaClient({}).$extends(hashPasswordExtension);

exports.getRegister = (req, res) => {
    res.render('pages/register.twig');
}