const express = require('express');
const router = express.Router();
const userService = require("../services/userService");
const User = require('../models/user');

const passport = require('passport');
const jwt = require('jsonwebtoken');


router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    res.json({
      message: 'Signup successful',
      user: req.user
    });
  }
);

router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user, info) => {
        try {
          if (err || !user) {
            const error = new Error('An error occurred.');

            return next(error);
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);

              const body = { _id: user._id, email: user.email };
              const token = jwt.sign({ user: body }, 'TOP_SECRET');

              return res.json({ token });
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);


router.get('/AllUsers', (req, res) => {
    userService.getAll().then(users => {res.status(200).json(users)});
})

//Read One
router.get('/:id', (req, res, next) => {
    userService.findOne(req.query/id).then(user => res.status(200).json(user));
});

// Create One
router.post('/create', (req, res, next) => {
    userService.createUser(req.body.user).then(res.status(200))

});

// Update One

router.put('/update', (req, res, next) => {
    const { user } = req.body
    userService.updateUser(user).then(user => res.status(200).json(user));
    
});

// Delete One
router.delete('/delete', (req, res, next) => {
    const { id } = req.body
    userService.updateUser(id).then(user => res.status(200).json(user));
    res.json({
        message: 'DELETE'
    });
});

module.exports = router;