define(["underscore", "when", "when/sequence"], function(_, When, sequence) {
  var BehaviorProcessor;
  return BehaviorProcessor = (function() {
    function BehaviorProcessor() {}

    BehaviorProcessor.prototype.sequenceBehavior = function(childContext) {
      return When(this.pluginWireFn.getProxy(childContext.behavior), function(behaviorObject) {
        var tasks;
        tasks = behaviorObject.target;
        if (_.isFunction(tasks)) {
          tasks = [tasks];
        }
        return sequence(tasks, childContext);
      }, function() {}).then(function() {
        return childContext;
      }, function(error) {
        return console.error("BehaviorProcessor::sequenceBehavior ERROR:", error.stack);
      });
    };

    return BehaviorProcessor;

  })();
});
