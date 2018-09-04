-- DROP DATABASE IF EXISTS qlnt;
-- CREATE DATABASE qlnt;

-- use qlnt;

CREATE TABLE thuoc (
  ma  varchar(10) primary key,
  ten nvarchar(50),
  id_ncc int,
  id_don_vi int,
  id_gia int
);

CREATE TABLE ncc (
  id int primary key auto_increment,
  ten nvarchar(50),
  info nvarchar(100)
);

CREATE TABLE kho_thuoc (
  ma_thuoc varchar(10) PRIMARY KEY,
  so_luong int
);

CREATE TABLE don_vi (
  id int PRIMARY KEY auto_increment,
  ten nvarchar(50),
  id_quy_doi int,
  he_so_quy_doi float
);

CREATE TABLE bang_gia (
  ma_thuoc varchar(10),
  edit_id int,
  username varchar(10),
  thoi_gian datetime,
  price decimal(15),
  time_start datetime,
  
  PRIMARY KEY (ma_thuoc, edit_id)
);

CREATE TABLE user (
  username varchar(10) PRIMARY KEY,
  password varchar(100),
  info varchar(100),
  role int
);

CREATE TABLE hoa_don (
  id int PRIMARY KEY, -- YYYYMMDDXXX
  time datetime,
  username varchar(10),
  so_luong int,
  kieu_ban int,
  tong_gia decimal(15)
);

CREATE TABLE ct_hoa_don (
  id int PRIMARY KEY auto_increment,
  id_hoa_don int,
  ma_thuoc varchar(10),
  so_luong int
);

CREATE TABLE error_log (
  id int PRIMARY KEY auto_increment,
  time datetime,
  msg nvarchar(100)
);

-- Reference

ALTER TABLE thuoc
	ADD CONSTRAINT FK_thuoc_nsx FOREIGN KEY (id_ncc) REFERENCES ncc(id),
    ADD CONSTRAINT FK_thuoc_donvi FOREIGN KEY (id_don_vi) REFERENCES don_vi(id),
    ADD CONSTRAINT FK_thuoc_gia FOREIGN KEY (ma, id_gia) references bang_gia(ma_thuoc, edit_id);


ALTER TABLE bang_gia
	ADD CONSTRAINT FK_banggia_user foreign key (username) references user (username);


alter table kho
	add constraint FK_kho_thuoc foreign key (ma_thuoc) references thuoc (ma);


alter table cthd
	add constraint FK_cthd_hd foreign key (id_hoa_don) references hoa_don(id),
    add constraint FK_cthd_thuoc foreign key (ma_thuoc) references thuoc(ma);

alter table hoa_don
	add constraint FK_hd_user foreign key (username) references user (username);
    
    
-- add initial data
INSERT into ncc (ten) values (N'Dược Hậu Giang'), (N'Dược Cần Thơ'), (N'Dược Hà Nội');
INSERT into don_vi (ten) values (N'Viên'), (N'Tuýp'), (N'Hộp'), (N'Vĩ');

truncate table thuoc;
insert into thuoc (ma, ten, id_don_vi, id_ncc) values
    ('ABC001', N'Thuốc 01', 1, 1),
    ('ABC002', N'Thuoc 02', 1, 2),
    ('ABC003', N'Thuoc 03', 4, 3),
    ('ABC004', N'Thuoc 04', 1, 3),
    ('ABC005', N'Thuoc 05', 1, 2),
    ('ABC006', N'Thuoc 06', 1, 1),
    ('ABC007', N'Thuoc 07', 3, 3),
    ('ABC008', N'Thuoc 08', 3, 3),
    ('ABC009', N'Thuoc 09', 2, 2),
    ('ABC010', N'Thuoc 10', 2, 2),
    ('ABC011', N'Thuoc 11', 2, 2),
    ('ABC012', N'Thuoc 12', 1, 1),
    ('ABC013', N'Thuoc 13', 1, 3),
    ('ABC014', N'Thuoc 14', 1, 3),
    ('ABC015', N'Thuoc 15', 4, 3);