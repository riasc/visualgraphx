window.console.debug = function() {};
window.console.log = function() {};

// dependencies
define(['utils/utils',
    'mvc/ui/ui-portlet',
    'plugin/views/editor/editor',
    'plugin/views/viewer/viewer',
    'plugin/models/graph',
    'plugin/models/settings',
    'plugin/graph/types',
    'plugin/means/means'],
    function(Utils, Portlet, EDITOR, VIEWER, GRAPH, SETTINGS, TYPES, Means) {
        return Backbone.View.extend({
            /* ########## VIEW1 ########## */

            // initialize
            initialize: function (options) {

                // link options for generic usage
                this.options = options;

                var _this = this;

                // load models
                console.debug('app.js:: new TYPES()');
                this.types = new TYPES();

                // load graph options
                console.debug('app.js:: new GRAPH()');
                this.graph = new GRAPH(this);
                console.log(this.graph);

                // wait until the data from user history has been fetched
                this.listenTo(this.graph, 'ready', function(graph) {
                    console.debug("app.js:: this.graph is ready - fetch has been finished", graph);
                    this.ready(graph);
                });

            }, // end initialize

            ready: function(graph) {

                // load settings
                //console.debug('app.js:: new SETTINGS()');
                //this.settings = new SETTINGS();

                // load editor/viewer
                console.debug('app.js:: new EDITOR()');
                this.editor = new EDITOR(this);

                console.debug('app.js:: new VIEWER()');
                this.viewer = new VIEWER(this);

                console.debug('app.js::this');
                console.debug(this);

                // append
                this.$el.append(this.editor.$el);
                this.$el.append(this.viewer.$el);

                // pick the start screen
                this.go('editor');
                
                //this.trigger('startup', this);


                //this.editor.settings = new SETTINGS(this);
                /*this.editor.tabs.add({
                    id: 'settings',
                    title: 'settings',
                    $el: this.editor.settings.$el
                });
                console.log(this);*/
            },

            go: function(view_id) {
                // select view
                switch(view_id) {
                    case 'editor':
                        console.debug('app.js:: go() - switch to editor');
                        this.editor.show();
                        this.viewer.hide();
                        break;
                    case 'viewer':
                        console.debug('app.js:: go() - switch to viewer');
                        this.trigger('wrap', this);   // trigger wrap to load the wrapper
                        this.editor.hide();
                        this.viewer.show();
                        break;
                }
            },

            // get path
            graph_path: function(graph_type) {
                // create path from id
                var path = graph_type.split(/_(.+)/);

                // check path
                if (path.length >= 2) {
                    // return path
                    return path[0] + '/' + path[1];
                }
                return undefined;
            }
        }); // Backbone.View
}); //
