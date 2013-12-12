
-- {{{ v0.23.1
CREATE TABLE monad_page (
    id bigint UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    parent bigint UNSIGNED,
    owner bigint UNSIGNED NOT NULL,
    sortorder bigint UNSIGNED NOT NULL default 0,
    datecreated timestamp NOT NULL DEFAULT NOW(),
    datemodified timestamp,
    usermodified bigint UNSIGNED,
    viewname varchar(255) NOT NULL DEFAULT 'monad\\page/generic',
    viewprepend varchar(255),
    viewappend varchar(255),
    INDEX(parent),
    INDEX(owner),
    INDEX(sortorder),
    INDEX(datecreated),
    INDEX(usermodified),
    CONSTRAINT FOREIGN KEY(parent) REFERENCES monad_page(id) ON DELETE SET NULL,
    CONSTRAINT FOREIGN KEY(owner) REFERENCES monolyth_auth(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY(usermodified) REFERENCES monolyth_auth(id) ON DELETE SET NULL
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_page_i18n (
    id bigint UNSIGNED NOT NULL,
    language bigint UNSIGNED NOT NULL,
    title varchar(255) NOT NULL,
    slug varchar(255) NOT NULL,
    content longtext,
    keywords varchar(255),
    description tinytext,
    status BIGINT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (id, language),
    UNIQUE INDEX(language, slug),
    INDEX(status),
    CONSTRAINT FOREIGN KEY(id) REFERENCES monad_page(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY(language) REFERENCES monolyth_language(id) ON DELETE CASCADE
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_section (
    id bigint UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    datecreated timestamp NOT NULL DEFAULT NOW(),
    datemodified datetime,
    viewname varchar(255) NOT NULL DEFAULT 'monad\\slice/section'
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_section_i18n (
    id bigint UNSIGNED NOT NULL,
    language bigint UNSIGNED NOT NULL,
    header text,
    content longtext,
    footer text,
    PRIMARY KEY(id, language),
    INDEX(id),
    INDEX(language),
    CONSTRAINT FOREIGN KEY(id) REFERENCES monad_section(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY(language) REFERENCES monolyth_language(id) ON DELETE CASCADE
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_page_section (
    section bigint UNSIGNED NOT NULL,
    page bigint UNSIGNED NOT NULL,
    parent bigint UNSIGNED,
    sortorder integer UNSIGNED NOT NULL,
    PRIMARY KEY(section, page),
    INDEX(parent),
    INDEX(sortorder),
    CONSTRAINT FOREIGN KEY(section) REFERENCES monad_section(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY(page) REFERENCES monad_page(id) ON DELETE CASCADE
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_menu (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    owner BIGINT UNSIGNED NOT NULL,
    status BIGINT UNSIGNED NOT NULL DEFAULT 0,
    datecreated timestamp NOT NULL DEFAULT NOw(),
    datemodified datetime,
    usermodified BIGINT UNSIGNED,
    INDEX(owner),
    INDEX(status),
    INDEX(usermodified),
    CONSTRAINT FOREIGN KEY(owner) REFERENCES monolyth_auth(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY(usermodified) REFERENCES monolyth_auth(id) ON DELETE SET NULL
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_menu_i18n (
    id BIGINT UNSIGNED NOT NULL,
    language BIGINT UNSIGNED NOT NULL,
    title VARCHAR(64) NOT NULL,
    PRIMARY KEY (id, language),
    CONSTRAINT FOREIGN KEY (id) REFERENCES monad_menu(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (language) REFERENCES monolyth_language(id) ON DELETE CASCADE
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_menu_item (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    owner BIGINT UNSIGNED NOT NULL,
    menu BIGINT UNSIGNED NOT NULL,
    parent BIGINT UNSIGNED,
    sortorder INTEGER UNSIGNED,
    page BIGINT UNSIGNED,
    link VARCHAR(255),
    params TEXT,
    datecreated TIMESTAMP NOT NULL DEFAULT NOW(),
    datemodified DATETIME,
    usermodified BIGINT UNSIGNED,
    INDEX(owner),
    INDEX(page),
    INDEX(menu),
    INDEX(parent),
    INDEX(sortorder),
    INDEX(usermodified),
    CONSTRAINT FOREIGN KEY(owner) REFERENCES monolyth_auth(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY(menu) REFERENCES monad_menu(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY(parent) REFERENCES monad_menu_item(id) ON DELETE SET NULL,
    CONSTRAINT FOREIGN KEY(page) REFERENCES monad_page(id) ON DELETE SET NULL,
    CONSTRAINT FOREIGN KEY(usermodified) REFERENCES monolyth_auth(id) ON DELETE SET NULL
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_menu_item_i18n (
    id BIGINT UNSIGNED NOT NULL,
    language BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255),
    i18nparams TEXT,
    status BIGINT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY(id, language),
    INDEX(status),
    CONSTRAINT FOREIGN KEY(id) REFERENCES monad_menu_item(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY(language) REFERENCES monolyth_language(id) ON DELETE CASCADE
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

-- Store temporary queries.
CREATE TABLE monad_query (
    owner bigint UNSIGNED NOT NULL,
    `session` varchar(32) NOT NULL,
    querysql longtext NOT NULL,
    checksum varchar(32) NOT NULL,
    datecreated timestamp NOT NULL default NOW(),
    INDEX(owner),
    INDEX(`session`),
    PRIMARY KEY(owner, `session`, checksum)
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

-- Store ids generated in MonAd.
CREATE TABLE monad_query_id (
    tablename varchar(255) NOT NULL,
    id varchar(255) NOT NULL,
    language bigint UNSIGNED NOT NULL,
    owner bigint UNSIGNED NOT NULL,
    INDEX(owner),
    UNIQUE INDEX(tablename, id, language)
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_admin (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    owner BIGINT UNSIGNED NOT NULL,
    INDEX(owner),
    CONSTRAINT FOREIGN KEY(owner) REFERENCES monolyth_auth(id) ON DELETE CASCADE
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_admin_i18n (
    id BIGINT UNSIGNED NOT NULL,
    language BIGINT UNSIGNED NOT NULL,
    title VARCHAR(64) NOT NULL,
    PRIMARY KEY(id, language),
    CONSTRAINT FOREIGN KEY(id) REFERENCES monad_admin(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY(language) REFERENCES monolyth_language_all(id) ON DELETE CASCADE
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_admin_item (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    owner BIGINT UNSIGNED NOT NULL,
    admin BIGINT UNSIGNED NOT NULL,
    parent BIGINT UNSIGNED,
    sortorder INTEGER UNSIGNED,
    link VARCHAR(32),
    package VARCHAR(32),
    target VARCHAR(32),
    INDEX(owner),
    INDEX(admin),
    INDEX(parent),
    INDEX(sortorder),
    CONSTRAINT FOREIGN KEY(owner) REFERENCES monolyth_auth(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY(admin) REFERENCES monad_admin(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY(parent) REFERENCES monad_admin_item(id) ON DELETE SET NULL
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_admin_item_i18n (
    id BIGINT UNSIGNED NOT NULL,
    language BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255),
    PRIMARY KEY(id, language),
    CONSTRAINT FOREIGN KEY(id) REFERENCES monad_admin_item(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY(language) REFERENCES monolyth_language_all(id) ON DELETE CASCADE
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE VIEW monad_auth
    (id, name, pass, salt, email, datecreated, datemodified, dateactive,
        status, feature) AS
    SELECT DISTINCT a.id, a.name, pass, salt, email, datecreated, datemodified,
        dateactive, status, feature
    FROM
        monolyth_acl AS c
        JOIN monolyth_acl_resource AS r ON c.acl_resource = r.id
        JOIN monolyth_auth_group AS g ON g.id = c.auth_group
        LEFT JOIN monolyth_auth_link_auth_group AS l ON l.auth_group = g.id
        LEFT JOIN monolyth_auth AS a ON (a.id = c.owner OR a.id = l.auth)
    WHERE r.name IN ('monad', '*') AND a.id IS NOT NULL;

DROP FUNCTION IF EXISTS fn_monad_page_i18n_unique_slug;
DELIMITER $$
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
$$
DELIMITER ;

DROP FUNCTION IF EXISTS fn_assembleslug;
DELIMITER $$
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
$$
DELIMITER ;


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

-- Monad's main menu.
INSERT INTO monad_admin VALUES (NULL, 1);
SET @admin = LAST_INSERT_ID();

INSERT INTO monad_admin_i18n SELECT @admin, id, 'Monad' FROM monolyth_language_all;
-- Settings
INSERT INTO monad_admin_item VALUES (NULL, 1, @admin, NULL, 1, NULL, NULL, NULL);
SET @item = LAST_INSERT_ID();
INSERT INTO monad_admin_item_i18n VALUES (@item, 1, 'Settings'), (@item, 2, 'Instellingen');
INSERT INTO monad_admin_item VALUES (NULL, 1, @admin, @item, 1, 'monad/admin/database', 'monolyth', 'language');
SET @subitem = LAST_INSERT_ID();
INSERT INTO monad_admin_item_i18n VALUES (@subitem, 1, 'Languages'), (@subitem, 2, 'Talen');
INSERT INTO monad_admin_item VALUES (NULL, 1, @admin, @item, 1, 'monad/admin/database', 'monolyth', 'text');
SET @subitem = LAST_INSERT_ID();
INSERT INTO monad_admin_item_i18n VALUES (@subitem, 1, 'Static texts'), (@subitem, 2, 'Statische teksten');
INSERT INTO monad_admin_item VALUES (NULL, 1, @admin, @item, 2, 'monad/admin/database', 'monolyth', 'mail');
SET @subitem = LAST_INSERT_ID();
INSERT INTO monad_admin_item_i18n VALUES (@subitem, 1, 'Mails'), (@subitem, 2, 'E-mails');
INSERT INTO monad_admin_item VALUES (NULL, 1, @admin, @item, 3, 'monad/admin/database', 'monolyth', 'mail_template');
SET @subitem = LAST_INSERT_ID();
INSERT INTO monad_admin_item_i18n VALUES (@subitem, 1, 'Mail templates'), (@subitem, 2, 'E-mail templates');
INSERT INTO monad_admin_item VALUES (NULL, 1, @admin, NULL, 4, NULL, NULL, NULL);
SET @item = LAST_INSERT_ID();
INSERT INTO monad_admin_item_i18n VALUES (@item, 1, 'Static content'), (@item, 2, 'Statische inhoud');
INSERT INTO monad_admin_item VALUES (NULL, 1, @admin, @item, 1, 'monad/admin/database', 'monad', 'page');
SET @subitem = LAST_INSERT_ID();
INSERT INTO monad_admin_item_i18n VALUES (@subitem, 1, 'Pages'), (@subitem, 2, 'Pagina\'s');
INSERT INTO monad_admin_item VALUES (NULL, 1, @admin, @item, 2, 'monad/admin/database', 'monad', 'menu');
SET @subitem = LAST_INSERT_ID();
INSERT INTO monad_admin_item_i18n VALUES (@subitem, 1, 'Menus'), (@subitem, 2, 'Menu\'s');
INSERT INTO monad_admin_item VALUES (NULL, 1, @admin, @item, 3, 'monad/admin/database', 'monolyth', 'media');
SET @subitem = LAST_INSERT_ID();
INSERT INTO monad_admin_item_i18n VALUES (@subitem, 1, 'Media'), (@subitem, 2, 'Media');
-- }}}

-- {{{ v0.23.2

-- @emit The admin menu has been moved from monad_admin/monad_admin_item etc.
-- @emit into PHP code in various ./config/menu.php files. Please refer to
-- @emit the examples on how to handle the new menus.
-- @emit
-- @emit I'm leaving your old tables as is so you can copy their contents
-- @emit to your new menu.php file, but when you're done, you can safely
-- @emit remove them.
-- @emit
-- @emit This concerns the following tables (you'll also want to delete some
-- @emit foreign keys first probably):
-- @emit
-- @emit monad_admin, monad_admin_i18n, monad_admin_item, monad_admin_item_i18n

-- }}}
