/* Gruntfile.js for correct setup of visualgraphx and its integration into galaxy. Usable for active development. */
module.exports = function(grunt) {

    grunt.initConfig({
        options: {
            // path of galaxy instance
            galaxy: '/Users/riasc/galaxy-dist/',
            // path of galaxy config
            galaxyconfig: '../galaxyconfig/'
        },
        copy: {
            config: {
                files: [{
                    expand: true,
                    src: '../galaxyconfig/config/*',
                    dest: '<%= options.galaxy %>'
                }]
            },
            visualgraphx: {
                files: [{
                    expand: true,
                    src: ['./config/*', './static/**', './templates/*'],
                    dest: '<%= options.galaxy %>config/plugins/visualizations/visualgraphx/'
                }]
            }
        },
        watch: {
            config: {
                files: '../galaxyconfig/config/*',
                tasks: 'copy:config'
            },
            visualgraphx: {
                files: ['./config/*', './static/**', './templates/*' ],
                tasks: 'copy:visualgraphx'
            }
        },
        concurrent: {
            dev: {
                tasks: ['watch:config', 'watch:visualgraphx'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "../../../../static/scripts",
                    paths: {
                        "plugins": "../../config/plugins/visualizations/visualgraphx/static"
                    },
                    shim: {
                        "libs/underscore": { exports: "_"},
                        "libs/backbone/backbone": { exports: "Backbone"}
                    },
                    name: "plugin/app",
                    out: "static/build-app.js"
                }
            }
        }
    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');

    // default task
    grunt.registerTask('default', 'copy'); // copy
    grunt.registerTask('dev', 'concurrent:dev');
    grunt.registerTask('compile','requirejs');
};
