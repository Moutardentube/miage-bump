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

        'src/modules/bump/module.js',
        'src/modules/bump/{,**/}*.js',

        'src/module.js',
        'src/filters/{,**/}*.js'



    ]
};

if (exports) {
    exports.files       = modelFiles;
}