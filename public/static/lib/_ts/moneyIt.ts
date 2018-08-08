(function ( $ ) {
    $.prototype.moneyInput = function() {
        this.each((id, el)=>{
			$(el).on('keyup', (e)=>{
				let val = $(el).val() as string;

				val = val.replace(/[\D\s\,\.]/g, '');
				let val_num = val ? parseInt(val) : 0;
				
				$(el).val(val_num.toLocaleString());
			});
		});
        return this;
    };
}( jQuery ));