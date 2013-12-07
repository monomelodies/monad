
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
    INDEX(parent), INDEX(owner), INDEX(sortorder), INDEX(datecreated),
    INDEX(usermodified),
    CONSTRAINT FOREIGN KEY (parent)
        REFERENCES monad_page(id) ON DELETE SET NULL,
    CONSTRAINT FOREIGN KEY (owner)
        REFERENCES monolyth_auth(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (usermodified)
        REFERENCES monolyth_auth(id) ON DELETE SET NULL
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
    UNIQUE INDEX(language, slug), INDEX(status),
    CONSTRAINT FOREIGN KEY (id)
        REFERENCES monad_page(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (language)
        REFERENCES monolyth_language(id) ON DELETE CASCADE
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
    PRIMARY KEY(id, language), INDEX(id), INDEX(language),
    CONSTRAINT FOREIGN KEY (id)
        REFERENCES monad_section(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (language)
        REFERENCES monolyth_language(id) ON DELETE CASCADE
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_page_section (
    section bigint UNSIGNED NOT NULL,
    page bigint UNSIGNED NOT NULL,
    parent bigint UNSIGNED,
    sortorder integer UNSIGNED NOT NULL,
    PRIMARY KEY(section, page), INDEX(parent), INDEX(sortorder),
    CONSTRAINT FOREIGN KEY (section)
        REFERENCES monad_section(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (page)
        REFERENCES monad_page(id) ON DELETE CASCADE
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_menu (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    owner BIGINT UNSIGNED NOT NULL,
    status BIGINT UNSIGNED NOT NULL DEFAULT 0,
    datecreated timestamp NOT NULL DEFAULT NOw(),
    datemodified datetime,
    usermodified BIGINT UNSIGNED,
    INDEX(owner), INDEX(status), INDEX(usermodified),
    CONSTRAINT FOREIGN KEY (owner)
        REFERENCES monolyth_auth(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (usermodified)
        REFERENCES monolyth_auth(id) ON DELETE SET NULL
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_menu_i18n (
    id BIGINT UNSIGNED NOT NULL,
    language BIGINT UNSIGNED NOT NULL,
    title VARCHAR(64) NOT NULL,
    CONSTRAINT PRIMARY KEY (id, language),
    CONSTRAINT FOREIGN KEY (id)
        REFERENCES monad_menu(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (language)
        REFERENCES monolyth_language(id) ON DELETE CASCADE
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
    INDEX(owner), INDEX(page), INDEX(menu),
    INDEX(parent), INDEX(sortorder), INDEX(usermodified),
    CONSTRAINT FOREIGN KEY (owner)
        REFERENCES monolyth_auth(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (menu)
        REFERENCES monad_menu(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (parent)
        REFERENCES monad_menu_item(id) ON DELETE SET NULL,
    CONSTRAINT FOREIGN KEY (page)
        REFERENCES monad_page(id) ON DELETE SET NULL,
    CONSTRAINT FOREIGN KEY (usermodified)
        REFERENCES monolyth_auth(id) ON DELETE SET NULL
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_menu_item_i18n (
    id BIGINT UNSIGNED NOT NULL,
    language BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255),
    i18nparams TEXT,
    status BIGINT UNSIGNED NOT NULL DEFAULT 0,
    CONSTRAINT PRIMARY KEY (id, language),
    INDEX(status),
    CONSTRAINT FOREIGN KEY (id)
        REFERENCES monad_menu_item(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (language)
        REFERENCES monolyth_language(id) ON DELETE CASCADE
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

-- Store temporary queries.
CREATE TABLE monad_query (
    owner bigint UNSIGNED NOT NULL,
    `session` varchar(32) NOT NULL,
    querysql longtext NOT NULL,
    checksum varchar(32) NOT NULL,
    datecreated timestamp NOT NULL default NOW(),
    INDEX(owner), INDEX(`session`), PRIMARY KEY(owner, `session`, checksum)
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

-- Store ids generated in MonAd.
CREATE TABLE monad_query_id (
    tablename varchar(255) NOT NULL,
    id varchar(255) NOT NULL,
    language bigint UNSIGNED NOT NULL,
    owner bigint UNSIGNED NOT NULL,
    INDEX(owner), UNIQUE INDEX(tablename, id, language)
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_admin (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    owner BIGINT UNSIGNED NOT NULL,
    INDEX(owner),
    CONSTRAINT FOREIGN KEY (owner)
        REFERENCES monolyth_auth(id) ON DELETE CASCADE
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_admin_i18n (
    id BIGINT UNSIGNED NOT NULL,
    language BIGINT UNSIGNED NOT NULL,
    title VARCHAR(64) NOT NULL,
    CONSTRAINT PRIMARY KEY (id, language),
    CONSTRAINT FOREIGN KEY (id)
        REFERENCES monad_admin(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (language)
        REFERENCES monolyth_language_all(id) ON DELETE CASCADE
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
    INDEX(owner), INDEX(admin), INDEX(parent), INDEX(sortorder),
    CONSTRAINT FOREIGN KEY (owner)
        REFERENCES monolyth_auth(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (admin)
        REFERENCES monad_admin(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (parent)
        REFERENCES monad_admin_item(id) ON DELETE SET NULL
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

CREATE TABLE monad_admin_item_i18n (
    id BIGINT UNSIGNED NOT NULL,
    language BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255),
    CONSTRAINT PRIMARY KEY (id, language),
    CONSTRAINT FOREIGN KEY (id)
        REFERENCES monad_admin_item(id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (language)
        REFERENCES monolyth_language_all(id) ON DELETE CASCADE
) ENGINE='InnoDB' DEFAULT CHARSET='UTF8';

