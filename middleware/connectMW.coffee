path = require "path"

ConnectMW = {}

ConnectMW.folderMount = (connect, point) ->
    return connect.static path.resolve(point)

module.exports = ConnectMW