
drop schema if exists toffeemint;

create database if not exists toffeemint;
use toffeemint;

create table if not exists user(
Userid int(11) not null,
Username varchar(50),
Password varchar(50),
Usertype varchar(20),
constraint user_pk primary key(userid)
);

INSERT INTO user (Userid, Username, Password, Usertype)
VALUES  (1, 'toffeemint', 'toffeemint123', 'importer');
INSERT INTO user (Userid, Username, Password, Usertype)
VALUES  (2, 'importer123', '123456', 'importer');
INSERT INTO user (Userid, Username, Password, Usertype)
VALUES  (3, 'exporter123', '654321', 'exporter');
INSERT INTO user (Userid, Username, Password, Usertype)
VALUES  (4, 'exporter456', '123456', 'exporter');
INSERT INTO user (Userid, Username, Password, Usertype)
VALUES  (5, 'issuingBank123', '123456', 'issuingBank');
INSERT INTO user (Userid, Username, Password, Usertype)
VALUES  (6, 'advisingBank123', '654321', 'advisingBank');
INSERT INTO user (Userid, Username, Password, Usertype)
VALUES  (7, 'shipper123', '123456', 'shipper');

/*create table if not exists operation(
Statusid int(11) not null,
Status varchar(50),
Importer_Ops varchar(50),
Exporter_Ops varchar(50),
Issuing_Ops varchar(50),
Advising_Ops varchar(50),
constraint user_pk primary key(Statusid)
);*/

/*
LOAD DATA INFILE 'C:/Users/user/Desktop/ToffeeMint/app/3.FrontEnd/SMUtBank_TradeFinance/SMUtBank_TradeFinance/sql/operationData.csv' 
INTO TABLE operation 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
*/