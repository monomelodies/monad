
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.initConfig({
        nggettext_extract: {
            pot: {
                files: {
                    'po/template.pot': ['src/**/*.{js,html}', 'index.html']
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
                        cwd: "po",
                        dest: 'dist/i18n',
                        src: ['*.po'],
                        ext: '.json'
                    }
                ]
            }
        },
        watch: {
            files: ['<%= nggettext_extract.pot.files["po/template.pot"] %>', '<%= nggettext_compile.all.files[0].src %>']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['nggettext_extract', 'nggettext_compile']);
};

