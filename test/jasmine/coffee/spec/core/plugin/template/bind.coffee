# behavior plugin spec
define [
    "wire"
    "when"
    "eventEmitter"
    "text!/test/jasmine/fixtures/formFixture.html"
    # "text!/test/jasmine/fixtures/divFixture.html"
], (wire, When, EventEmitter, formTemplate) ->

    integrationSpec = 
        $plugins:[
            "wire/debug"
            'wire/on'
            'wire/dom'
            'wire/dom/render'
            "core/plugin/template/bind"
        ]

        # TODO: via fixture?
        view:
            render:
                template: formTemplate
            insert:
                at: {$ref: 'dom.first!.testFormWrapper'}
            bind:
                to: {$ref: 'model'}
                by: "id"

        model:
            create: "core/entity/Model"
            init: 
                'setProperties': [{firstName: "one", lastName: "two"}]

    describe "bind plugin", ->

        beforeEach (done) ->
            wire(integrationSpec).then (@ctx) =>
                done()
            .otherwise (err) ->
                console.log "ERROR", err

        it "bind model should have trigger method", (done) ->
            expect(@ctx.model.trigger).toBeFunction()
            done()

        it "bind model attribute should have correspondent value", (done) ->
            expect(@ctx.model.getProperty("firstName")).toBe "one"
            done()

        it "after model.setProperty invokation model attributes is changed", (done) ->
            @ctx.model.setProperty("firstName", "Edward")
            @ctx.model.setProperty("lastName", "Williams")
            expect(@ctx.model.getAttributes()).toEqual {firstName: "Edward", lastName: "Williams"}
            done()