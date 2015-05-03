# behavior plugin spec
define [
    "wire"
], (wire) ->

    integrationSpec = 
        $plugins:[
            "wire/debug"
            "plugins/template/hbsResolver"
        ]

        hbsResolved: {$ref: "hbsResolver!/test/jasmine/fixtures/formFixture"}

    describe "hbsResolver", ->

        beforeEach (done) ->
            wire(integrationSpec).then (@ctx) =>
                done()
            .otherwise (err) ->
                console.log "ERROR", err

        it "hbsResolver should provide function", (done) ->
            expect(@ctx.hbsResolved).toBeFunction()
            done()