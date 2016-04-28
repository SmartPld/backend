module.exports = function(grunt) {
    grunt.initConfig({
        'loopback_auto': {
            'db_autoupdate': {
                options: {
                    dataSource: 'mariadb',
                    app: './server/server',
                    config: './server/model-config',
                    method: 'autoupdate',
                    exclude : []
                }
            },
            'db_automigrate': {
                options: {
                    dataSource: 'mariadb',
                    app: './server/server',
                    config: './server/model-config',
                    method: 'automigrate',
                    exclude : []
                }
            }
        }
    });
    // Load the plugin
    grunt.loadNpmTasks('grunt-loopback-auto');
    grunt.registerTask('default', ['loopback_auto']);
};