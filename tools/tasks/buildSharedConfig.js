/*jshint node:true */
'use strict';

module.exports = function(grunt) {
    grunt.config.merge({
        shared_config: {
            default: {
                options: {
                    name: 'sharedConfig',
                    indention: '    ',
                    cssFormat: 'uppercase',
                    useSassMaps: true,
                    jsFormat: 'camelcase',
                    singlequote: true,
                    amd: true
                },
                src: './src/assets/sharedConfig.json',
                dest: [
                    './src/assets/scss/helpers/_sharedConfig.scss',
                    './src/assets/scripts/sharedConfig.js'
                ]
            },
        }
    });

    grunt.registerTask('buildSharedConfig', [
        'shared_config:default',
    ]);
};
