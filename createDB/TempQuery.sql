use qlnhathuoc_test;

insert into don_vi (ten, id_quy_doi, he_so_quydoi) values
	(N'Viên', null, null),
    (N'Vĩ 5 viên', 1, 5),
    (N'Vĩ 10 viên', 1, 10),
    (N'Hộp 30 viên', 1, 30),
    (N'Hộp 10 vĩ(5 viên)', 2, 10);
insert into nhanvien (username, salt_pass, firstname, lastname, email)
	values ('admin', crypt('admin', gen_salt('md5')), 'Beo', 'Hoang', 'asd@asd.com');

select * from func_addThuoc(15101997, 'Thuốc đau đầu', 'Dược Hậu Giang', 'asd', 1, 15000);


--TEST
    
SELECT thuoc.ma as 'ma_thuoc', thuoc.ten as 'ten_thuoc', don_gia
							, nsx.id as 'id_nsx', nsx.ten as 'ten_nsx'
							FROM thuoc, nsx
							WHERE nsx.id = thuoc.nsx
							AND (thuoc.ten LIKE N't%' OR thuoc.viet_tat LIKE '%t%');
select * from thuoc;
select * from nsx;
SELECT salt_pass AS sessionid, username from nhanvien WHERE username = 'admin' AND salt_pass = crypt('admin', salt_pass)