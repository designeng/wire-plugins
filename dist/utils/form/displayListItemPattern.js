define(["handlebars"], function(Handlebars) {
  return Handlebars.compile("<li class='validator__messageListItem validator__messageListItem_type_{{ type }}'>        <p class='text-danger'>{{ text }}</p></li>");
});
