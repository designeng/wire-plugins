define(["wire"], function(wire) {
  var integrationSpec, onDataDeliveredSpy;
  onDataDeliveredSpy = jasmine.createSpy('onDataDeliveredSpy');
  define('bunch/firstController', function() {
    var FirstController;
    return FirstController = (function() {
      function FirstController() {}

      FirstController.prototype.onDataDelivered = function(res) {
        return onDataDeliveredSpy(res);
      };

      return FirstController;

    })();
  });
  define('bunch/secondController', function() {
    var SecondController;
    return SecondController = (function() {
      function SecondController() {}

      SecondController.prototype.oneInvoker = function(value) {
        return value;
      };

      SecondController.prototype.twoInvoker = function(value) {
        return value;
      };

      SecondController.prototype.threeInvoker = function(value) {
        return value;
      };

      SecondController.prototype.fourInvoker = function(value) {
        return value;
      };

      return SecondController;

    })();
  });
  integrationSpec = {
    $plugins: ['wire/debug', 'plugins/data/bunch'],
    model: {
      create: "core/entity/Model",
      init: {
        setProperty: ["one", "1"]
      }
    },
    anotherModel: {
      create: "core/entity/Model"
    },
    firstController: {
      create: "bunch/firstController"
    },
    secondController: {
      create: "bunch/secondController",
      valuesBunch: {
        byInvocation: [
          {
            $ref: 'secondController.oneInvoker',
            aspectMode: "before"
          }, {
            $ref: 'secondController.twoInvoker'
          }, {
            $ref: 'secondController.threeInvoker',
            aspectMode: "before",
            combineWith: 'secondController.fourInvoker'
          }, {
            $ref: 'secondController.fourInvoker',
            combineWith: 'secondController.threeInvoker'
          }
        ],
        byProperty: [
          {
            name: "one",
            at: {
              $ref: 'model'
            }
          }, {
            name: "two",
            at: {
              $ref: 'model'
            }
          }, {
            name: "three",
            at: {
              $ref: 'anotherModel'
            }
          }
        ],
        deliverTo: {
          $ref: 'firstController.onDataDelivered'
        }
      }
    }
  };
  return describe("bunch plugin", function() {
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
    it("bunch plugin should get data from byProperty option reference", function(done) {
      this.ctx.model.setProperty("two", "2");
      expect(onDataDeliveredSpy).toHaveBeenCalledWith("2");
      return done();
    });
    it("bunch plugin should work with byInvocation option", function(done) {
      this.ctx.secondController.oneInvoker("oneInvoker invoked");
      expect(onDataDeliveredSpy).toHaveBeenCalledWith("oneInvoker invoked");
      return done();
    });
    return it("bunch plugin should combine streams", function(done) {
      this.ctx.secondController.fourInvoker("fourInvoker");
      this.ctx.secondController.threeInvoker("threeInvoker");
      expect(onDataDeliveredSpy).toHaveBeenCalledWith(['threeInvoker', 'fourInvoker']);
      expect(onDataDeliveredSpy).not.toHaveBeenCalledWith(['fourInvoker', 'threeInvoker']);
      return done();
    });
  });
});
