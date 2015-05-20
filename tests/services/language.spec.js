
"use strict";

angular.module('tests').value('languages', ['en', 'nl', 'es']);

describe('service: Language', () => {
    let Language;

    beforeEach(inject((moLanguage) => {
        Language = moLanguage;
    }));

    it('should not have a current language', () => {
        expect(Language.current).toBe(undefined);
    });

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

