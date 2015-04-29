define [
    "wire"
], (wire) ->

    noop = () ->

    define 'firstController', ->
        class FirstController

            provider: undefined

            setProvider: (value) ->
                @provider = value
                return value

    define 'secondController', ->
        class SecondController

            consumer: "someInitValue"

    integrationSpec = 
        $plugins: [
            'wire/debug'
            'plugins/data/follow'
        ]

        firstController:
            create: "firstController"

        secondController:
            create: "secondController"
            follow:
                'consumer': {$ref: 'firstController.provider'}

    # tests
    describe "followPluginSpec", ->

        beforeEach (done) ->
            wire(integrationSpec).then (@ctx) =>
                done()
            .otherwise (err) ->
                console.log "ERROR:", err
                done()

        it "secondController.consumer must be defined after firstController.setProvider invocation", (done) ->
            expect(@ctx.secondController['consumer']).toBe "someInitValue"
            @ctx.firstController.setProvider("1234567")
            expect(@ctx.secondController['consumer']).toBe "1234567"
            done()

        it "secondController.consumer object must be equial firstController.provider after firstController.setProvider invocation", (done) ->
            @ctx.firstController.setProvider({a: 1})
            expect(@ctx.secondController['consumer']['a']).toBe 1
            done()


