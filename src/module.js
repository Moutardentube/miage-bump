'use strict';

angular.module('miage.bump', [
    'miage.bump.button',
    'miage.bump.profile',
    'eklabs.angularStarterPack.user',
    'ngMaterial'
]).config(function ($mdIconProvider) {
    $mdIconProvider.iconSet('material-design', '/public/material-design.svg', 24);
});