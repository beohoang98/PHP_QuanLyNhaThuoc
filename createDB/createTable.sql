-- create table
create table thuoc (
	ma			int,
    ten			varchar(40),
	nsx			int,
    viet_tat 	varchar(50),
    
    id_don_vi	int,
    don_gia		decimal(15, 0),
    
    primary key (ma)
);

create table nsx (
	id 			serial,
    ten 		varchar(40),
    thong_tin 	varchar(100),
    
    primary key (id)
);

create table don_vi (
	id 				serial,
    ten 			varchar(20) 	not null,
    id_quy_doi 		int,
    he_so_quydoi 	float,
    primary key (id)
);

create table nhanvien (
	username 	char(20),
    salt_pass 	text 		not null,
    
    firstname 	varchar(30) 	not null,
    lastname 	varchar(30) 	not null,
    
    phone 		varchar(15),
    email		varchar(40) 	not null,
    address 	varchar(40),
    
    primary key (username)
);

create table hoa_don (
	id 			serial,
    
    ngay 		timestamp 	not null,
    username 	char(20)	not null,
    ghi_chu 	varchar(40),
    
    primary key (ID)
);

create table ct_hoa_don (
	id_hoa_don 	int,
    id_thuoc 	int,
    
    so_luong 	int not null,
    id_donvi 	int not null,
    
    tong_gia	decimal(15, 0),
    
    primary key (id_hoa_don, id_thuoc)
);

-- create relationship
alter table thuoc
	add constraint fk_thuoc_nsx 	foreign key (nsx) references nsx(id),
    add constraint fk_thuoc_donvi	foreign key (id_don_vi) references don_vi(id);
    
alter table hoa_don
	add constraint fk_hoadon_user foreign key (username) references nhanvien(username);
    
alter table ct_hoa_don
	add constraint fk_cthoadon_hoadon foreign key (id_hoa_don) references hoa_don(id),
    add constraint fk_cthoadon_thuoc foreign key (id_thuoc) references thuoc(ma);
   
alter table don_vi
	add constraint fk_donvi_quydoi foreign key (id_quy_doi) references don_vi(id);