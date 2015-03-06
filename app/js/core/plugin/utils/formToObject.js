define(function() {
  var formToObject;
  return formToObject = function(formOrEvent, filter) {
    var el, els, form, i, name, obj, seen, value;
    obj = void 0;
    form = void 0;
    els = void 0;
    seen = void 0;
    i = void 0;
    el = void 0;
    name = void 0;
    value = void 0;
    form = formOrEvent.selectorTarget || formOrEvent.target || formOrEvent;
    if (typeof filter !== "function") {
      filter = alwaysInclude;
    }
    obj = {};
    els = form.elements;
    seen = {};
    i = 0;
    while ((el = els[i++])) {
      name = el.name;
      if (!name || (!("value" in el)) || !filter(el)) {
        continue;
      }
      value = el.value;
      if (el.type === "radio") {
        if (el.checked) {
          obj[name] = value;
        } else {
          if (!(name in seen)) {
            obj[name] = false;
          }
        }
      } else if (el.type === "checkbox") {
        if (!(name in seen)) {
          obj[name] = (el.attributes["value"] ? !!el.checked && value : !!el.checked);
        } else if (el.checked) {
          obj[name] = (name in obj && obj[name] !== false ? [].concat(obj[name], value) : [value]);
        }
      } else if (el.type === "file") {
        if (!(name in seen)) {
          obj[name] = getFileInputValue(el);
        }
      } else if (el.multiple && el.options) {
        obj[name] = getMultiSelectValue(el);
      } else {
        obj[name] = value;
      }
      seen[name] = name;
    }
    return obj;
  };
});
