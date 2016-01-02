
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
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
        ngtemplates: {
            'monad.templates': {
                options: {
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: false,
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
        watch: {
            gettext_extract: {
                files: ['src/**/*.{js,html}', 'index.html'],
                tasks: ['nggettext_extract']
            },
            gettext_compile: {
                files: ['Locale/*.po'],
                tasks: ['nggettext_compile']
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

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['gettext', 'spritesheet', 'inline']);
    grunt.registerTask('gettext', ['nggettext_extract', 'nggettext_compile']);
    grunt.registerTask('dev', ['build', 'watch']);
};

