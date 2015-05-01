define(function() {
  var groundRoutes;
  return groundRoutes = {
    "{plain}": {
      spec: "specs/prospect/plain/spec",
      slot: {
        $ref: "dom.first!#prospect"
      },
      rules: {
        plain: /\bcontacts\b/i
      }
    }
  };
});
