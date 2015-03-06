/**
@license MIT License (c) copyright B Cavalier & J Hann
*/

(function(define) {
  define(function() {
    var alwaysInclude, forEach, formToObject, getFileInputValue, getMultiSelectValue, isCheckable, isMultiSelect, objectToForm, setElementValue, setGroupValue, setMultiSelectValue, slice, textValue;
    objectToForm = function(form, object, filter) {
      var els;
      els = void 0;
      els = form.elements;
      if (typeof filter !== 'function') {
        filter = alwaysInclude;
      }
      Object.keys(object).forEach(function(name) {
        var el, value;
        el = void 0;
        value = void 0;
        value = object[name];
        el = els[name];
        if (!filter(el, name, value)) {
          return;
        }
        if ((el.length && el.type !== 'select-one') || isMultiSelect(el)) {
          setGroupValue(el, value);
        } else {
          setElementValue(el, value);
        }
      });
      return form;
    };
    setGroupValue = function(group, value) {
      var getBooleanValue;
      getBooleanValue = void 0;
      getBooleanValue = (Array.isArray(value) ? function(array, el) {
        return array.indexOf(el.value) >= 0;
      } : function(value, el) {
        return el.value === value;
      });
      forEach.call(group, function(el, i) {
        if (isCheckable(el)) {
          el.checked = getBooleanValue(value, el);
        } else {
          el.value = textValue(value[i]);
        }
      });
    };
    setElementValue = function(el, value) {
      if (isCheckable(el)) {
        el.checked = !!value;
      } else if (isMultiSelect(el)) {
        if (!Array.isArray(value)) {
          el.value = textValue(value);
        } else {
          setMultiSelectValue(el, value);
        }
      } else {
        el.value = textValue(value);
      }
    };
    isMultiSelect = function(el) {
      return el.type === 'select-multiple';
    };
    setMultiSelectValue = function(select, values) {
      var i, option, options;
      i = void 0;
      option = void 0;
      options = void 0;
      options = select.options;
      i = 0;
      if ((function() {
        var _results;
        _results = [];
        while ((option = options[i++])) {
          _results.push(values.indexOf(option.value) >= 0);
        }
        return _results;
      })()) {
        option.selected = true;
      }
    };
    textValue = function(value) {
      if (value == null) {
        return '';
      } else {
        return value;
      }
    };
    isCheckable = function(el) {
      return el.type === 'radio' || el.type === 'checkbox';
    };
    /**
    Simple routine to pull input values out of a form.
    @param form {HTMLFormElement}
    @return {Object} populated object
    */

    formToObject = function(formOrEvent, filter) {
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
      if (typeof filter !== 'function') {
        filter = alwaysInclude;
      }
      obj = {};
      els = form.elements;
      seen = {};
      i = 0;
      while ((el = els[i++])) {
        name = el.name;
        if (!name || (!('value' in el)) || !filter(el)) {
          continue;
        }
        value = el.value;
        if (el.type === 'radio') {
          if (el.checked) {
            obj[name] = value;
          } else {
            if (!(name in seen)) {
              obj[name] = false;
            }
          }
        } else if (el.type === 'checkbox') {
          if (!(name in seen)) {
            obj[name] = (el.attributes['value'] ? !!el.checked && value : !!el.checked);
          } else {
            if (el.checked) {
              obj[name] = (name in obj && obj[name] !== false ? [].concat(obj[name], value) : [value]);
            }
          }
        } else if (el.type === 'file') {
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
    getFileInputValue = function(fileInput) {
      if ('files' in fileInput) {
        if (fileInput.multiple) {
          return slice.call(fileInput.files);
        } else {
          return fileInput.files[0];
        }
      } else {
        return fileInput.value;
      }
    };
    getMultiSelectValue = function(select) {
      var i, option, options, values;
      values = void 0;
      options = void 0;
      i = void 0;
      option = void 0;
      values = [];
      options = select.options;
      i = 0;
      if ((function() {
        var _results;
        _results = [];
        while ((option = options[i++])) {
          _results.push(option.selected);
        }
        return _results;
      })()) {
        values.push(option.value);
      }
      return values;
    };
    alwaysInclude = function() {
      return true;
    };
    forEach = void 0;
    slice = void 0;
    forEach = Array.prototype.forEach;
    slice = Array.prototype.slice;
    return {
      getValues: formToObject,
      getMultiSelectValue: getMultiSelectValue,
      setValues: objectToForm,
      setElementValue: setElementValue,
      setGroupValue: setGroupValue,
      setMultiSelectValue: setMultiSelectValue,
      isCheckable: isCheckable
    };
  });
})((typeof define === 'function' && define.amd ? define : function(factory) {
  module.exports = factory();
}));
