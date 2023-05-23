// dependencies
define(['utils/utils','mvc/ui/ui-misc'], function(Utils, Ui) {
    /* ########## VIEW12 ########## */
    return Backbone.View.extend({
        // default options
        optionsDefault: {
            onchange: null
        },

        // events
        events: {
            'click':  '_onclick'
        },

        // initialize
        initialize: function(app, options) {
            var _this = this; // link this
            this.app = app; // link app

            this.options = Utils.merge(options, this.optionsDefault);

            var $el = $('<div class="graph-grid"/>');

            // append class grid to types
            this.setElement($el);

            this.render(app);


        }, // end initialize

        // render
        render: function() {
            // load the categories that contain graph types
            this.categories = {}; // storage
            this.categories_index = {}; //
            var category_index = 0; // equals id of categories

            // load attributes of categories
            this.types = this.app.types.attributes; // obj of obj
            for(var id in this.types) { // traverse graph type objects
                // structure defined in config.js of coressponding graph
                var type = this.types[id]; // obj {title: xyz, category: xyz, ... }
                var category = type.category; // get category of graph object
                if(!this.categories[category]) { // category not in storage
                    this.categories[category] = {}; // create obj for the category
                    this.categories_index[category] = category_index++;
                }
                this.categories[category][id] = type;
            }

            // add categories and charts to screen
            for(var category in this.categories) {
                // create empty element
                var $el = $('<div style="clear: both;"/>');
                // add header label
                $el.append(this._template_header({
                    id: 'types-header-' + this.categories_index[category],
                    title: category
                }));

                // add graph types
                for(var id in this.categories[category]) {
                    // get settings of type in category
                    var type = this.categories[category][id];

                    // append type to screen
                     $el.append(this._template_item({
                        id: id,
                        title: type.title + ' (' + type.library + ')',
                        url: config.app_root + 'graph/' + this.app.graph_path(id) + '/logo.png'
                    }));

                }
                this.$el.append($el);
            }

        }, // end render


        value: function(new_value) {
            /* get selected (graph) element - tag with class current */
            var before = this.$el.find('.current').attr('id');
            // check if new_value is defined
            if (new_value !== undefined) {
                // remove current class
                this.$el.find('.current').removeClass('current');
                // add current class
                this.$el.find('#' + new_value).addClass('current');
            }

            // get current id/value
            var after = this.$el.find('.current').attr('id');
            if(after === undefined) {
                return null;
            } else {
                // fire onchange
                if (after != before && this.options.onchange) {
                    this.options.onchange(new_value);
                }
                // return current value
                return after;
            }
        }, // end value

        // onclick
        _onclick: function(e) {
            var old_value = this.value(); //
            var new_value = $(e.target).closest('.item').attr('id');
            if (new_value != '') {
                if (new_value && old_value != new_value) {
                    this.value(new_value);
                }
            }
        },

        // template for the header
        _template_header: function(options) {
            return  '<div id="' + options.id + '" class="header">' +
                        '&bull; ' + options.title + '</div>';
        },
        // template
        _template_item: function(options) {
            return  '<div id="' + options.id + '" class="item current">' +
                '<img class="image" src="' + options.url + '">' +
                '<div class="title">' + options.title + '</div>';
        }
    });
});
