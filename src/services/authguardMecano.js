const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const authguardMecano = async(req, res, next) => {
    try{
        if(req.session.Mecano){
            return next();
        }
        else throw ("Utilisateur non connecté")
    }
    catch(error){
        res.redirect("/login")
    }
}

module.exports = authguardMecano;
        