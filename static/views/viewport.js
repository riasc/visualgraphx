//dependencies
define(['mvc/ui/ui-portlet',
    'mvc/ui/ui-misc',
    'utils/utils'], function(Portlet, Ui, Utils) {
    /**
     *
     *
     **/
    return Backbone.View.extend({

        // canvas elements
        container_list: [],
        convas_list: [],

        // initialize
        initialize: function(app, options) {
            this.app = app; // link app
            this.graph = this.app.graph; // link graph

            this.options = Utils.merge(options, this.optionsDefault);

            this.setElement($(this._template())); // create element
            this._fullscreen(this.$el, 100); // use full screen for viewer
            this._createContainer('div'); // create container element

            // events
            var self = this;
            this.graph.on('redraw', function() {
                self._draw(self.graph);
            });

            // link status handler
            this.graph.on('set:state', function() {
                // get info element
                var $info = self.$el.find('#info');
                var $container = self.$el.find('.graph-viewport-container');

                var $icon = $info.find('#icon'); // get icon
                $icon.removeClass(); // remove icon

                // show info
                $info.show();
                $info.find('#text').html(self.graph.get('state_info'));

                // check status
                var state = self.graph.get('state');
                switch (state) {
                    case 'ok':
                        $info.hide();
                        $container.show();
                        break;
                    case 'failed':
                        $icon.addClass('icon fa fa-warning');
                        $container.hide();
                        break;
                    default:
                        $icon.addClass('icon fa fa-spinner fa-spin');
                        $container.show();
                }
            });

        }, // end initalize

        // show
        show: function() {
            this.$el.show();
        },

        // hide
        hide: function() {
            this.$el.hide();
        },

        // resize to fullscreen
        _fullscreen: function($el, margin) {
            // fix size
            $el.css('height', $(window).height() - margin);

            // catch window resize event
            $(window).resize(function () {
                $el.css('height', $(window).height()  - margin);
            });
        },

        // creates n canvas elements
        _createContainer: function(tag, n) {
            // check size of requested canvas elements
            n = n || 1;

            // clear previous canvas elements
            for (var i in this.container_list) {
                this.container_list[i].remove();
            }

            // reset lists
            this.container_list = [];
            this.canvas_list = [];

            // create requested canvas elements
            for (var i = 0; i < n; i++) {
                // create element
                var container_el = $(this._templateContainer(tag, parseInt(100 / n)));

                // add to view
                this.$el.append(container_el);

                // add to list
                this.container_list[i] = container_el;

                // add a separate list for canvas elements
                this.canvas_list[i] = container_el.find('.graph-viewport-canvas').attr('id');
            }
        }, // end _createContrainer

    // add
    _draw: function(graph) {
        var self = this; // link this
        var process_id = this.app.deferred.register(); // register process
        var graph_type = graph.get('type');         // identify graph type
        this.graph_definition = graph.definition; // load graph settings

        // determine number of svg/div-elements to create
        var n_panels = 1;
        if (graph.settings.get('use_panels') === 'true') {
            n_panels = graph.groups.length;
        }

        this._createContainer(this.graph_definition.tag, n_panels); // create canvas element and add to canvas list

        graph.state('wait', 'Please wait...'); // set graph state

        // clean up data if there is any from previous jobs
        if (!this.graph_definition.execute ||
            (this.graph_definition.execute && graph.get('modified'))) {

            // reset jobs
            this.app.jobs.cleanup(graph);

            // reset modified flag
            graph.set('modified', false);
        }

        // create graph view
        var self = this;
        require(['plugin/graph/' + this.app.graphPath(graph_type) + '/wrapper'], function(GraphView) {
            if (self.graph_definition.execute) {
                self.app.jobs.request(graph, self._defaultSettingsString(graph), self._defaultRequestString(graph),
                    function() {
                        var view = new GraphView(self.app, {
                            process_id: process_id,
                            graph: graph,
                            request_dictionary: self._defaultRequestDictionary(graph),
                            canvas_list: self.canvas_list
                        });
                    },
                    function() {
                        this.app.deferred.done(process_id);
                    }
                );
            } else {
                var view = new GraphView(self.app, {
                    process_id: process_id,
                    graph: graph,
                    request_dictionary: self._defaultRequestDictionary(graph),
                    canvas_list: self.canvas_list
                });
            }
        });
    },

    //
    // REQUEST STRING FUNCTIONS
    //
    // create default graph request
    _defaultRequestString: function(graph) {
        var request_string = ''; // config request

        // add groups to data request
        var group_index = 0;
        var self = this;
        graph.groups.each(function(group) {
            // increase group counter
            group_index++;

            // add selected columns to column string
            for (var key in self.graph_definition.columns) {
                request_string += key + '_' + group_index + ':' + (parseInt(group.get(key)) + 1) + ', ';
            }
        });

        // return
        return request_string.substring(0, request_string.length - 2);
    },

    // create default graph request
    _defaultSettingsString: function(graph) {

        // configure settings
        var settings_string = '';

        // add settings to settings string
        for (key in graph.settings.attributes) {
            settings_string += key + ':' + graph.settings.get(key) + ', ';
        };

        return settings_string.substring(0, settings_string.length - 2); // return
    },

    // create default graph request
    _defaultRequestDictionary: function(graph) {
        // configure request
        var request_dictionary = {
            groups : []
        };

        // update request dataset id
        if (this.graph_definition.execute) {
            request_dictionary.id = graph.get('dataset_id_job');
        } else {
            request_dictionary.id = graph.get('dataset_id');
        }

        // add groups to data request
        var group_index = 0;
        var self = this;
        graph.groups.each(function(group) {
            // add columns
            var columns = {};
            for (var column_key in self.graph_definition.columns) {
                // get settings for column
                var column_settings = self.graph_definition.columns[column_key];

                // add to columns
                columns[column_key] = Utils.merge ({
                    index : group.get(column_key)
                }, column_settings);
            }

            // add group data
            request_dictionary.groups.push({
                key: (++group_index) + ':' + group.get('key'),
                columns: columns
            });
        });

        // return
        return request_dictionary;
    },

    // template
    _template: function() {
        return  '<div class="graph-viewport">' +
                    '<div id="info" class="info">' +
                        '<span id="icon" class="icon"/>' +
                        '<span id="text" class="text" />' +
                    '</div>' +
                '</div>';
    },

    // template svg/div element
    _templateContainer: function(tag, width) {
        return  '<div class="graph-viewport-container" style="width:' + width + '%;">' +
                    '<div id="menu"/>' +
                    '<' + tag + ' id="' + Utils.uuid() + '" class="graph-viewport-canvas">' +
                '</div>';
    }

    });
});
