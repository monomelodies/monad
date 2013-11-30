
DROP VIEW IF EXISTS monad_auth;
CREATE VIEW monad_auth
    (id, name, pass, salt, email, datecreated, datemodified, dateactive,
    relations, status, feature) AS
SELECT DISTINCT a.id, a.name, pass, salt, email, datecreated, datemodified,
    dateactive, relations, status, feature
FROM
    monolyth_acl AS c
    JOIN monolyth_acl_resource AS r ON c.acl_resource = r.id
    JOIN monolyth_auth_group AS g ON g.id = c.auth_group
    LEFT JOIN monolyth_auth_link_auth_group AS l ON l.auth_group = g.id
    LEFT JOIN monolyth_auth AS a ON (a.id = c.owner OR a.id = l.auth)
WHERE r.name IN ('monad', '*') AND a.id IS NOT NULL;

DELETE FROM monad_page WHERE owner NOT IN (SELECT id FROM monolyth_auth);
RENAME TABLE monad_page TO monad_page_old;
CREATE TABLE monad_page (
    id bigint UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    parent bigint REFERENCES monad_page(id) ON DELETE SET NULL,
    owner bigint REFERENCES monolyth_auth(id) ON DELETE SET NULL,
    sortorder integer NOT NULL default 0,
    datecreated timestamp NOT NULL DEFAULT NOW(),
    datemodified timestamp,
    viewname varchar(255) NOT NULL DEFAULT 'monad\\anonymous\\page/generic',
    viewprepend varchar(255),
    viewappend varchar(255),
    INDEX(parent), INDEX(owner), INDEX(sortorder), INDEX(datecreated)
) ENGINE='InnoDB' CHARSET='UTF8';

CREATE TABLE monad_page_i18n (
    id bigint UNSIGNED NOT NULL REFERENCES monad_page(id) ON DELETE CASCADE,
    language tinyint UNSIGNED NOT NULL,
    title varchar(255) NOT NULL,
    slug varchar(255) NOT NULL,
    content longtext,
    PRIMARY KEY (id, language), INDEX (id), INDEX(language)
) ENGINE='InnoDB' CHARSET='UTF8';

INSERT INTO monad_page SELECT NULL, title, NULL, owner, sortorder, datecreated, NULL,
    viewname, viewprepend, viewappend FROM monad_page_old;
INSERT INTO monad_page_i18n SELECT monad_page.id, language, title, slug, content FROM
    monad_page_old JOIN monad_page USING(title);
ALTER TABLE monad_page DROP COLUMN title;
DROP TABLE monad_page_old;

