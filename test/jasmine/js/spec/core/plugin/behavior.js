define(["wire", "when", 'when/sequence', "behavior/index"], function(wire, When, sequence, behaviorIndex) {
  var behaviorSpec;
  define('behaviorController', function() {
    var behaviorController;
    return behaviorController = (function() {
      function behaviorController() {}

      behaviorController.prototype.shiftRight = void 0;

      behaviorController.prototype.shiftLeft = void 0;

      behaviorController.prototype.shiftCenter = void 0;

      behaviorController.prototype.complexTask = void 0;

      return behaviorController;

    })();
  });
  behaviorSpec = {
    $plugins: ["wire/debug", "core/plugin/behavior"],
    controller: {
      create: "behaviorController",
      properties: {
        shiftRight: {
          $ref: "behavior!shiftRight"
        },
        shiftLeft: {
          $ref: "behavior!shiftLeft"
        },
        shiftCenter: {
          $ref: "behavior!shiftCenter"
        },
        complexTask: {
          $ref: "behavior!firstTask, secondTask"
        }
      }
    }
  };
  return describe("behavior plugin", function() {
    beforeEach(function(done) {
      var _this = this;
      behaviorIndex["firstTask"] = function() {
        return 1;
      };
      behaviorIndex["secondTask"] = function() {
        return 2;
      };
      return wire(behaviorSpec).then(function(ctx) {
        _this.ctx = ctx;
        return done();
      }).otherwise(function(err) {
        return console.log("ERROR", err);
      });
    });
    it("behavior shiftRight is function", function(done) {
      expect(this.ctx.controller.shiftRight[0]).toBeFunction();
      return done();
    });
    it("behavior shiftLeft is function", function(done) {
      expect(this.ctx.controller.shiftLeft[0]).toBeFunction();
      return done();
    });
    it("behavior shiftCenter is function", function(done) {
      expect(this.ctx.controller.shiftCenter[0]).toBeFunction();
      return done();
    });
    it("behavior complexTask is array", function(done) {
      expect(this.ctx.controller.complexTask).toBeArray();
      return done();
    });
    return it("behavior complexTask sequence run", function(done) {
      var promise;
      promise = sequence(this.ctx.controller.complexTask);
      return When(promise).then(function(res) {
        expect(res).toBeArray();
        expect(res[0]).toBe(1);
        expect(res[1]).toBe(2);
        return done();
      });
    });
  });
});
