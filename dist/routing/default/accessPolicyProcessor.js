define(["plugins/utils/navigation/navigate"], function(navigate) {
  var AccessPolicyProcessor;
  return AccessPolicyProcessor = (function() {
    function AccessPolicyProcessor() {}

    AccessPolicyProcessor.prototype.askForAccess = function(childContext) {
      var access;
      if (childContext.accessPolicy != null) {
        access = childContext.accessPolicy.checkAccess();
        if (!access) {
          if (childContext.accessPolicy.getRedirect != null) {
            if (childContext.__environmentVars.replaceable) {
              navigate(childContext.accessPolicy.getRedirect(), "replace");
            } else {
              navigate(childContext.accessPolicy.getRedirect());
            }
          }
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    };

    return AccessPolicyProcessor;

  })();
});
