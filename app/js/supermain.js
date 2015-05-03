require.config({
  baseUrl: "/app/js",
  paths: {
    "bootstrapSpec": "specs/bootstrapSpec",
    "routerMainSpec": "specs/routerMainSpec",
    "plugins/routing/appRouter": "../../dist/routing/appRouter",
    "plugins/routing/default/spec": "../../dist/routing/default/spec",
    "plugins/routing/default/routeStrategy": "../../dist/routing/default/routeStrategy",
    "plugins/routing/default/prepareBehavior": "../../dist/routing/default/prepareBehavior",
    "plugins/routing/default/behaviorProcessor": "../../dist/routing/default/behaviorProcessor",
    "plugins/routing/default/accessPolicyProcessor": "../../dist/routing/default/accessPolicyProcessor",
    "plugins/routing/default/hasherInitializator": "../../dist/routing/default/hasherInitializator",
    "plugins/routing/default/contextController": "../../dist/routing/default/contextController",
    "plugins/routing/default/childContextProcessor": "../../dist/routing/default/childContextProcessor",
    "plugins/routing/default/environment": "../../dist/routing/default/environment",
    "plugins/routing/default/routeHandlerFactory": "../../dist/routing/default/routeHandlerFactory",
    "plugins/routing/default/controller": "../../dist/routing/default/controller",
    "plugins/routing/default/tasksFactory": "../../dist/routing/default/tasksFactory",
    "plugins/routing/default/route": "../../dist/routing/default/route",
    "plugins/form/validate": "../../dist/form/validate",
    "plugins/form/validator/spec": "../../dist/form/validator/spec",
    "plugins/form/streams": "../../dist/form/streams",
    "plugins/form/validator/validator": "../../dist/form/validator/validator",
    "plugins/form/validator/controller": "../../dist/form/validator/controller",
    "plugins/form/validator/display/spec": "../../dist/form/validator/display/spec",
    "plugins/form/validator/display/controller": "../../dist/form/validator/display/controller",
    "plugins/data/bunch": "../../dist/data/bunch",
    "plugins/data/follow": "../../dist/data/follow",
    "plugins/data/structure/collection": "../../dist/data/structure/collection",
    "plugins/bahavior": "../../dist/bahavior/bahavior",
    "plugins/extender": "../../dist/extender/extender",
    "plugins/localizer": "../../dist/localizer/localizer",
    "plugins/template/hb": "../../dist/template/hb",
    "plugins/template/look": "../../dist/template/look",
    "plugins/template/bind": "../../dist/template/bind",
    "plugins/utils/normalize": "../../dist/utils/normalize",
    "plugins/utils/navigation/navigateToError": "../../dist/utils/navigation/navigateToError",
    "plugins/utils/navigation/navigate": "../../dist/utils/navigation/navigate",
    "plugins/utils/routing/appRouterController": "../../dist/utils/routing/appRouterController",
    "plugins/utils/entity/Collection": "../../dist/utils/entity/Collection",
    "plugins/utils/form/displayListItemPattern": "../../dist/utils/form/displayListItemPattern"
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
      name: "hbs",
      main: "hbs",
      location: "../../bower_components/requirejs-hbs"
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
  shim: {},
  hbs: {
    templateExtension: ".html"
  }
});

require(["wire", "hasher", "wire!specs/bootstrapSpec", "specs/appRouterSpec"], function(wire, hasher, bootstrapCTX, appRouterSpec) {
  return bootstrapCTX.wire(appRouterSpec).then(function(resultCTX) {});
});
