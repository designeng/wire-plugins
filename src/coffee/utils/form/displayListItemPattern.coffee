define [
    "handlebars"
], (Handlebars) ->

    Handlebars.compile "<li class='validator__messageListItem validator__messageListItem_type_{{ type }}'>{{ text }}</li>"
