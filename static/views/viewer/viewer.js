// dependencies
define(['utils/utils',
    'mvc/ui/ui-misc',
    'mvc/ui/ui-portlet',
    'plugin/views/viewer/visualizer',
    'plugin/libs/capture'],
    function (Utils, Ui, Portlet, VISUALIZER, CAPTURE) {
        /* ########## VIEW15 ########## */
        return Backbone.View.extend({
            // initialize
            initialize: function(app, options) {
                var _this = this; // linkage of this (view15)
                this.app = app; // link rootview with cid="view1"
                this.message = new Ui.Message();  // message element

                /* create visualizer that handles the graphvisualization itself*/
                this.visualizer = new VISUALIZER(app);

                var snapshot_button_menu = new Ui.ButtonMenu({
                    icon: 'fa-camera',
                    title: 'Snapshot',
                    tooltip: 'Export  as PNG, SVG or PDF file'
                });

                // button menu
                var picture_button_menu = new Ui.ButtonMenu({
                    icon: 'fa-camera',
                    title: 'Export',
                    tooltip: 'Export the graph as PNG, SVG or PDF file'
                });

                // add PNG option
                picture_button_menu.addMenu({
                    id: 'button-png',
                    title: 'as PNG',
                    icon: 'fa-file',
                    onclick: function() {
                        CAPTURE.createPNG({
                            $el: _this.visualizer.$el
                        });
                    }
                });

                // add SVG option
                picture_button_menu.addMenu({
                    id: 'button-svg',
                    title: 'as SVG',
                    icon: 'fa-file-text-o',
                    onclick: function() {
                        CAPTURE.createSVG({
                            $el: _this.visualizer.$el
                        });
                    }
                });

                /*
                // add PDF option
                picture_button_menu.addMenu({
                    id: 'button-pdf',
                    title: 'as PDF',
                    icon: 'fa-file-o',
                    onclick: function() {
                        CAPTURE.createPDF({
                            $el: _this.visualizer.$el
                        });
                    }
                });*/


                this.portlet = new Portlet.View({
                    title: 'VisualGraphX - Interactive Graph Visualization',
                    operations: {
                        picture_button_menu: picture_button_menu
                        //snapshot_button_menu: snapshot_button_menu
                        //'edit_button': new Ui.ButtonIcon({
                        //    icon: 'fa fa-pencil-square-o',
                        //    title: 'Editor'
                        //})
                    }
                });

                // append to portlet
                this.portlet.append(this.message.$el);
                this.portlet.append(this.visualizer.$el);

                // set element ($el)
                this.setElement(this.portlet.$el);

            },

            // show
            show: function() {
                this.$el.show(); // show the element
            },

            // hide
            hide: function() {
                this.$el.hide(); // hide the element
            }

        });
    });
