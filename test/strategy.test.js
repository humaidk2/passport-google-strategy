var Strategy = require("../lib/strategy");

describe("Strategy", function () {
  it("should provide verification method", function () {
    expect(function () {
      var strategy = new Strategy({});
    }).to.throw(Error, "CustomGoogle Strategy requires a verify callback");
  });
  var strat = new Strategy({});
});
