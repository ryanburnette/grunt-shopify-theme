module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json') 
  , 'shopify-theme': {
      project: {
        destination: 'deploy',
        assets: {
          src: ['assets/css/*', 'assets/js/*', 'assets/images/*'],
          options: {
            extensions: ['.mov', '.mp3']
          }
        },
        config: {
          src: ['config/*']
        },
        layout: {
          src: ['layout/*']
        },
        snippets: {
          src: ['snippets/*']
        },
        templates: {
          src: ['templates/*']
        }
      }
    }
  });

  grunt.loadTasks('grunt-task/');
  grunt.registerTask('default', ['shopify-theme']);
};
