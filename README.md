grunt-shopify-theme
===================

This Grunt task provides one simple step for a Shopify theme developer's workflow. It identifies which files in a repository are part of a Shopify theme's deployment subset and copies those into a subdirectory. It is assumed that the subdirectory will be watched by some other task, app or manual process which will facilitate the deployment to Shopify. This allows for extra local-only directories containing precompiled files to be kept separate from the deployment structure.

## Getting Started
Here's an exmaple configuration for Gruntfile.js. This configuration looks for components of the assets directory in three, organized subdirectories. The precompiled files are organized any way your workflow dictates it should be. Let the Grunt task make them a mess all in one folder together for deployment. The other directories are all shown in their simplest configurations, but remember that the rules for each will be applied. For example, you may render your settings.html file from a Jade template. That Jade template could be right in the directory, but because of the rules it will be ignored. More advanced configurations can be used depending upon the workflow requirements.

```javascript
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
```

## How It Works
A Shopify theme is comprised of 5 directories:

```
/assets
/config
/layout
/snippets
/templates
```

There are limitations for each of these directories. The task watches the source directory and looks for these subdirectories, applying rules to each which will copy all applicable files, leaving behind anything which is not part of a proper Shopify theme.

## Task Rules
Rules for each Shopify theme subdirectory:

### Assets
+ Any image file
+ Any .css or .css.liquid file
+ And .js or .js.liquid file

### Config
+ Only settings.html and settings_data.json files

### Layout
+ Any .liquid file

### Snippets
+ Any .liquid file

### Templates
+ Any .liquid file

These rules allow deviations from a standard Shopify theme. Local-only assets may be stored in subdirectories of the assets folder while only applicable files will be copied to the deployment assets folder in the expected Shopify scheme.

## Complementary Tasks/apps
There are several options for handling the deployment of your theme. Any of these options is a great compliment to this task:

+ grunt-shopify
+ Shopify Theme App
