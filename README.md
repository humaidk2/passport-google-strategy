# passport-google-strategy

passport strategy that uses google-auth library to verify id token before logging in user

This strategy is an authentication strategy based on google's recommended signin practice [google-signin](https://developers.google.com/identity/sign-in/web/backend-auth)

A custom strategy that utilizes google's recommended [google-auth-library](https://github.com/googleapis/google-auth-library-nodejs#readme)
and is based on [passport-strategy](https://github.com/jaredhanson/passport-strategy)

# Authentication Strategy

This package helps with the following authentication strategy
![your client -> google ->token->set auth header -> send /verifygoogle request -> verify token -> insert db -> start session -> return 200 status](./authStrategy.png?raw=true "Authentication strategy")

# Usage

### Install

```javascript
npm install passport-google-strategy --save
```

### Configure Strategy

```javascript
var passport = require("passport");
var CustomGoogleStrategy = require("passport-google-strategy");
module.exports = function (passport, User) {
  passport.use(
    new CustomGoogleStrategy(
      { clientId: process.env.GOOGLE_CLIENT_ID },
      function (req, payload, cb) {
        User.findOrCreate({
          where: {
            oAuthID: payload.sub,
          },
          defaults: {
            username: payload.name,
            email: payload.email,
            active: true,
          },
        })
          .then(function (user) {
            return cb(null, user[0]);
          })
          .catch(function (err) {
            return cb(err, null);
          });
      }
    )
  );
};
```

### Authenticate Requests

```javascript
var passport = require("passport");
module.exports = function (app, User) {
  app.get("/verifygoogle", passport.authenticate("custom-google"), function (
    req,
    res
  ) {
    // do something with req.user
    res.status(200).send({ username: req.session.passport.user.username });
  });
};
```

# License

[Apache 2.0](https://opensource.org/licenses/Apache-2.0)
