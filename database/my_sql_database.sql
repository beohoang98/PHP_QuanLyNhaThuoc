-- DROP DATABASE IF EXISTS qlnt;
-- CREATE DATABASE qlnt;

-- use qlnt;

CREATE TABLE thuoc (
    ma VARCHAR(10) PRIMARY KEY,
    ten NVARCHAR(50),
    viet_tat VARCHAR(20),
    id_ncc INT,
    id_don_vi INT
);

CREATE TABLE ncc (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten NVARCHAR(50),
    info NVARCHAR(100)
);

CREATE TABLE kho_thuoc (
    ma_thuoc VARCHAR(10) PRIMARY KEY,
    so_luong INT
);

CREATE TABLE don_vi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten NVARCHAR(50),
    id_quy_doi INT,
    he_so_quy_doi FLOAT
);

CREATE TABLE bang_gia (
    ma_thuoc VARCHAR(10),
    edit_id INT auto_increment,
    username VARCHAR(10),
    thoi_gian DATETIME,
    price DECIMAL(15),
    PRIMARY KEY (edit_id)
);

CREATE TABLE user (
    username VARCHAR(10) PRIMARY KEY,
    password VARCHAR(100),
    info VARCHAR(100),
    role INT
);

CREATE TABLE hoa_don (
    id INT PRIMARY KEY,
    time DATETIME,
    username VARCHAR(10),
    so_luong INT,
    kieu_ban INT,
    tong_gia DECIMAL(15)
);

CREATE TABLE ct_hoa_don (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_hoa_don INT,
    ma_thuoc VARCHAR(10),
    so_luong INT
);

CREATE TABLE error_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    time DATETIME,
    msg NVARCHAR(100)
);

-- Reference

ALTER TABLE thuoc
	ADD CONSTRAINT FK_thuoc_nsx FOREIGN KEY (id_ncc) REFERENCES ncc(id),
    ADD CONSTRAINT FK_thuoc_donvi FOREIGN KEY (id_don_vi) REFERENCES don_vi(id);


ALTER TABLE bang_gia
	ADD CONSTRAINT FK_banggia_user foreign key (username) references user (username),
    ADD CONSTRAINT FK_banggia_thuoc foreign key (ma_thuoc) references thuoc (ma);


alter table kho_thuoc
	add constraint FK_kho_thuoc foreign key (ma_thuoc) references thuoc (ma);


alter table ct_hoa_don
	add constraint FK_cthd_hd foreign key (id_hoa_don) references hoa_don(id),
    add constraint FK_cthd_thuoc foreign key (ma_thuoc) references thuoc(ma);

alter table hoa_don
	add constraint FK_hd_user foreign key (username) references user (username);


-- add initial data
INSERT into ncc (ten) values (N'Dược Hậu Giang'), (N'Dược Cần Thơ'), (N'Dược Hà Nội');
INSERT into don_vi (ten) values (N'Viên'), (N'Tuýp'), (N'Hộp'), (N'Vĩ');
