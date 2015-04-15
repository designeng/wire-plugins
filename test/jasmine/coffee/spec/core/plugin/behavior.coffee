# behavior plugin spec
define [
    "wire"
    "when"
    'when/sequence'
    "behavior/index"
], (wire, When, sequence, behaviorIndex) ->

    define 'behaviorController', () ->
        class behaviorController
            shiftRight: undefined
            shiftLeft: undefined
            shiftCenter: undefined

            complexTask: undefined


    # spec
    behaviorSpec = 
        $plugins:[
            "wire/debug"
            "core/plugin/behavior"
        ]

        controller:
            create: "behaviorController"
            properties:
                shiftRight: {$ref: "behavior!shiftRight"}
                shiftLeft: {$ref: "behavior!shiftLeft"}
                shiftCenter: {$ref: "behavior!shiftCenter"}
                
                # can be written with spaces - each task will be trimmed 
                complexTask: {$ref: "behavior!firstTask, secondTask"}


    describe "behavior plugin", ->

        beforeEach (done) ->
            # stuff behaviorIndex with stub functions
            behaviorIndex["firstTask"] = () ->
                return 1
            behaviorIndex["secondTask"] = () ->
                return 2

            wire(behaviorSpec).then (@ctx) =>           
                done()
            .otherwise (err) ->
                console.log "ERROR", err

        it "behavior shiftRight is function", (done) ->
            expect(@ctx.controller.shiftRight[0]).toBeFunction()
            done()
        it "behavior shiftLeft is function", (done) ->
            expect(@ctx.controller.shiftLeft[0]).toBeFunction()
            done()
        it "behavior shiftCenter is function", (done) ->
            expect(@ctx.controller.shiftCenter[0]).toBeFunction()
            done()
        it "behavior complexTask is array", (done) ->
            expect(@ctx.controller.complexTask).toBeArray()
            done()
        it "behavior complexTask sequence run", (done) ->
            promise = sequence(@ctx.controller.complexTask)
            When(promise).then (res) ->
                expect(res).toBeArray()
                expect(res[0]).toBe 1
                expect(res[1]).toBe 2
                done()