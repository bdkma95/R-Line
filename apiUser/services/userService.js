// Liaison l'objet de l'utilisateur ET la couche mértier (source de données et le endoints exposés à l'extérieur)
const userModel = require("../models/user");
const User = require('../models/user');
//const MONGO_URL = 'mongodb://root:example@mongo:27017/'


require('dotenv').config();
// DB + SessionStor

async function getAll() {
    const users = await userModel.find({});
    return users;
}


async function createUser(user) { // Cela correspond à un utilisateur. 
    User.findOne({ email: user.email }, function(err, foundUser) {
        if (foundUser) return; // Verification du user en base 
        const defaultUser = Object.assign(new User(), user); /// Création du user
        defaultUser.password = defaultUser.generateHash(user.password); // Génerer un mot de passe. 
        defaultUser.save(function(err) {
            if (err) console.error(err);
        });
    });
};
async function findOne(id) { // Cela correspond à un utilisateur. 
    User.findOne({ id: id }, function(err, foundUser) {
        if (foundUser) return foundUser;
        if (err) console.error(err);
        });
};

function updateUser(user) {
    User.findOne({ id: user.id }, function(err, foundUser) {
        if (foundUser) {
            foundUser.password = foundUser.generateHash(user.password); // Génerer un mot de passe. 
            foundUser.save(function(err) {
                if (err) {console.error(err);}
                else{
                    return foundUser
                }

            });
        
        }
    });
}
async function deleteUser(id){
    User.findByIdAndDelete(id, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Deleted : ", docs);
        }
    });
}


module.exports = {
    getAll: getAll,
    createUser: createUser,
    updateUser: updateUser,
    findOne:findOne,
    deleteUser:deleteUser
};