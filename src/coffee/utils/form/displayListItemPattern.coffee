define [
    "handlebars"
], (handlebars) ->

    itemPattern = "<li class='validator__messageListItem validator__messageListItem_type_{{ type }}'>{{ text }}</li>"

    displayListItemPattern = ->
        return handlebars.compile(itemPattern)
