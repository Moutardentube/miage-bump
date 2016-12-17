modelFiles = {
    src : [


        'src/modules/json-editor/module.js',
        'src/modules/json-editor/{,**/}*.js',

        'src/modules/bump-profile/module.js',
        'src/modules/bump-profile/{,**/}*.js',
        
        'src/module.js',
        'src/services/{,**/}*.js'

    ]
};

if (exports) {
    exports.files       = modelFiles;
}