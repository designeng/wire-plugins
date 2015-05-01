require.config

    baseUrl: "/app/js"

    paths:
        # specs
        "bootstrapSpec": "specs/bootstrapSpec"
        "routerMainSpec": "specs/routerMainSpec"

        # plugins
        # appRouter"
        "plugins/appRouter"                     : "../../dist/routing/appRouter"
        "plugins/routing/default/spec"          : "../../dist/routing/default/spec"
        # /appRouter

        "plugins/data/bunch"                    : "../../dist/data/bunch"
        "plugins/data/follow"                   : "../../dist/data/follow"
        "plugins/data/structure/collection"     : "../../dist/data/structure/collection"
        "plugins/bahavior"                      : "../../dist/bahavior/bahavior"
        "plugins/extender"                      : "../../dist/extender/extender"
        "plugins/localizer"                     : "../../dist/extender/localizer"

        # plugins utils
        "plugins/utils/normalize"                       : "../../dist/utils/normalize"
        "plugins/utils/navigation/navigateToError"      : "../../dist/utils/navigation/navigateToError"
        "plugins/utils/navigation/navigate"             : "../../dist/utils/navigation/navigate"
        "plugins/utils/routing/appRouterController"     : "../../dist/utils/routing/appRouterController"

    packages: [
        # lib packages
        {
            name: "wire"
            main: "wire"
            location: "../../bower_components/wire"
        },
        {
            name: "when"
            main: "when"
            location: "../../bower_components/when"
        },
        {
            name: "meld"
            main: "meld"
            location: "../../bower_components/meld"
        },
        {
            name: "handlebars"
            main: "handlebars"
            location: "../../bower_components/handlebars"
        },
        {
            name: "hbs"
            main: "hbs"
            location: "../../bower_components/requirejs-hbs"
        },
        {
            name: "crossroads"
            main: "crossroads"
            location: "../../bower_components/crossroads/dist"
        },
        {
            name: "signals"
            main: "signals"
            location: "../../bower_components/signals/dist"
        },
        {
            name: "hasher"
            main: "hasher"
            location: "../../bower_components/hasher/dist/js"
        },
        {
            name: "underscore"
            main: "lodash"
            location: "../../bower_components/lodash/dist"
        },
        {
            name: "jquery"
            main: "jquery"
            location: "../../bower_components/jquery/dist"
        },
        {
            name: "text"
            main: "text"
            location: "../../bower_components/text"
        },
        {
            name: "kefir"
            main: "kefir"
            location: "../../bower_components/kefir/dist"
        },
        {
            name: "kefirJquery"
            main: "kefir-jquery"
            location: "../../bower_components/kefir-jquery"
        },
        {
            name: "eventEmitter"
            main: "eventEmitter"
            location: "../../bower_components/eventEmitter"
        }
    ]

    shim: {

    }