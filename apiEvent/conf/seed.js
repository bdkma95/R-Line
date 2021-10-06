// console.log('MongoDB connection successful');
const passport = require('passport');
const User = require('../models/user');


const usersList = [
    {
        email: "valentin.merlo@airnext.io",
        password:"test"
    }

];

usersList.forEach(function(user) { // Boucle qui correspond aux users listes. 
    User.findOne({ email: user.email }, function(err, foundUser) {
        if (foundUser) return; // Verification du user en base 
        const defaultUser = Object.assign(new User(), user); /// Création du user
        defaultUser.save(function(err) {
            if (err) console.error(err);
        });
    });
});