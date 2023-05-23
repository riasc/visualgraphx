graph = {};

 // build subgraph recursively out of graph
graph.build =  function build(root, depth) {
                // get the node object and its outbounds
                var node = JSON.search(graph, '//nodes[id="' + root + '"]');
                var outbound = JSON.search(graph, '//links[source="' + root + '"]');

                //
                if((depth == 0) || (outbound.length == 0)) {
                    subgraph.nodes = subgraph.nodes.concat(node);
                } else {
                    node[0].expanded = true;
                    subgraph.nodes = subgraph.nodes.concat(node);
                    subgraph.links = subgraph.links.concat(outbound);
                    for(key in outbound) {
                        build(outbound[key].target, depth-1);
                    }
                }
} // end function build
