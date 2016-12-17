modelFiles = {
    src : [


        'src/services/{,**/}*.js',

        'src/modules/json-editor/module.js',
        'src/modules/json-editor/{,**/}*.js',

        'src/modules/form-editor/module.js',
        'src/modules/form-editor/{,**/}*.js',
        
        'src/modules/forms/module.js',
        'src/modules/forms/{,**/}*.js',

        'src/modules/user/module.js',
        'src/modules/user/{,**/}*.js',

        'src/modules/bump-button/module.js',
        'src/modules/bump-button/{,**/}*.js',
        'src/modules/bump-profile/module.js',
        'src/modules/bump-profile/{,**/}*.js',

        'src/module.js',
        'src/filters/{,**/}*.js'



    ]
};

if (exports) {
    exports.files       = modelFiles;
}