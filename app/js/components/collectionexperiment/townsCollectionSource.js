define(['cola/adapter/Array', 'rest', 'rest/interceptor/mime', 'rest/interceptor/entity', 'when'], function(ArrayAdapter, rest, mime, entity, When) {
  var client, serviceDefered;
  serviceDefered = When.defer();
  client = rest.wrap(mime).chain(entity);
  client({
    path: '/service/aeroports'
  }).then(function(response) {
    var source;
    source = new ArrayAdapter(response.airports);
    return serviceDefered.resolve(source);
  }, function(error) {
    return console.log("SERVICE ERROR:", error);
  });
  return serviceDefered.promise;
});
