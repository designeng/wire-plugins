require.config({
  baseUrl: "/app/js",
  paths: {
    "bootstrapSpec": "specs/bootstrapSpec",
    "routerMainSpec": "specs/routerMainSpec"
  },
  packages: [
    {
      name: "wire",
      main: "wire",
      location: "../../bower_components/wire"
    }, {
      name: "when",
      main: "when",
      location: "../../bower_components/when"
    }, {
      name: "meld",
      main: "meld",
      location: "../../bower_components/meld"
    }, {
      name: "handlebars",
      main: "handlebars",
      location: "../../bower_components/handlebars"
    }, {
      name: "hbs",
      main: "hbs",
      location: "../../bower_components/requirejs-hbs"
    }, {
      name: "crossroads",
      main: "crossroads",
      location: "../../bower_components/crossroads/dist"
    }, {
      name: "signals",
      main: "signals",
      location: "../../bower_components/signals/dist"
    }, {
      name: "hasher",
      main: "hasher",
      location: "../../bower_components/hasher/dist/js"
    }, {
      name: "underscore",
      main: "lodash",
      location: "../../bower_components/lodash/dist"
    }, {
      name: "jquery",
      main: "jquery",
      location: "../../bower_components/jquery/dist"
    }, {
      name: "text",
      main: "text",
      location: "../../bower_components/text"
    }, {
      name: "i18n",
      main: "i18n",
      location: "../../bower_components/requirejs-i18n"
    }, {
      name: "domReady",
      main: "domReady",
      location: "../../bower_components/requirejs-domready"
    }, {
      name: "kefir",
      main: "kefir",
      location: "../../bower_components/kefir/dist"
    }, {
      name: "kefirJquery",
      main: "kefir-jquery",
      location: "../../bower_components/kefir-jquery"
    }, {
      name: "eventEmitter",
      main: "eventEmitter",
      location: "../../bower_components/eventEmitter"
    }
  ],
  shim: {}
});

requirejs.s.contexts._.config.paths["jasmine"] = '/test/jasmine/js/lib/jasmine-2.0.0/jasmine';

requirejs.s.contexts._.config.paths["jasmine-html"] = '/test/jasmine/js/lib/jasmine-2.0.0/jasmine-html';

requirejs.s.contexts._.config.paths["boot"] = '/test/jasmine/js/lib/jasmine-2.0.0/boot';

requirejs.s.contexts._.config.paths["jasmine-jquery"] = '../../../bower_components/jasmine-jquery/lib/jasmine-jquery';

requirejs.s.contexts._.config.paths["jquery-simulate"] = '../../../bower_components/jquery-simulate/jquery.simulate';

requirejs.s.contexts._.config.shim["jasmine"] = {
  exports: "jasmine"
};

requirejs.s.contexts._.config.shim["jasmine-html"] = {
  deps: ['jasmine'],
  exports: 'jasmine'
};

requirejs.s.contexts._.config.shim["jasmine-jquery"] = {
  deps: ['jasmine', 'jquery'],
  exports: 'jasmine-jquery'
};

requirejs.s.contexts._.config.shim["boot"] = {
  deps: ['jasmine', 'jasmine-html'],
  exports: 'jasmine'
};

require(["boot", "underscore", "js/SpecIndex.js", "/test/jasmine/js/common/beforeEach.js"], function(boot, _, indexSpecs) {
  var extention, pathToSpec, specs;
  pathToSpec = "/test/jasmine/js/spec/";
  extention = ".js";
  specs = _.map(indexSpecs, function(spec) {
    return spec = pathToSpec + spec + extention;
  });
  return require(specs, function(specs) {
    return window.onload();
  });
});
