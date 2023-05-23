// dependencies
define(['libs/underscore'], function(_) {


    function merge (options, optionsDefault) {
        if (options)
            return _.defaults(options, optionsDefault);
        else
            return optionsDefault;
    };

    return {
        merge: merge
    };
});
