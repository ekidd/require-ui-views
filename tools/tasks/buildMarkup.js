/*jshint node:true, laxbreak:true */
'use strict';

module.exports = function(grunt) {
    var shouldMinify = !grunt.option('dev');

    grunt.config.merge({
        includes: {
            buildMarkup: {
                cwd: '<%= env.DIR_SRC %>',
                dest: '<%= env.DIR_TMP %>',
                src: [
                    '**/*.html',
                    '!templates/**',
                    '!assets/vendor/**'
                ]
            }
        },

        prettify: {
            buildMarkup: {
                options: {
                    indent: 4,
                    wrap_line_length: 999999, // jshint ignore:line
                    indent_inner_html: false, // jshint ignore:line
                    unformatted: [
                        'a', 'b', 'code', 'i', 'p',
                        'pre', 'small', 'span',
                        'sub', 'sup', 'u', 'textarea'
                    ]
                },
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_TMP %>',
                    dest: '<%= env.DIR_DEST %>',
                    src: ['**/*.html']
                }]
            }
        },

        // Replaces script and style tag references with a reference to a
        // single optimized output file.
        usemin: {
            html: ['<%= env.DIR_DEST %>/**/*.html']
        }
    });

    grunt.registerTask('buildMarkup',
        shouldMinify
            ? [
                'includes:buildMarkup',
                'prettify:buildMarkup',
                'usemin'
            ]
            : [
                'includes:buildMarkup',
                'prettify:buildMarkup'
            ]
    );
};
