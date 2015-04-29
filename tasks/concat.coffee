_ = require "underscore"

module.exports = (grunt) ->

    grunt.registerMultiTask "concatFiles", "files concatination", ->

        content = ""
        errors = []

        for file in @.data.src
            try
                fileContent = grunt.file.read file
                content += fileContent
            catch err
                errors.push err
                if err.origError.code == "ENOENT"
                    console.warn "NO FILE FOUND:::", file
                else
                    console.warn "Error in concatFiles task"

        if !errors.length        
            grunt.file.write @.data.dest, content

        grunt.log.ok "OK"