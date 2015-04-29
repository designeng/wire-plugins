define [
    "underscore"
    "jquery"
    "wire"
    "text!/test/jasmine/fixtures/formFixture.html"
    "jasmine-jquery"
], (_, $, wire, formFixture, displaySlotFixture) ->

    noop = () ->

    oneFilterCallbackSpy = jasmine.createSpy('oneFilterCallbackSpy')

    collectionSource = [
        {one: "1", two: "2"}
        {one: "10", two: "20"}
        {one: "100", two: "200"}
        {one: undefined, two: "200"}
        {one: "1000", two: undefined}
        {one: null, two: undefined}
        {one: null, two: null}
        {one: noop , two: {}}
        {one: parseInt("10000"), two: Number()}
        {}
    ]

    # TODO: options for filter is stored in @["_filterOptions"], @ = Collection
    # in other words, it's the result of the method, defined in 'after' attribute, invocation.
    # So, @["_filterOptions"] can be used in filter,
    # but if it can be refactored with carring (or wrapping), it should be refactored.
    define 'filters', ->
        return {
            oneFilter: (item) ->
                return @["_filterOptions"]["checkForString"] item["one"]

            twoFilter: (item) ->
                return item["two"] in @["_filterOptions"]["allowedValues"]
        }

    define 'transformer', ->
        return (res) ->
            return res

    define 'controller', ->
        class Controller

            onReady: (collection) ->
                collection.addSource collectionSource

            oneFilterCallback: oneFilterCallbackSpy

            invokerOne: ->
                return {
                    checkForString: _.isString
                }

            invokerTwo: ->
                return {
                    allowedValues: ["2", "20"]
                }

            successHandler: (res) ->
                console.debug "RES: successHandler", res

    integrationSpec = 
        $plugins: [
            'wire/debug'
            'wire/on'
            'wire/dom'
            'wire/dom/render'
            'wire/connect'
            'plugins/data/structure/collection'
        ]

        form: {$ref: 'dom.first!.searchForm'}

        strategy:
            lastName:
                "lastNameCommonRule":
                    rule: (value) ->
                        return value
                    message: "someMessage"

        controller:
            create: "controller"
            ready:
                onReady: {$ref: "firstCollection"}

        transformer:
            module: 'transformer'

        filters:
            module: 'filters'

        firstCollection:
            create: "core/entity/Collection"

        secondCollection:
            cloneStructure: {$ref: "firstCollection"}
            # addFilter: [
            #     {$ref: 'filters.oneFilter', after: 'controller.invokerOne', someWrongAspect: 'controller.someWrongAspect'}
            #     {$ref: 'filters.twoFilter', after: 'controller.invokerTwo'}
            # ]
            bindFiltersToFields:
                form: {$ref: 'form'}
                fieldNames: [
                    'firstName'
                    'lastName'
                ]
            connect:
                "applyFilter": "getSource | transformer | controller.oneFilterCallback | restoreLastSourceRevision"

    # tests
    describe "collectionPluginSpec", ->

        beforeEach (done) ->
            setFixtures(formFixture)
            wire(integrationSpec).then (@ctx) =>
                done()
            .otherwise (err) ->
                console.log "ERROR:", err
                done()

        afterEach (done) ->
            @ctx.destroy()
            done()

        it "firstCollection source is array", (done) ->
            source = @ctx.firstCollection.getSource()
            expect(source).toBeArray()
            expect(source.length).toBe 10
            done()

        it "secondCollection source is array, sources have the same length and items identificators are equial", (done) ->
            source0 = @ctx.firstCollection.getSource()
            source1 = @ctx.secondCollection.getSource()
            expect(source1).toBeArray()
            expect(source1.length).toBe 10
            expect(source0[0]["_id"]).toBe source1[0]["_id"]
            done()

        xit "secondCollection should be filtered after provided filter invokation", (done) ->
            @ctx.controller.invokerOne()
            expect(@ctx.secondCollection.getSource().length).toBe 4

            @ctx.controller.invokerTwo()
            source = @ctx.secondCollection.getSource()

            expect(oneFilterCallbackSpy).toHaveBeenCalled()
            
            expect(source.length).toBe 2
            expect(source[1]["two"]).toBe "20"
            done()

        xit "secondCollection should listen to streams", (done) ->
            form = $(@ctx.form)

            input0 = form.find("[name='firstName']")
            input = form.find("[name='lastName']")

            input0.focus()
            input0.val("123")

            input.focus()
            # TODO: expect?
            done()
            