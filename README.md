## MEDICAL STORE MANAGEMENT

**Seft-study PHP Project**

Badge for fun:
[![Maintainability](https://api.codeclimate.com/v1/badges/fc19ff48774de6386253/maintainability)](https://codeclimate.com/github/beohoang98/PHP_QuanLyNhaThuoc/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/fc19ff48774de6386253/test_coverage)](https://codeclimate.com/github/beohoang98/PHP_QuanLyNhaThuoc/test_coverage)
[![BCH compliance](https://bettercodehub.com/edge/badge/beohoang98/PHP_QuanLyNhaThuoc?branch=master)](https://bettercodehub.com/)

# Set up project

## Requirement
- PHP 7.0+
- Apache (optional if PHP 7+)
- MySQL
- Composer
- Npm

## Setup tool
install package for javascript
```bash
npm install
```

install package for php
```
composer install
```

Config your database in `local_env.json` (remove `-dev` of `local_env-dev.json` file):
```json
{
    "mysql": {
        "host": "localhost",
        "port": 3306,
        "dbname": "your_dbname",
        "user": "your_username",
        "pass": "your_password"
    }
}
```

After config, create database in `database/my_sql_database.sql`.

Run `php database/addAdmin.php` to add admin account to database.

## RUN

Run by Apache
or by built-in of php7+:
```
php -S localhost:8080
```

And goto http://localhost:8080/