
CREATE TABLE monad_page (
    id SERIAL PRIMARY KEY,
    parent INTEGER REFERENCES monad_page(id) ON DELETE SET NULL,
    owner INTEGER REFERENCES monolyth_auth(id) ON DELETE CASCADE,
    sortorder INTEGER NOT NULL DEFAULT 0,
    datecreated timestamp with time zone NOT NULL DEFAULT NOW(),
    datemodified timestamp with time zone,
    usermodified INTEGER REFERENCES monolyth_auth(id) ON DELETE SET NULL,
    viewname varchar(255) NOT NULL DEFAULT E'monad\\page/generic',
    viewprepend varchar(255),
    viewappend varchar(255)
);
CREATE INDEX monad_page_parent_key ON monad_page(parent);
CREATE INDEX monad_page_owner_key ON monad_page(owner);
CREATE INDEX monad_page_sortorder_key ON monad_page(sortorder);
CREATE INDEX monad_page_datecreated_key ON monad_page(datecreated);
CREATE INDEX monad_page_usermodified_key ON monad_page(usermodified);

CREATE TABLE monad_page_i18n (
    id INTEGER REFERENCES monad_page(id) ON DELETE CASCADE,
    language INTEGER NOT NULL REFERENCES monolyth_language(id) ON DELETE CASCADE,
    title varchar(255) NOT NULL,
    slug varchar(255) NOT NULL,
    content text,
    keywords varchar(255),
    description text,
    status INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY(id, language)
);
CREATE UNIQUE INDEX monad_page_i18n_language_slug_key ON monad_page_i18n(language, slug);

CREATE TABLE monad_section (
    id SERIAL NOT NULL PRIMARY KEY,
    datecreated timestamp with time zone NOT NULL DEFAULT NOW(),
    datemodified timestamp with time zone,
    viewname varchar(255) NOT NULL DEFAULT E'monad\\slice/section'
);

CREATE TABLE monad_section_i18n (
    id INTEGER NOT NULL REFERENCES monad_section(id) ON DELETE CASCADE,
    language INTEGER NOT NULL REFERENCES monolyth_language(id) ON DELETE CASCADE,
    header text,
    content text,
    footer text,
    PRIMARY KEY(id, language)
);

CREATE TABLE monad_page_section (
    section INTEGER NOT NULL REFERENCES monad_section(id) ON DELETE CASCADE,
    page INTEGER NOT NULL REFERENCES monad_page(id) ON DELETE CASCADE,
    parent INTEGER NOT NULL REFERENCES monad_section(id) ON DELETE SET NULL,
    sortorder INTEGER NOT NULL,
    PRIMARY KEY(section, page)
);
CREATE INDEX monad_section_link_page_parent_key ON monad_section_link_page(parent);
CREATE INDEX monad_section_link_page_sortorder_key ON monad_section_link_page(sortorder);

CREATE TABLE monad_menu (
    id SERIAL NOT NULL PRIMARY KEY,
    owner INTEGER NOT NULL REFERENCES monolyth_auth(id) ON DELETE CASCADE,
    status INTEGER NOT NULL DEFAULT 0,
    datecreated timestamp with time zone NOT NULL DEFAULT NOW(),
    datemodified timestamp with time zone,
    usermodified INTEGER REFERENCES monolyth_auth(id) ON DELETE SET NULL
);
CREATE INDEX monad_menu_owner_key ON monad_menu(owner);
CREATE INDEX monad_menu_status_key ON monad_menu(status);
CREATE INDEX monad_menu_usermodified_key ON monad_menu(usermodified);

CREATE TABLE monad_menu_i18n (
    id INTEGER NOT NULL REFERENCES monad_menu(id) ON DELETE CASCADE,
    language INTEGER NOT NULL REFERENCES monolyth_language(id) ON DELETE CASCADE,
    title varchar(64) NOT NULL,
    PRIMARY KEY(id, language)
);

CREATE TABLE monad_menu_item (
    id SERIAL NOT NULL PRIMARY KEY,
    owner INTEGER NOT NULL REFERENCES monolyth_auth(id) ON DELETE CASCADE,
    menu INTEGER NOT NULL REFERENCES monad_menu(id) ON DELETE CASCADE,
    parent INTEGER NOT NULL REFERENCES monad_menu_item(id) ON DELETE CASCADE,
    sortorder INTEGER,
    page INTEGER REFERENCES monad_page(id) ON DELETE SET NULL,
    link varchar(255),
    params text,
    datecreated timestamp with time zone NOT NULL DEFAULT NOW(),
    datemodified timestamp with time zone,
    usermodified INTEGER REFERENCES monolyth_auth(id) ON DELETE SET NULL
);
CREATE INDEX monad_menu_item_owner_key ON monad_menu_item(owner);
CREATE INDEX monad_menu_item_page_key ON monad_menu_item(page);
CREATE INDEX monad_menu_item_menu_key ON monad_menu_item(menu);
CREATE INDEX monad_menu_item_parent_key ON monad_menu_item(parent);
CREATE INDEX monad_menu_item_sortorder_key ON monad_menu_item(sortorder);
CREATE INDEX monad_menu_item_usermodified_key ON monad_menu_item(usermodified);

CREATE TABLE monad_menu_item_i18n (
    id INTEGER NOT NULL REFERENCES monad_menu_item(id) ON DELETE CASCADE,
    language INTEGER NOT NULL REFERENCES monolyth_language(id) ON DELETE CASCADE,
    title varchar(255),
    i18nparams text,
    status INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY(id, language)
);
CREATE INDEX monad_menu_item_i18n_status_key ON monad_menu_item_i18n(status);

-- Store temporary queries.
CREATE TABLE monad_query (
	owner integer NOT NULL REFERENCES monolyth_auth(id) ON DELETE CASCADE,
	session varchar(32) NOT NULL,
	querysql text NOT NULL,
	datecreated timestamp with time zone NOT NULL default NOW()
);
CREATE INDEX monad_query_owner_key ON monad_query(owner);
CREATE UNIQUE INDEX monad_query_session_datecreated_key ON monad_query(session, datecreated);

-- Store auto_increment ids generated in MonAd.
CREATE TABLE monad_query_id (
	tablename varchar(255) NOT NULL,
	id integer NOT NULL,
	owner integer NOT NULL REFERENCES monolyth_auth(id) ON DELETE CASCADE
);
CREATE INDEX monad_query_id_owner_key ON monad_query_id(owner);
CREATE UNIQUE INDEX monad_query_tablename_id_key ON monad_query_id (tablename, id);

CREATE TABLE monad_admin (
    id SERIAL PRIMARY KEY,
    owner INTEGER NOT NULL REFERENCES monolyth_auth(id) ON DELETE CASCADE
);
CREATE INDEX monad_admin_owner_key ON monad_admin(owner);

CREATE TABLE monad_admin_i18n (
    id INTEGER NOT NULL REFERENCES monad_admin(id) ON DELETE CASCADE,
    language INTEGER NOT NULL REFERENCES monolyth_language_all(id) ON DELETE CASCADE,
    title VARCHAR(64) NOT NULL,
    PRIMARY KEY (id, language)
);

CREATE TABLE monad_admin_item (
    id SERIAL PRIMARY KEY,
    owner INTEGER NOT NULL REFERENCES monolyth_auth(id) ON DELETE CASCADE,
    admin INTEGER NOT NULL REFERENCES monad_admin(id) ON DELETE CASCADE,
    parent INTEGER REFERENCES monad_admin_item(id) ON DELETE SET NULL,
    sortorder INTEGER,
    link VARCHAR(32),
    package VARCHAR(32),
    target VARCHAR(32)
);
CREATE INDEX monad_admin_item_owner_key ON monad_admin_item(owner);
CREATE INDEX monad_admin_item_admin_key ON monad_admin_item(admin);
CREATE INDEX monad_admin_item_parent_key ON monad_admin_item(parent);
CREATE INDEX monad_admin_item_sortorder_key ON monad_admin_item(sortorder);

CREATE TABLE monad_admin_item_i18n (
    id INTEGER NOT NULL REFERENCES monad_admin_item(id) ON DELETE CASCADE,
    language INTEGER NOT NULL REFERENCES monolyth_language_all(id) ON DELETE CASCADE,
    title VARCHAR(255),
    PRIMARY KEY (id, language)
);

