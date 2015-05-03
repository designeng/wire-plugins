define(["wire"], function(wire) {
  var integrationSpec;
  integrationSpec = {
    $plugins: ["wire/debug", "plugins/template/hbsResolver"],
    hbsResolved: {
      $ref: "hbsResolver!/test/jasmine/fixtures/formFixture"
    }
  };
  return describe("hbsResolver", function() {
    beforeEach(function(done) {
      var _this = this;
      return wire(integrationSpec).then(function(ctx) {
        _this.ctx = ctx;
        return done();
      }).otherwise(function(err) {
        return console.log("ERROR", err);
      });
    });
    return it("hbsResolver should provide function", function(done) {
      expect(this.ctx.hbsResolved).toBeFunction();
      return done();
    });
  });
});
