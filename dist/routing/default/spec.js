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
    create: "plugins/routing/default/routeStrategy",
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
    module: "plugins/routing/default/prepareBehavior"
  },
  behaviorProcessor: {
    create: "plugins/routing/default/behaviorProcessor",
    properties: {
      pluginWireFn: {
        $ref: 'pluginWireFn'
      }
    }
  },
  accessPolicyProcessor: {
    create: "plugins/routing/default/accessPolicyProcessor",
    properties: {
      pluginWireFn: {
        $ref: 'pluginWireFn'
      }
    }
  },
  hasherInitializator: {
    create: "plugins/routing/default/hasherInitializator",
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
    create: "plugins/routing/default/contextController",
    properties: {
      routeStrategy: {
        $ref: 'routeStrategy'
      }
    }
  },
  childContextProcessor: {
    create: "plugins/routing/default/childContextProcessor",
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
    create: "plugins/routing/default/environment",
    properties: {
      pluginWireFn: {
        $ref: 'pluginWireFn'
      }
    }
  },
  routeHandlerFactory: {
    create: "plugins/routing/default/routeHandlerFactory",
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
    create: "plugins/routing/default/controller",
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
