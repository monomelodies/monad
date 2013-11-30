
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

