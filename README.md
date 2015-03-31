# grunt-shopify-theme

[![npm](https://nodei.co/npm/grunt-shopify-theme.png?downloads=true&stars=true)](https://npmjs.org/package/grunt-shopify-theme)

> Compile assets from a custom directory structure into a valid Shopify theme.

In order to deploy a Shopify theme, the theme assets must be organized into Shopify's conventional directory structure. This may be constricting to a developer's workflow. This grunt task allows Shopify theme developers to organize their sources files how ever they choose, compiling the theme for deployment while keeping source assets organized as desired.

When the task runs, only the files which have changed are copied. This keeps the task light when working with large themes.

## Getting Started
This plugin requires Grunt `0.4.0` or newer

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-shopify-theme --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-shopify-theme');
```

## Configuration
This example shows the simplest possible Gruntfile.js which might be used to set up the `grunt-shopify-theme` task. No options are specified, so defaults will be used. This assumes that your base directory contains the following folders:

```
assets/
config/
layout/
snippets/
templates/
templates-customers/
```

Each of these directories will be checked recursively for files which are allowed in the theme. The theme will be compiled in a subdirectory under the base of `deploy/`.

```javascript
module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json') ,
    'shopify-theme': {
      target: {}
    }
  });

  grunt.loadNpmTasks('grunt-shopify-theme');
  
  grunt.registerTask('default', ['shopify-theme']);
};
```

This Gruntfile.js example demonstrates all possible options which can be specified for the `grunt-shopify-theme` task.

```javascript
module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json') ,
    'shopify-theme': {
      target: {
        // set the path to the deployment directory, by default this is deploy/
        destination: 'deploy/theme',
        assets: {
          // src assets from as many directories as you like, use blob (**) for
          // recursive searching
          src: ['assets/css/*', 'assets/images/**', 'assets/js/*', 'assets/fonts/*'],
          options: {
            // by default common images, css, js or liquid files are allowed in the
            // assets folder, you can allow additional extensions here
            extensions: ['.mov', '.aiff']
          }
        },
        config: {
          // config only allows settings.html and settings_data.json, if you render
          // your settings.html with Jade or Haml, no worries about the other files ...
          // this example also demonstrates the method that should be used for
          // ignoring a file which may be present in the precompiled theme, remember
          // that this file will be pruned if it is present in the destination folder
          src: ['config/*', '!config/settings_data.json']
        },
        layout: {
          // the remaining three sources only allow liquid files
          src: ['layout/*']
        },
        snippets: {
          src: ['snippets/*']
        },
        templates: {
          // use blog to search subdirectories and your directory structure can be as
          // fancy as you wish
          src: ['templates/**']
        },
        templatesCustomers: {
          src: ['templates-customers/**']
        },
        dontPrune: [
          // use dontPrune to specify an array of filenames that should not be pruned,
          // you can't use * or ** here
          'settings_data.json'
        ]
      }
    }
  });

  // consider using watch to run this task when source files change

  // pair it with a desktop uploader or another task which can upload your files
  // directly to shopify, just watch the deployment folder for changes

  grunt.loadNpmTasks('grunt-shopify-theme');
  
  grunt.registerTask('default', ['shopify-theme']);
};
```

## How This Plugin Works
A Shopify theme is comprised of several directories:

```
/assets
/config
/layout
/snippets
/templates
/templates/customers (optional)
```

There are limitations for each of these directories. The task watches the source directory and looks for these subdirectories, applying rules to each which will copy all applicable files, leaving behind anything which is not part of a proper Shopify theme.

A few rules are applied to the source files for each of these directories and the options are there to source from multiple directories for each type of Shopify theme asset. These rules allow sources to deviate from the structure of the deployed Shopify theme. Source: well-organized. Deployment: messy but who cares?

## Task Rules
Rules for each Shopify theme subdirectory:

#### Assets
+ Any image file
+ Any .css or .css.liquid file
+ And .js or .js.liquid file
+ Additional extensions can be added using Gruntfile.js

#### Config
+ Only settings.html and settings_data.json files

#### Layout
+ Any .liquid file

#### Snippets
+ Any .liquid file

#### Templates
+ Any .liquid file
+ Remember to locate your customers folder files outside this folder or they will not be compiled into the correct location

#### Templates/Customers
+ Any liquid file

## Complementary Tasks/apps
There are several options for handling the deployment of your theme. Any other grunt task or app which can watch a directory and upload changes will be a great compliment to this task.

## Future Development
I plan to add the capability of deploying changes directly to Shopify at some point in the future. For now, there are many other options for watching and deploying.

## Version History

+ 0.1.4 2015-03-31
  + Add settings_schema.json to allowable files

+ 0.1.3 2014-01-30
  + Added dontPrune option to avoid overwriting files in destination directory

+ 0.1.2 2013-11-23
  + Added support for templates/customers directory
  + Updated documentation

+ 0.1.1
  + Bug fixes

+ 0.1.0
  + Initial
