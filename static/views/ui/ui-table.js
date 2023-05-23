//dependencies
define(['plugin/means/means'],
        function(Means) {

    var View = Backbone.View.extend({
        
        // current row
        row: null,

        // count rows
        row_count: 0,


        // default options
        optionsDefault: {
            cls: 'ui-table',
            cls_tr: '', // additional class for the row (<tr>-tag)
            content: 'No content available'
        },

        // initialize
        initialize: function(options) {

            // merge (forwarded) options and default options
            this.options = Means.merge(options, this.optionsDefault);

            // create $el with template
            var $el = $(this._template(this.options));

            // link the table elements
            this.$thead = $el.find('thead');
            this.$tbody = $el.find('tbody');
            this.$tmessage = $el.find('tmessage');

            // set template for the viewer
            this.setElement($el);

            // initialize new <tr> in the table
            this.row = this._row();

            console.log(this);

        },


        add_subheader: function($el) {
            var wrapper = $('<td></td>');
            // wrap $el between <td>-tags
            wrapper.append($el);
            // append the newly <td>-element to row
            this.row.append(wrapper);
        },

        // add cell/<td>-tag to the row
        add: function($el, cls_tr) {
            this.row.addClass(cls_tr);
            

            var wrapper = $('<td class="ui-table-td"></td>');
            // wrap $el between <td>-tags
            wrapper.append($el);
            // append the newly <td>-element to row
            this.row.append(wrapper);
            
        },


        commit: function() {
            this.$tbody.append(this.row);


            this.row = this._row(); // reset row
            this.row.count++;
        },

        commit_after: function(cls) {

            this.$tbody.find(cls).after(this.row);

            this.row = this._row();
            this.row.count++;
        },

        //
         _appendHeader: function() {
            //this.$thead.append(this.row);
        },


        _remove: function(cls_rmv) {
            this.$tbody.find(cls_rmv).remove();
        },

        // creates new row in the table
        _row: function() {
            return $('<tr class="' + this.options.cls_tr + '"></tr>');
        },


        // load the template for the table
        _template: function(options) {
            return  '<div>' +
                                '<table class="' + options.cls + '">' +
                                    '<thead></thead>' +
                                    '<tbody></tbody>' +
                                '</table>' +
                                //'<tmessage>' + options.content + '</tmessage>' +
                        '</div>';
        }
    });

    // return
    return {
        View: View
    }
  
});


 /*
        // options
        optionsDefault: {
            title       : '',
            content     : '',
            mode        : ''
        },
    
        // elements
        list: [],

        //initialize
        initialize: function(app, options) {
            this.app = app; // link the app (view1)
            // retrieve forwarded options and merge with defaults
            this.options = Utils.merge(options, this.optionsDefault); 
            // ui-elements from /scripts/ui/
            this.table_title = new Ui.Label({ title: this.options.title });
            this.table = new Table.View({ content: this.options.content });

            var $view = $('<div class="ui-table-form">');
            if (this.options.title) {
                $view.append(this.table_title.$el);
            }
            $view.append(this.table.$el);
            

            this.table.addHeader('Basic');
            this.table.appendHeader();

            this.table.add('Graph <div>(default: first)</div>', '30%', 'left');
            
            var blablub = new Ui.Select.View();
            this.table.add(new Ui.Select.View({
                //id: 'field-graph',
                data: [{id: 1, text: 123}]
            }).$el, '70%', 'center');
            console.log(blablub);
            
            this.table._commit();


            console.log(this.table);

            this.setElement(this.table.$el);
        },

        //title
        title: function(new_title) {
            this.table_title.title(new_title);
        }

    });

    // return
    return {
        View: View
    }*/
