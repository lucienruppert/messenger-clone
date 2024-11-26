<?php 
header("Access-Control-Allow-Origin: $_SERVER[HTTP_ORIGIN]");
header("Access-Control-Allow-Methods: POST, DELETE, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");
