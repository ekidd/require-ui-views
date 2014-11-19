/*jshint node:true, laxbreak:true */
'use strict';

module.exports = function(grunt) {
    grunt.config.merge({
        sass: {
            buildStyles: {
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_SRC %>/assets/scss',
                    src: ['*.scss'],
                    dest: '<%= env.DIR_DEST %>/assets/styles',
                    ext: '.css'
                }],
                options: {
                    outputStyle: (grunt.option('prod') ? 'compressed' : 'nested')
                }
            }
        }

    });

    grunt.registerTask('buildStyles', [
        'sass:buildStyles'
    ]);
};
