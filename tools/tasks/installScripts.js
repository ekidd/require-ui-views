/*jshint node:true, laxbreak:true */
'use strict';

module.exports = function(grunt) {
    require('jit-grunt')(grunt, {
        bower: 'grunt-bower-requirejs'
    });

    grunt.config.merge({
        // Automatically wires up bower modules into the RequireJS config file
        bower: {
            installScripts: {
                // Path of shared configuration file
                rjsConfig: '<%= env.DIR_SRC %>/assets/scripts/config.js'
            }
        }
    });

    grunt.registerTask('installScripts', [
        'bower:installScripts'
    ]);
};
