define [
    "underscore"
    "jquery"
], (_, $) ->
    normalize = () ->
        args = Array::slice.call(arguments)
        if args.length > 1
            return _.map args, (view) ->
                return $(view)
        else if args.length == 1
            return $(args[0])