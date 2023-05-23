<%
       root = h.url_for( "/" )
       app_root = root + "plugins/visualizations/visualgraphx/static/"
       history_id = trans.security.encode_id( trans.history.id )

%>

## -------------------------------------------------------------------------------------------------------------

<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>${hda.name} | ${visualization_name}</title>

## --------------------------------------------------------------------------------------------------------------

        ## install shared libraries
        ${h.js( 'libs/jquery/jquery',
            'libs/bootstrap',
            'libs/underscore',
            'libs/backbone',
            'libs/d3',
            'libs/require')}

        ## load merged / minified

        ## load jsonpath for easy access
        ${h.javascript_link(app_root + "plugins/jsonpath-0.8.0.js")}

        ## load defiant.js 1.2.5 for JSON queries
        ${h.javascript_link(app_root + "libs/defiantjs-1.2.5/defiant-latest.min.js")}

        ## load select2
        ${h.javascript_link(app_root + "libs/select2-3.5.3/select2.min.js")}
        ${h.stylesheet_link(app_root + "libs/select2-3.5.3/select2.css")}

        ${h.javascript_link(app_root + "libs/FileSaver.min.js")}

        ## shared css
        ${h.css('base')}

        ## install default css
        ${h.stylesheet_link(app_root + "app.css")}

## --------------------------------------------------------------------------------------------------------------

    </head>
    <body>
    <!-- properties for the graph visualization -->

    <script type="text/javascript">


        var config = {
            root                : '${root}',
            app_root        : '${app_root}',  // /plugins/visualizations/visualgraphx/static/
        };

        // link galaxy
        var Galaxy = Galaxy || parent.Galaxy;

        // console protection
        window.console = window.console || {
                log: function() {},
                debug: function() {},
                info: function() {},
                warn: function() {},
                error: function() {},
                assert: function() {}
        };

        // configure require
        require.config({
            baseUrl: config.root + "static/scripts/",
            paths: {
                "plugin":   "${app_root}",
                "d3":   "libs/d3"
            },
            shim: {
                "libs/underscore": { exports: "_" },
                "libs/backbone/backbone": { exports: "Backbone" },
                "d3": { exports: "d3"}
            }
        });

        // application
        var app = null;
        $(document).ready(function () {
            // request application script
            require(['plugin/app'], function(App) {

                // load options
                var options = {
                    id: ${h.dumps(visualization_id)} || undefined,
                    hid: ${h.dumps(history_id)},
                    did: ${h.dumps(config)}.dataset_id,
                    durl: config.root + 'api/histories/' + ${h.dumps(history_id)} + '/contents/' + ${h.dumps(config)}.dataset_id + '/display',
                    config: ${h.dumps( config )}
                };

                // create application
                app = new App(options);

                // add to body
                $('body').append(app.$el);
            });
        });

    </script>
    </body>
</html>
