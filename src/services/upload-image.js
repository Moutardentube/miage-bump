'use strict';


angular.module('eklabs.angularStarterPack.upload',['ngFileUpload'])
    .service('uploadImage', function($timeout, Upload){

        return function(file, path,token,callback){

            file.upload = Upload.upload({
                url     : path,
                method  : 'POST',
                headers : {
                    'Authorization' : token
                },
                file : file,
                fields : { type : file.type.split('/')[1]}
            });

            file.upload.then(function(response){
                $timeout(function () {
                    file.result = response.data;
                    return callback(response.data);
                });
            }, function(reason){
                return callback(reason);
            });

            file.upload.progress(function(evt){
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            })
        }

    });