require(["wire", "hasher", "wire!specs/bootstrapSpec", "specs/appRouterSpec"], function(wire, hasher, bootstrapCTX, appRouterSpec) {
  return bootstrapCTX.wire(appRouterSpec).then(function(resultCTX) {});
});
