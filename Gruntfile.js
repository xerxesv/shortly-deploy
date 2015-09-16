module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      build: {
        files: {
          'public/dist/minified.js': ['public/lib/jquery.js', 'public/lib/underscore.js','public/lib/backbone.js','public/lib/handlebars.js','public/client/**/*.js']
        }
      }
    },

    jshint: {
      files: [
        'app/**/*.js',
        'db/**/*.js',
        'lib/**/*.js',
        'server-config.js',
        'server.js',
        'public/client/**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      target: {
        files: {
          'public/dist/style.min.css' : 'public/*.css'
        }
      }
        // Add filespec list here
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      gitAdd :{
        command : 'git add public/dist/minified.js public/dist/style.min.css'
      },
      gitCommit : {
        command : 'git commit -m "commit minified files grunt"'
      },
      scaleUp: {
        command : 'azure site scale mode standard ShortlyApp'
      },
      gitPush: {
        command: 'git push azure master'
      },
      logTail: {
        command: 'azure site log tail ShortlyApp'
      },
      scaleDown: {
        command: 'azure site scale mode free ShortlyApp'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'jshint','uglify','cssmin'
  ]);

// grunt upload:prod 
  grunt.registerTask('deploy', function(n) {
  //  grunt.task.run('test');
    grunt.task.requires('test');
    if(grunt.option('prod')) {
      //grunt.task.run(['shell:gitAdd']);
      //grunt.task.run(['shell:gitCommit']);
      grunt.task.run(['shell:scaleUp']);
      grunt.task.run(['shell:gitPush']);
      //grunt.task.run(['shell:logTail']);
      grunt.task.run(['shell:scaleDown']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

};
