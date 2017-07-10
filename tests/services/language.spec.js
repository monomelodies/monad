
"use strict";

describe('service: Language', () => {
    let Language = undefined;

    beforeEach(inject($rootScope => {
        $rootScope.languages = ['en', 'nl', 'es'];
    }));
    beforeEach(inject((moLanguage) => {
        Language = moLanguage;
    }));

    it('should have three languages in total', () => {
        expect(Language.list.length).toBe(3);
    });

    it('should allow setting of the current language', () => {
        Language.current = 'en';
        expect(Language.current).toBe('en');
    });

    it('should throw an error if the language set is unavailable', () => {
        expect(() => Language.current = 'de').toThrow();
    });
});

