define([], function() {
    return {
        merge: function(options, defaults) {
            if (options)
                return _.defaults(options, defaults);
            else
                return defaults;
        },
        uuid: function() {
            return 'xxxxxxxx'.replace(/x/g, function() {
                return Math.floor(Math.random() * 16).toString(16);
            });
        }
    };
});
