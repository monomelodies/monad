angular.module('monad.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/monad/LICENSE.html',
    "<p>The MIT License (MIT)</p>\n" +
    "<p>\n" +
    "    Copyright (c) 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016\n" +
    "    Marijn Ophorst <a href=mailto:marijn@monmomelodies.nl>&lt;marijn@monomelodies.nl&gt;</a>\n" +
    "</p>\n" +
    "<p>\n" +
    "    Permission is hereby granted, free of charge, to any person obtaining a copy\n" +
    "    of this software and associated documentation files (the \"Software\"), to deal\n" +
    "    in the Software without restriction, including without limitation the rights\n" +
    "    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n" +
    "    copies of the Software, and to permit persons to whom the Software is\n" +
    "    furnished to do so, subject to the following conditions:\n" +
    "</p>\n" +
    "<p>\n" +
    "    The above copyright notice and this permission notice shall be included in all\n" +
    "    copies or substantial portions of the Software.\n" +
    "</p>\n" +
    "<p>\n" +
    "    THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n" +
    "    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n" +
    "    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n" +
    "    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n" +
    "    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n" +
    "    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n" +
    "    SOFTWARE.\n" +
    "</p>"
  );


  $templateCache.put('/monad/components/Login/template.html',
    "<div ng-transclude ng-if=$ctrl.auth.check></div>\n" +
    "<div class=vert-wrapper ng-if=!$ctrl.auth.check>\n" +
    "    <div class=vert-wrapper-inner>\n" +
    "        <form ng-submit=$ctrl.auth.attempt($ctrl.credentials) id=auth name=auth novalidate method=post>\n" +
    "            <fieldset>\n" +
    "                <legend translate>Please login</legend>\n" +
    "                <div class=form-group>\n" +
    "                    <input name=username ng-model=$ctrl.credentials.username class=form-control placeholder=\"{{ 'Username' | translate }}\">\n" +
    "                </div>\n" +
    "                <div class=form-group>\n" +
    "                    <input type=password name=password ng-model=$ctrl.credentials.password class=form-control placeholder=\"{{ 'Password' | translate }}\">\n" +
    "                </div>\n" +
    "                <button type=submit class=\"btn btn-default pull-right\" translate>Go!</button>\n" +
    "            </fieldset>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/monad/components/Update/template.html',
    "<h1 class=\"container-fluid clearfix\">\n" +
    "    <small><a class=\"glyphicon glyphicon-arrow-up pull-right\" mo-path=\"/:language{{ $ctrl.list }}\"></a></small>\n" +
    "    <span ng-if=update.item.$new translate>Create new item in <code>{{ $ctrl.type }}</code></span>\n" +
    "    <span ng-if=!update.item.$new translate>Edit <q>{{ $ctrl.item[$ctrl.title] }}</q> in <code>{{ $ctrl.type }}</code></span>\n" +
    "</h1>\n" +
    "<div class=\"container-fluid clearfix\">\n" +
    "    <form ng-submit=$ctrl.save() id=mo_update_form name=mo_update_form novalidate method=post>\n" +
    "        <div ng-transclude></div>\n" +
    "        <br style=\"clear: both\">\n" +
    "        <div class=row>\n" +
    "            <div class=\"clearfix col-md-12 spaceme\">\n" +
    "                <button type=submit class=\"btn btn-primary fixed\" ng-if=\"mo_update_form.$valid && mo_update_form.$dirty\" translate>Save changes</button>\n" +
    "                <a href class=\"glyphicon glyphicon-trash text-danger\" ng-if=\"$ctrl.delete && $ctrl.item.id\" ng-click=$ctrl.delete()></a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>"
  );


  $templateCache.put('/monad/directives/list/header/template.html',
    "<h1 class=clearfix>\n" +
    "    <a ng-if=header.component.settings.create class=\"glyphicon glyphicon-plus-sign pull-right\" title=\"{{'Create' | translate}}\" mo-path=/:language{{header.component.settings.create.url}}></a>\n" +
    "    <span ng-transclude></span>\n" +
    "    <span translate ng-if=!header.transcluded>List of items in {{ header.component.name }}</span>\n" +
    "</h1>"
  );


  $templateCache.put('/monad/directives/list/table/delete.html',
    "<button class=\"btn btn-warning\" mo-delete ng-click=\"tbody.refresh(delete(row, tbody.list.Manager))\" translate>Delete</button>"
  );


  $templateCache.put('/monad/templates/home.html',
    "<article class=jumbotron>\n" +
    "    <div class=container-fluid>\n" +
    "        <h1>{{ $root.title }} administrator</h1>\n" +
    "    </div>\n" +
    "</article>\n" +
    "<div class=container-fluid>\n" +
    "    <div class=row>\n" +
    "        <article class=col-md-6>\n" +
    "            <h2 translate>Welcome!</h2>\n" +
    "            <p translate>\n" +
    "                Hi there, you've reached the administrator for this site. Your options are listed here.\n" +
    "                You can also use the main menu at the top to navigate.\n" +
    "            </p>\n" +
    "        </article>\n" +
    "        <aside class=col-md-6>\n" +
    "            <div class=\"panel panel-info\">\n" +
    "                <ul class=list-group>\n" +
    "                    <li class=list-group-item ng-repeat=\"item in monad.Navigation.main\">\n" +
    "                        <a mo-path=\"{{ item.url }}\" ng-include=\"item.component + '/menu.html'\"></a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </aside>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/monad/templates/license.html',
    "<div class=modal-header>\n" +
    "    <h3 class=modal-title translate>License</h3>\n" +
    "</div>\n" +
    "<div class=modal-body>\n" +
    "    <p><strong translate>Note: this applies to the Monad CMS framework, not (necessarily) the site it is used for :)</strong></p>\n" +
    "    <div ng-include=\"'/monad/LICENSE.html'\"></div>\n" +
    "</div>\n" +
    "<div class=modal-footer>\n" +
    "    <button class=\"btn btn-primary\" ng-click=ok() translate>Got it!</button>\n" +
    "</div>"
  );


  $templateCache.put('/monad/templates/list.html',
    "<div class=container-fluid mo-list module=list.module>\n" +
    "    <mo-list-header></mo-list-header>\n" +
    "    <div ng-if=list.filterUrl ng-include=list.filterUrl></div>\n" +
    "    <mo-list-table rows=list.items list=list columns=list.columns templates=list.templates></mo-list-table>\n" +
    "    <div class=text-center ng-if=\"list.Manager.count > 10\">\n" +
    "        <pagination total-items=list.Manager.count ng-model=list.page boundary-links=true max-size=10></pagination>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('/monad/templates/login.html',
    "<div ng-transclude ng-if=login.auth.check></div>\n" +
    "<div class=vert-wrapper ng-if=\"!login.auth.check && login.default\">\n" +
    "    <div class=vert-wrapper-inner>\n" +
    "        <form ng-submit=login.auth.attempt(login.credentials) id=auth name=auth novalidate method=post>\n" +
    "            <fieldset>\n" +
    "                <legend translate>Please login</legend>\n" +
    "                <div class=form-group>\n" +
    "                    <input name=username ng-model=login.credentials.username class=form-control placeholder=\"{{'Username' | translate}}\">\n" +
    "                </div>\n" +
    "                <div class=form-group>\n" +
    "                    <input type=password name=password ng-model=login.credentials.password class=form-control placeholder=\"{{'Password' | translate}}\">\n" +
    "                </div>\n" +
    "                <button type=submit class=\"btn btn-default pull-right\" translate>Go!</button>\n" +
    "            </fieldset>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div ng-if=\"!login.default && !login.auth.check\">\n" +
    "    <div ng-if=login.template ng-bind-html=login.template></div>\n" +
    "    <div ng-if=login.templateUrl ng-include=login.templateUrl></div>\n" +
    "</div>"
  );

}]);
