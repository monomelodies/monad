
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
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
                        dest: 'dist/LICENSE.txt'
                    }
                ]
            }
        },
        clean: {
            prepare: ['dist']
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
            sass: {
                files: ['src/_sass/**/*.scss', 'bower_components/bootstrap-sass/assets/stylesheets/**/*.scss'],
                tasks: ['sass']
            },
            statics: {
                files: ['src/**/*.{html,json}', 'assets/**/*.png', 'bower_components/bootstrap-sass/assets/fonts/**/*'],
                tasks: ['newer:copy:statics']
            },
            license: {
                files: ['LICENSE'],
                tasks: ['newer:copy:license']
            }
        },
        browserify: {
            monad: {
                src: './src/angular.js',
                dest: 'dist/monad.js',
                options: {
                    transform: ['babelify'],
                    watch: true
                }
            }
        },
        uglify: {
            monad: {
                src: './dist/monad.js',
                dest: './dist/monad.min.js'
            }
        }
    });
    grunt.registerTask('default', ['clean:prepare', 'build']);
    grunt.registerTask('build', ['gettext', 'sass', 'browserify', 'uglify', 'newer:copy']);
    grunt.registerTask('gettext', ['nggettext_extract', 'nggettext_compile']);
    grunt.registerTask('dev', ['clean:prepare', 'build', 'watch']);
};

