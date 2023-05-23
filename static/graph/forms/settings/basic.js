// dependencies
define(['mvc/ui/ui-table', 'mvc/ui/ui-misc', 'mvc/ui/ui-slider', 'utils/utils'],
    function(Table, Ui, Slider, Utils) {
    return Backbone.View.extend({

        // initialize
        initialize: function(app, options) {
            var _this = this;
            this.app = app;
            this.graph = app.graph;

            // create ui table element
            this.table = new Table.View();
            this.table_title = new Ui.Label({title: options.title});

            var $view = $('<div class="basic-settings"/>');

            $view.append(this.table_title.$el);
            //$view.append(this.table.$el);


            var $form = $( '<div id="settings">'
                + '<table style="width:100%">'
                    + '<tr>'
                        + '<td style="width: 25%">'
                        + '<span class="ui-table-form-title">Rootnode: </span>'
                        + '</td>'
                        + '<td>'
                        + '<select id="rootnode" name="rootnode" placeholder="rootnode"></select>'
                        + '</td>'
                + '</tr>'
            + '</table>'
            + '</div>');

            $view.append($form);



            this.data = {};
            this.data.nodes = this.graph.attributes.nodes;
            this.data.links = this.graph.attributes.links;


            this.setElement($view);

            this.render();
        },

        bindings: {
            '#rootnode': {
                observe: 'rootnode',
                selectOptions: {
                    collection: function() {
                        return this.graph.attributes.nodes;
                    },

                    valuePath: 'id',
                    labelPath: 'name',
                    defaultOption: {
                        label: '',
                        value: null
                    },
                    onSet: function(val) {
                        this.model.set('rootnode', val);
                    }
                }
            }
        },

        // set the title
        title: function(new_title) {
            this.table_title.title(new_title);
        },

        update: function() {
            var _this = this;
        }

    });
});
