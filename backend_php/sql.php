<?php

"CREATE TABLE users_chat (
    id INT(11) NOT NULL AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'user',
    PRIMARY KEY (id)
);

CREATE TABLE emails (
    id INT(11) NOT NULL AUTO_INCREMENT,
    owner INT(11) NOT NULL,
    project VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE 
)";