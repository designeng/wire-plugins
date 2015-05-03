define [
    "handlebars"
], (Handlebars) ->

    itemPattern = "<li class='validator__messageListItem validator__messageListItem_type_{{ type }}'>{{ text }}</li>"
    
    return Handlebars.compile(itemPattern)
