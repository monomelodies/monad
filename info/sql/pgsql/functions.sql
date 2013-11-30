
CREATE OR REPLACE FUNCTION fn_monad_page_i18n_unique_slug(IN str TEXT, IN lang INTEGER) RETURNS TEXT AS $$
    DECLARE uniq INTEGER;
    DECLARE incr INTEGER;
    DECLARE mycheck INTEGER;
BEGIN
    WHILE uniq <> 1 LOOP
        mycheck := (SELECT COUNT(*) FROM monad_page_i18n WHERE slug = str AND language = lang);
        IF mycheck = 0 THEN
            uniq := 1;
        ELSE
            incr := incr + 1;
            str := fn_increment_slug(str, incr);
        END IF;
    END LOOP;
    RETURN str;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION fn_assembleslug(pageid INT, lang INT) RETURNS TEXT AS $$
    DECLARE myparent INTEGER;
    DECLARE slug TEXT;
    DECLARE slug2 TEXT;
BEGIN
    myparent := (SELECT parent FROM monad_page WHERE id = pageid);
    slug := (SELECT slug FROM monad_page_i18n WHERE id = pageid AND language = lang);
    WHILE myparent IS NOT NULL LOOP
        IF myparent IS NOT NULL THEN
            slug2 := (SELECT slug FROM monad_page_i18n WHERE id = myparent);
            myparent := (SELECT parent FROM monad_page WHERE id = myparent);
            slug := slug2 || '/' || slug;
        END IF;
    END LOOP;
    RETURN slug;
END;
$$ LANGUAGE 'plpgsql';

