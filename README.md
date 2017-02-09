# miage.bump 0.3.4

A Bump module embedding directives that:
 - Bumps the contents of an URL or a DOM Node
 - Tests the Bump action within an iframe (DEV only)
 - Displays the top tags from a user
 - Displays the top tags from a user's friends
 - Displays profiles matching a user's tags
 
## How to run as demo and dev server

1. Clone the repository: `git clone https://github.com/Moutardentube/miage-bump.git`
2. Go to the project directory: `cd miage-bump`
3. Run `npm install` then `bower install`
4. Create your own configuration file from the default one using `cp demo/config.dist.js config.js`
5. Start `grunt dev`
6. Open Chrome with same origin policy disabled: `open -a Google\ Chrome --args --disable-web-security --user-data-dir`
7. Visit http://localhost:9100

## How to run as standalone component

### Install the module
1. Install with bower: `bower install https://github.com/Moutardentube/miage-bump`
2. Include the module and its dependencies files in your index.html:
```
<script src="bower_components/ng-onload/release/ng-onload.js"></script>
<script src="bower_components/angular-toArrayFilter/toArrayFilter.js"></script>
<script src="bower_components/eklabs.angularStarterPack/release/eklabs.angularStarterPack.js"></script>
<script src="bower_components/miage.bump/miage.bump.js"></script>
<script src="bower_components/miage.bump/miage.bump_view.js"></script>
```

### Use its directives
1. Use your existing configuration module or register a new one to inject your API parameters into Bump
```
angular.module('yourApp')
    .constant('WEBAPP_CONFIG', {
        api         : 'yourApiUrl',
        uploadPath  : 'yourUploadUrl'
    });
```
2. Include the module in your own module dependencies:
```
angular.module('yourApp', [
    ...
    'miage.bump'
]);
```
3. Anywhere within your templates include its directive, ie:
```
<bump-button user="yourUser"
             url="yourUrl"
             container="yourContainer"
             tags="yourTags"
             callback="yourCallback"></bump-button>
```
Note that bumpTops, bumpTrends and bumpMatches all require the bumpProfile directive

## Bump Button contract
```
{
  "user"      : "Resource User",
  "url"       : "string",
  "container" : "string",
  "tags"      : "string",
  "callback"  : {
    "onBump"  : "function (user, url, container, tags) {}"
  }
}
```
## Bump Profile contract
```
{
  "user"      : "Resource User"
}
```