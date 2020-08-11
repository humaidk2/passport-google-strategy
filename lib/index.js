var passport = require("passport");
var CustomGoogleStrategy = require("./verifyGooglePassport");

module.exports = function (passport, User) {
  passport.use(
    "custom-google",
    new CustomGoogleStrategy({}, function (req, payload, cb) {
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
    })
  );
};
