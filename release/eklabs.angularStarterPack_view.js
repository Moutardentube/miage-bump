angular.module('eklabs.angularStarterPack').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('eklabs.angularStarterPack/modules/forms/directives/my-form/myFormView.html',
    "<form name=\"myForm\" ng-submit=\"actions.onValid(myUser)\">\n" +
    "\n" +
    "    <div layout=\"column\" >\n" +
    "        <md-input-container >\n" +
    "            <label>FirstName</label>\n" +
    "            <input name=\"name\" ng-model=\"myUser.firstname\" />\n" +
    "        </md-input-container>\n" +
    "\n" +
    "        <md-input-container >\n" +
    "            <label>LastName</label>\n" +
    "            <input name=\"name\" ng-model=\"myUser.lastname\" />\n" +
    "        </md-input-container>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <md-button type=\"submit\">\n" +
    "        <md-icon md-svg-src=\"material-design:done\"></md-icon>\n" +
    "        Valider\n" +
    "    </md-button>\n" +
    "\n" +
    "\n" +
    "</form>"
  );


  $templateCache.put('eklabs.angularStarterPack/modules/json-editor/directives/editor/view.html',
    "<form id        =   \"myJsonEditor\"\n" +
    "      name      =   \"myForm\"\n" +
    "      novalidate\n" +
    "      layout    =   \"column\"\n" +
    "      ng-submit =   \"myForm.$valid && !editorError && !eerror.length && actions.valid(currentJson)\"\n" +
    "      ng-style  =   \"{'min-height' : currentHeight, 'max-height' : currentHeight}\"\n" +
    "      style=\"overflow-y: hidden;overflow-x: hidden\">\n" +
    "\n" +
    "    <!-- FORM CONTENT -->\n" +
    "    <div flex\n" +
    "         layout     =   \"column\"\n" +
    "         style      =   \"overflow-y:auto;overflow-x: hidden;\"\n" +
    "         ng-style   =   \"{'min-height' : maxHeightContainer , 'max-height' : maxHeightContainer}\">\n" +
    "\n" +
    "        <div layout=\"column\" flex ng-if=\"aceAvailable\">\n" +
    "\n" +
    "            <h2 class=\"title\">Editeur JSON </h2>\n" +
    "\n" +
    "            <div ui-ace=\"aceOption\" ng-model=\"aceModel\" style=\"width: 100%\" ng-style = \"{'max-height' : aceMaxHeight }\"></div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- BOUTON ACTIONS -->\n" +
    "    <div layout=\"row\" layout-align=\"start center\" class=\"shadow_up\" >\n" +
    "\n" +
    "        <div ng-if=\"errors.length || editorError\" layout=\"row\" class=\"warn-font\" style=\"font-size: 0.9em\">\n" +
    "\n" +
    "            <md-icon md-svg-src=\"material-design:error_outline\" class=\"ic_16px warn-font\"></md-icon>\n" +
    "\n" +
    "            <span ng-if=\"errors.length\" ng-repeat=\"error in errors\">{{error}}</span>\n" +
    "\n" +
    "            <span ng-if=\"editorError\" style=\"margin-left: 10px;\">{{editorError}}</span>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div flex></div>\n" +
    "\n" +
    "        <md-button type=\"submit\" aria-label=\"test\" ng-disabled=\"editorError || errors.length\">\n" +
    "            <md-icon md-svg-src=\"material-design:done\"></md-icon>\n" +
    "            <span style=\"font-weight:200\">Valider</span>\n" +
    "        </md-button>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</form>"
  );


  $templateCache.put('eklabs.angularStarterPack/modules/user/directives/my-user-form/myUserForm.html',
    "<form name=\"myUserForm\" id=\"myUserForm\" ng-style=\"{'min-height' : current_height, 'max-height' : current_height, overflow:'auto'}\">\n" +
    "\n" +
    "    <div layout=\"row\">\n" +
    "\n" +
    "        <div flex layout=\"column\" layout-align=\"center center\">\n" +
    "\n" +
    "            <img ng-src=\"{{user.getPicture()}}\" style=\"width:100px; height: 100px; border-radius: 20px\" ng-if=\"!avatarUploaded\" />\n" +
    "\n" +
    "            <img ngf-src=\"picFile\" style=\"width: 100px; height: 100px; border-radius: 20px\" ng-if=\"avatarUploaded\"/>\n" +
    "\n" +
    "            <md-button ngf-select ngf-change=\"changeAvatar($file)\" aria-label=\"upload photo\" accept=\"image/png, image/jpg, image/jpeg\">\n" +
    "                <md-icon md-svg-src=\"material-design:edit\" class=\"blue-font ic_16px\"></md-icon>\n" +
    "                <span style=\"font-weight: 200\">Changer de photo</span>\n" +
    "            </md-button>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div flex=\"5\"></div>\n" +
    "\n" +
    "        <!-- General Information  -->\n" +
    "        <div flex=\"70\">\n" +
    "\n" +
    "            <md-input-container class=\"md-block\">\n" +
    "                <label>Nom complet de la personne</label>\n" +
    "                <input ng-model=\"currentUser.name\" required name=\"name\" aria-label='user name'/>\n" +
    "                <div ng-messages=\"myUserForm.name.$error\">\n" +
    "                    <div ng-message=\"required\">This is required.</div>\n" +
    "                </div>\n" +
    "            </md-input-container>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "<div layout=\"row\" layout-align=\"end center\" class=\"md-whiteframe-10dp\">\n" +
    "\n" +
    "    <div class=\"warn-font\" style=\"font-size: 0.8em\" ng-if=\"errors\">\n" +
    "        {{errors}}\n" +
    "    </div>\n" +
    "\n" +
    "    <md-button aria-label=\"cancel\" ng-click=\"cancel()\" ng-if=\"!isLoading\">\n" +
    "        <md-icon md-svg-src=\"material-design:reply\" class=\"ic_16px\"></md-icon>\n" +
    "        <span style=\"font-weight: 200\">Annuler</span>\n" +
    "    </md-button>\n" +
    "\n" +
    "    <md-button aria-label=\"delete\" ng-click=\"delete()\" ng-if=\"!isCreation && !isLoading\">\n" +
    "        <md-icon md-svg-src=\"material-design:delete\" class=\"ic_16px\"></md-icon>\n" +
    "        <span style=\"font-weight: 200\">Supprimer</span>\n" +
    "    </md-button>\n" +
    "\n" +
    "    <md-button aria-label=\"valid\" ng-click=\"save()\" ng-if=\"!isLoading\">\n" +
    "        <md-icon md-svg-src=\"material-design:doneLB\" class=\"ic_16px\"></md-icon>\n" +
    "        <span style=\"font-weight: 200\">Valider</span>\n" +
    "    </md-button>\n" +
    "\n" +
    "    <div layout=\"row\" ng-if=\"isLoading\">\n" +
    "        <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"20px\"></md-progress-circular>\n" +
    "        <span>In progress, please wait</span>\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('eklabs.angularStarterPack/modules/user/directives/my-user-list/myUserList.html',
    "<div layout=\"column\" layout-align=\"start start\" ng-style=\"{'min-height' : current_height, 'max-height' : current_height, overflow : 'auto'}\" style=\"width:100%\">\n" +
    "\n" +
    "    <div layout=\"row\" style=\"width: 100%;\">\n" +
    "        <div flex></div>\n" +
    "\n" +
    "        <md-input-container md-no-float flex=\"30\">\n" +
    "            <input ng-model=\"filter.name\" placeholder=\"Recherche sur le nom\"/>\n" +
    "        </md-input-container>\n" +
    "\n" +
    "        <div flex=\"5\"></div>\n" +
    "\n" +
    "        <md-switch ng-model=\"filter.pictureActive\" aria-label=\"Is Connected\">\n" +
    "            {{(!filter.pictureActive)?'Filter par photo presente':'Afficher tous les users'}}\n" +
    "        </md-switch>\n" +
    "\n" +
    "        <div flex></div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"isLoading\" layout=\"row\" layout-align=\"center center\">\n" +
    "        <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"20px\"></md-progress-circular>\n" +
    "        <span>Chargement en cours, merci de patienter</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div layout=\"column\" layout-align=\"center center\" ng-if=\"users.isEmpty() && !isLoading\">\n" +
    "        <span>Aucun User trouvé dans la base</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div layout=\"column\" layout-align=\"center center\" ng-if=\"errors\">\n" +
    "        <md-icon md-svg-src=\"material-design:error_outline\" class=\"warn-font\" style=\"width:70px;height: 70px\"></md-icon>\n" +
    "        <p class=\"warn-font\" style=\"font-size: 0.9em\">{{errors}}</p>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <md-list style=\"width:100%\">\n" +
    "        <md-list-item ng-repeat=\"user in users.items | filter : filterFn\" ng-click=\"editUser(user)\" style=\"width:100%\">\n" +
    "\n" +
    "            <img ng-src=\"{{user.getPicture()}}\" style=\"width: 48px; height: 48px; border-radius: 20px;margin-right:10px\" />\n" +
    "\n" +
    "            <span>{{user.name}}</span>\n" +
    "\n" +
    "            <div flex></div>\n" +
    "\n" +
    "            <md-icon md-svg-src=\"material-design:edit\"></md-icon>\n" +
    "\n" +
    "        </md-list-item>\n" +
    "    </md-list>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('eklabs.angularStarterPack/modules/user/directives/my-user-tab/myUserTab.html',
    "<div layout=\"column\" style=\"padding: 0px;\" ng-style=\"{'min-height' : current_height}\"  >\n" +
    "\n" +
    "    <div layout=\"row\" layout-align=\"end end\">\n" +
    "        <md-button ng-click=\"navigateTo('create')\" ng-disabled=\"createNotAvailable\">\n" +
    "            <md-icon md-svg-src=\"material-design:add\"></md-icon>\n" +
    "            Add new user\n" +
    "        </md-button>\n" +
    "    </div>\n" +
    "\n" +
    "    <md-tabs md-selected=\"selectedIndex\"  flex  md-border-bottom md-autoselect md-dynamic-height >\n" +
    "\n" +
    "        <md-tab ng-repeat=\"tab in tabs\"  ng-disabled=\"tab.disabled\" style=\"\">\n" +
    "\n" +
    "            <md-tab-label>\n" +
    "                <h2 class=\"tabLabel\">\n" +
    "                    <md-icon ng-if=\"tab.icon\" md-svg-icon=\"material-design:{{tab.icon}}\" style=\"width: 20px;height: 20px\"></md-icon>\n" +
    "                    {{tab.title}}\n" +
    "                </h2>\n" +
    "            </md-tab-label>\n" +
    "\n" +
    "            <md-tab-body  style=\"overflow:auto;\">\n" +
    "\n" +
    "                <div ng-switch=\"tab.directive\">\n" +
    "\n" +
    "                    <my-user-list ng-switch-when=\"my-user-list\"  callback=\"actionsList\" height=\"(current_height-14)\" refresh=\"refresh\"></my-user-list>\n" +
    "\n" +
    "                    <my-user-form ng-switch-when=\"my-user-form\"  callback=\"actionsForm\" height=\"(current_height-14)\" refresh=\"refresh\" user=\"currentUser\"></my-user-form>\n" +
    "\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "            </md-tab-body>\n" +
    "\n" +
    "        </md-tab>\n" +
    "\n" +
    "    </md-tabs>\n" +
    "\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('eklabs.angularStarterPack/modules/user/directives/my-user/view.html',
    "<div ng-if=\"!user\">\n" +
    "    User manquant ....\n" +
    "</div>\n" +
    "\n" +
    "<md-card layout=\"column\" ng-if=\"user && !isModeEdition\">\n" +
    "\n" +
    "    <div layout=\"row\">\n" +
    "        <div flex=\"20\">\n" +
    "            <img ng-src=\"{{user.photo}}\" ng-if=\"user.photo\" style=\"width: 100px; height: 100px;border-radius:30px\"/>\n" +
    "        </div>\n" +
    "\n" +
    "        <div flex layout=\"column\">\n" +
    "            <span>{{user.name}}</span>\n" +
    "            <span>{{user.birthDate | momentFormat: 'DD MMM YYYY'}}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div layout=\"row\" layout-align=\"end end\">\n" +
    "        <md-button ng-if=\"isEditable\" ng-click=\"goToEdition()\">\n" +
    "            <md-icon md-svg-src=\"material-design:edit\"></md-icon>\n" +
    "            Editer\n" +
    "        </md-button>\n" +
    "    </div>\n" +
    "</md-card>\n" +
    "\n" +
    "<md-card ng-if=\"user && isModeEdition\">\n" +
    "\n" +
    "    <div layout=\"row\">\n" +
    "\n" +
    "        <div flex=\"20\">\n" +
    "            <img ng-src=\"{{user.photo}}\" ng-if=\"user.photo\" style=\"width: 100px; height: 100px;border-radius:30px\"/>\n" +
    "        </div>\n" +
    "\n" +
    "        <div flex layout=\"column\">\n" +
    "\n" +
    "            <md-input-container class=\"md-block\">\n" +
    "                <label>Nom</label>\n" +
    "                <input required name=\"nom\" ng-model=\"userEdit.name\" />\n" +
    "            </md-input-container>\n" +
    "\n" +
    "            <md-datepicker ng-model=\"userEdit.birthDate\" md-placeholder=\"Enter date\"></md-datepicker>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div layout=\"row\" layout-align=\"end end\">\n" +
    "        <md-button ng-click=\"goToEdition()\">\n" +
    "            <md-icon md-svg-src=\"material-design:remove\"></md-icon>\n" +
    "            Annuler\n" +
    "        </md-button>\n" +
    "        <md-button ng-click=\"valid(userEdit)\">\n" +
    "            <md-icon md-svg-src=\"material-design:done\"></md-icon>\n" +
    "            Valider\n" +
    "        </md-button>\n" +
    "    </div>\n" +
    "</md-card>\n" +
    "\n"
  );

}]);
