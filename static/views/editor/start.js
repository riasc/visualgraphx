define(['plugin/views/types'],
    function(Types) {
        /* ########## VIEW11 ########## */
        return Backbone.View.extend({
            // initialize
            initialize: function(app) {
                var _this = this; // linkage of this
                this.app = app; // linkage of view1

                this.types = new Types(app, {
                    onchange: function(graph_type) {
                        console.log(graph_type);
                        _this.app.graph.set({type: graph_type});  // set
                        _this.app.graph.set({definition: _this.app.types.attributes[graph_type]});

                        _this.app.editor.settings._refresh();

                        //console.log(this.app.graph.get("type"));

                        console.debug('start.js:: onchange() - switched the graph type', graph_type);
                    }
                });
                this.setElement(this.types.$el);
            }
        }); // Backbone.View.extend
});
