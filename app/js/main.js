require(["wire", "hasher", "wire!bootstrapSpec", "routerMainSpec"], function(wire, hasher, bootstrapCTX, routerMainSpec) {
  return bootstrapCTX.wire(routerMainSpec).then(function(resultCTX) {
    hasher.prependHash = "";
    return hasher.init();
  });
});
