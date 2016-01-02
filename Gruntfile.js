
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('node-spritesheet');

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
                files: {'i18n.js': ['Locale/*.po']}
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    compass: true,
                    sourcemap: 'none',
                    loadPath: ['node_modules/bootstrap-sass/assets/stylesheets']
                },
                files: {'dist/default.css': 'src/_sass/**/default.scss'}
            }
        },
        copy: {
            statics: {
                files: [
                    {expand: true, src: '**/*.{html,json}', cwd: 'src/', dest: 'dist/'},
                    {expand: true, src: 'fonts/**/*', cwd: 'node_modules/bootstrap-sass/assets/', dest: 'dist'}
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
        ngtemplates: {
            'monad.templates': {
                options: {
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    },
                    standalone: true,
                    prefix: '/monad/'
                },
                cwd: 'src',
                src: ['**/*.html', '!index.html'],
                dest: 'templates.js'
            }
        },
        spritesheet: {
            compile: {
                options: {
                    outputImage: 'i18n.png',
                    outputCss: 'flags.css',
                    selector: '.flag'
                },
                files: {'': 'assets/i18n/**/*.png'}
            }
        },
        inline: {
            index: {
                src: 'src/index.html',
                dest: 'index.html'
            },
            flags: {
                options: {
                    tag: ''
                },
                src: 'flags.css',
                dest: 'src/_sass/_flags.scss'
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
                files: ['src/**/*.{html,json}', 'bower_components/bootstrap-sass/assets/fonts/**/*'],
                tasks: ['newer:copy:statics']
            },
            license: {
                files: ['LICENSE'],
                tasks: ['newer:copy:license']
            },
            spritesheet: {
                files: ['assets/i18n/**/*.png'],
                tasks: ['spritesheet']
            },
            inline: {
                files: ['src/index.html', 'flags.css', 'i18n.png'],
                tasks: ['inline']
            }
        }
    });

    grunt.registerTask('default', ['clean:prepare', 'build']);
    grunt.registerTask('build', ['gettext', 'sass', 'spritesheet', 'inline', 'newer:copy']);
    grunt.registerTask('gettext', ['nggettext_extract', 'nggettext_compile']);
    grunt.registerTask('dev', ['clean:prepare', 'build', 'watch']);
};

