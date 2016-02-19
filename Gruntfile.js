
module.exports = function (grunt) {

    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({pkg: pkg});

    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.config('nggettext_extract', {
        pot: {
            files: {
                'Locale/template.pot': ['src/**/*.{js,html}', 'index.html']
            }
        },
    });
    grunt.config('nggettext_compile', {
        all: {
            files: {'i18n.js': ['Locale/*.po']}
        }
    });

    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.config('ngtemplates', {
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
    });

    grunt.loadNpmTasks('node-spritesheet');
    grunt.config('spritesheet', {
        compile: {
            options: {
                outputImage: 'i18n.png',
                outputCss: 'flags.css',
                selector: '.flag'
            },
            files: {'': 'assets/i18n/**/*.png'}
        }
    });

    grunt.loadNpmTasks('grunt-inline');
    grunt.config('inline', {
        index: {
            src: 'src/index.html',
            dest: 'dist/index.html'
        },
        flags: {
            options: {
                tag: ''
            },
            src: 'flags.css',
            dest: 'src/_sass/_flags.scss'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.config('watch', {
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
        templates: {
            files: ['src/**/*.html'],
            tasks: ['ngtemplates']
        },
        inline: {
            files: ['src/index.html', 'flags.css', 'i18n.png'],
            tasks: ['inline', 'includereplace']
        }
    });

    grunt.loadNpmTasks('grunt-include-replace');
    grunt.config('includereplace', {
        index: {
            options: {
                globals: {
                    version: pkg.version
                }
            },
            src: 'index.html',
            dest: 'index.html'
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.config('browserify', {
        monad: {
            src: './src/angular.js',
            dest: 'dist/monad.js',
            options: {
                transform: ['babelify'],
                watch: true
            }
        }
    });

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['gettext', 'inline', 'includereplace', 'browserify']);
    grunt.registerTask('gettext', ['nggettext_extract', 'nggettext_compile']);
    grunt.registerTask('dev', ['build', 'watch']);
};

