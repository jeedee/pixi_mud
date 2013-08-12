module.exports = (grunt) ->
	
	grunt.initConfig
		nodemon: {
		  dev: {}
		}
	
	
	grunt.loadNpmTasks('grunt-nodemon');
	
	# TASKS
	grunt.registerTask('default', ['nodemon:dev']);