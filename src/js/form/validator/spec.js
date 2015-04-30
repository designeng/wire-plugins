define({
  $plugins: ["wire/debug", "wire/dom", "wire/dom/render", "wire/on", "wire/connect", "wire/aop", "core/plugin/form/streams"],
  messageDisplay: {
    wire: {
      spec: "core/plugin/form/validator/display/spec",
      provide: {
        displaySlot: {
          $ref: 'displaySlot'
        },
        displaySlotClass: {
          $ref: 'displaySlotClass'
        }
      }
    }
  },
  defaultPointMessage: "Пожалуйста, заполните это поле",
  validator: {
    create: {
      module: "core/plugin/form/validator/validator",
      args: [
        {
          strategy: {
            $ref: 'strategy'
          },
          defaultPointMessage: {
            $ref: 'defaultPointMessage'
          }
        }
      ]
    },
    properties: {
      fieldNames: {
        $ref: 'fieldNames'
      }
    }
  },
  controller: {
    create: "core/plugin/form/validator/controller",
    properties: {
      form: {
        $ref: 'form'
      },
      target: {
        $ref: 'target'
      },
      fieldNames: {
        $ref: 'fieldNames'
      },
      successHandler: {
        $ref: 'successHandler'
      },
      messageDisplay: {
        $ref: 'messageDisplay'
      },
      validator: {
        $ref: 'validator'
      }
    },
    after: {
      'validator.addStrategyField': 'addStrategyField',
      'validator.removeStrategyField': 'swithToInitialState | forgetField'
    },
    streams: {
      eventMap: {
        "focus": "before:hideError | before:scrollToFocusInput | filter:isActualField | filter:checkForRegisteredError | getRegisteredError | displayError | alternative:displayHint",
        "keyup": "filter:isActualField |filter:checkAndShowRegisteredError | validate | displayError| highLight | alternative:validate",
        "change": "validate | registerError | highLight",
        "submit": "validateAll",
        "blur": "hideError"
      },
      hooks: {
        $ref: 'streamsHooks'
      }
    }
  }
});
