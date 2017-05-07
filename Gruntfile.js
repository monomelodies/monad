
module.exports = function (grunt) {

    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({pkg});

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
                prefix: 'Monad/'
            },
            cwd: 'src',
            src: ['**/*.html', '!index.html'],
            dest: 'es5/templates.js'
        }
    });

    grunt.loadNpmTasks('node-spritesheet');
    grunt.config('spritesheet', {
        compile: {
            options: {
                outputImage: 'dist/i18n.png',
                outputCss: 'src/_sass/_flags.scss',
                selector: '.flag'
            },
            files: {'': 'assets/i18n/**/*.png'}
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.config('sass', {
        monad: {
            options: {
                outputStyle: 'compressed',
                compass: true,
                sourcemap: 'none'
            },
            files: {'dist/monad.css': 'src/style.scss'}
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.config('browserify', {
        monad: {
            src: 'src/index.js',
            dest: 'dist/monad.js',
            options: {
                transform: ['babelify'],
                standalone: 'monad',
                watch: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.config('copy', {
        logo: {expand: true, cwd: 'assets', src: 'logo.png', dest: 'dist'},
        bootstrap: {expand: true, cwd: 'node_modules/bootstrap-sass/assets', src: 'fonts/**', dest: 'dist'},
        flags: {expand: true, cwd: 'src/_sass', src: 'i18n.png', dest: 'dist'}
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.config('shell', {
        es5: { command: 'npm run build' }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.config('watch', {
        spritesheet: {
            files: ['assets/i18n/**/*.png'],
            tasks: ['spritesheet']
        },
        es5: {
            files: ['src/**/*.js'],
            tasks: ['shell:es5']
        },
        sass: {
            files: ['src/_sass/**/*.scss'],
            tasks: ['sass']
        },
        templates: {
            files: ['src/**/*.html'],
            tasks: ['ngtemplates']
        },
        includereplace: {
            files: ['src/index.html'],
            tasks: ['includereplace']
        }
    });

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['ngtemplates', /*'sass',*/ 'shell:es5', 'copy', 'browserify']);
    grunt.registerTask('dev', ['build', 'watch']);
};

