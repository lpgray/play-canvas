/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n */',
    // Task configuration.
    concat: {
      js: {
        src: ['src/lib/jquery-2.1.0.min.js', 'src/bs3/js/bootstrap.min.js','temp/sngame-<%= pkg.version %>.min.js'],
        dest: 'build/all.js'
      },
      placeholderjs: {
        src: ['src/placeholder.js'],
        dest: 'build/placeholder.js'
      },
      verge: {
        src: ['src/lib/verge.min.js'],
        dest: 'build/verge-1.9.1.min.js'
      },
      css: {
        src: ['src/bs3/css/bootstrap.min.css', 'temp/index-<%=pkg.version%>.min.css'],
        dest: 'build/all.css'
      }
    },
    uglify: {
      sngame: {
        files:{
          'temp/sngame-<%=pkg.version%>.min.js' : 'src/sngame.js'
        }
      }
    },
    cssmin: {
      minify: {
        src: ['src/index.css'],
        dest: 'temp/index-<%=pkg.version%>.min.css'
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
  grunt.registerTask('debug', ['connect', 'watch']);

  grunt.registerTask('build', ['uglify', 'cssmin', 'concat', 'processhtml']);
};