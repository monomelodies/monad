# Language
Based on the values of [`languages`](../overview/customisation.md#languages)
and the current `$route`, this service stores language settings.

## Usage
```javascript
class Something {

    constructor(Language) {
    }

};

Something.$inject = ['moLanguage'];
```

## API
### Properties
- **Language.current**
    Get or set the current language (e.g. `en`). An error is thrown if the
    language to be set is not available.
- **Language.list**
    Get a list of all defined languages.

