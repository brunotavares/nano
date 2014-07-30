module.exports = function(grunt) {
    'use strict';

    var files = {
        less: {
            './static/dist/css/nano-theme.css': './static/less/nano-theme.less',
            './static/dist/css/source-code.css': './static/less/source-code.less'
        },
        uglify: {
            './static/dist/js/nano-theme.js': [
                './static/bower_components/jquery/dist/jquery.js',
                './static/js/_router.js',
                './static/js/_content.js',
                './static/js/_viewport.js'
            ],
            './static/dist/js/source-code.js': [
                './static/js/prettify/_prettify.js',
                './static/js/prettify/_lang-css.js',
                './static/js/prettify/_linenumber.js'
            ]
        },
        htmlmin: {
            'tmpl/dist/container.tmpl': 'tmpl/container.tmpl',
            'tmpl/dist/details.tmpl': 'tmpl/details.tmpl',
            'tmpl/dist/example.tmpl': 'tmpl/example.tmpl',
            'tmpl/dist/examples.tmpl': 'tmpl/examples.tmpl',
            'tmpl/dist/exceptions.tmpl': 'tmpl/exceptions.tmpl',
            'tmpl/dist/index.tmpl': 'tmpl/index.tmpl',
            'tmpl/dist/mainpage.tmpl': 'tmpl/mainpage.tmpl',
            'tmpl/dist/members.tmpl': 'tmpl/members.tmpl',
            'tmpl/dist/method.tmpl': 'tmpl/method.tmpl',
            'tmpl/dist/params.tmpl': 'tmpl/params.tmpl',
            'tmpl/dist/properties.tmpl': 'tmpl/properties.tmpl',
            'tmpl/dist/returns.tmpl': 'tmpl/returns.tmpl',
            'tmpl/dist/source.tmpl': 'tmpl/source.tmpl',
            'tmpl/dist/tutorial.tmpl': 'tmpl/tutorial.tmpl',
            'tmpl/dist/type.tmpl': 'tmpl/type.tmpl'
        }
    };

    // Config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            dev: {
                files: files.less,
                options: {
                    paths: ['./static/less']
                },
            },
            dist: {
                files: files.less,
                options: {
                    paths: ['./static/less'],
                    compress: true
                }
            }
        },

        uglify: {
            dev: {
                files: files.uglify,
                options: {
                    mangle: false,
                    compress: false,
                    preserveComments: 'all',
                    beautify: true
                }
            },
            dist: {
                files: files.uglify
            }
        },

        htmlmin: {
            dev: {
                files: files.htmlmin
            },
            dist: {
                files: files.htmlmin,
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                }
            }
        },

        watch: {
            stylesheet: {
                files: ['./static/less/*'],
                tasks: ['less:dev', 'example']
            },
            javascript: {
                files: [
                    './static/js/*',
                    './static/js/prettify/*',
                    '!./static/dist/*',
                ],
                tasks: ['uglify:dev', 'example']
            },
            template: {
                files: ['./tmpl/*', './publish.js'],
                tasks: ['htmlmin:dev', 'example']
            }
        }
    });

    // Plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Tasks
    grunt.task.registerTask(
        'example',
        'Generate the example docs. Pass example:default to generate against the default template',
        function(template) {
            var cb = this.async(),
                exec = require('child_process').exec;

            exec('node ../node_modules/jsdoc/jsdoc.js -c '+ (template === 'default' ? 'conf-default.js' : 'conf.json'), {
                maxBuffer: 5000 * 1024,
                cwd: './example'
            }, function(error, stdout, stderr) {
                if (error || stderr) {
                    grunt.log.error(error);
                }
                if (stdout) {
                    grunt.log.writeln(stdout);
                }

                cb();
            });
        }
    );

    grunt.task.registerTask(
        'release',
        'Prepare all the code for release.',
        [
            'less:dist',
            'uglify:dist',
            'htmlmin:dist'
        ]
    );
};