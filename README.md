##wire-plugins

It's not a "framework" in common sense: no "core", just plugins for `DSL` semantic extention.

This assumes that you use `wire.js` in your application as composition layer.

##usage example
As usial, run `npm install` (you should have `node` preinstalled). `grunt-cli` should be installed globaly (instructions [here](http://gruntjs.com/getting-started)).

Start server by running default task `grunt` & navigate your browser to `http://localhost:7788/app/#/contacts`.

`contacts` component source code: `app/coffee/components/contacts`

##todo
+ Documentation
+ Extract usage example to wire-plugins-example
+ Tests for validation plugin and routing system.