define(["meld", "plugins/utils/dialog/modalDialogPattern"], function(meld, modalDialogPattern) {
  return function(options) {
    var createDialogFactory, destroy, getClassAndMethod, pluginInstance, removers;
    removers = [];
    getClassAndMethod = function(str) {
      return str.split(".").slice(0, 2);
    };
    createDialogFactory = function(resolver, componentDef, wire) {
      var $modalDialogEl, invoker, onDialogShow, providerClass, _ref;
      $modalDialogEl = null;
      onDialogShow = function() {};
      _ref = getClassAndMethod(componentDef.options.showAfter.$ref), providerClass = _ref[0], invoker = _ref[1];
      return wire.resolveRef(providerClass).then(function(provider) {
        removers.push(meld.after(provider, invoker, function(data) {
          $modalDialogEl.show();
          return onDialogShow(data);
        }));
        return wire(componentDef.options).then(function(options) {
          var $closeBtn, $confirBtn, $refuseBtn, closeDialog, html;
          html = modalDialogPattern({
            title: options.title,
            body: options.body,
            confirmButtonLabel: options.confirmButtonLabel,
            refuseButtonLabel: options.refuseButtonLabel
          });
          $modalDialogEl = $(options.appendTo).append(html).find(".modal");
          $closeBtn = $modalDialogEl.find("button.close");
          $confirBtn = $modalDialogEl.find("button.confirmation");
          $refuseBtn = $modalDialogEl.find("button.refuse");
          onDialogShow = options.onDialogShow;
          closeDialog = function() {
            if (options.onDialogClose != null) {
              options.onDialogClose.call();
            }
            return $modalDialogEl.hide();
          };
          $closeBtn.on("click", function() {
            return closeDialog();
          });
          $confirBtn.on("click", function() {
            if (options.onConfirmation != null) {
              options.onConfirmation.call();
            }
            return closeDialog();
          });
          $refuseBtn.on("click", function() {
            if (options.onRefusing != null) {
              options.onRefusing.call();
            }
            return closeDialog();
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
