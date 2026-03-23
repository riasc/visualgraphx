define([], function() {
    var View = Backbone.View.extend({
        initialize: function(options) {
            this.options = options || {};
            var $el = $('<div class="portlet"/>');

            // header
            var $header = $('<div class="portlet-header"/>');
            if (this.options.icon) {
                $header.append($('<i class="' + this.options.icon + '"/>').css('margin-right', '6px'));
            }
            $header.append($('<span class="portlet-title"/>').text(this.options.title || ''));

            // operations (buttons in the header bar)
            var $ops = $('<div class="portlet-operations" style="float:right"/>');
            if (this.options.operations) {
                for (var key in this.options.operations) {
                    $ops.append(this.options.operations[key].$el);
                }
            }
            $header.append($ops);

            // body
            this.$body = $('<div class="portlet-body"/>');

            $el.append($header);
            $el.append(this.$body);
            this.setElement($el);
        },

        append: function($content) {
            this.$body.append($content);
        }
    });

    return { View: View };
});
