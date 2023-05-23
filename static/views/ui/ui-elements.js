// dependencies
define(['plugin/means/means',
    'plugin/views/ui/ui-button-dropdown'],
    function(Means, ButtonDropdown) {

    //
    var Label = Backbone.View.extend({
        // default options
        optionsDefault: {
            title: '',
            cls: ''
        },

        // initialize
        initialize: function(options) {

            this.options = Means.merge(options, this.optionsDefault);

            // create $el with template
            var $el = this._template(this.options);

            this.$select = this.$el.find('select'); // link the select element

            this.setElement($el);
        },

        _template: function(options) {
            return '<label class="ui-label">' + options.title + '</label>';
        }
    });

    //
    var Select2 = Backbone.View.extend({
        // default options
        optionsDefault: {
            id: '',
            cls: '',
            error_text: 'No data available',
            data: '',
            data_value: '',
            data_label: '',
            preselection: '',   // value that is preselected of the select field
            info: '',
            visible: true,
            wait: false,
            multiple: false,
            searchable: false
        },

        // initialize
        initialize: function(options) {
            // merge (forwarded) options and default options
            this.options = Means.merge(options, this.optionsDefault);

            var _this = this;

            // create $el with template
            var $el = this._template(this.options);

            this.setElement($el);

            // link the select elements
            this.$select = this.$el.find('.select');

            this.$select.on('change', function(lkl) {
                //console.debug('changed', lkl);
                _this._change();
            });

            //
            this.update(this.options);
        },

        // update the select options
        update: function(options) {
            // backup current
            var current = this.$select.val();

            // remove all options of select field
            this.$select.find('option').remove();

            // populate select with data - as specified in data_value and data_label
            for(key in options.data) {
                this.$select.append(this._template_option(options.data[key][options.data_value], options.data[key][options.data_label]));
            }

            this.$select.select2({
                width: '100%',
                dropdownAutoWidth: true,

            }).select2('val', options.preselection);

        },

        add: function(options) {
            this.$select.append(this._template_option(this.options));
        },

        _change: function() {

            // call the onchange function with selected value
            this.options.onchange(this.$select.val());

            // determine the selected element
        },

        _setdata: function(new_data, new_preselection) {
            this.options.data = new_data;
            this.options.preselection = new_preselection;
            this.update(this.options);
        },

        _template: function(options) {
            var out = '<div id="' + options.id + '" class="ui-select" >' +
                                '<select id="select" class="select"></select>'
                            + '</div>';
            if(options.info.length != 0) {
                
                out = out + '<div class="elements-select-info">' + options.info + '</div>';
            }

            return out;
        },

        // template for the select options in the form
        _template_option: function(value, label) {
            return '<option value="' +  value + '">' + label + '</option>';
        }
    });


    var RadioButton = Backbone.View.extend({
        // default options
        optionsDefault: {
            id: '',
            title: '',
            input: '',
            input_name: '',     // must be identical for one radio button
            input_value: '',
            input_label: '',
            input_type: '',
            preselection: '',
            info: '',
            div_cls: '',
            form_cls: ''
        },

        // initialize
        initialize: function(options) {
            this.options = Means.merge(options, this.optionsDefault);

            var _this = this;

            var $el = this._template(this.options);
            this.setElement($el);

            this.$form = this.$el.find('form');

            console.log(this.$form);

            this._update(this.options);

            this.$form.on('change', function() {
                _this._change();
            });
        },

        _update: function(options) {
            for(key in options.input) {
                this.$form.append(this._template_input(options.input[key][options.input_label], options.input[key][options.input_value], this.options.preselection));
            }

        },

        _change: function() {

            //this.options.onchange(this.$form.find('input[name=radio_source]:checked').val());
            this.options.onchange(this.$form.find('input[name='+this.options.input_name + ']:checked').val());



        },

        _add: function(options) {
            this.$form.append(this._template_input(options));
        },

        _template: function(options) {
            return '<div id="' + options.id + ' class="ui-radio">'
            + '<form></form>'
            + '</div>'
            + '<div class="elements-select-info">' + options.info + '</div>';
        },

        _template_input: function(label, value, preselection) {
            // add preselection
            var presel;
            if (value == preselection) {
                presel = 'checked';
            } else {
                presel = '';
            }

            return '<input type="' + this.options.input_type + '" name="'
            + this.options.input_name +  '" value="' + value + '"' + presel + ' class="' + presel + ' " >' + label
            + '</input>';
        }
    });


    return {
        Label: Label,
        Select2: Select2,
        RadioButton: RadioButton,
        ButtonDropdown: ButtonDropdown
    }
});
