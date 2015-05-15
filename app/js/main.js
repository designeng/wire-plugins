require(["wire", "wire!specs/bootstrapSpec", "specs/appRouterSpec"], function(wire, bootstrapCTX, appRouterSpec) {
  return bootstrapCTX.wire(appRouterSpec).then(function(resultCTX) {});
});
