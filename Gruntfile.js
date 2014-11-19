/*jshint node:true, laxbreak:true */
'use strict';

module.exports = function(grunt) {

    // -- Plugins --------------------------------------------------------------

    // Uncomment the next line to have grunt report the time it takes for tasks
    // to run so targets for optimization may be identified.
    // require('time-grunt')(grunt);

    // Intelligently lazy loads tasks and plugins as needed at runtime.
    require('jit-grunt')(grunt)({ customTasksDir: 'tools/tasks' });

    // -- Options --------------------------------------------------------------

    // All builds are considered to be development builds, unless they're not.
    grunt.option('dev', !grunt.option('stage') && !grunt.option('prod'));

    // -- Configuration --------------------------------------------------------

    grunt.initConfig({
        // This will load the `package.json` file so we can have access to the
        // project metadata such as name and version number.
        pkg: require('./package.json'),

        // This will load the `build-env.js` file so we can have access to the
        // project environment configuration and constants.
        env: require('./build-env'),

        // Automatically removes generated files and directories. Useful for
        // rebuilding the project with fresh copies of everything.
        clean: {
            options: {
                force: '<%= env.UNSAFE_MODE %>'
            },
            dest: ['<%= env.DIR_DEST %>'],
            docs: ['<%= env.DIR_DOCS %>'],
            tmp: ['<%= env.DIR_TMP %>'],
            installed: [
                'tools/node-*',
                '<%= env.DIR_BOWER %>',
                '<%= env.DIR_NPM %>'
            ]
        },

        // Watches files and directories changes and runs associated tasks
        // automatically. Compatible with the free LiveReload browser
        // extensions to reload pages after watch tasks complete:
        // http://go.livereload.com/extensions
        watch: {
            options: {
                livereload: {
                    // Default port for LiveReload
                    // Note: will collide with an error message if others are
                    // running this on a shared server
                    port: 35729
                }
            },
            watchMarkup: {
                files: ['<%= env.DIR_SRC %>/**/*.html'],
                tasks: ['buildMarkup']
            },
            watchStatic: {
                files: [
                    '<%= env.DIR_SRC %>/**/.htaccess',
                    '<%= env.DIR_SRC %>/**/*.{php,rb,py,jsp,asp,aspx,cshtml,txt}',
                    '<%= env.DIR_SRC %>/assets/media/**',
                ],
                tasks: ['buildStatic']
            },
            watchStyles: {
                files: ['<%= env.DIR_SRC %>/assets/{scss,vendor}/**/*.{s,}css'],
                tasks: ['buildStyles']
            },
            watchScripts: {
                files: ['<%= env.DIR_SRC %>/assets/{scripts,vendor}/**/*.js'],
                tasks: ['buildScripts']
            }
        }
    });

    // -- Tasks ----------------------------------------------------------------

    grunt.registerTask('default', 'Run default tasks for the target environment.',
        // Ran `grunt`
        grunt.option('dev')   ? ['build'] :
        // Ran `grunt --stage`
        grunt.option('stage') ? ['lint', 'build'] :
        // Ran `grunt --prod`
        grunt.option('prod')  ? ['lint', 'test', 'build', 'docs'] : []
    );

    grunt.registerTask('build', 'Compile source code and outputs to destination.',
        ['clean:dest', 'buildStatic', 'buildMarkup', 'buildStyles', 'buildScripts', 'clean:tmp']
    );

    grunt.registerTask('docs', 'Generate documentation.',
        ['clean:docs', 'docsScripts', 'clean:tmp']
    );

    grunt.registerTask('install', 'Run installation tasks.',
        ['installScripts']
    );

    grunt.registerTask('lint', 'Validate code syntax.',
        ['lintScripts']
    );

    grunt.registerTask('test', 'Execute tests.',
        ['testScripts']
    );

    grunt.loadNpmTasks('grunt-contrib-watch');
};
