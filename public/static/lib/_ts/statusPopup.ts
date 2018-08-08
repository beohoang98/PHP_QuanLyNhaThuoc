class StatusPopup
{
	timeEase : number;
	_element : HTMLElement;
	_innerDiv : HTMLElement;
	_statusIcon : HTMLImageElement;
	_statusString : HTMLElement;
	_closeButton : HTMLElement;

	constructor() {
		this.timeEase = 500;

		this._element = document.createElement('div');
		this._element.style.position 	= "fixed";
		this._element.style.top 		= "0";
		this._element.style.left		= "0";
		this._element.style.zIndex 		= "9999";
		this._element.style.width 		= "100%";
		this._element.style.height 		= "100%";
		this._element.style.backgroundColor = "rgba(0,0,0,0.5)";
		this._element.style.opacity = "0";
		this._element.style.visibility = 'hidden';
		this._element.style.display = "flex";

		this._innerDiv = document.createElement('div');
		this._innerDiv.style.margin = "auto";
		this._innerDiv.style.display = 'inline-flex';
		this._innerDiv.style.position = 'relative';
		this._innerDiv.style.flexFlow = "row";
		this._innerDiv.style.backgroundColor = "white";
		this._innerDiv.style.borderRadius = '10px';

		this._statusIcon = document.createElement('img');
		this._statusIcon.style.width = "50px";
		this._statusIcon.style.height = "50px";
		this._statusIcon.style.margin = "10px";
		this._statusIcon.src = "";

		this._statusString = document.createElement('div');
		this._statusString.style.maxWidth = "200px";
		this._statusString.style.padding = "10px";

		this._closeButton = document.createElement('div');
		this._closeButton.style.position = 'absolute';
		this._closeButton.style.right = '-10px';
		this._closeButton.style.top = '-10px';
		this._closeButton.style.width = "20px";
		this._closeButton.style.height = "20px";
		this._closeButton.style.backgroundColor = "#f55";
		this._closeButton.innerText = "X";
		this._closeButton.style.textAlign = 'center';
		this._closeButton.addEventListener('click', (e)=>{
			this.hide();
		});

		this._innerDiv.appendChild(this._statusIcon);
		this._innerDiv.appendChild(this._statusString);
		this._innerDiv.appendChild(this._closeButton);
		this._element.appendChild(this._innerDiv);
	}

	create() {
		document.body.appendChild(this._element);
	}

	setStatus(isSuccess, msg) {
		if (isSuccess == undefined) return;
		if (!!isSuccess == true) {
			this._statusIcon.src = "/static/lib/success.svg";
		}
		else {
			this._statusIcon.src = "/static/lib/failed.svg";
		}
		this._statusString.textContent = msg;
	}

	show()
	{
		this._element.style.visibility = 'visible';

		let count = 0;
		let changeTarget = this._element.style;
		
		let idInterval = setInterval(()=>{
			changeTarget.opacity = count/this.timeEase + "";

			count+=10;
			if (count > this.timeEase) clearInterval(idInterval);
		}, 10);
	}

	hide()
	{
		let count = this.timeEase;
		const changeTarget = this._element.style;
		const idInterval = setInterval(()=>{
			changeTarget.opacity = count/this.timeEase + "";

			count-=10;
			if (count < 0) {
				this._element.style.visibility = 'hidden';
				clearInterval(idInterval);
			} 
		}, 10);
	}

	close() {
		this._element.remove();
	}
}