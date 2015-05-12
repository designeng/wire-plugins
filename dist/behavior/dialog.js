define(["meld", "plugins/utils/dialog/modalDialogPattern"], function(meld, modalDialogPattern) {
  return function(options) {
    var createDialogFactory, destroy, getClassAndMethod, pluginInstance, removers;
    removers = [];
    getClassAndMethod = function(str) {
      return str.split(".").slice(0, 2);
    };
    createDialogFactory = function(resolver, componentDef, wire) {
      var $modalDialogEl, invoker, providerClass, _ref;
      $modalDialogEl = null;
      _ref = getClassAndMethod(componentDef.options.showOn.$ref), providerClass = _ref[0], invoker = _ref[1];
      return wire.resolveRef(providerClass).then(function(provider) {
        removers.push(meld.after(provider, invoker, function() {
          return $modalDialogEl.show();
        }));
        return wire(componentDef.options).then(function(options) {
          var $closeBtn, $confirBtn, html;
          html = modalDialogPattern({
            title: options.title,
            body: options.body,
            confirmButtonLabel: options.confirmButtonLabel
          });
          $modalDialogEl = $(options.appendTo).append(html).find(".modal");
          $closeBtn = $modalDialogEl.find("button.close");
          $confirBtn = $modalDialogEl.find("button.confirmation");
          $closeBtn.on("click", function() {
            return $modalDialogEl.hide();
          });
          $confirBtn.on("click", function() {
            options.onConfirmation.call();
            return $modalDialogEl.hide();
          });
          return resolver.resolve();
        });
      });
    };
    destroy = function(resolver, wire) {
      var remover, _i, _len;
      for (_i = 0, _len = removers.length; _i < _len; _i++) {
        remover = removers[_i];
        remover.remove();
      }
      return resolver.resolve();
    };
    return pluginInstance = {
      context: {
        "destroy": destroy
      },
      factories: {
        createDialog: createDialogFactory
      }
    };
  };
});
