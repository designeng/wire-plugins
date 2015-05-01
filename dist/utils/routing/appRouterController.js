define(["crossroads", "plugins/utils/navigation/navigateToError"], function(crossroads, navigateToError) {
  var AppRouterController, appRouterController;
  AppRouterController = (function() {
    function AppRouterController() {
      var router;
      router = crossroads.create();
      router.bypassed.add(function(route) {
        return navigateToError("404", "The page with route " + route + " you tried to access does not exist");
      });
      router.getCurrentRoute = function() {
        return this._prevRoutes[0];
      };
      router.resetPreviousRoutes = function() {
        return this._prevRoutes = [];
      };
      return router;
    }

    return AppRouterController;

  })();
  if (typeof appRouterController === "undefined" || appRouterController === null) {
    return appRouterController = new AppRouterController();
  }
});
