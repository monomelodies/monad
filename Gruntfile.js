
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
                    module: 'backwho',
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
        }
    });
};

