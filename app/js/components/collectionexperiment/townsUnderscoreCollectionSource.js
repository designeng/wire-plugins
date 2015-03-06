define(['rest', 'rest/interceptor/mime', 'rest/interceptor/entity', 'when'], function(rest, mime, entity, When) {
  var client, serviceDefered;
  serviceDefered = When.defer();
  client = rest.wrap(mime).chain(entity);
  client({
    path: '/service/aeroports'
  }).then(function(response) {
    return serviceDefered.resolve(response.airports);
  }, function(error) {
    return console.log("SERVICE ERROR:", error);
  });
  return serviceDefered.promise;
});
