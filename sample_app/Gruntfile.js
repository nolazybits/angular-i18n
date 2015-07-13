/**
 * Created by nolazybits on 29/06/15.
 */
var modRewrite = require('connect-modrewrite');
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt)
{
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        application: {
            dist: 'app'
        },

        copy: {
            libraries: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '../',
                    dest: '<%= application.dist %>/js/',
                    src: ['angular-internationalization.js']
                }]
            }
        },

        connect: {
            options: {
                middleware: function (connect, options, middlewares) {
                    return [
                        modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg$ /index.html [L]']),
                        mountFolder(connect, 'app/')
                    ];

                }
            },
            server: {
                options: {
                    port: 8000,
                    hostname: 'localhost'
                }
            }
        },

        watch: {
            options: {
                spawn: false
            },
            live_dist: {
                files: ['../*.js'],
                tasks: ['copy:libraries'],
                options: {
                    livereload: true
                }
            }
        }
    });


    grunt.registerTask('server', [
        'copy:libraries',
        'connect:server',
        'watch'
    ]);

    grunt.registerTask('default', 'server');
};
