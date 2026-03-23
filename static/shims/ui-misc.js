define([], function() {
    var Message = Backbone.View.extend({
        initialize: function(options) {
            this.setElement($('<div class="ui-message"/>'));
        }
    });

    var ButtonIcon = Backbone.View.extend({
        initialize: function(options) {
            this.options = options || {};
            var $btn = $('<button class="btn btn-default btn-sm" type="button"/>');
            if (this.options.icon) {
                $btn.append($('<i class="' + this.options.icon + '"/>').css('margin-right', '4px'));
            }
            if (this.options.title) {
                $btn.append($('<span/>').text(this.options.title));
            }
            if (this.options.tooltip) {
                $btn.attr('title', this.options.tooltip);
            }
            if (this.options.onclick) {
                $btn.on('click', this.options.onclick);
            }
            this.setElement($btn);
        }
    });

    var ButtonMenu = Backbone.View.extend({
        initialize: function(options) {
            this.options = options || {};
            var $wrapper = $('<div class="btn-group"/>');
            var $btn = $('<button class="btn btn-default btn-sm dropdown-toggle" type="button"/>');
            if (this.options.icon) {
                $btn.append($('<i class="fa ' + this.options.icon + '"/>').css('margin-right', '4px'));
            }
            if (this.options.title) {
                $btn.append($('<span/>').text(this.options.title));
            }
            if (this.options.tooltip) {
                $btn.attr('title', this.options.tooltip);
            }
            this.$menu = $('<ul class="dropdown-menu dropdown-menu-right" style="display:none"/>');
            var $menu = this.$menu;
            $btn.on('click', function(e) {
                e.stopPropagation();
                $menu.toggle();
            });
            $(document).on('click', function() { $menu.hide(); });
            $wrapper.append($btn);
            $wrapper.append(this.$menu);
            this.setElement($wrapper);
        },

        addMenu: function(options) {
            var $li = $('<li/>');
            var $a = $('<a href="javascript:void(0)"/>');
            if (options.icon) {
                $a.append($('<i class="fa ' + options.icon + '"/>').css('margin-right', '4px'));
            }
            $a.append(options.title);
            if (options.onclick) {
                $a.on('click', function() { options.onclick(); });
            }
            $li.append($a);
            this.$menu.append($li);
        }
    });

    var Label = Backbone.View.extend({
        initialize: function(options) {
            this.options = options || {};
            this.setElement($('<label class="ui-label"/>').text(this.options.title || ''));
        },
        title: function(newTitle) {
            if (newTitle !== undefined) {
                this.$el.text(newTitle);
            }
            return this.$el.text();
        }
    });

    return {
        Message: Message,
        ButtonIcon: ButtonIcon,
        ButtonMenu: ButtonMenu,
        Label: Label
    };
});
