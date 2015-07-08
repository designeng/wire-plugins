+[![codecov.io](http://codecov.io/github/designeng/wire-plugins/coverage.svg?branch=dev)](http://codecov.io/github/designeng/wire-plugins?branch=dev)

###wire-plugins
Not a "framework" in common sense: no "core", just plugins for `DSL` semantic extention.

This assumes that you use [wire.js](https://github.com/cujojs/wire) in your application as IOC and [wire.js specifications](https://github.com/cujojs/wire/blob/master/docs/concepts.md#application-composition) as composition layer.

###installation

    git clone https://github.com/designeng/wire-plugins
    cd wire-plugins
    npm install
    grunt

and navigate your browser to `http://localhost:7788/app/#/contacts`.

###usage example
To get to the point, take a look to `contacts` component source code: [app/coffee/components/contacts/spec](https://github.com/designeng/wire-plugins/blob/master/app/coffee/components/contacts/spec.coffee).

###todo
+ Avoid `deferred` [terrible](https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns#the-deferred-anti-pattern) somewhere 
+ Documentation
+ Extract usage example to wire-plugins-example
+ Dist as package to avoid boring 'plugins/etc' in requirejs paths
+ Tests for validation plugin and routing system.