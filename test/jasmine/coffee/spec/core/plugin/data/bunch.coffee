define [
    "wire"
], (wire) ->

    onDataDeliveredSpy = jasmine.createSpy('onDataDeliveredSpy')

    define 'bunch/firstController', ->
        class FirstController
            onDataDelivered: (res) ->
                onDataDeliveredSpy(res)

    define 'bunch/secondController', ->
        class SecondController
            oneInvoker: (value) ->
                return value
            twoInvoker: (value) ->
                return value

            threeInvoker: (value) ->
                return value
            fourInvoker: (value) ->
                return value

    integrationSpec = 
        $plugins: [
            'wire/debug'
            'plugins/data/bunch'
        ]

        model:
            create: "core/entity/Model"
            init:
                setProperty: [
                    "one"
                    "1"
                ]

        anotherModel:
            create: "core/entity/Model"

        firstController:
            create: "bunch/firstController"

        secondController:
            create: "bunch/secondController"
            valuesBunch:
                byInvocation: [
                    {$ref: 'secondController.oneInvoker', aspectMode: "before"}
                    {$ref: 'secondController.twoInvoker'}
                    # order is important! combination result will be delivered as array from threeInvoker, fourInvoker invokations
                    {$ref: 'secondController.threeInvoker', aspectMode: "before", combineWith: 'secondController.fourInvoker'}
                    {$ref: 'secondController.fourInvoker', combineWith: 'secondController.threeInvoker'}
                ]
                byProperty:[
                    {name: "one", at: {$ref: 'model'}}
                    {name: "two", at: {$ref: 'model'}}
                    {name: "three", at: {$ref: 'anotherModel'}}
                ]
                deliverTo: {$ref: 'firstController.onDataDelivered'}

    describe "bunch plugin", ->

        beforeEach (done) ->
            wire(integrationSpec).then (@ctx) =>
                done()
            .otherwise (err) ->
                console.log "ERROR:", err
                done()

        it "bunch plugin should get data from byProperty option reference", (done) ->
            @ctx.model.setProperty "two", "2"
            expect(onDataDeliveredSpy).toHaveBeenCalledWith("2")
            done()

        it "bunch plugin should work with byInvocation option", (done) ->
            @ctx.secondController.oneInvoker "oneInvoker invoked"
            expect(onDataDeliveredSpy).toHaveBeenCalledWith("oneInvoker invoked")
            done()

        it "bunch plugin should combine streams", (done) ->
            @ctx.secondController.fourInvoker "fourInvoker"
            @ctx.secondController.threeInvoker "threeInvoker"
            # order is important!
            expect(onDataDeliveredSpy).toHaveBeenCalledWith ['threeInvoker', 'fourInvoker']
            expect(onDataDeliveredSpy).not.toHaveBeenCalledWith ['fourInvoker', 'threeInvoker']
            done()


