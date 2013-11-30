
-- Monad's main menu.
DO $$
    DECLARE adminid integer;
    DECLARE itemid integer;
    DECLARE subitemid integer;
BEGIN
    INSERT INTO monad_admin (owner) VALUES (1);
    adminid := (SELECT currval('monad_admin_id_seq'));
    INSERT INTO monad_admin_i18n SELECT adminid, id, 'Monad' FROM monolyth_language_all;
    -- Settings
    INSERT INTO monad_admin_item (owner, admin, parent, sortorder, link, package, target) VALUES (1, adminid, NULL, 1, NULL, NULL, NULL);
    itemid := (SELECT currval('monad_admin_item_id_seq'));
    INSERT INTO monad_admin_item_i18n VALUES (itemid, 1, 'Settings'), (itemid, 2, 'Instellingen');
    INSERT INTO monad_admin_item (owner, admin, parent, sortorder, link, package, target) VALUES (1, adminid, itemid, 1, 'monad/admin/database', 'monolyth', 'language');
    subitemid := (SELECT currval('monad_admin_item_id_seq'));
    INSERT INTO monad_admin_item_i18n VALUES (subitemid, 1, 'Languages'), (subitemid, 2, 'Talen');
    INSERT INTO monad_admin_item (owner, admin, parent, sortorder, link, package, target) VALUES (1, adminid, itemid, 2, 'monad/admin/database', 'monolyth', 'text');
    subitemid := (SELECT currval('monad_admin_item_id_seq'));
    INSERT INTO monad_admin_item_i18n VALUES (subitemid, 1, 'Static texts'), (subitemid, 2, 'Statische teksten');
    INSERT INTO monad_admin_item (owner, admin, parent, sortorder, link, package, target) VALUES (1, adminid, itemid, 3, 'monad/admin/database', 'monolyth', 'mail');
    subitemid := (SELECT currval('monad_admin_item_id_seq'));
    INSERT INTO monad_admin_item_i18n VALUES (subitemid, 1, 'Mails'), (subitemid, 2, 'E-mails');
    INSERT INTO monad_admin_item (owner, admin, parent, sortorder, link, package, target) VALUES (1, adminid, itemid, 4, 'monad/admin/database', 'monolyth', 'mail_template');
    subitemid := (SELECT currval('monad_admin_item_id_seq'));
    INSERT INTO monad_admin_item_i18n VALUES (subitemid, 1, 'Mail templates'), (subitemid, 2, 'E-mail templates');
    INSERT INTO monad_admin_item (owner, admin, parent, sortorder, link, package, target) VALUES (1, adminid, NULL, 2, NULL, NULL, NULL);
    itemid := (SELECT currval('monad_admin_item_id_seq'));
    INSERT INTO monad_admin_item_i18n VALUES (itemid, 1, 'Static content'), (itemid, 2, 'Statische inhoud');
    INSERT INTO monad_admin_item (owner, admin, parent, sortorder, link, package, target) VALUES (1, adminid, itemid, 1, 'monad/admin/database', 'monad', 'page');
    subitemid := (SELECT currval('monad_admin_item_id_seq'));
    INSERT INTO monad_admin_item_i18n VALUES (subitemid, 1, 'Pages'), (subitemid, 2, E'Pagina''s');
    INSERT INTO monad_admin_item (owner, admin, parent, sortorder, link, package, target) VALUES (1, adminid, itemid, 2, 'monad/admin/database', 'monad', 'menu');
    subitemid := (SELECT currval('monad_admin_item_id_seq'));
    INSERT INTO monad_admin_item_i18n VALUES (subitemid, 1, 'Menus'), (subitemid, 2, E'Menu''s');
    INSERT INTO monad_admin_item (owner, admin, parent, sortorder, link, package, target) VALUES (1, adminid, itemid, 3, 'monad/admin/database', 'monolyth', 'media');
    subitemid := (SELECT currval('monad_admin_item_id_seq'));
    INSERT INTO monad_admin_item_i18n VALUES (subitemid, 1, 'Media'), (subitemid, 2, 'Media');
END;
$$;

