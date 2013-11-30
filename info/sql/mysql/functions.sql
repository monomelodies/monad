
DROP FUNCTION IF EXISTS fn_monad_page_i18n_unique_slug;
DELIMITER |
CREATE FUNCTION fn_monad_page_i18n_unique_slug(oldid INT, str TEXT, lang INT) RETURNS TEXT
BEGIN
    SET @uniq = 0;
    SET @incr = 0;
    REPEAT
        SELECT COUNT(*) FROM monad_page_i18n
            WHERE slug = str AND language = lang AND id <> oldid INTO @check;
        IF @check = 0 THEN
            SET @uniq = 1;
        ELSE
            SET @incr = @incr + 1;
            SET str = fn_increment_slug(str, @incr);
        END IF;
    UNTIL @uniq = 1 END REPEAT;
    RETURN str;
END;
|
DELIMITER ;

DROP FUNCTION IF EXISTS fn_assembleslug;
DELIMITER |
CREATE FUNCTION fn_assembleslug(pageid INT, lang INT) RETURNS TEXT
BEGIN
    SELECT parent, slug FROM monad_page JOIN monad_page_i18n USING(id)
        WHERE id = pageid AND language = lang INTO @parent, @slug;
    REPEAT
        IF @parent IS NOT NULL THEN
            SELECT parent, slug FROM monad_page JOIN monad_page_i18n USING(id)
                WHERE id = @parent AND language = lang INTO @parent, @slug2;
            SET @slug = CONCAT_WS('/', @slug2, @slug);
        END IF;
    UNTIL @parent IS NULL END REPEAT;
    RETURN @slug;
END;
|
DELIMITER ;

