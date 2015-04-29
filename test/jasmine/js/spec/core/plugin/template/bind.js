define(["wire", "when", "eventEmitter", "text!/test/jasmine/fixtures/formFixture.html"], function(wire, When, EventEmitter, formTemplate) {
  var integrationSpec;
  integrationSpec = {
    $plugins: ["wire/debug", 'wire/on', 'wire/dom', 'wire/dom/render', "core/plugin/template/bind"],
    view: {
      render: {
        template: formTemplate
      },
      insert: {
        at: {
          $ref: 'dom.first!.testFormWrapper'
        }
      },
      bind: {
        to: {
          $ref: 'model'
        },
        by: "id"
      }
    },
    model: {
      create: "core/entity/Model",
      init: {
        'setProperties': [
          {
            firstName: "one",
            lastName: "two"
          }
        ]
      }
    }
  };
  return describe("bind plugin", function() {
    beforeEach(function(done) {
      var _this = this;
      return wire(integrationSpec).then(function(ctx) {
        _this.ctx = ctx;
        return done();
      }).otherwise(function(err) {
        return console.log("ERROR", err);
      });
    });
    it("bind model should have trigger method", function(done) {
      expect(this.ctx.model.trigger).toBeFunction();
      return done();
    });
    it("bind model attribute should have correspondent value", function(done) {
      expect(this.ctx.model.getProperty("firstName")).toBe("one");
      return done();
    });
    return it("after model.setProperty invokation model attributes is changed", function(done) {
      this.ctx.model.setProperty("firstName", "Edward");
      this.ctx.model.setProperty("lastName", "Williams");
      expect(this.ctx.model.getAttributes()).toEqual({
        firstName: "Edward",
        lastName: "Williams"
      });
      return done();
    });
  });
});
