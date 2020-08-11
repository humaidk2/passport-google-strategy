var passport = require("passport");
var CustomGoogleStrategy = require("./verifyGooglePassport");

module.exports = function (passport, User) {
  passport.use(
    "custom-google",
    new CustomGoogleStrategy(
      {
        clientId: process.env.GOOGLE_CLIENT_ID,
      },
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
