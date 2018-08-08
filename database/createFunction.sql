------------------------------------------------------------------------
-- PROCEDURE ADD THUOC
drop function if exists func_addThuoc;
create function func_addThuoc
	(ma_thuoc_in int, ten_thuoc_in varchar(40), ten_nsx varchar(40), viet_tat_in varchar(50)
    ,don_vi_in int, don_gia_in decimal(15, 0))
returns TABLE (err BOOLEAN, msg text) AS $$
DECLARE
	lastid int;
begin
	if exists(select * from thuoc where ma = ma_thuoc_in) then
		return query select true as err, 'ma thuoc da ton tai' as msg;
    end if;
    
    if not exists(select * from don_vi where id = don_vi_in) then
		return query select true as err, 'Đơn vị không tồn tại' as msg;
    end if;
    
    if not exists(select * from nsx where ten = ten_nsx) then
		--chua co nha san xuat, them moi
        insert into nsx (ten) values (ten_nsx);
    end if;

	select id from nsx where ten = ten_nsx into lastid;
	insert into thuoc values (ma_thuoc_in, ten_thuoc_in, lastid, viet_tat_in, don_vi_in, don_gia_in);
    
	return query (select false as err, 'insert thuoc thanh cong' as msg);
end; $$ LANGUAGE plpgsql;