
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-newer');
    grunt.initConfig({
        nggettext_extract: {
            pot: {
                files: {
                    'Locale/template.pot': ['src/**/*.{js,html}', 'index.html']
                }
            },
        },
        nggettext_compile: {
            all: {
                options: {
                    module: 'monad',
                    format: 'json'
                },
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: "Locale",
                        dest: 'dist/i18n',
                        src: ['*.po'],
                        ext: '.json'
                    }
                ]
            }
        },
        concat: {
            libs: {
                src: [
                    'node_modules/babel-core/browser-polyfill.js',
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/angular/angular.js',
                    'bower_components/angular-bootstrap/ui-bootstrap.js',
                    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                    'bower_components/angular-route/angular-route.js',
                    'bower_components/angular-sanitize/angular-sanitize.js',
                    'bower_components/autofill-event/src/autofill-event.js',
                    'bower_components/angular-gettext/dist/angular-gettext.js'
                ],
                dest: 'tmp/libraries.js'
            }
        },
        uglify: {
            libs: {
                src: 'tmp/libraries.js',
                dest: 'dist/libraries.js'
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    compass: true,
                    sourcemap: 'none',
                    loadPath: ['bower_components/bootstrap-sass/assets/stylesheets']
                },
                files: {'dist/default.css': 'src/_sass/**/default.scss'}
            }
        },
        copy: {
            statics: {
                files: [
                    {expand: true, src: '**/*.{html,json}', cwd: 'src/', dest: 'dist/'},
                    {expand: true, src: '**/*.png', cwd: 'assets/', dest: 'dist/'},
                    {expand: true, src: 'fonts/**/*', cwd: 'bower_components/bootstrap-sass/assets/', dest: 'dist'}
                ]
            },
            license: {
                files: [
                    {
                        cwd: './',
                        src: ['LICENSE'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        clean: {
            prepare: ['dist'],
            scripts: ['tmp']
        },
        watch: {
            gettext_extract: {
                files: ['src/**/*.{js,html}', 'index.html'],
                tasks: ['nggettext_extract']
            },
            gettext_compile: {
                files: ['Locale/*.po'],
                tasks: ['nggettext_compile']
            },
            libs: {
                files: ['<%= concat.libs.src %>'],
                tasks: ['concat', 'uglify']
            },
            sass: {
                files: ['src/_sass/**/*.scss', 'bower_components/bootstrap-sass/assets/stylesheets/**/*.scss'],
                tasks: ['sass']
            },
            statics: {
                files: ['**/*.{html,json,png}'],
                tasks: ['newer:copy:statics']
            },
            license: {
                files: ['LICENSE'],
                tasks: ['newer:copy:license']
            }
        }
    });
    grunt.registerTask('default', ['clean:prepare', 'build']);
    grunt.registerTask('build', ['gettext', 'scripts', 'sass', 'newer:copy']);
    grunt.registerTask('gettext', ['nggettext_extract', 'nggettext_compile']);
    grunt.registerTask('scripts', ['concat', 'uglify', 'clean:scripts']);
    grunt.registerTask('dev', ['clean:prepare', 'build', 'watch']);
};

