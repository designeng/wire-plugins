define [
    "underscore"
    "jquery"
    "when"
], (_, $, When) ->

	# it's not a power deep extension, because extends only first-level properties
	firstLevelExtend = (original, provider) ->
		for prop, value of provider
			if _.isObject(original[prop])
				original[prop] = _.extend original[prop], provider[prop]
			else
				original[prop] = provider[prop]
		return original

	class Validator

		parsedStrategy: {}

		defaultPoint:
			rule: (value) -> if value is "" then false else true

		constructor: (options) ->
			@options = options
			@defaultPoint.message = options.defaultPointMessage || "Should not be empty!"
			@setStrategy(options)

		setStrategy: (options) ->
			@strategy = options.strategy
			possibleFields = {}
			for fieldName, fieldPoints of options.strategy
				possibleFields[fieldName] = true
				fieldPoints = @stuffFieldPointsWithDefault(fieldPoints)
				@parsedStrategy[fieldName] = @normalizePoints(fieldPoints)
			@fieldNames = possibleFields

		# connector
		removeStrategyField: (fieldName) =>
			return fieldName

		# connector
		addStrategyField: (fieldName) ->
			return fieldName

		getStrategy: ->
			return @strategy

		# @param {String} fieldName
		# @param {String | Number} value
		# @returns {Object} result - validation result
		# 		- {Array} result.errors
		validate: (fieldName, value, formInputs, controller) ->
			value = $.trim(value) if _.isString value
			points = @parsedStrategy[fieldName]

			getDependencies = (dependsOn) ->
				obj = {}
				_.forEach dependsOn.split(","), (dependency) ->
					dependency = $.trim dependency
					obj[dependency] = formInputs[dependency].val()
				return obj

			iterator = (result, point) ->
				if result.errors
					return result
				else
					if point?.transform?
						value = point.transform(value)
					if point.dependsOn?
						dependencies = getDependencies(point.dependsOn)
					if point.invoke?
						if point.invoke.condition?
							controller.invoke(point.invoke.name, point.invoke.condition)

					if !point.rule(value, fieldName, dependencies, formInputs, controller)
						result["errors"] = []
						result["errors"].push point.message
					return result

			result = _.reduce(points, iterator, {})

			return result

		stuffFieldPointsWithDefault: (fieldPoints) ->
			fieldPoints    = _.clone(fieldPoints)
			if !fieldPoints.common?.optional
				defaultPoint   = @getDefaultPoint(fieldPoints)
				fieldPoints[0] = defaultPoint
			if fieldPoints.common?.transform
				_.forEach fieldPoints, (point) ->
					if point?
						point.transform = fieldPoints.common.transform
			delete fieldPoints.common
			return fieldPoints

		# TODO: message = false : make it more obvious
		getDefaultPoint: (fieldPoints) ->
			if fieldPoints.common?
				defaultPoint = _.clone(@defaultPoint)
				defaultPoint = _.extend(defaultPoint, fieldPoints.common)
			else
				defaultPoint = @defaultPoint
			return defaultPoint

		normalizePoints: (points) ->
			points = _.filter points, (item, key, index) =>
				if key is "hint"
					return false 
				else 
					return true

			points = _.map points, (item, key, index) =>
				item.rule = @normalizeRule(item.rule)
				return item
			return points

		# we want deal with the function
		normalizeRule: (rule) ->
			if _.isFunction rule
				return rule
			else if _.isRegExp rule
				return (value) ->
					return value.match rule

		# validator plugin API:
		extendStrategy: (additionalStrategy) =>
			@setStrategy({strategy: firstLevelExtend(@strategy, additionalStrategy)})