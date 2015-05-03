define
    $plugins:[
        "wire/debug"
        "wire/dom"
        "wire/dom/render"
        "wire/on"
        "wire/connect"
        "wire/aop"
        "plugins/form/streams"
    ]

    messageDisplay:
        wire:
            spec: "plugins/form/validator/display/spec"

    defaultPointMessage: "Пожалуйста, заполните это поле"

    validator:
        create: 
            module: "plugins/form/validator/validator"
            args: [{
                strategy: {$ref: 'strategy'}
                defaultPointMessage: {$ref: 'defaultPointMessage'}
            }]
        properties:
            fieldNames     : {$ref: 'fieldNames'}

    controller:
        create: "plugins/form/validator/controller"
        properties:
            form            : {$ref: 'form'}
            target          : {$ref: 'target'}
            fieldNames      : {$ref: 'fieldNames'}
            successHandler  : {$ref: 'successHandler'}
            messageDisplay  : {$ref: 'messageDisplay'}
            validator       : {$ref: 'validator'}
        after:
            'validator.addStrategyField'    : 'addStrategyField'
            'validator.removeStrategyField' : 'swithToInitialState | forgetField'
        # Prefixes:
        # "before:" - method will be invoked before all filters, returned value ignored;
        # "filter:" - method will be invoked before all tasks, can return true or false.
        # Another tasks (without prefix) will be pipelined and invoked in order from left to right 
        # - in case of conjunction of all filters returns true.
        streams:
            eventMap:
                "focus" : "before:hideError | filter:isActualField | filter:checkForRegisteredError | getRegisteredError | displayError | alternative:displayHint"
                "keyup" : "filter:isActualField |filter:checkAndShowRegisteredError | validate | displayError| highLight | alternative:validate"
                "change": "validate | registerError | highLight"
                "submit": "validateAll"
                "blur"  : "hideError"
            hooks: {$ref: 'streamsHooks'}