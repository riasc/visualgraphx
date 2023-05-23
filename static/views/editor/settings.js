// dependencies
define([
    'utils/utils',
    'plugin/views/ui/ui-table',
    'mvc/ui/ui-misc',
    'plugin/graph/forms/settings/basic',
    'plugin/views/ui/ui-elements'], 
    function(Utils, Table, Ui, BasicSettingsForm, Elements) {

    /* ########## VIEW13 ##########*/
    return Backbone.View.extend({
        // initialize
        initialize: function(app, options) {
            var _this = this;    // link of original this (view13)
            this.app = app;     // link the app (view1)
            this.graph = app.graph;

            this.table_title = new Ui.Label({title: 'bla'});
            this.table = new Table.View({});

            var $view = $('<div id="settings"/>');

            this.table.add_subheader(new Elements.Label({ title: 'Basic'}).$el);
            this.table.commit();

            console.log(this.graph);

            // ######### Select2: Graph ############
            console.log(this.graph.graphs);
            graphs_input = [];
            for(var graph in this.graph.graphs.models) {
                var label;
                if(this.graph.graphs.models[graph].toJSON().label == "") {
                    label = parseInt(graph)+1;
                } else {
                    label = this.graph.graphs.models[graph].toJSON().label;
                }
                graphs_input.push({
                    input_value: graph,
                    input_label: label
                });                
            }
            console.log(graphs_input);
            this.table.add('Graph: <div>(default: first in file)</div>');
            this.table.add(new Elements.Select2({
                id: 'select_graph',
                data: graphs_input,
                data_value: 'input_value',
                data_label: 'input_label',
                preselection: this.graph.setup.toJSON().graph,
                info: 'Select the graph (according to label) to be visualized - if the input file specifies multiple graphs. Graphs with missing graph labels can be selected according to the position in the file.',
                onchange: function(value) {
                    console.debug("value has been changed", value);
                    _this.graph.setup.set('graph', value); // change graph

                    console.log(_this.graph.setup.get('graph'));

                    //console.log(_this.graph._rootnode(_this.graph.graphs.models[_this.graph.setup.get('graph')]));
                    console.log(_this.graph._rootnode(_this.graph.graphs.models[_this.graph.setup.get('graph')].toJSON().nodes));
                    
                    // update fields
                    _this.nodelabel._setdata(_this.graph.labels.nodes[_this.graph.setup.get('graph')], _this.graph._defaults(_this.graph.labels.nodes, 'label', _this.graph.setup.get('graph'))); //
                    _this.edgelabel._setdata(_this.graph.labels.edges[_this.graph.setup.get('graph')], _this.graph._defaults(_this.graph.labels.edges, 'label', _this.graph.setup.get('graph'))); //
                    _this.rootnode._setdata(_this.graph.graphs.models[_this.graph.setup.get('graph')].toJSON().nodes, _this.graph._rootnode(_this.graph.graphs.models[_this.graph.setup.get('graph')].toJSON().nodes));

                }
            }).$el);
            this.table.commit();
                 
            console.log(this.graph.setup);

            this.table.add('Edge: <div>(default: directed)</div>');
            this.edge = new Elements.Select2({
                id: 'select_type',
                data: [{input_label: 'directed', input_value: 0},{input_label: 'undirected', input_value: 1}],
                data_value: 'input_value',
                data_label: 'input_label',
                preselection: this.graph.setup.get('edge'),
                info: 'Set the edges as either directed or undirected. Additionally, "file" reads the "directed" properties in the input file and applies it to the graph.',
                onchange: function(value) {
                    console.debug("value has been changed", value);
                    _this.graph.setup.set("edge",value);
                }
            });
            
            /*this.table.add(new Elements.RadioButton({
                id: 'radio_orientation',
                input: [{input_label: 'undirected', input_value: 0},{input_label: 'directed', input_value: 1}, {input_label: 'specified in file', input_value:2}],
                input_name: 'radio_orientation',
                input_value: 'input_value',
                input_label: 'input_label',
                input_type: 'radio',
                preselection: this.graph.setup.toJSON().orientation,
                info: 'Select the orientation of the edges in the graph. This can be either undirected or directed. Furthermore, JGF allows the <b>directed</b> key/pair for each edge that will be considered in "specified in file"',
                onchange: function(value) {
                    console.debug("value has been changed", value);
                    _this.graph.setup.set('orientation', value);
                }
            }).$el, 'radio_orientation');*/
            this.table.add(this.edge.$el);
            this.table.commit();

            console.debug('settings.js:: add edge select field');

            var putroots = this.graph.graphs.models[this.graph.setup.get('graph')].toJSON().nodes;
            if(putroots.length > 1000) {
                putroots = putroots.slice(0,1000);
            }
        
            // ######### SELECT2: Root ############
            this.table.add('Root:<div>(default: lowest id)</div>');
            this.rootnode = new Elements.Select2({
                id: 'field_rootnode',
                data: putroots,
                data_value: 'id',
                data_label: 'label',
                preselection: this.graph.setup.get('rootnode'),   // preselect node set in this.graph.setup
                info: 'Select the (root) node from which the graph will be constructed. ',
                onchange: function(value) {
                    _this.graph.setup.set('rootnode', value); // set the new value for rootnode in graph model
                    console.log("value has been changed", value);
                }
            });
            this.table.add(this.rootnode.$el);
            this.table.commit();
            console.debug('settings.js:: add Root select field');

            
            // ######### SELECT2: Depth ############
            this.table.add('Depth:<div>(default: 2)</div>');
            //console.log(this.graph.data);
            //console.log(this.graph._graphdepth(this.graph.data, this.graph.setup.toJSON().rootnode, []));
            var dpth = [];
            for(i = 0; i <= this.graph.setup.get('max_depth');i++) {
                dpth[i] = {level: i};
            } // create array of objects for select2 field
            console.log(dpth);
            this.depth = new Elements.Select2({
                id: 'field_depth',
                data: dpth,
                data_value: 'level',
                data_label: 'level',
                preselection: this.graph.setup.toJSON().set_depth,
                info: 'Select the initial depth of the graph with 0 being the node itself. If selected depth exceeds the actual depth of the graph, the whole graph will be visualized. ',

                onchange: function(value) {
                    console.log("value has been changed", value);
                    _this.graph.setup.set('set_depth', value);
                }
            });
            this.table.add(this.depth.$el);
            this.table.commit();            

        

            // ######### RadioButton: Source ############
            this.table.add('Source: <div>(default: internal)</div>');
            this.table.add(new Elements.RadioButton({
                id: 'radio_source',
                input: [{input_label: 'internal', input_value: 0},{input_label: 'external', input_value: 1}],
                input_name: 'radio_source',
                input_value: 'input_value',
                input_label: 'input_label',
                input_type: 'radio',
                preselection: this.graph.setup.toJSON().source,
                info: 'Set the source of the graph nodes that can either be generated (internal) or loaded as an (external) graphic when providing an additional key/value pair (as URL) in the input file',
                onchange: function(value) {
                    console.debug("source has been changed", value);
                    _this.graph.setup.set('source', value); // change source according to changed value

                    if(value == 1) { // source change to external
                        _this.table.add('key/value pairs with URLs:', 'external');
                        var extfound = _this.graph.setup.get('external');
                        if(extfound[0]) {
                            _this.table.add('URL has been found the <b>' + extfound[1] + '</b> key/value pair of the nodes metadata object.');
                        } else {
                            _this.table.add('URL key/value pairs have not been found in metadata - nodes will be generated.');
                            _this.graph.setup.set('source', 0); // still draw the graph but internally
                        }
                        
                        _this.table.commit_after('.radio_source');
                    } else { // source changed to internal
                        _this.table._remove('.external');
                    }
                }

            }).$el, 'radio_source');
            this.table.commit();

            console.log(this.graph.labels.nodes[this.graph.setup.get('graph')]);
            // ######### SELECT2: Label ##########
            this.table.add('Node label:<div>(default: label if present)</div>');
            this.nodelabel = new Elements.Select2({
                id: 'select_label_node',
                data: this.graph.labels.nodes[this.graph.setup.get('graph')],
                data_value: 'property',
                data_label: 'property',
                preselection: this.graph.setup.get('label_node'),
                info: 'Select the key/value pair containing the node labels to be displayed in the visualization',
                onchange: function(value) {
                    _this.graph.setup.set('label_node', value);
                }
            });
            this.table.add(this.nodelabel.$el);
            this.table.commit();

            // ######### SELECT2: Label Link ##########
            var tmp = this.graph.labels.edges[this.graph.setup.get('graph')];
            tmp.push({property: 'none'});
            this.table.add('Edge label:<div>(default: label if present)</div>');
            this.edgelabel = new Elements.Select2({
                id: 'select_label_edges',
                data: tmp,
                data_value: 'property',
                data_label: 'property',
                preselection: this.graph.setup.get('label_edge'),
                info: 'Select the key/value pair containing the edge labels to be displayed in the visualization',
                onchange: function(value) {
                    _this.graph.setup.set('label_edge', value);
                }
            });
            this.table.add(this.edgelabel.$el);
            this.table.commit();

            console.log('settings.js:: edgelabel');

            $view.append(this.table_title.$el);
            $view.append(this.table.$el);

            this._refresh();
            this.setElement($view);
        },

         _refresh: function() {
            var graph_definition = this.graph.attributes.definition; // retrieve settings of graph defined in types
            this.table_title.title(graph_definition.category + ' - ' + graph_definition.title);
            //this.basic.update();
        }

    });
});
            /*
            

            
            this.table.add(new Elements.RadioButton({
                id: 'radio_source',
                input: [{input_label: 'internal', input_value: 0},{input_label: 'external', input_value: 1}],
                input_name: 'radio_source',
                input_value: 'input_value',
                input_label: 'input_label',
                input_type: 'radio',
                preselection: this.graph.setup.toJSON().source,
                info: 'Set the source of the graph nodes that can either be generated (internal) or loaded as an (external) graphic when providing an additional key/value pair (as URL) in the input file',

                onchange: function(value) {
                    console.debug("source has been changed", value);
                    _this.graph.setup.set('source', value); // change source according to changed value

                    if(value == 1) { // source change to external
                        _this.table.add('Properties: <div>(default: chart if present )</div>');
                        _this.table.add(new Elements.Select2({
                            id: 'field_source_properties',
                            data: _this.graph.properties.nodes,
                            data_value: 'prop',
                            data_label: 'prop',
                            preselection: _this.graph.setup.toJSON().source_prop,
                            info: 'Select the property of the nodes in the JSON file that includes the external resource (URL)',
                            onchange: function(value) {
                                console.log(value);
                                _this.graph.setup.set('source_prop', value);
                            }
                        }).$el, 'source_properties');
                        _this.table.commit_after('.source');
                    } else { // source changed to internal
                        _this.table._remove('.source_properties');
                    }
                }
            }).$el, 'source');
            this.table.commit();


            // ######### SELECT2: Label ##########
            this.table.add('Node label:<div>(default: name if present)</div>');
            this.nodelabel = new Elements.Select2({
                id: 'select2_nodelabel',
                data: this.graph.properties.nodes,
                data_value: 'prop',
                data_label: 'prop',
                preselection: this.graph.setup.toJSON().label_node,
                info: 'Select the key/value pair contaning the node labels to be displayed in the visualization',
                onchange: function(value) {
                    _this.graph.setup.set('label_node', value);
                }
            });
            this.table.add(this.nodelabel.$el);

            
            // this.linklabel = new Elements.Select2({
            //     id: 'select2_nodelink',
            //     data: this.graph.properties.nodes,
            //     data_value: 'prop',
            //     data_label: 'prop',
            //     info: 'blbla'
            // });
            // this.table.add(this.linklabel.$el);

            this.table.commit();


            // ######### SELECT2: Root ############
            this.table.add('Root:<div>(default: lowest id)</div>');
            // create data array that include both id and name
            var nmnid = this.graph.nodes.toJSON();
            for(key in nmnid) {
                if(nmnid[key] !== undefined && nmnid[key]['name'] !== undefined) {
                    nmnid[key]['nameandid'] = nmnid[key]['name'] + ' (id = ' + nmnid[key]['id'] + ')';
                } else {
                    nmnid[key]['nameandid'] = 'id = ' + nmnid[key]['id'];
                }
            }

            this.root = new Elements.Select2({
                id: 'field_rootnode',
                data: nmnid,
                data_value: 'id',
                data_label: 'nameandid',
                preselection: this.graph.setup.toJSON().rootnode,   // preselect node set in this.graph.setup
                info: 'Select the (root) node from which the graph will be constructed',
                onchange: function(value) {
                    _this.graph.setup.set('rootnode', value); // set the new value for rootnode in graph model

                    /*
                    console.log("value has been changed", value);
                    _this.graph.setup.set('rootnode', value); // set the new value for rootnode in graph model
                    // determine new depth according to new rootnode
                    var depth = _this.graph._graphdepth(_this.graph.data,value,[]);
                    var pres = [];
                    for(i = 0; i <= depth;i++) {
                        pres[i] = {level: i};
                    } // create array of objects for select2 field

                    // set
                    _this.depth._setdata(pres, (depth > 2) ? 2 : depth);
                }
            });
            this.table.add(this.root.$el);
            this.table.commit();


            // ######### SELECT2: Depth ############
            this.table.add('Depth:<div>(default: 2)</div>');
            //console.log(this.graph.data);
            //console.log(this.graph._graphdepth(this.graph.data, this.graph.setup.toJSON().rootnode, []));
            var dpth = [];
            for(i = 0; i <= this.graph.setup.toJSON().max_depth;i++) {
                dpth[i] = {level: i};
            } // create array of objects for select2 field
            console.log(dpth);
            this.depth = new Elements.Select2({
                id: 'field_depth',
                data: dpth,
                data_value: 'level',
                data_label: 'level',
                preselection: this.graph.setup.toJSON().set_depth,
                info: 'Select the initial depth of the graph with 0 being the node itself. If selected depth exceeds the actual depth of the graph, ',

                onchange: function(value) {
                    console.log("value has been changed", value);
                    _this.graph.setup.set('set_depth', value);
                }
            });
            this.table.add(this.depth.$el);
            this.table.commit();

            this.table.add_subheader(new Elements.Label({ title: 'Display Setup'}).$el);
            this.table.commit();

            $view.append(this.table_title.$el);
            $view.append(this.table.$el);

            this._refresh();
            this.setElement($view);

        }, // end initialize

       


/*
        this.form = new TableForm.View(app, {

            });


            this.form.table


            console.log(this.form.table);


            this.setElement(this.form.$el); // */

