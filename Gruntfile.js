module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin : {
            //"prod/css/styles.min.css" : ["public/css/*.css"]
            css: {
                files: [{
                    expand: true,
                    cwd: 'public/css',
                    src: ['*.css'],
                    dest: 'prod/css',
                    ext: '.min.css'
                }]
              }
        },
        uglify: {
            distJs : {
                files : {
                    "prod/js/scriptAll.min.js" : [
                        "public/js/custom.js",
                        "public/js/panier.js",
                        "public/js/stripe.js",
                        "public/js/spin.min.js"
                    ]
                }
            },
            dev : {
                options : {
                    beautify : true,
                    compress : false,
                    mangle : false,
                    preserveComments : 'all'
                },
                src : "public/js/*.js",
                dest : "prod/js/scriptAll.min.js"
            }
        },
        jshint : {
            all: ['public/js/*.js', '!public/js/spin.min.js']  //  '!fichierNonTretter.js'
        },
        watch : {
            js : {
                files : ["public/js/*.js", "!public/js/*.min.js"],
                tasks : ["uglify:distJs"],
                options : {spawn : false}
            },
            css : {
                files : ["public/css/*.css"],
                tasks : ["cssmin"],
                options : {spawn : false}
            }
        }
    });

    //Load the plugin that provides the "uglify" task.
    //minifier et compresser tout les fichier js
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //Load the plugin that provides the "watch" task.
    //watcher et ecouter tout les actions qui se faites au niveau des fichier js 
    grunt.loadNpmTasks('grunt-contrib-watch');
    //Load the plugin that provides the "jshint" task.
    //tester tout les fichier js
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //minification de tout les fichier css
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //Default task(s).
    grunt.registerTask('dev', ['uglify:dev']);
    grunt.registerTask('default', ['jshint', 'uglify:distJs', "cssmin"]);

};