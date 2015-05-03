define(["handlebars"], function(Handlebars) {
  var displayListItemPattern, itemPattern;
  itemPattern = "<li class='validator__messageListItem validator__messageListItem_type_{{ type }}'>{{ text }}</li>";
  return displayListItemPattern = function() {
    return Handlebars.compile(itemPattern);
  };
});
