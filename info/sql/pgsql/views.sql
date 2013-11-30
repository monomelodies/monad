
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

