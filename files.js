modelFiles = {
    src : [


        'src/modules/json-editor/module.js',
        'src/modules/json-editor/{,**/}*.js',

        'src/modules/form-editor/module.js',
        'src/modules/form-editor/{,**/}*.js',

        'src/modules/bump-button/module.js',
        'src/modules/bump-button/{,**/}*.js',
        
        'src/module.js',
        'src/services/{,**/}*.js'

    ]
};

if (exports) {
    exports.files       = modelFiles;
}