define(["wire"], function(wire) {
  var integrationSpec, noop;
  noop = function() {};
  define('firstController', function() {
    var FirstController;
    return FirstController = (function() {
      function FirstController() {}

      FirstController.prototype.provider = void 0;

      FirstController.prototype.setProvider = function(value) {
        this.provider = value;
        return value;
      };

      return FirstController;

    })();
  });
  define('secondController', function() {
    var SecondController;
    return SecondController = (function() {
      function SecondController() {}

      SecondController.prototype.consumer = "someInitValue";

      return SecondController;

    })();
  });
  integrationSpec = {
    $plugins: ['wire/debug', 'core/plugin/data/follow'],
    firstController: {
      create: "firstController"
    },
    secondController: {
      create: "secondController",
      follow: {
        'consumer': {
          $ref: 'firstController.provider'
        }
      }
    }
  };
  return describe("followPluginSpec", function() {
    beforeEach(function(done) {
      var _this = this;
      return wire(integrationSpec).then(function(ctx) {
        _this.ctx = ctx;
        return done();
      }).otherwise(function(err) {
        console.log("ERROR:", err);
        return done();
      });
    });
    it("secondController.consumer must be defined after firstController.setProvider invocation", function(done) {
      expect(this.ctx.secondController['consumer']).toBe("someInitValue");
      this.ctx.firstController.setProvider("1234567");
      expect(this.ctx.secondController['consumer']).toBe("1234567");
      return done();
    });
    return it("secondController.consumer object must be equial firstController.provider after firstController.setProvider invocation", function(done) {
      this.ctx.firstController.setProvider({
        a: 1
      });
      expect(this.ctx.secondController['consumer']['a']).toBe(1);
      return done();
    });
  });
});
