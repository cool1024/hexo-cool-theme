---
title: php7.2安装
date: 2018-08-08 17:31:06
tags: php
---
#### 添加新源

`apt-get install software-properties-common python-software-properties`

`sudo add-apt-repository ppa:ondrej/php && sudo apt-get update`

#### 安装php7.2

`sudo apt-get -y install php7.2`

#### 安装php7.2-fpm

`sudo apt-get -y install php7.2-fpm`

#### 如果之前有其他版本PHP，在这边禁用掉
sudo a2dismod php5
sudo a2enmod php7.2

#### 基础常用相关拓展安装（请安装）

`sudo -y apt-get install php7.2-mysql php7.2-curl php7.2-json php7.2-mbstring php7.2-xml php7.2-intl`

#### 额外相关拓展（按需安装）
sudo apt-get install php7.2-gd
sudo apt-get install php7.2-soap
sudo apt-get install php7.2-gmp    
sudo apt-get install php7.2-odbc       
sudo apt-get install php7.2-pspell     
sudo apt-get install php7.2-bcmath   
sudo apt-get install php7.2-enchant    
sudo apt-get install php7.2-imap       
sudo apt-get install php7.2-ldap       
sudo apt-get install php7.2-opcache
sudo apt-get install php7.2-readline   
sudo apt-get install php7.2-sqlite3    
sudo apt-get install php7.2-xmlrpc
sudo apt-get install php7.2-bz2
sudo apt-get install php7.2-interbase
sudo apt-get install php7.2-pgsql      
sudo apt-get install php7.2-recode     
sudo apt-get install php7.2-sybase     
sudo apt-get install php7.2-xsl
sudo apt-get install php7.2-cgi        
sudo apt-get install php7.2-dba 
sudo apt-get install php7.2-phpdbg     
sudo apt-get install php7.2-snmp       
sudo apt-get install php7.2-tidy       
sudo apt-get install php7.2-zip

#### 运行/重启/关闭php7.2-fpm
`service php7.2-fpm start`
`service php7.2-fpm restart`
`service php7.2-fpm stop`