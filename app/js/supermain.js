require.config({
  baseUrl: "/app/js",
  paths: {
    "bootstrapSpec": "specs/bootstrapSpec",
    "routerMainSpec": "specs/routerMainSpec",
    "plugins/data/bunch": "../../src/js/data/bunch",
    "plugins/data/follow": "../../src/js/data/follow",
    "plugins/data/collection": "../../src/js/data/structure/collection",
    "plugins/bahavior": "../../src/js/bahavior/bahavior",
    "plugins/extender": "../../src/js/extender/extender",
    "plugins/localizer": "../../src/js/extender/localizer"
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

require(["wire", "hasher", "wire!bootstrapSpec", "routerMainSpec"], function(wire, hasher, bootstrapCTX, routerMainSpec) {
  return bootstrapCTX.wire(routerMainSpec).then(function(resultCTX) {
    hasher.prependHash = "";
    return hasher.init();
  });
});
