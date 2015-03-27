System.config({
  "baseURL": "/monad/",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.3.15",
    "babel": "npm:babel@4.7.16",
    "babel-runtime": "npm:babel-runtime@4.7.16",
    "bootstrap": "github:twbs/bootstrap@3.3.4",
    "jquery": "github:components/jquery@2.1.3"
  }
});

