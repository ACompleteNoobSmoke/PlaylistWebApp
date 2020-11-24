create database WebSQL;
use WebSQL;

create table WebUser(
firstName varchar(100),
lastName varchar(100),
userName varchar(100) Primary Key,
email varchar(100),
password varchar(100)
);

drop table WebUser;

select * from WebUser;
truncate table WebUser;
