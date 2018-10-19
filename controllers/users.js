const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const mailer = require('../helpers/mailer');

const jwtsecret = 'mysecret';

const confirm = function (req, res) {
  const email = req.params.email;
  User.update({ email: email }, {$set : { activated: true }}, function (err) {
    if (err) {
      console.log(err);
      res.status(500);
      res.json({ message: 'Error during user account confirmation!' });
    }
    res.status(200);
    res.json({ message: `${email} was activated!` });
  });
};

const signup = function (req, res) {
  //TODO: add body validation
  console.log(req.body);

  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);

  User.create(user, function(err, doc) {
    if (err) console.log(err);
    console.log('User created!');
  });

  const email = {
    from: `zndtestdev@gmail.com`,
    to: user.email,
    subject: `Auction Marketplace: Signup confirmation!`,
    html: `<p>To confirm registration follow the link: <a href="http://localhost:3001/api/confirm/${req.body.email}">confirmation</a></p>`
  };

  mailer.send(email);
  res.status(200);
  res.json(user);
};

const login = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      res.status(401);
      res.json({ status: 'Unauthorized' });
    }
    if (!user) {
      res.status(401);
      res.json({ status: 'Unauthorized' });
    }
    else {
      const payload = {
        id: user._id,
        email: user.email
      };
      const token = jwt.sign(payload, jwtsecret);
      res.json({ user: user.email, token: `JWT ${token}`});
    }
  })(req, res, next);
};

const user = function(req, res) {
    res.json({ user: "test" });
};

exports.confirm = confirm;
exports.signup = signup;
exports.login = login;
exports.user = user;
