var util = require("util"),
  Strategy = require("passport-strategy");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function CustomStrategy(name = "custom", verify) {
  if (!verify)
    throw new TypeError("CustomGoogle Strategy requires a verify callback");
  Strategy.call(this);
  this._verify = verify;
  this.name = name;
}
CustomStrategy.prototype.authenticate = function (req, options) {
  verifyToken.call(this, req, req.headers.authorization).catch(this.fail);
};

async function verifyToken(req, token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  var self = this;
  function checkIfVerified(err, user) {
    if (err) return self.error(err);
    self.success(user);
  }
  const payload = ticket.getPayload();
  try {
    self._verify(req, payload, checkIfVerified);
    // self.success(payload);
  } catch (ex) {
    return self.error(ex);
  }
}
util.inherits(CustomStrategy, Strategy);
module.exports = CustomStrategy;
