module.exports = (grunt) ->
	grunt.initConfig
		watch: {
			files: 'src/**/*',
			tasks: ['clean:build_dir', 'coffee:dev', 'concat', 'copy'],
			options: {
				debounceDelay: 1000
			}
		},
		
		concat: {
			dev: {
				files: {
					'dist/plugins.js': ['src/plugins/underscore.js', 'src/plugins/**/*.js']
				}
			}
		},
		
		connect: {
			server: {
				options: {
					port: 9000,
					hostname: '*',
					base: 'dist'
				}
			}
		},
		
		coffee: {
			dev:  {
				files: {
					'dist/app.js':['src/coffee/main.coffee', 'src/coffee/kobu/**/*.coffee', 'src/coffee/**/*.coffee']
				}
			}
		},
		
		copy: {
		  main: {
		    files: [
		      {src: ['**/*'], dest: 'dist/', cwd: 'src/root/', expand: true, flatten: false}
		    ]
		  }
		},
		
		clean: {
			build_dir: ["dist/"]
		}
	
	
	# NPM TASKS
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	# TASKS
	grunt.registerTask('dev', ['clean:build_dir', 'coffee:dev', 'copy', 'concat', 'connect', 'watch'])