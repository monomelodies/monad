angular.module('monad.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/monad/LICENSE.html',
    "<p>The MIT License (MIT)</p><p>Copyright (c) 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Marijn Ophorst <a href=mailto:marijn@monmomelodies.nl>&lt;marijn@monomelodies.nl&gt;</a></p><p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p><p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p><p>THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>"
  );


  $templateCache.put('/monad/directives/list/header/template.html',
    "<h1 class=clearfix><a ng-if=header.component.settings.create class=\"glyphicon glyphicon-plus-sign pull-right\" title=\"{{'Create' | translate}}\" mo-path=/:language{{header.component.settings.create.url}}></a> <span ng-transclude></span> <span translate ng-if=!header.transcluded>List of items in {{ header.component.name }}</span></h1>"
  );


  $templateCache.put('/monad/directives/list/table/delete.html',
    "<button class=\"btn btn-warning\" mo-delete ng-click=\"tbody.refresh(delete(row, tbody.list.Manager))\" translate>Delete</button>"
  );


  $templateCache.put('/monad/directives/list/table/template.html',
    "<div ng-show=\"tbody.rows && tbody.rows.length\"><table class=\"table table-striped\"><thead></thead><tbody><tr ng-repeat=\"row in tbody.rows\" ng-if=!row.$deleted><td ng-repeat=\"column in tbody.columns\"><a ng-if=!tbody.templates[column] mo-path=/:language{{tbody.component.settings.update.url}} arguments=row>{{row[column]}}</a><div ng-if=tbody.templates[column] ng-include=tbody.templates[column]></div></td></tr></tbody></table></div><div ng-show=\"!(tbody.rows && tbody.rows.length)\"><uib-alert type=warning><span translate>Sorry, nothing found.</span></uib-alert></div>"
  );


  $templateCache.put('/monad/directives/update/template.html',
    "<h1 class=\"container-fluid clearfix\"><small><a class=\"glyphicon glyphicon-arrow-up pull-right\" mo-path=/:language{{update.component.settings.list.url}}></a></small> <span ng-if=update.item.$new translate>Create new item in <code>{{ update.component.name }}</code></span> <span ng-if=!update.item.$new translate>Edit <q>{{ update.item.$title }}</q> in <code>{{ update.component.name }}</code></span></h1><div class=\"container-fluid clearfix\"><form ng-submit=update.save() id=mo_update_form name=mo_update_form><div ng-transclude></div><br style=\"clear: both\"><div class=row><div class=\"clearfix col-md-12 spaceme\"><button type=submit class=\"btn btn-primary fixed\" ng-if=\"mo_update_form.$valid && update.$dirty\" translate>Save changes</button> <a href class=\"glyphicon glyphicon-trash text-danger\" ng-if=\"update.delete && !update.item.$new\" ng-click=update.delete()></a></div></div></form></div>"
  );


  $templateCache.put('/monad/templates/home.html',
    "<article class=jumbotron><div class=container-fluid><h1>{{monad.title}} administrator</h1></div></article><div class=container-fluid><div class=row><article class=col-md-6><h2 translate>Welcome!</h2><p translate>Hi there, you've reached the administrator for this site. Your options are listed here. You can also use the main menu at the top to navigate.</p></article><aside class=col-md-6><div class=\"panel panel-info\"><ul class=list-group><li class=list-group-item ng-repeat=\"item in monad.Navigation.main\"><a mo-path={{item.url}} ng-include=\"item.component + '/menu.html'\"></a></li></ul></div></aside></div></div>"
  );


  $templateCache.put('/monad/templates/license.html',
    "<div class=modal-header><h3 class=modal-title translate>License</h3></div><div class=modal-body><p><strong translate>Note: this applies to the Monad CMS framework, not (necessarily) the site it is used for :)</strong></p><div ng-include=\"'/monad/LICENSE.html'\"></div></div><div class=modal-footer><button class=\"btn btn-primary\" ng-click=ok() translate>Got it!</button></div>"
  );


  $templateCache.put('/monad/templates/list.html',
    "<div class=container-fluid mo-list module=list.module><mo-list-header></mo-list-header><div ng-if=list.filterUrl ng-include=list.filterUrl></div><mo-list-table rows=list.items list=list columns=list.columns templates=list.templates></mo-list-table><div class=text-center ng-if=\"list.Manager.count > 10\"><pagination total-items=list.Manager.count ng-model=list.page boundary-links=true max-size=10></pagination></div></div>"
  );


  $templateCache.put('/monad/templates/login.html',
    "<div class=vert-wrapper><div class=vert-wrapper-inner><form ng-submit=login.attempt() id=auth name=auth novalidate method=post><fieldset><legend translate>Please login</legend><div class=form-group><input name=username ng-model=login.credentials[0] class=form-control placeholder=\"{{'Username' | translate}}\"></div><div class=form-group><input type=password name=password ng-model=login.credentials[1] class=form-control placeholder=\"{{'Password' | translate}}\"></div><button type=submit class=\"btn btn-default pull-right\" translate>Go!</button></fieldset></form></div></div>"
  );

}]);
