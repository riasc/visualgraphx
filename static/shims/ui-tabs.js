define([], function() {
    var View = Backbone.View.extend({
        initialize: function(options) {
            this.tabs = {};
            this.tabOrder = [];
            var $el = $('<div class="tabs-container"/>');
            this.$nav = $('<ul class="tabs-nav"/>');
            this.$content = $('<div class="tabs-content"/>');
            $el.append(this.$nav);
            $el.append(this.$content);
            this.setElement($el);
        },

        add: function(options) {
            var _this = this;
            var id = options.id;
            this.tabs[id] = options;
            this.tabOrder.push(id);

            // nav item
            var $li = $('<li class="tab-item" data-tab="' + id + '"/>');
            $li.append($('<a href="javascript:void(0)"/>').text(options.title));
            $li.on('click', function() {
                _this._show(id);
            });
            this.$nav.append($li);

            // content panel
            var $panel = $('<div class="tab-panel" data-tab="' + id + '"/>');
            $panel.append(options.$el);
            this.$content.append($panel);

            // show first tab by default
            if (this.tabOrder.length === 1) {
                this._show(id);
            } else {
                $panel.hide();
            }
        },

        _show: function(id) {
            this.$content.find('.tab-panel').hide();
            this.$content.find('.tab-panel[data-tab="' + id + '"]').show();
            this.$nav.find('.tab-item').removeClass('active');
            this.$nav.find('.tab-item[data-tab="' + id + '"]').addClass('active');
        }
    });

    return { View: View };
});
