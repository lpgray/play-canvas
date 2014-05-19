module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n */',
    // Task configuration.
    concat: {
      js: {
        src: ['src/js/zepto.min.js'
          , 'src/js/zepto.touch.js'
          , 'src/js/md5.js'

          , 'src/js/Class.js'
          , 'src/js/Paper.js'
          , 'src/js/Background.js'
          , 'src/js/Ball.js'
          , 'src/js/Drawer.js'
          , 'src/js/Keeper.js'
          , 'src/js/Loading.js'
          , 'src/js/Modal.js'
          , 'src/js/ProgressBar.js'
          , 'src/js/ScoreBoard.js'
          , 'src/js/SelectButtons.js'
          , 'src/js/Shooter.js'

          , 'src/js/Class.js'
          , 'src/config.js'
          , 'src/share.js'
          , 'src/store.js'
          , 'src/app.js'],
        dest: 'build/js/football.js'
      },
      // placeholderjs: {
      //   src: ['src/config.js'],
      //   dest: 'build/config.js'
      // },
      css: {
        src: ['src/css/base.css', 'src/css/style.css'],
        dest: 'build/css/football.css'
      }
    },
    uglify: {
      sngame: {
        files:{
          'build/js/football.min.js' : 'build/js/football.js'
        }
      }
    },
    cssmin: {
      minify: {
        src: ['build/css/football.css'],
        dest: 'build/css/football.min.css'
      }
    },
    jshint: {
      options: {
        jshintrc : true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src : ['src/**/*.js']
      }
    },
    processhtml: {
      dist: {
        files: {
          'build/index.html' : 'src/index.html'
        }
      }
    },
    watch: {
      livereload: {
        options: {livereload: true},
        files: ['src/**/*.js', 'src/**/*.css', 'src/index.html']
      }
    },
    connect: {
      server:{
        options : {
          port : 1377,
          debug : true,
          livereload : true
        }
      }
    },
    copy: {
      main: {
        src: 'src/img/**',
        dest: 'build/'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit', 'concat', 'uglify']);
  grunt.registerTask('dev', ['connect', 'watch']);

  grunt.registerTask('build', ['concat', 'uglify', 'cssmin', 'processhtml']);
};