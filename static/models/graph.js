// dependencies
define([], function() {
        // ############ SETUP MODEL ############
        var setup = Backbone.Model.extend({
            defaults: {
                graph: '',
                orientation: 0, // default is directed 
                edge: 0,
                source: '',
                external: '',
                label_node: '',
                label_edge: '',
                rootnode: '',
                max_depth: '',
                set_depth: ''
            }
        });

        // ############ NODE MODEL ############
        var node = Backbone.Model.extend({
            defaults: {
                id: '',
                expanded: false
            }
        });
        var nodes = Backbone.Collection.extend({
            model: node
        });
        
        // ############ LINK MODEL ############
        var link = Backbone.Model.extend({
            defaults: {
                source: '',
                target: ''
            }
        });
        var links = Backbone.Collection.extend({
            mode: link
        });

        // ############ GRAPH MODEL ############
        var graph = Backbone.Model.extend({
            defaults: {
                directed: '',
                type: '',
                label: '',
                metadata: '',
                nodes: new nodes(),
                edges: new links()
            }
        });
        var graphs = Backbone.Collection.extend({
            model: graph
        });


        return Backbone.Model.extend({
            // defaults
            defaults : {
                id: null,
                title: '',
                type: 'd3js_generic',   // d3js_generic as the default (predefined) graph type
                definition: '', // e.g. category
                date: null,
                state: '',
                state_info: '',
                modified: false,
                dataset_id: '',
                dataset_id_job : ''
            },

            // initialize
            initialize: function(app, options) {
                var _this = this; // make copy current Graph Model
                this.app = app; // link app

                // initialize models for nodes and links
                this.graphs = new graphs();
                this.nodes = new nodes();
                this.links = new links();

                // initialize model for the visualization setup (e.g. rootnode, depth)
                this.setup = new setup();

                // set definition of the graph as specified in
                this.set('definition', this.app.types.attributes['d3js_generic']);

                this.listenTo(this, 'sync', function() {
                    this.labels = {};
                    this.labels.nodes = [];
                    this.labels.edges = [];

                    // retrieve the data from the jgf file and write to model
                    var single = this.get('graph'); // 
                    this.graphs.add((typeof single === 'undefined') ? this.get('graphs') : single);
                    for(model in this.graphs.models) {
                        this.graphs.add(this.graphs.models[model]);
                        
                        // 
                        var nodes = this.graphs.models[model].toJSON().nodes;
                        var edges = this.graphs.models[model].toJSON().edges;
                        this.labels.nodes.push(this._labels(nodes));
                        this.labels.edges.push(this._labels(edges));
                    }

                    /* ################# SET initial graph.setup values ##################*/
                    
                    this.setup.set('graph', 0); // default graph (number of occurence)
                    this.setup.set('edge', 1); // default edge type to undirected (=1)
                    
                    this.setup.set('source', 0); // internal or external source of the nodes
                    // check for property with url corresponding to external source
                    this.setup.set('external', this._urlPropertySearch(this.graphs.models[this.setup.get('graph')].toJSON().nodes));
                    
                    // set default (node, edge) label: label if present otherwise first attribute
                    this.setup.set('label_node', this._defaults(this.labels.nodes, 'label', this.setup.get('graph')));
                    //this.setup.set('label_edge', this._defaults(this.labels.edges, 'label', this.setup.get('graph')));
                    this.setup.set('label_edge', 'none');

                    // determine the rootnode of 
                    this.setup.set('rootnode', this._rootnode(this.graphs.models[this.setup.get('graph')].toJSON().nodes));
                    
                    //var depth = this._graphdepth(this.data, rootnode, []);
                    var depth = 100; // default depth - as calculation takes too much time

                    this.setup.set('max_depth', depth);
                    this.setup.set('set_depth', (depth >= 2) ? 2 : depth );

                    console.log(this);


                    this.trigger('ready', this); // fire 'ready'-event - meaning that the data has been fetched

                });
                this.fetch();
            },

            url: function() {
                return this.app.options.durl;
            },

            // determine adjacency list
            _adj: function(data, adj) {
                for(key in data.nodes) {
                    adj[data.nodes[key].id] = []; // intialize nodes
                }
                for(key in data.links) {
                    adj[data.links[key].source].push(data.links[key].target);
                }
            },

            // determines the depth of a graph recursively
            _graphdepth: function(data, rootnode, path) {
                var childs = JSON.search(data, '//links[source="' + rootnode + '"]/target');

                if(childs.length == 0) {
                    return 0;
                } else {
                    path.push(rootnode); // remember active path
                    var sub = [];
                        for(j in childs) {
                            // check if child is in active path: backedge
                            if(path.indexOf(childs[j]) == -1) {
                                sub.push(this._graphdepth(data, childs[j], path) +1);
                            }
                        }
                        return Math.max(...sub);
                }
            },


            // create list with labels of edges and nodes
            _labels: function(collection){
                properties = [];
                if (collection.length > 0) {
                    var keys = Object.keys(collection[0]);
                    //console.log(keys);
                    var i = 0;
                    for (i; i < keys.length; i++) {
                        properties[i] = {property: keys[i]};
                    }
                }
                return properties;
            },


            // check if default(searchterm) value exists as label
            _defaults: function(labels, searchterm, graph){
                if(labels.length > 0) {
                    // set default as 
                    var default_value = labels[graph][0].property;
                    for(property in labels[graph]) {
                        if(labels[graph][property].property.indexOf(searchterm) > -1) {
                            default_value = searchterm;
                        }
                    }
                    return default_value;
                }
            },

            // search for a property in the JSON nodes that consists of an URL otherwise return first
            _urlPropertySearch: function(nodes) { 
                var found = [false, '']; // if and where (property name) url has been found
                var meta = nodes[0].metadata; // get the metadata from first node

                for(property in meta) {
                    var validated = urlValidation(meta[property]);
                    if(validated){
                        found[0] = validated;
                        found[1] = property;    
                    }
                }
                return found;

                // check if property is valid url
                function urlValidation(prop) {
                    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(prop);
                }
            }, 


            // determine the rootnode - if there is root: true in metadata
            _rootnode: function(nodes) {
                
                if($.inArray('metadata', Object.getOwnPropertyNames(nodes[0])) > -1) {
                    // retrieve node object with root == true
                    var rootnode = $.grep(nodes, function(node) { 
                        return node.metadata.root == 'true' 
                    });
                } 

                return nodes[0].id;
                if(rootnode == null) { // equivalent to if(variable === undefined || variable === null)
                    return nodes[0].id;
                } else {
                    return rootnode[0].id; // return the id of first found
                }
            }


            
    });
});




 /*
                if(childs.length == 0) {
                    return 0;
                } else {
                    var sub = [];
                    for(var j in childs) {
                        console.log(childs[j]);
                        if(visited.indexOf(childs[j]) > -1){
                            console.log('already visited');
                        }
                        if(visited.indexOf(childs[j]) == -1) {
                            sub.push(this._graphdepth(data, childs[j], visited) +1);
                            visited.push(childs[j]);
                        }
                    }
                    return Math.max(...sub);
                }*/


                 //  verify the para metrized depth of the graph
            /*_verifydepth : function(data, rootnode, depth) {
                var counter = 0; // counter for the depth
                var verification = false;
                console.log(data);

                // create toplogy of graph as list
                var top = [[rootnode]];

                // iterate through the levels
                while(counter <= depth) {
                    for(tier in top) {
                        for(node in tier) {

                        }
                        top[counter]
                    }
                }
            },/*

            // test for
            _connectivity: function() {

            },

            /*
            //implementation of the iterative deepening depth first search
            _iddfs: function(root) {
                var depth = 1000;
                var found;
                for(var i=0; i <= depth; i++) {
                    found = this_dls(root, depth);
                    if(found) {
                        return;
                    }
                }
                var found = this._dls();
            },


            // implementation of the recursive depth-limited DFS
            _dls: function(node, depth) {
                if(depth == 0) {
                    return;
                }
            },*/
