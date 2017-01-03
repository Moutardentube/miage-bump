modelFiles = {
    src : [
        'src/module.js',
        'src/modules/button/module.js',
        'src/modules/profile/module.js',

        'src/modules/{,**/}*.js',
        'src/services/{,**/}*.js',
        'src/models/{,**/}*.js',
        'src/filters/{,**/}*.js'
    ]
};

if (exports) {
    exports.files       = modelFiles;
}