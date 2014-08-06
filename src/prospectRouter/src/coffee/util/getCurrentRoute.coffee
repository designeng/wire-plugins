define [
    "hasher"
], (hasher) -> 
    getCurrentRoute = () ->
        return hasher.getHash()