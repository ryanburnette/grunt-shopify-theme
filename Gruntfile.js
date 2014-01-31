'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    'shopify-theme': {
      dist: {
        destination: 'test/theme',
        assets: {
          src: ['test/src/assets/**']
        },
        config: {
          src: ['test/src/config/*', '!test/src/config/settings_data.json']
        },
        layout: {
          src: ['test/src/layout/*']
        },
        snippets: {
          src: ['test/src/snippets/*']
        },
        templates: {
          src: ['test/src/templates/*']
        },
        dontPrune: [
          'settings_data.json'
        ]
      }
    }
  });

  grunt.loadTasks('tasks');
  
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);
};
