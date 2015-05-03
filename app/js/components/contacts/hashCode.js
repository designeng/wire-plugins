define(function() {
  var hashCode;
  return hashCode = function(string) {
    var char, hash, i;
    hash = 0;
    if (string.length === 0) {
      return hash;
    }
    i = 0;
    while (i < string.length) {
      char = string.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
      i++;
    }
    return hash;
  };
});
