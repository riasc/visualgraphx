// import dependencies
define(['mvc/ui/ui-tabs',
    'mvc/ui/ui-misc',
    'mvc/ui/ui-portlet',
    'utils/utils',
    'plugin/views/editor/start',
    'plugin/views/editor/settings',
    'plugin/views/types'],
    function(Tabs, Ui, Portlet, Utils, StartTab, SettingsTab, Types) {
    /* ########## VIEW4 ########## */
    return Backbone.View.extend({
            // initialize
            initialize: function(app, options) {

                var _this = this; // linkage of original this (view4)
                console.debug('editor.js:: initialize() - link this (view4) in _this');
                 /* link the app (view1) for method invocation without parameters in editor.js*/
                this.app = app;
                console.debug('editor.js:: initialize() - link the app (view1) in this.app')
                // create message element from ui-misc
                this.message = new Ui.Message(); // cid = "view3"
                console.debug('editor.js:: initialize() - link ui-message (view3) in this.message');

                // create the portlet that functions as canvas for the editor
                this.portlet = new Portlet.View({
                    icon: 'fa fa-pencil-square-o',
                    title: 'VisualGraphX - Interactive Graph Visualization',
                    operations: {
                        'save': new Ui.ButtonIcon({
                            tooltip: 'Visualize the Graph',
                            title: 'Visualize',
                            icon: 'fa fa-long-arrow-right',
                            onclick: function() {
                                _this.app.go('viewer');
                            }
                        })
                    }
                });
                console.debug('editor.js:: initialize() - link portlet (view9) in this.portlet');

                // ########## TABS ##########
                // create the tabs on editor screen
                this.tabs = new Tabs.View({});
                console.debug('editor.js:: initialize() - link tabs (view10) in this tabs');

                // ########## START ##########
                this.start = new StartTab(app);
                $start = this.start.$el;

                // create the tab: "start" itself
                this.tabs.add({
                    id: 'start',
                    title: 'Start',
                    $el: $start
                });

                // ########## SETTINGS ##########
                this.settings = new SettingsTab(app);
                $settings = this.settings.$el; // create the tab: "Settings" itself
                this.tabs.add({
                        id: 'settings',
                        title: 'Settings',
                        $el: $settings
                });

                // fetch message and tab elements to portlet
                this.portlet.append(this.message.$el.addClass('ui-margin-top'));
                this.portlet.append(this.tabs.$el);

                this.portlet.append('<br/><b>Example:</b>');
                var manual = '<p>1. Select the type of graph in VisualGraphX in the <b>Start</b> tab - here: <b>Generic (d3.js) </b> is the only available type. </p>';
                manual += '<p><ul>2. Switch to the <b>Settings</b> tab and set the parameters for the initial visualization.</ul>';
                manual += '<li><b>Graph:</b> as the JSON Graph Format allows multiple graph objects, the parameter "Graph" specifies the graph object that is subject to the visualization. Graphs in the drop-down list correspond to the values of the "label" property of the graph object. If the "label" property has not been specified in the graph object, its position in the input file will be displayed as value in the drop-down list. Default setting is the first graph in input file. </li>';
                manual += '<li><b>Edge:</b> set the edge type in the graph connecting a set of vertices that can be either directed or undirected. Furthermore, the JSON Graph Format allows a "directed" properties in the graph object and the option "file" applies the values to the graph. If "directed: true" has been set in the graph object the graph will be drawn as directed graph. Similarly with "directed: false" that results in an undirected graph. </li>';
                manual += '<li><b>Root:</b> set the (root) node that functions as origin of the visualized subgraph that in turn will be derived through traversion of the original (complete) graph. Optionally, the root node can directly be specified in any input file that comes in the JSON Graph Format. In the "metadata" property of the node objects, the key/value pair "root: true" sets the node as root. If multiple node objects include "root: true", then the first one in the input file is used.  If there is no "directed" property in the graph object or the edge objects, the graph will be drawn with the directed edges</li>';
                manual += '<li><b>Depth:</b> set the depth of the visualized subgraph starting from the root node. A graph with a depth of 0 consists of only the root node. Similarly, a graph with a depth of 1 consists of the root node and all the outgoing edges with the corresponding nodes,  and so on. If the specified depth exceeds the depth of the original (complete) graph, then the whole graph is visualized. By default the depth is set to 2.</li>'
                manual += '<li><b>Source: </b> set the source of the graph nodes to "internal" or "external". The former simply draws the nodes as predefined circle elements, where the latter incorporates any graphic on an external location as nodes. On "external" the metadata property in the node objects is scanned for key/value pairs that contain an URL. If such an property could be found then the graphic is loaded asynchronously in the visualization.</li>'
                manual += '<li><b>Node and Edge label:</b> set the property in the node and edge objects whose values will be displayed in the visualization next to the nodes and edges.</li></p>';
                manual += '<p><ul>3. Click <b>Visualize</b> to draw the graph.</ul>';
                manual += '<li>Double Click: Expand/Collapse </li>';
                manual += '<li>Click&Drag: Move and Pin the nodes</li>';
                manual += '<li>Right Click: Unpin the nodes</li></p>';
                this.portlet.append(manual);


                // override editor.js el with portlet el
                this.setElement(this.portlet.$el);
                this.reset(); // reset the settings for the graph

            }, // initialize


            // show
            show: function() {
                this.$el.show();
            }, // end show

            // hide
            hide: function() {
                this.$el.hide();
            }, // end hide

            // reset the graph
            reset: function() {
                this.app.graph.set('type', 'd3js_generic'); // set d3js_generic as default graph type
                this.app.graph.set('dataset_id', this.app.options.config.dataset_id);
                console.debug('editor.js:: reset() - ');
            }
    }); // end Backbone.View.extend
}); // define


 /*
                this.listenTo(this.app, 'startup', function() {
                    console.log('bla something');
                    this.settings = new SettingsTab(app);
                    $settings = this.settings.$el;
                    this.tabs.add({
                        id: 'settings',
                        title: 'Settings'
                    });
                });*/

