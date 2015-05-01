define

    $plugins: [
        'wire/dom'
        'wire/dom/render'
    ]

    prospectView:
        render:
            template: '<div id="page"></div>'
        insert:
            at: {$ref: 'slot'}