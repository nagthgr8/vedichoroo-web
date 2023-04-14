import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { HoroscopeService } from '../horoscope.service';
import { ShareService } from '../share.service';
import { Location } from '../location';
import * as moment from 'moment';
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {

  @ViewChild('dropdownMenu') dropdownMenu: ElementRef;
  place: string = '';
     srise: string;
	 sset: string;
	 nam = '';
	pic = '';
	vusr: boolean = false;
	 showAS: boolean = false;
	 showSU: boolean = false;
	 showLB: boolean = false;
  showUP: boolean = false;
  showMNU: boolean = true;
  showPanch: boolean = true;
	isExpanded = false;
	today: any = '';
	sunrise: string = '';
	sunset: string = '';
	rahukal: string = '';
	yama: string = '';
	abhjit: string = '';
	lagna: string = '';
	ticks: number = 0;
	lag_d: number = 0;
	lag_m: number = 0;
	lag_s: number = 0;
	lagml: string = '';
	lagal: string = '';
	lagsl: string = '';
	nak: string = '';
	tithi: string = '';
	yog: string = '';
	karn: string = '';
	sublords_v: any;
  opacity = 0;
	intervalID = 0;
	bal: number = 0;
    csym: string = '₹'; 
  user: any;
  cdt: any;
 
	constructor(private horoService: HoroscopeService, private shareService: ShareService, private modalService: NgbModal) {
		this.showAS = false;
		this.showLB = true;
		this.showSU = false;
		this.showUP = false;
    this.today = Date.now();
    this.cdt = new Date();
    //this.cdt = { year: cd.getFullYear(), month: cd.getMonth()+1, day: cd.getDate() }
		if (this.shareService.getLANG() == null) this.shareService.setLANG('en');
		this.horoService.getJson('assets/data/sublords.json')
			.subscribe(rs => {
				this.sublords_v = rs;
			this.shareService.getItem('vho:loc').then((loc: Location) => {
        console.log('loc', loc);
        this.place = loc.place;
				this.getMoonPhase(loc.latitude, loc.longitude);
			})
			.catch(e => {
				this.horoService.getIP()
				.subscribe(res => {
				     console.log('getIP', res);
				     let loc: Location = {
					         latitude: res['latitude'],
							 longitude: res['longitude'],
               country_code: res['country_code_iso3'],
               place: res['city'] + ',' + res['region'] + ',' + res['country_name']
          };
          this.place = loc.place;
         // this.shareService.setItem('place', this.place);
					 this.shareService.setItem('vho:loc', JSON.stringify(loc));
				     this.getMoonPhase(res['latitude'], res['longitude']);
					 this.horoService.getJson('assets/data/currencies.json')
					 .subscribe(curs => {
					    console.log('Response Data: ', curs);
					    this.shareService.getItem('vho:loc').then((loc: Location) => {
						   console.log('loc', loc);
						   //const loc = JSON.parse(locs);
						   console.log('curs', curs)
							if(curs.hasOwnProperty(loc.country_code)) {
							   
							   this.shareService.setItem('vho:ccy', curs[loc.country_code]); 
							}
						});
					 });
					 
					//this.shareService.setCLAT(lo);
					//this.shareService.setCLNG(res['longitude']);
					 // this.shareService.setCCODE(res['country_code']);
					//this.shareService.setCTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
				});
			});
		});
	}
	getMoonPhase(lat, lng) {
	    console.log('getMoonPhase', lat);
		console.log('getMoonPhase', lng);
		let cd = new Date();
		this.horoService.getProMoonPhase(lat, lng, cd.getFullYear() + '-' + (cd.getMonth() + 1).toString() + '-' + cd.getDate() + 'T' + cd.getHours() + ':' + cd.getMinutes() + ':' + cd.getSeconds() + 'Z', Intl.DateTimeFormat().resolvedOptions().timeZone, 4)
		.subscribe(res3 => {
			this.sunrise = res3['sunrise'];
			this.sunset = res3['sunset'];
			this.nak = this.shareService.translate_func(res3['birthStar']);
			this.tithi = this.shareService.translate_func(res3['tithi']);
			this.yog = this.shareService.translate_func(res3['yoga']);
			this.karn = this.shareService.translate_func(res3['karana']);
			this.calcPanch(cd, lat, lng, (cd.getTimezoneOffset() / 60));
			var signs = ['ar|0', 'ta|30', 'ge|60', 'cn|90', 'le|120', 'vi|150', 'li|180', 'sc|210', 'sa|240', 'cp|270', 'aq|300', 'pi|330'];
			for (var sn = 0; sn < signs.length; sn++) {
				if (res3['planetPos'].hasOwnProperty(signs[sn].split('|')[0])) {
					var sgn = signs[sn].split('|')[0];
					for (var p = 0; p < res3['planetPos'][sgn].split('|').length; p++) {
						if (res3['planetPos'][sgn].split('|')[p].split(' ')[1] == 'AC') {
							let pp: string = res3['planetPos'][sgn].split('|')[p].split(' ')[0];
							this.lagna = (Number(signs[sn].split('|')[1]) + Number(pp.split('.')[0])).toString() + 'º' + pp.split('.')[1] + "'" + pp.split('.')[2] + '"';
							break;
						}
					}
				}
		}
			this.lag_d = Number(this.lagna.substring(0, this.lagna.indexOf('º')));
			console.log(this.lag_d);
			this.lag_m = Number(this.lagna.substring(this.lagna.indexOf('º') + 1, this.lagna.indexOf("'")));
			console.log(this.lag_m);
			this.lag_s = Math.floor(Number(this.lagna.substring(this.lagna.indexOf("'") + 1, this.lagna.indexOf('"'))));
			console.log(this.lag_s);
			let sssl: string = this.calcStar(this.dmsToDec(this.lag_d, this.lag_m, this.lag_s));
			console.log(sssl);
			this.lagml = sssl.split('|')[0];
			this.lagal = sssl.split('|')[1];
			this.lagsl = sssl.split('|')[2];
			var intv = setInterval(() => {
				this.ticks++;
				if (this.lag_s > 59) {
					this.lag_s = this.lag_s - 59;
					this.lag_m++;
					if (this.lag_m > 59) {
						this.lag_m = 0;
						this.lag_d++;
					}
				}
				let lag_r: string = '';
				if (this.lag_d < 29) lag_r = 'Aries';
				else if (this.lag_d < 59) lag_r = 'Taurus';
				else if (this.lag_d < 89) lag_r = 'Gemini';
				else if (this.lag_d < 119) lag_r = 'Cancer';
				else if (this.lag_d < 149) lag_r = 'Leo';
				else if (this.lag_d < 179) lag_r = 'Virgo';
				else if (this.lag_d < 209) lag_r = 'Libra';
				else if (this.lag_d < 239) lag_r = 'Scorpio';
				else if (this.lag_d < 269) lag_r = 'Sagittarius';
				else if (this.lag_d < 299) lag_r = 'Capricorn';
				else if (this.lag_d < 329) lag_r = 'Aquarius';
				else lag_r = 'Pisces';
				this.lagna = lag_r + ' ' + this.lag_d.toString() + 'º' + this.lag_m.toString() + "'" + this.lag_s.toString() + '"';
				let sl: string = this.calcStar(this.dmsToDec(this.lag_d, this.lag_m, this.lag_s));
				this.lagml = sl.split('|')[0];
				this.lagal = sl.split('|')[1];
				this.lagsl = sl.split('|')[2];
				this.lag_s += 15;
			}, 1000);
		});
	}
  ngOnInit() {
     
;
		this.shareService.signin	
			.subscribe(usr => {
			    console.log('signin', usr);
				if(usr) { this.user = usr; }
			});
		this.shareService.gevt
			.subscribe(res => {
			    console.log('gevt', res);
				if(res == 'get-bal') {
				   this.horoService.getBalance(this.user.email).subscribe((bal) => {
				     console.log('bal', bal);
				     this.user.balance = bal['balance'];
				   });
				} else if (res == 'logout') {
					this.user = null;
				}else if (res == 'activate') {
					this.showAS = true;
				} else if (res == 'subscriber') {
					this.showSU = true;
				} else if (res == 'hidemp') {
				  this.showMNU = false;
				}
			});

	}
  

	toggleDropdown() {
		this.dropdownMenu.nativeElement.classList.toggle('show');
   }

  collapse() {
    this.isExpanded = false;
  }
  toggle() {
    this.isExpanded = !this.isExpanded;
	}
	calcStar(mins: number) {
		//console.log('calcStar', mins);
		for (var i = 0; i < Object.keys(this.sublords_v).length; i++) {
			var nak = this.sublords_v[i];
			var degs = this.sublords_v[i].deg;
			var s_mins = this.dmsToDec(Number(degs.split('-')[0].split('.')[0]), Number(degs.split('-')[0].split('.')[1]), Number(degs.split('-')[0].split('.')[2]));
			var e_mins = this.dmsToDec(Number(degs.split('-')[1].split('.')[0]), Number(degs.split('-')[1].split('.')[1]), Number(degs.split('-')[1].split('.')[2]));
			//var deg_s = parseFloat(degs.split('-')[0].split('.')[0] + '.' + degs.split('-')[0].split('.')[1]);
			//var deg_e = parseFloat(degs.split('-')[1].split('.')[0] + '.' + degs.split('-')[1].split('.')[1]);
			//console.log(s_mins);
			//console.log(e_mins);
			if (mins >= s_mins && mins < e_mins) {
				//console.log(s_mins);
				//console.log(e_mins);
				return nak.sign + '|' + nak.star + '|' + nak.sub;
			}
		}
		console.log('calcStar', -1);
		return '-1';
	}

	getDms(val: any) {

		// Required variables
		var valDeg, valMin, valSec, result;

		// Here you'll convert the value received in the parameter to an absolute value.
		// Conversion of negative to positive.
		// In this step it does not matter if it's North, South, East or West,
		// such verification was performed earlier.
		val = Math.abs(val); // -40.601203 = 40.601203

		// ---- Degrees ----
		// Stores the integer of DD for the Degrees value in DMS
		valDeg = Math.floor(val); // 40.601203 = 40

		// Add the degrees value to the result by adding the degrees symbol "º".
		result = valDeg + "º"; // 40º

		// ---- Minutes ----
		// Removing the integer of the initial value you get the decimal portion.
		// Multiply the decimal portion by 60.
		// Math.floor returns an integer discarding the decimal portion.
		// ((40.601203 - 40 = 0.601203) * 60 = 36.07218) = 36
		valMin = Math.floor((val - valDeg) * 60); // 36.07218 = 36

		// Add minutes to the result, adding the symbol minutes "'".
		result += valMin + "'"; // 40º36'

		// ---- Seconds ----
		// To get the value in seconds is required:
		// 1º - removing the degree value to the initial value: 40 - 40.601203 = 0.601203;
		// 2º - convert the value minutes (36') in decimal ( valMin/60 = 0.6) so
		// you can subtract the previous value: 0.601203 - 0.6 = 0.001203;
		// 3º - now that you have the seconds value in decimal,
		// you need to convert it into seconds of degree.
		// To do so multiply this value (0.001203) by 3600, which is
		// the number of seconds in a degree.
		// You get 0.001203 * 3600 = 4.3308
		// As you are using the function Math.round(),
		// which rounds a value to the next unit,
		// you can control the number of decimal places
		// by multiplying by 1000 before Math.round
		// and subsequent division by 1000 after Math.round function.
		// You get 4.3308 * 1000 = 4330.8 -> Math.round = 4331 -> 4331 / 1000 = 4.331
		// In this case the final value will have three decimal places.
		// If you only want two decimal places
		// just replace the value 1000 by 100.
		valSec = Math.round((val - valDeg - valMin / 60) * 3600 * 1000) / 1000; // 40.601203 = 4.331 

		// Add the seconds value to the result,
		// adding the seconds symbol " " ".
		result += valSec + '"'; // 40º36'4.331"

		// Returns the resulting string.
		return result;
	}
	dmsToDec(d, m, s) {
		let v: number = d + (m / 60) + (s / 3600);
		return Number(v.toFixed(2));
	}
	calcPanch(cd, clat, clng, ofset) {
		//this.sdt = cd;
		//var cd = new Date();
		console.log('calcPanch', cd);
		console.log('ofset', ofset);
		var jd = this.horoService.getJD(cd.getDate(), cd.getMonth() + 1, cd.getFullYear());
		console.log('jd', jd);
		console.log('lat', clat);
		console.log('lng', clng);
		//var datestr = this.horoService.getDateString(cd)
		// var utcoffset = moment(datestr).tz(this.localtz).format('Z');
		//var a = utcoffset.split(":")
		//var tz = parseFloat(a[0]) + parseFloat(a[1])/60.0
		//this.sunrise = this.horoService.calcSunriseSet(1, jd, Number(clat), Number(clng), ofset, 0);
		console.log('sunrise', this.sunrise);
		//this.sunset = this.horoService.calcSunriseSet(0, jd, Number(clat), Number(clng), ofset, 0);
		console.log('sunset', this.sunset);
		var startTime = moment(this.sunrise + ':00 am', "HH:mm:ss a");
		var endTime = moment(this.sunset + ':00 pm', "HH:mm:ss a");

		this.srise = startTime.format('h:mm a');
		this.sset = endTime.format('h:mm a');
		var duration = moment.duration(endTime.diff(startTime));
		var hours = duration.asHours();
		var minutes = duration.asMinutes() % 60;
		//var tmins = moment(endTime).add(startTime.minutes(), 'm');
		var smins = startTime.hour() * 60 + startTime.minute();
		var emins = endTime.hour() * 60 + endTime.minute();
		var tmins = (smins + emins) / 2;
		var tothrs = Math.floor(tmins / 60);
		var totmins = (tmins % 60);
		var midTime = moment(tothrs.toString() + ':' + totmins.toString() + ':00 pm', "HH:mm:ss a");
		//var lnt = Math.floor(tothrs/2);
		//var totmins = hours*60 + minutes;
		var totalsec = hours * 60 * 60 + minutes * 60;
		var abhsecs = Math.floor(totalsec / 2);
		var abh = Math.floor((hours / 30) * 60);
		var abhs = moment(midTime).subtract(abh, 'm');
		var abhe = moment(midTime).add(abh, 'm');
		var ethsec = Math.floor(totalsec / 8);
		var ethmin = Math.floor(ethsec / 60);
		var eth = moment.utc(ethsec * 1000).format('HH:mm:ss');
		var weekdays = new Array(7);
		weekdays[0] = "SUN|8|5";
		weekdays[1] = "MON|2|4";
		weekdays[2] = "TUE|7|3";
		weekdays[3] = "WED|5|2";
		weekdays[4] = "THU|6|1";
		weekdays[5] = "FRI|4|7";
		weekdays[6] = "SAT|3|6";
		var rwv = parseInt(weekdays[cd.getDay()].split('|')[1]);
		var ywv = parseInt(weekdays[cd.getDay()].split('|')[2]);
		var srhu = moment(startTime).add((rwv - 1) * ethmin, 'm');
		var erhu = moment(srhu).add(ethmin, 'm');
		var sym = moment(startTime).add((ywv - 1) * ethmin, 'm');
		var eym = moment(sym).add(ethmin, 'm');

		this.rahukal = srhu.format('h:mm a') + ' To ' + erhu.format('h:mm a');
		this.yama = sym.format('h:mm a') + ' To ' + eym.format('h:mm a');
		this.abhjit = abhs.format('h:mm a') + ' To ' + abhe.format('h:mm a');
		//this.sunrise = this.sunrise.split(' ')[0];
		//this.sunset = this.sunset.split(' ')[0];
	}
	vhoevt(evt, name) {
		evt.stopPropagation();
    console.log('evt', name);
    if (name == 'home') this.showPanch = true;
		this.shareService.setGEVT(name);
	}
  hidePanch() {
    console.log('hidePanch');
    this.showPanch = false;
  }
	
}

