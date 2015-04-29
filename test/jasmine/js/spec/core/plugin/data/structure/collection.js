var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(["underscore", "jquery", "wire", "text!/test/jasmine/fixtures/formFixture.html", "jasmine-jquery"], function(_, $, wire, formFixture, displaySlotFixture) {
  var collectionSource, integrationSpec, noop, oneFilterCallbackSpy;
  noop = function() {};
  oneFilterCallbackSpy = jasmine.createSpy('oneFilterCallbackSpy');
  collectionSource = [
    {
      one: "1",
      two: "2"
    }, {
      one: "10",
      two: "20"
    }, {
      one: "100",
      two: "200"
    }, {
      one: void 0,
      two: "200"
    }, {
      one: "1000",
      two: void 0
    }, {
      one: null,
      two: void 0
    }, {
      one: null,
      two: null
    }, {
      one: noop,
      two: {}
    }, {
      one: parseInt("10000"),
      two: Number()
    }, {}
  ];
  define('filters', function() {
    return {
      oneFilter: function(item) {
        return this["_filterOptions"]["checkForString"](item["one"]);
      },
      twoFilter: function(item) {
        var _ref;
        return _ref = item["two"], __indexOf.call(this["_filterOptions"]["allowedValues"], _ref) >= 0;
      }
    };
  });
  define('transformer', function() {
    return function(res) {
      return res;
    };
  });
  define('controller', function() {
    var Controller;
    return Controller = (function() {
      function Controller() {}

      Controller.prototype.onReady = function(collection) {
        return collection.addSource(collectionSource);
      };

      Controller.prototype.oneFilterCallback = oneFilterCallbackSpy;

      Controller.prototype.invokerOne = function() {
        return {
          checkForString: _.isString
        };
      };

      Controller.prototype.invokerTwo = function() {
        return {
          allowedValues: ["2", "20"]
        };
      };

      Controller.prototype.successHandler = function(res) {
        return console.debug("RES: successHandler", res);
      };

      return Controller;

    })();
  });
  integrationSpec = {
    $plugins: ['wire/debug', 'wire/on', 'wire/dom', 'wire/dom/render', 'wire/connect', 'plugins/data/structure/collection'],
    form: {
      $ref: 'dom.first!.searchForm'
    },
    strategy: {
      lastName: {
        "lastNameCommonRule": {
          rule: function(value) {
            return value;
          },
          message: "someMessage"
        }
      }
    },
    controller: {
      create: "controller",
      ready: {
        onReady: {
          $ref: "firstCollection"
        }
      }
    },
    transformer: {
      module: 'transformer'
    },
    filters: {
      module: 'filters'
    },
    firstCollection: {
      create: "core/entity/Collection"
    },
    secondCollection: {
      cloneStructure: {
        $ref: "firstCollection"
      },
      bindFiltersToFields: {
        form: {
          $ref: 'form'
        },
        fieldNames: ['firstName', 'lastName']
      },
      connect: {
        "applyFilter": "getSource | transformer | controller.oneFilterCallback | restoreLastSourceRevision"
      }
    }
  };
  return describe("collectionPluginSpec", function() {
    beforeEach(function(done) {
      var _this = this;
      setFixtures(formFixture);
      return wire(integrationSpec).then(function(ctx) {
        _this.ctx = ctx;
        return done();
      }).otherwise(function(err) {
        console.log("ERROR:", err);
        return done();
      });
    });
    afterEach(function(done) {
      this.ctx.destroy();
      return done();
    });
    it("firstCollection source is array", function(done) {
      var source;
      source = this.ctx.firstCollection.getSource();
      expect(source).toBeArray();
      expect(source.length).toBe(10);
      return done();
    });
    it("secondCollection source is array, sources have the same length and items identificators are equial", function(done) {
      var source0, source1;
      source0 = this.ctx.firstCollection.getSource();
      source1 = this.ctx.secondCollection.getSource();
      expect(source1).toBeArray();
      expect(source1.length).toBe(10);
      expect(source0[0]["_id"]).toBe(source1[0]["_id"]);
      return done();
    });
    xit("secondCollection should be filtered after provided filter invokation", function(done) {
      var source;
      this.ctx.controller.invokerOne();
      expect(this.ctx.secondCollection.getSource().length).toBe(4);
      this.ctx.controller.invokerTwo();
      source = this.ctx.secondCollection.getSource();
      expect(oneFilterCallbackSpy).toHaveBeenCalled();
      expect(source.length).toBe(2);
      expect(source[1]["two"]).toBe("20");
      return done();
    });
    return xit("secondCollection should listen to streams", function(done) {
      var form, input, input0;
      form = $(this.ctx.form);
      input0 = form.find("[name='firstName']");
      input = form.find("[name='lastName']");
      input0.focus();
      input0.val("123");
      input.focus();
      return done();
    });
  });
});
