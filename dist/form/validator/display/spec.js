define({
  $plugins: ["wire/dom", "wire/dom/render", "wire/on"],
  displayView: {
    render: {
      template: {
        $ref: 'displayViewTemplate'
      }
    },
    insert: {
      at: {
        $ref: 'displaySlot'
      }
    }
  },
  controller: {
    create: "plugins/form/validator/display/controller",
    properties: {
      displayView: {
        $ref: 'displayView'
      },
      displayListItemPattern: {
        $ref: 'displayListItemPattern'
      },
      displaySlot: {
        $ref: 'displaySlot'
      },
      displaySlotClass: {
        $ref: 'displaySlotClass'
      }
    },
    ready: {
      onReady: {}
    }
  }
});
