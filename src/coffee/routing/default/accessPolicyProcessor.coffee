define [
    "core/util/navigation/navigate"
], (navigate) ->

    class AccessPolicyProcessor

        askForAccess: (childContext) ->
            if childContext.accessPolicy?
                access = childContext.accessPolicy.checkAccess()
                if !access
                    # access denied, take redirect if defined
                    if childContext.accessPolicy.getRedirect?
                        # route hash should be replaced with the next route hash, without writing in browser history
                        if childContext.__environmentVars.replaceable
                            navigate(childContext.accessPolicy.getRedirect(), "replace")
                        else
                            navigate(childContext.accessPolicy.getRedirect())
                    return false
                else
                    return true
            else
                return true
