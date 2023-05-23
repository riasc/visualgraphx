// dependencies
define([], function() {
    /* ########## VIEW18 ########## */
    return Backbone.View.extend({

        // initialize
        initialize: function(app, options) {
            var _this = this;
            this.app = app;


            console.log("visualizer");

            // set template for the viewer
            this.setElement($(this._tmpl()));

            // set values needed for visualization

            var graph  = {
                did: _this.app.graph.get('dataset_id'),
                type: _this.app.graph.get('type'),
                data: _this.app.dat
            };

            // listen to 'wrap'-event in view1
            this.listenTo(app, 'wrap', function(value) {
                // load wrapper that matches selected graph type
                require(['plugin/graph/' + _this.app.graph_path(graph.type) + '/wrapper'], function(WRAPPER) {
                    this.wrapper = new WRAPPER(value);
                });
            });
        },

        // template for the visualization
        _tmpl: function() {
            return  '<div id="graph-visualization">' + '</div>';
        }
    })
});
