<?php

namespace monad\core;
use monolyth, monolyth\db, monad;

class Querysaver implements monolyth\adapter\Access
{
    private $controller;
    private $queries = [];

    public function __construct(Base_Controller $controller)
    {
        $this->controller = $controller;
        $this->querycount = 0;
        $this->queries = [];
        $config = monolyth\Config::get('database');
        foreach ($config as $id => $db) {
            if (!($db instanceof db\sql\SQLAbstract) || $id == 'current') {
                continue;
            }
            if (strtolower(get_class($this->controller)) != 'monad_restorecontroller') {
                try {
                    $db->get(
                        'tmp_query',
                        1,
                        [
                            'owner' => User::id(),
                            'session' => ['<>' => substr(Session::id(), 0, 32)],
                        ],
                        ['limit' => 1]
                    );
                    $this->controller->redirect(
                        Link::get('\monad\controller\Restore::session'));
                    die();
                } catch (db\sql\NoResults_Exception $e) {
                } catch (db\sql\Exception $e) {}
            }
            try {
                $q = $db->getrows(
                    'tmp_query',
                    ['querysql', 'datecreated'],
                    [
                        'owner' => User::id(),
                        'session' => substr(core\Session::id(), 0, 32),
                    ],
                    ['order' => [['asc' => 'datecreated']]]
                );
                $this->querycount += count($q);
                $this->queries[$id] = $q;
            } catch (db\sql\NoResults_Exception $e) {
                $this->queries[$id] = [];
            } catch (db\sql\Exception $e) {
                $this->queries[$id] = [];
            }

            /** Any inserted objects that aren't public yet? */
            try {
                $q = $db->getrows(
                    'tmp_query_id',
                    '*',
                    ['owner' => User::id()]
                );
            } catch (db\sql\NoResults_Exception $e) {
            } catch (db\sql\Exception $e) {}
        }
    }

    public function start()
    {
        $config = monolyth\Config::get('database');
        foreach ($config as $id => $db) {
            if (!($db instanceof db\sql\SQLAbstract) || $id == 'current') {
                continue;
            }

            $db->execute($db::SQL_START_TRANSACTION, false);
            if (!$this->queries[$id]) {
                continue;
            }

            // Temporarily apply stored queries, but don't store them again.
            foreach ($this->queries[$id] as $row) {
                $result = $db->execute($row['querysql'], false);
                if (!$db->affected_rows($result)) {
                    $db->execute($db::SQL_ROLLBACK_TRANSACTION, false);
                    $db->execute($db::SQL_START_TRANSACTION, false);
                }
            }
        }
    }

    public function end()
    {
        $config = monolyth\Config::get('database');
        foreach ($config as $id => $db) {
            if (!($db instanceof db\sql\SQLAbstract) || $id == 'current') {
                continue;
            }

            $db->execute($db::SQL_ROLLBACK_TRANSACTION, false);
            $q = $db->queries;

            /** Ignore non-modifying queries. */
            foreach ($q as $i => $sql) {
                if (!preg_match(
                    "@^(update|delete|truncate|drop)\s+@",
                    trim(strtolower($sql))
                )) {
                    unset($q[$i]);
                }
            }
            if (!$q) {
                continue;
            }

            /** Ignore queries within a failed transaction. */
            $start = null;
            foreach ($q as $i => $sql) {
                if (strtoupper($sql) == $db::SQL_START_TRANSACTION
                    && !isset($start)
                ) {
                    $start = $i;
                }
                if (strtoupper($sql) == $db::SQL_ROLLBACK_TRANSACTION
                    && isset($start)
                ) {
                    $q = array_splice($q, $begin, $i - $start);
                    reset($q);
                }
            }

            /**
             * Ignore select queries and transactions in general.
             * Keep session and tmp_queries, we'll always want to commit those.
             */
            $keep = [];
            $match = "(update|insert\s+into|delete\s+from)\s+";
            foreach ($q as $i => $sql) {
                if (!preg_match("@^$match@ms", trim(strtolower($sql)))) {
                    unset($q[$i]);
                    continue;
                }
                if (preg_match("@^$match(session|tmp_query)@ms", trim(strtolower($sql)))) {
                    $keep[] = $sql;
                    unset($q[$i]);
                }
            }

            /** Make the query list unique; keep newest. */
            $q = array_reverse(array_unique(array_reverse($q)));

            /** Finally, save the resulting list. */
            foreach ($q as $sql) {
                $db->execute(
                    $db->insert_query(
                        'tmp_query',
                        [
                            'owner' => User::id(),
                            'session' => monolyth\core\Session::id(),
                            'querysql' => $sql,
                        ]
                    ),
                    false
                );
            }

            /** Execute the $keep array. */
            if ($keep) {
                $db->execute($db::SQL_START_TRANSACTION, false);
                foreach ($keep as $sql) {
                    $db->execute($sql, false);
                }
                $db->execute($db::SQL_COMMIT_TRANSACTION, false);
            }
        }
    }
}

