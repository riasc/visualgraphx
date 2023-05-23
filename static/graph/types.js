    // dependencies
define(['plugin/graph/d3js/generic/config',
    'plugin/graph/d3js/covenntree/config'],
    function(d3js_generic, d3js_covenntree) {
        // widget
        return Backbone.Model.extend({
            // types
            defaults: {
                'd3js_generic': d3js_generic
                //'d3js_covenntree': d3js_covenntree
            }
        });
});
