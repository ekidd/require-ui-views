/*jshint node:true, laxbreak:true */
'use strict';

module.exports = function(grunt) {
    var shouldMinify = (grunt.option('maps') || !grunt.option('dev'));

    grunt.config.merge({
        // Copies static files for non-optimized builds
        copy: {
            buildScripts: {
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_SRC %>',
                    dest: '<%= env.DIR_DEST %>',
                    src: shouldMinify
                       ? ['assets/scripts/config.js', 'assets/vendor/requirejs/require.js']
                       : ['assets/scripts/**/*.js', 'assets/vendor/**/*.js']
                }]
            }
        },

        // RequireJS plugin that will use uglify2 to build and minify our
        // JavaScript, templates and any other data we include in the require
        // files.
        requirejs: {
            options: {
                // Path of source scripts, relative to this build file
                baseUrl: '<%= env.DIR_SRC %>/assets/scripts',

                // Path of shared configuration file
                mainConfigFile: '<%= env.DIR_SRC %>/assets/scripts/config.js',

                // Whether to generate source maps for easier debugging of
                // concatenated and minified code in the browser.
                generateSourceMaps: grunt.option('maps'),

                // Whether to preserve comments with a license. Not needed when,
                // and oddly incompatible with, generating a source map.
                preserveLicenseComments: grunt.option('no-maps'),

                // Allow `'use strict';` be included in the RequireJS files
                useStrict: true,

                // Comments that start with //>> are build pragmas. Exmaple:
                //
                //     //>>includeStart("isDev", pragmas.isDev);
                //     ... debugging code here ...
                //     //>>includeEnd("isDev");
                //
                pragmas: {
                    isProd: grunt.option('prod'),
                    isStage: grunt.option('stage'),
                    isDev: grunt.option('dev')
                },

                // Whether and how to optimize
                optimize: shouldMinify ? 'uglify2' : 'none',

                // Minification options
                uglify2: {
                    output: {
                        beautify: false,
                        comments: false
                    },
                    compress: {
                        sequences: false,
                        global_defs: { // jshint ignore:line
                            DEBUG: false
                        }
                    },
                    warnings: false,
                    mangle: true
                }
            },
            buildScripts: {
                options: {
                    // Name of input script (.js extension inferred)
                    name: 'main',

                    // Destination path of final output
                    out: '<%= env.DIR_DEST %>/assets/scripts/main.js'
                }
            }
        }

    });

    grunt.registerTask('buildScripts',
        shouldMinify
            ? [
                'copy:buildScripts',
                'requirejs:buildScripts'
            ]
            : [
                'copy:buildScripts'
            ]
    );
};
