define ->
    hashCode = (string) ->
        hash = 0
        if string.length == 0
            return hash
        i = 0
        while i < string.length
            char = string.charCodeAt(i)
            hash = (hash << 5) - hash + char
            hash = hash & hash
            # Convert to 32bit integer
            i++
        return hash