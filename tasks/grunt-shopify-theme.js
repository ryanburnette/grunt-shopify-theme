module.exports = function (grunt) {
  "use strict";

  var path = require('path')
    , fs = require('fs')
    , crypto = require('crypto')
    , walk = require('walk')
    ;

  grunt.registerMultiTask('prune', "prune files that don't exist in source folder", function () {
    var me = this
      , done = me.async()
      , walker
      , haves = me.data.haves
      , ignores = me.data.ignores
      ;

    if ( !ignores ) {
      ignores = [];
    }

    walker = walk.walk(me.data.base);

    walker.on('file', function (root, fileStats, next) {
      var destname
        ;
      
      destname = path.join(root, fileStats.name);
      if ( !haves[destname] && ignores.indexOf(fileStats.name) === -1 ) {
        fs.unlinkSync(destname); 
        grunt.log.writeln('Deleted: ' + destname);
      }

      next();
    });

    walker.on('end', function () {
      done();
    });
  });

  grunt.registerMultiTask('shopify-theme', function () {
    grunt.loadNpmTasks('grunt-contrib-copy');

    var me = this
      , defaultExtensions
      , assetsExtensions
      , additionalExtensions = []
      , configs 
      , checks = {}
      , destdir = me.data.destination || 'deploy'
      , copyTaskConfig
      , pruneTaskConfig
      , haves = {}
      , ignores = me.data.dontPrune
      , taskOptions
      ;

    if ( !me.data.assets ) {
      me.data.assets = {};
    }
    if ( !me.data.config ) {
      me.data.config = {};
    }
    if ( !me.data.layout ) {
      me.data.layout = {};
    }
    if ( !me.data.snippets ) {
      me.data.snippets = {};
    }
    if ( !me.data.templates ) {
      me.data.templates = {};
    }
    if ( !me.data.templatesCustomers ) {
      me.data.templatesCustomers = {};
    }

    defaultExtensions = [
      '.css'
    , '.js'
    , '.liquid'
    , '.jpg'
    , '.svg'
    , '.gif'
    , '.png'
    ];
    if ( me.data.assets.options && me.data.assets.options.extensions ) {
      additionalExtensions = me.data.assets.options.extensions;
    }
    assetsExtensions = [].concat.apply(defaultExtensions, additionalExtensions);

    configs = [
      'settings.html'
    , 'settings_data.json'
    , 'settings_schema.json'
    ];

    checks.assets = function (filename) {
      var extension = path.extname(filename).toLowerCase()
        ;
      
      if (-1 !== assetsExtensions.indexOf(extension) ) {
        return true;
      }
      return false;
    };

    checks.config = function (filename) {
      if (-1 !== configs.indexOf(filename)) {
        return true;
      }
      return false;
    };

    function checkLiq (filename) {
      if ('.liquid' === path.extname(filename)) {
        return true;
      }
      return false;
    }

    checks.layout = checkLiq;
    checks.snippets = checkLiq;
    checks.templates = checkLiq;
    checks['templates/customers'] = checkLiq;

    function createHashSync(pathname) {
      var hash = crypto.createHash('md5')
        , data = fs.readFileSync(pathname)
        ;

      hash.update(data);
      return hash.digest('hex');
    }

    function checkFile(filetype, pathname) {
      var stat
        , filename
        , destname
        , dstat
        , md5src
        , md5dst
        ;

      try {
        stat = fs.lstatSync(pathname);
      } catch(e) {
        return false;
      }

      // If not a file, bail immediately
      if (!stat.isFile()) {
        return false;
      } 

      filename = path.basename(pathname);

      // checks valid file extension for directory type
      if (!checks[filetype](filename)) {
        return false;
      }

      // ex: ./<destdir>/<filetype>/<filename>
      // ex: ./deploy/assets/style.css
      destname = path.join(destdir, filetype, filename);

      // gather haves
      if ( haves[destname] ) {
        grunt.log.warn(['You have a file by the same name in multiple source directories.']);
        grunt.log.warn(haves[destname]);
        grunt.log.warn(pathname);
        grunt.fail.warn('File conflict detected. An overwrite will occur.');
      }
      haves[destname] = pathname;

      // compare destdir + filename against current pathname
      try {
        dstat = fs.lstatSync(destname);
        md5dst = createHashSync(destname);
      } catch(e) {
        dstat = {};
      }

      md5src = createHashSync(pathname);
      if (dstat.size === stat.size && md5src === md5dst) {
        return false;
      }
      
      return true;
    }

    copyTaskConfig = {
      assets: {
        files: [
          { expand: true
          , flatten: true
          , src: me.data.assets.src || ['assets/**']
          , dest: destdir + '/assets'
          , filter: checkFile.bind(null, 'assets')
          , onlyIf: 'modified'
          }
        ]
      },
      config: {
        files: [
          { expand: true
          , flatten: true
          , src: me.data.config.src || ['config/**']
          , dest: destdir + '/config'
          , filter: checkFile.bind(null, 'config')
          }
        ]
      },
      layout: {
        files: [
          { expand: true
          , flatten: true
          , src: me.data.layout.src || ['layout/**']
          , dest: destdir + '/layout'
          , filter: checkFile.bind(null, 'layout')
          }
        ]
      },
      snippets: {
        files: [
          { expand: true
          , flatten: true
          , src: me.data.snippets.src || ['snippets/**']
          , dest: destdir + '/snippets'
          , filter: checkFile.bind(null, 'snippets')
          }
        ]
      },
      templates: {
        files: [
          { expand: true
          , flatten: true
          , src: me.data.templates.src || ['templates/**']
          , dest: destdir + '/templates'
          , filter: checkFile.bind(null, 'templates')
          }
        ]
      },
      templatesCustomers: {
        files: [
          { expand: true
          , flatten: true
          , src: me.data.templatesCustomers.src || ['templates-customers/**']
          , dest: destdir + '/templates/customers'
          , filter: checkFile.bind(null, 'templates/customers')
          }
        ]
      }
    };

    grunt.config('copy', copyTaskConfig);
    grunt.task.run('copy');

    pruneTaskConfig = { all: { base: destdir, haves: haves, ignores: ignores } };
    grunt.config('prune', pruneTaskConfig);
    grunt.task.run('prune');
  });
};
