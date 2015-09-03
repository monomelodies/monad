# Controllers
In most cases, you'll be fine with Monad's default controllers for List and Crud
(Create or Update, Delete usually doesn't warrant a separate controller). But in
some cases (doing complex manipulation on an item with a number of linked
managers/models is a common example) you'll want to roll your own. It's easiest
to simply extend one of the existing controllers and override what you need to
(usually the `update` method):

```javascript
import CrudController from '/path/to/monad/src/controllers/CrudController`;

export default class MyController extends CrudController {

    update() {
        // Custom update logic
    }

}
```

Note that both the `CrudController` as well as the `ListController`
automagically register all passed resolves whose names do not begin with `$`
(since that's kind of an internal Angular-thing) on `this`, and are thus
available both in the controller as in the view template.

Finally, during component definition instruct Monad to use the custom
controller for this action:

```javascript
import controller from '/path/to/MyController';

monad.component('foobar', 'foo')
    // ES6 syntax, meaning {controller: controller}
    .update('/my/url/:id/', {controller});
```

In the same vein you can also override stuff like `templateUrl` if the default
doesn't suffice (e.g. you need to show a gallery of images instead of table with
text).

> Consider handling your custom saving logic in the associated Manager; the
> manager is custom by definition so it might make more sense in a lot of
> cases.

And of course, you're free to add your own controllers, though we generally
recommend putting most custom code in directives.

