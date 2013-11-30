
DROP TRIGGER IF EXISTS monad_page_update_before;
DELIMITER $$
CREATE TRIGGER monad_page_update_before BEFORE UPDATE ON monad_page
FOR EACH ROW
BEGIN
    SET NEW.datemodified = NOW();
END;
$$
DELIMITER ;

DROP TRIGGER IF EXISTS monad_query_insert_before;
DELIMITER $$
CREATE TRIGGER monad_query_insert_before BEFORE INSERT ON monad_query
FOR EACH ROW
BEGIN
    SET NEW.checksum = md5(CONCAT(NEW.owner, NEW.`session`, NEW.querysql, NOW()));
END;
$$
DELIMITER ;

DROP TRIGGER IF EXISTS monad_page_insert_before;
DELIMITER $$
CREATE TRIGGER monad_page_insert_before BEFORE INSERT ON monad_page
FOR EACH ROW
BEGIN
    IF NEW.sortorder IS NULL OR NEW.sortorder = 0 THEN
        IF NEW.parent IS NULL THEN
            SET NEW.sortorder = (SELECT COALESCE(sortorder, 0) FROM
                monad_page WHERE parent IS NULL ORDER BY sortorder DESC LIMIT 1
            ) + 1;
        ELSE
            SET NEW.sortorder = (SELECT COALESCE(sortorder, 0) FROM
                monad_page WHERE parent = NEW.parent
                ORDER BY sortorder DESC LIMIT 1
            ) + 1;
        END IF;
    END IF;
    IF NEW.sortorder IS NULL OR NEW.sortorder = 0 THEN
        SET NEW.sortorder = 1;
    END IF;
END;
$$
DELIMITER ;

DROP TRIGGER IF EXISTS monad_page_insert_after;
DELIMITER $$
CREATE TRIGGER monad_page_insert_after AFTER INSERT ON monad_page
FOR EACH ROW
BEGIN
    INSERT INTO monad_page_i18n
        SELECT NEW.id, id, md5(CONCAT(NEW.datecreated, NEW.id)),
            NULL, NULL, NULL, NULL, 1 FROM monolyth_language;
END;
$$
DELIMITER ;

DROP TRIGGER IF EXISTS monad_page_i18n_insert_before;
DELIMITER $$
CREATE TRIGGER monad_page_i18n_insert_before BEFORE INSERT ON monad_page_i18n
FOR EACH ROW
BEGIN
    IF NEW.slug = '' OR NEW.slug IS NULL THEN
        SET NEW.slug = fn_monad_page_i18n_unique_slug(0, fn_generate_slug(NEW.title), NEW.language);
    END IF;
END;
$$
DELIMITER ;

DROP TRIGGER IF EXISTS monad_page_i18n_update_before;
DELIMITER $$
CREATE TRIGGER monad_page_i18n_update_before BEFORE UPDATE ON monad_page_i18n
FOR EACH ROW
BEGIN
    IF OLD.title <> NEW.title AND NEW.slug = OLD.slug THEN
        SET NEW.slug = fn_monad_page_i18n_unique_slug(NEW.id, fn_generate_slug(NEW.title), NEW.language);
    END IF;
END;
$$
DELIMITER ;

DROP TRIGGER IF EXISTS monad_section_insert_after;
DELIMITER $$
CREATE TRIGGER monad_section_insert_after AFTER INSERT ON monad_section
FOR EACH ROW
BEGIN
    INSERT INTO monad_section_i18n
        SELECT NEW.id, id, NULL, NULL, NULL FROM monolyth_language;
END;
$$
DELIMITER ;

DROP TRIGGER IF EXISTS monad_menu_update_before;
DELIMITER $$
CREATE TRIGGER monad_menu_update_before BEFORE UPDATE ON monad_menu
FOR EACH ROW
BEGIN
    SET NEW.datemodified = NOW();
END;
$$
DELIMITER ;

DROP TRIGGER IF EXISTS monad_menu_insert_after;
DELIMITER $$
CREATE TRIGGER monad_menu_insert_after AFTER INSERT ON monad_menu
FOR EACH ROW BEGIN
    INSERT INTO monad_menu_i18n
        SELECT NEW.id, id, 'New menu' FROM
            monolyth_language;
END;
$$
DELIMITER ;

DROP TRIGGER IF EXISTS monad_menu_item_update_before;
DELIMITER $$
CREATE TRIGGER monad_menu_item_update_before BEFORE UPDATE ON monad_menu_item
FOR EACH ROW
BEGIN
    SET NEW.datemodified = NOW();
END;
$$
DELIMITER ;

DROP TRIGGER IF EXISTS monad_menu_item_insert_before;
DELIMITER $$
CREATE TRIGGER monad_menu_item_insert_before BEFORE INSERT ON monad_menu_item
FOR EACH ROW
BEGIN
    IF NEW.sortorder IS NULL OR NEW.sortorder = 0 THEN
        IF NEW.menu IS NULL THEN
            SET NEW.sortorder = (SELECT COALESCE(sortorder, 0) FROM
                monad_menu_item WHERE menu IS NULL ORDER BY sortorder DESC LIMIT 1
            ) + 1;
        ELSE
            SET NEW.sortorder = (SELECT COALESCE(sortorder, 0) FROM
                monad_menu_item WHERE menu = NEW.menu
                ORDER BY sortorder DESC LIMIT 1
            ) + 1;
        END IF;
    END IF;
    IF NEW.sortorder IS NULL OR NEW.sortorder = 0 THEN
        SET NEW.sortorder = 1;
    END IF;
END;
$$
DELIMITER ;

DROP TRIGGER IF EXISTS monad_menu_item_insert_after;
DELIMITER $$
CREATE TRIGGER monad_menu_item_insert_after AFTER INSERT ON monad_menu_item
FOR EACH ROW BEGIN
    INSERT INTO monad_menu_item_i18n
        SELECT NEW.id, id, CONCAT('Option ', NEW.sortorder), NULL, 1 FROM
            monolyth_language;
END;
$$
DELIMITER ;

