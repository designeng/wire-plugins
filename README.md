###wire-plugins
Not a "framework" in common sense: no "core", just plugins for `DSL` semantic extention.

This assumes that you use `wire.js` in your application as composition layer.

###installation
`git clone https://github.com/designeng/wire-plugins
cd wire-plugins
npm install
grunt`
and navigate your browser to `http://localhost:7788/app/#/contacts`.

###usage example
To get to the point, take a look to `contacts` component source code: `app/coffee/components/contacts/spec`.

###todo
+ Avoid `deferred` [terrible](https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns#the-deferred-anti-pattern) somewhere 
+ Documentation
+ Extract usage example to wire-plugins-example
+ Dist as package to avoid boring 'plugins/etc' in requirejs paths
+ Tests for validation plugin and routing system.