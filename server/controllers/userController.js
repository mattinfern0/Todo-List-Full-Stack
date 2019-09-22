const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user'); // For testing purposes

function notImplemented(res) {
  return res.json({ message: 'Not implemented' });
}


function createMockUser() {
  const mockUser = new User(
    {
      username: 'Johnny Appleseed',
      password: "12345"
    },
  );

  mockUser.save((err) => {
    if (err) {
      console.log("Error creating mock user: ", err);
    }
  });
}

// createMockUser();

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(400).json({
        message: 'A weird error occured...',
        user,
      });
    } else if (!user) {
      return res.status(400).json({
        message: 'This user was not found.',
        user,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        console.log('Error while loggin in: ', err);
        res.send(err);
      }

      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.json({ user, token });
    });
  })(req, res, next);
};

// eslint-disable-next-line arrow-body-style
exports.createUser = (req, res, next) => {
  return notImplemented(res);
};
