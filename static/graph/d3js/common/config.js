// dependencies
define(['plugin/graph/forms/default'], function(config_default) {
    return $.extend(true, {}, config_default, {
        title: '',
        category: '',
        library: 'd3.js',
        tag: 'svg',
        keywords: 'small'
    });
});
