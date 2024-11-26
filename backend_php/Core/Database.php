<?php

namespace Core;

use PDO;

class Database
{
  public $connection;
  private $statement;

  public function __construct($config, $username = 'root', $password = '')
  {
    $dsn = 'mysql:' . http_build_query($config, '', ';');
    $this->connection = new PDO($dsn, $username, $password, [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
  }
  public function query($query, $params = [])
  {

    $this->statement = $this->connection->prepare($query);
    $this->statement->execute($params);

    return $this;
  }

  public function get()
  {
    return $this->statement->fetchAll();
  }

  public function find()
  {
    return $this->statement->fetch();
  }

  public function fetchColumn()
  {
    return $this->statement->fetchColumn();
  }

  public function findOrAbort()
  {
    $result = $this->statement->fetch();
    if (!$result) {
      abort();
    }
    return $result;
  }

  public function lastInsertId()
  {
    return $this->connection->lastInsertId();
  }

  public function beginTransaction()
  {
    return $this->connection->beginTransaction();
  }

  public function commit()
  {
    return $this->connection->commit();
  }

  public function rollBack()
  {
    return $this->connection->rollBack();
  }

}
