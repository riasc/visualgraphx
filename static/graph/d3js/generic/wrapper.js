// dependencies
define([], function() {
    //* ########## VIEW22 ########## */
    return Backbone.View.extend({
        // select id that has been create in the template of visualizer
        el: "#graph-visualization",

        // initialize
        initialize: function(app, options) {
            var _this = _(app).clone();   //
            this.app = app; // linkage of the view1
            this.setup = app.graph.setup; // linkage of the setup
            
            this.graph = {}; // retrieve the graph and sort the data
            this.graph.nodes = app.graph.graphs.models[this.setup.get('graph')].toJSON().nodes;
            this.graph.edges = app.graph.graphs.models[this.setup.get('graph')].toJSON().edges;

            this.render(); // render it! 
        },

        // render the content
        render: function() {
            
            var _this = this;
            var graph = this.graph;
            var setup = this.setup.toJSON();

            //console.log(graph);
            //console.log(setup);

            var radius = 12; // set radius of node

            // create nodes and links for subgraph
            var subgraph = {};
            subgraph.nodes = [];
            subgraph.links = [];

            // read dimension of browser window
            var canvas = {
                width: $('#graph-visualization').width(),
                height: $(window).height()
            };

            /*var zoomer = d3.behavior.zoom()
                .scaleExtent([0.1,10])
                .on("zoom", zoomed);*/

            // set svg canvas
            var svg = d3.select('#graph-visualization')
                        .append("svg:svg")
                        .attr("height", canvas.height)
                        .attr("width", canvas.width)
                        .attr("id", "canvas");

            if(setup.edge == 0) {
                
            }

            var nodes = [],
                links = [];

            var force = d3.layout.force()
                        .gravity(.05)
                        .linkDistance(100)
                        .charge(-1000)
                        .nodes(nodes)
                        .links(links)
                        .size([$('svg').attr('height'), $('svg').attr('width')]);

            var node = svg.selectAll(".node"),
                link = svg.selectAll('.link');

            var drag = force.drag().on("dragstart", dragstart);

            /* #################### INITIALIZE #################### */
            var hashcounter = 0; // create pseudo hash table
            var lookup = []; 

            var top = []; // buffer topology of the graph
            var topl = {};
            
            buildup({}, setup.rootnode, setup.set_depth);
            update();
            
            // calm the layout
            var k = 0;
            while ((force.alpha() > 1e-2) && (k < 150)) {
                force.tick(),
                k = k + 1;
            }

            //
            function update() {
                //console.log(nodes);
                //console.log(links);
                
                /* #################### LINKS #################### */
                link = link.data(links, function(d) { 
                        return d.source.id + '-' + d.target.id; 
                    });
                // create group for links and link labels
                var linktag = link.enter().append("g").attr("class", "link");
                // if edge type is directed
                if(setup.edge == 0) {
                    var directed = svg.append("svg:defs").selectAll("marker")
                        .data(["end"])      // Different link/path types can be defined here
                        .enter().append("svg:marker")    // This section adds in the arrows
                        .attr("id", String)
                        .attr("viewBox", "0 -5 10 10");

                    // internal source
                    if(setup.source == 0){
                        directed = directed.attr("refX", 23).attr("refY", 0);
                    } else { // external source
                        directed = directed.attr("refX", 10).attr("refY", 0);
                    }
                    
                    directed = directed
                        .attr("markerWidth", 6)
                        .attr("markerHeight", 6)
                        .attr("orient", "auto")
                        .append("svg:path")
                        .attr("d", "M0,-5L10,0L0,5"); 

                    var linkline = linktag.append("svg:path")
                        .attr("class", "linkline")
                        .attr("marker-end", "url(#end)");
                } else if(setup.edge == 1) {
                    var linkline = linktag.append("line").attr("class", "linkline");
                }
                
                // add 
                var linktext = linktag.append("text").attr("class", "linktext")
                    .text(function(d) {
                        return d[setup.label_edge];
                });
                link.exit().remove();
                

                /* #################### NODES #################### */
                node = node.data(force.nodes(), function(d) { 
                    return d.id; 
                });
                node.exit().remove();

                var appended = node.enter().append("g").call(drag);

                if(setup.source == 0) {
                    appended.append("circle")
                        .attr("class","node")
                        .attr("r", radius - .75);
                } else {
                    appended.append('image')
                            .attr("xlink:href", function(d) {
                                return d.metadata[setup.external[1]];
                            })
                            .attr('x', '-8px')
                            .attr('y', '-8px')
                            .each(imagesize);
                }

                    appended.append("title").text(function(d) {
                        var adjlen = -1;
                        if(!d.expanded) { // if expanded = false
                            var adj = JSON.search(graph, "//edges[source='" + d.id +"']");
                            adjlen = adj.length;
                        }
                        if(adjlen == 0) {
                            return 'max depth reached';
                        } 
                        if(adjlen > 0) {
                            return 'expandable';
                        }
                        if(adjlen == -1) {
                            return '';
                        }
                    });

                appended
                    .on("dblclick", dblclick)
                    .on("contextmenu", dragend);
                
                appended.append("svg:text")
                    .attr("dx", function(d) {
                        //console.log(d);
                        return (d.width/2);
                    })
                    .attr("dy", function(d) {
                        return (d.height/2);
                    })
                    //.attr("dy", ".35em")
                    .text(function(d) { return d[setup.label_node]; });

                
                force.on("tick", function(e) {
                    if(setup.edge == 1) {
                        if(setup.source == 0) {
                            link.selectAll("line").attr("x1", function(d) { 
                                return d.source.x; 
                            })
                            .attr("y1", function(d) { 
                                return d.source.y; 
                            })
                            .attr("x2", function(d) { 
                                return d.target.x; 
                            })
                            .attr("y2", function(d) { 
                                return d.target.y;
                            });

                        } else {
                            link.selectAll("line").attr("x1", function(d) { 
                                return d.source.x + (d.source.width ? d.source.width/2 : 0); 
                            })
                            .attr("y1", function(d) { 
                                return d.source.y + (d.source.height ? d.source.height/2 : 0);
                            })
                            .attr("x2", function(d) { 
                                return d.target.x + (d.target.width ? d.target.width/2 : 0);
                            })
                            .attr("y2", function(d) { 
                                return d.target.y + (d.target.height ? d.target.height/2 : 0); 
                            });
                        }
                    } else {
                        link.selectAll("path").attr("d", function(d) {
                            var dx = d.target.x - d.source.x,
                                dy = d.target.y - d.source.y,
                                //dr = Math.sqrt(dx * dx + dy * dy);
                                dr = 0;
                                return "M" + 
                                (d.source.x + (d.source.width ? d.source.width/2 : 0)) +  
                                "," + 
                                (d.source.y + (d.source.height ? d.source.height/2 : 0)) +
                                "A" + 
                                dr + "," + dr + " 0 0,1 " + 
                                (d.target.x + (d.target.width ? d.target.width/2 : 0)) +
                                "," + 
                                (d.target.y + (d.target.height ? d.target.height/2 : 0));
                        });
                    }

                    linktext
                        .attr("x", function(d) {
                            return ((d.source.x + d.target.x)/2);
                        })
                        .attr("y", function(d) {
                            return ((d.source.y + d.target.y)/2);
                        });
                
                    node.attr("transform", function(d) {
                        if(setup.source == 0) {
                            if(d.id==0){
                                damper = 0.1;
                                d.x = d.x + ($('svg').attr('width')/2 - d.x) * (damper + 0.02) * e.alpha;
                                d.y = d.y + ($('svg').attr('height')/2 - d.y) * (damper + 0.02) * e.alpha;
                            }

                            var x = Math.max(radius, Math.min($('svg').attr('width')  - radius, d.x));
                            var y = Math.max(radius, Math.min($('svg').attr('height') - radius, d.y));
                            return "translate(" + x + "," + y + ")";
                        } else {
                            if(d.id==0){
                                damper = 0.1;
                                d.x = d.x + ($('svg').attr('width')/2 - d.x) * (damper + 0.02) * e.alpha;
                                d.y = d.y + ($('svg').attr('height')/2 - d.y) * (damper + 0.02) * e.alpha;
                            }

                            var x = Math.max(radius, Math.min($('svg').attr('width')  - imagesize2(d.metadata[setup.external[1]])[0], d.x));
                            var y = Math.max(radius, Math.min($('svg').attr('height') - imagesize2(d.metadata[setup.external[1]])[1], d.y));
                            return "translate(" + x + "," + y + ")";
                        }
                    });
                });
                force.start();
            }
            
            /* #################### INTERACTION #################### */
            function dragstart(d) {
                d3.select(this).classed("fixed", d.fixed = true);
            }

            function dragend(d) {
                d3.select(this).classed("fixed", d.fixed = false);
            }

            function zoomed() {
                console.log('zooming');
                //appended.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
            }

            /* #################### GRAPH MANIPULATION #################### */
            // build the initial graph to be visualized with the specified settings
            function buildup(predecessor, root, depth) {
                console.debug('wrapper.js:: buildup()');
                
                
                // traverse the graph recursively
                function traverse(activePredecessor, activeRoot, activeDepth) { 
                    
                    // retrieve node (root) and outgoing nodes
                    var node = JSON.search(graph, "//nodes[id='" + activeRoot + "']")[0];
                    
                    var inbound = JSON.search(graph, "//edges[target='" + activeRoot +"']");
                    node.expanded = false; nodes.push(node); 
                    
                    top.push(node.id);  // add id of the node to topology buffer
                    // check if indegree is > 0
                    if(inbound.length > 0) { // check if active node has incoming edges
                        // check if node has no parents
                        if(!_.isEmpty(activePredecessor)) {
                            if(!topl.hasOwnProperty([activePredecessor.id, node.id])){
                                //var theedge = inbound[key];
                                //theedge.source = activePredecessor; 
                                //theedge.target = node; 
                                //console.log(theedge); //links.push(theedge);
                                
                                links.push({source: activePredecessor, target: node}); //
                                topl[[activePredecessor.id, node.id]] = 0; //
                            }   
                        }
                    }

                    //update();
   
                    if(activeDepth > 0) { // traverse graph if desired depth > 0
                        var outbound = JSON.search(graph, "//edges[source='" + activeRoot + "']");
                        if(outbound.length > 0) {
                            nodes[nodes.length-1].expanded = true;
                        }
                        for(key in outbound) {   
                            // only follow the path if node is not already in topology / cyclic
                            if(top.indexOf(outbound[key].target) < 0) {
                                
                                //console.log(node);
                                //console.log(outbound[key].target);
                                traverse(node, outbound[key].target, activeDepth-1);    
                            }
                        }
                    }
                }
                traverse(predecessor, root, depth); // call traverse for the first time               
            }

            // 
            function dblclick(node) {
                if(node.expanded == false) {
                    console.debug('wrapper.js:: dblclick(node) - expand()');
                    node.expanded = true;
                    expand(node);
                } else { // node is already expanded
                    console.debug('wrapper.js:: dblclick(node) - contract()');
                    node.expanded = false;
                    contract(node);
                }
            }

            // expands forwarded node by an level
            function expand(node) {
                // retrieve child nodes of node
                var childs = JSON.search(graph, "//edges[source='" + node.id + "']");
                console.log(node);
                console.log(graph);
                console.log(childs);
                if(childs.length > 0) { // node has childs
                    for(key in childs) {
                        var child = JSON.search(graph, "//nodes[id='" + childs[key].target + "']")[0];
                        child.expanded = false;
                        nodes.push(child); // add node of child to nodes
                        links.push({source: node, target: child});
                    }
                }
                update();
            }

            // contracts forwarded node by an level
            function contract(node) {
                var tgra = {}; tgra.nodes = nodes; tgra.edges = links;
                var outbound = JSON.search(tgra, "//edges[source/id='" + node.id + "']");
                console.log(outbound);

                for(key in outbound) { destroy(outbound[key].target, tgra); }
                
                // recursively remove nodes and links starting from given node
                function destroy(n) {
                    console.log(n);
                    var inbound = JSON.search(tgra, "//edges[target/id='" + n.id + "']");
                    // remove inbound links from 
                    for(key in inbound) {
                        var pos = links.indexOf(inbound[key]);
                        links.splice(pos,1);
                    }
                    // remove active node n
                    var pos = nodes.indexOf(n); // position of n in nodes
                    nodes.splice(pos, 1); // remove n from nodes

                    console.log(nodes);
                    update(); // update force layout

                    // 
                    var outbound = JSON.search(tgra, "//edges[source/id='" + n.id + "']");
                    for(key in outbound) {
                        destroy(outbound[key].target);
                    }

                }
            }

            /* #################### HELP FUNCTIONS #################### */
            // determine the size (width, height) of an image link
            function imagesize(d) {
                var self = d3.select(this);
                function loaded() {
                    d.width = img.width;
                    d.height = img.height;
                    self.attr('width', d.width);
                    self.attr('height', d.height);
                }
                var img = new Image();
                img.src = self.attr('href');
                if(img.complete) {
                    loaded();
                } else {
                    img.addEventListener('load', loaded);
                    img.addEventListener('error', function() {
                        console.debug('error');
                    });
                }
            }

            // disable contextmenu
            document.oncontextmenu = function() {
                return false;
            }

            function imagesize2(link) {
                var img = new Image();
                img.src = link;
                return [img.width, img.width];
            }


        
        } // end render
    });
});