define({
  $plugins: ["wire/debug", "wire/dom", "plugins/routing/appRouter"],
  hidePreloader: {
    module: "components/preloader/hidePreloader"
  },
  groundRoutes: {
    module: "specs/routes/groundRoutes"
  },
  childRoutes: {
    module: "specs/routes/childRoutes"
  },
  prospectRouter: {
    appRouter: {
      groundRoutes: {
        $ref: 'groundRoutes'
      },
      childRoutes: {
        $ref: 'childRoutes'
      },
      afterChildrenLoaded: {
        $ref: 'hidePreloader'
      }
    }
  }
});
