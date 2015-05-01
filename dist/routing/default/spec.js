define({
  $plugins: ["wire/debug", "wire/aop"],
  appRouterController: {
    parse: function() {}
  },
  groundRoutes: {},
  childRoutes: {},
  pluginWireFn: {
    module: "wire"
  },
  afterChildrenLoaded: function() {},
  routeStrategy: {
    create: "core/plugin/routing/default/routeStrategy",
    properties: {
      appRouterController: {
        $ref: 'appRouterController'
      },
      childRoutes: {
        $ref: 'childRoutes'
      }
    }
  },
  prepareBehavior: {
    module: "core/plugin/routing/default/prepareBehavior"
  },
  behaviorProcessor: {
    create: "core/plugin/routing/default/behaviorProcessor",
    properties: {
      pluginWireFn: {
        $ref: 'pluginWireFn'
      }
    }
  },
  accessPolicyProcessor: {
    create: "core/plugin/routing/default/accessPolicyProcessor",
    properties: {
      pluginWireFn: {
        $ref: 'pluginWireFn'
      }
    }
  },
  hasherInitializator: {
    create: "core/plugin/routing/default/hasherInitializator",
    properties: {
      appRouterController: {
        $ref: 'appRouterController'
      }
    },
    after: {
      'parseHash': 'contextController.onHashChanged'
    }
  },
  contextController: {
    create: "core/plugin/routing/default/contextController",
    properties: {
      routeStrategy: {
        $ref: 'routeStrategy'
      }
    }
  },
  childContextProcessor: {
    create: "core/plugin/routing/default/childContextProcessor",
    properties: {
      appRouterController: {
        $ref: 'appRouterController'
      },
      routeStrategy: {
        $ref: 'routeStrategy'
      },
      accessPolicyProcessor: {
        $ref: 'accessPolicyProcessor'
      },
      prepareBehavior: {
        $ref: 'prepareBehavior'
      },
      behaviorProcessor: {
        $ref: 'behaviorProcessor'
      },
      environment: {
        $ref: 'environment'
      },
      pluginWireFn: {
        $ref: 'pluginWireFn'
      },
      contextController: {
        $ref: 'contextController'
      },
      afterChildrenLoaded: {
        $ref: 'afterChildrenLoaded'
      }
    }
  },
  environment: {
    create: "core/plugin/routing/default/environment",
    properties: {
      pluginWireFn: {
        $ref: 'pluginWireFn'
      }
    }
  },
  routeHandlerFactory: {
    create: "core/plugin/routing/default/routeHandlerFactory",
    properties: {
      contextController: {
        $ref: 'contextController'
      },
      routeStrategy: {
        $ref: 'routeStrategy'
      },
      childContextProcessor: {
        $ref: 'childContextProcessor'
      },
      behaviorProcessor: {
        $ref: 'behaviorProcessor'
      },
      environment: {
        $ref: 'environment'
      },
      groundRoutes: {
        $ref: 'groundRoutes'
      },
      childRoutes: {
        $ref: 'childRoutes'
      }
    }
  },
  controller: {
    create: "core/plugin/routing/default/controller",
    properties: {
      groundRoutes: {
        $ref: 'groundRoutes'
      },
      routeHandlerFactory: {
        $ref: 'routeHandlerFactory'
      }
    },
    afterFulfilling: {
      "registerGroundRoutes": "hasherInitializator.initialize"
    },
    ready: {
      registerGroundRoutes: {}
    }
  }
});
