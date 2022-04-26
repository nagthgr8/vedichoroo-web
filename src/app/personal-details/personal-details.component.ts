import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/operators';
import {saveAs} from 'file-saver';
import { HoroscopeService } from '../horoscope.service';
import { ShareService } from '../share.service'
import { Plan } from '../plan';
import { BirthInfo } from '../birth-info';
import { WindowRefService } from '../window-ref.service';
declare let window: any; // <--- Declare it like this
declare var google; 
declare var RazorpayCheckout: any;
@Component({
  selector: 'my-app',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
})
export class PersonalDetailsComponent implements OnInit {
 objectKeys = Object.keys;
 oBirth :BirthInfo[] = [];
 service = new google.maps.places.AutocompleteService();
 public product: any = {
    name: 'My Product',
    apid: '1234',
    gpid: 'com.mypubz.eportal.dob'
  };
	day: number;
  mon: number;
  year: number;
  hou: number;
  min: number;
  sec: number;
  autocomplete;
  autocompleteItems;
   info: string = '';
   info2: string = '';
   horo: any;
   errorMessage: string;
   phone: string = '';
   source: string = '';
   plan: Plan;
   showSU: boolean;
   showCR: boolean;
   showASU: boolean;
   showYO: boolean;
   showH: boolean = false;
   paym: string = 'rpay';
   dob: string = '';
   tob: string = '';
   place: string = '';
   nam: string='';
   gen: string = '';
   eml: string = '';
   mob: string = '';
   lan: string = 'en';
   chtyp: string = 'nind';
   aynm: string = 'lah';
	nwait: number = 0;
	sbtn: string = '';
   dstofset: number = 0;
   smp: string = '';
  constructor(private winRef: WindowRefService, private router: Router, private route: ActivatedRoute, private zone: NgZone, public shareService: ShareService, public horoService: HoroscopeService) {
  this.info2 = 'Please wait...';
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
		this.showSU = false;
		this.showCR = false;
		this.showASU = false;
		this.showYO = false;
  }
	public AddressChange(address: any) {
		//setting address from API to local variable
		if (this.autocomplete.query == '' || this.autocomplete.query.length < 3 || this.autocomplete.query == this.place) {
			this.autocompleteItems = [];
			return;
		}
		console.log('getPlacePredictions');
		let me = this;
		this.service.getPlacePredictions({
			input: this.autocomplete.query,

		}, (predictions, status) => {
			console.log('getPlacePredictions', predictions);
			me.autocompleteItems = [];

			me.zone.run(() => {
				console.log('zone.run', predictions);
				if (predictions != null) {
					predictions.forEach((prediction) => {
						me.autocompleteItems.push(prediction.description);
					});
				}
			});
		});
	} 
   ngOnInit() {
    console.log('personal-details ngOnInit called');	  
	   this.source = '';
	   this.shareService.setLANG('en');
    this.shareService.plan.subscribe((pln) => {
	    console.log('personal-details fetched plan', pln);
		this.plan = pln;
    }, (err) => {
					this.showSU = false;
					this.showCR = false;
					this.showASU = false;
				this.info2 = JSON.stringify(err);
	});
	   this.route.queryParams
      .subscribe(params => {
        console.log(params); 
        this.source = params['title'];
		  console.log('source', this.source);
		  switch (this.source) {
			  case 'Report':
				this.sbtn = 'PAY RS. 99/- & GET YOUR DETAILED REPORT BY EMAIL';
				break;
			  case 'Birth Chart':
				  this.sbtn = "GET YOUR FREE BIRTH CHART READINGS";
				  break;
			  case 'KP Astrology':
				  this.sbtn = "GET FREE KP ASTROLOGY REPORT";
				  break;
			  case 'Transit Predictions':
				  this.sbtn = "GET YOUR FREE 30DAY TRANSIT PREDICTIONS";
				  break;
			  case 'Career Horoscope':
				  this.sbtn = "GET YOUR FREE CAREER HOROSCOPE READINGS";
				  break;
			  case 'Money Horoscope':
				  this.sbtn = "GET YOUR FREE MONEY HOROSCOPE READINGS";
				  break;
			  default:
				  this.sbtn = "GET YOUR FREE BIRTH CHART READINGS";
				  break;
		  }
      });
	var intv = setInterval(() =>  {
  			if(this.nwait > 0) {	
			    this.info = 'please wait..' + this.nwait.toString();
				this.nwait--;
			}
	},1000);	
  }
  showDatePicker() {
	var dt = new Date();
	if(this.dob != '') {
		dt.setFullYear(Number(this.dob.split('-')[0]));
		dt.setMonth(Number(this.dob.split('-')[1])-1);
		dt.setDate(Number(this.dob.split('-')[2]));
	}
  }
 showTimePicker() {
	var dt = new Date();
	if(this.tob != '') {
		dt.setHours(Number(this.tob.split(':')[0]));
		dt.setMinutes(Number(this.tob.split(':')[1]));
	}
	}
 ngAfterViewInit() {
    console.log('ionViewDidLoad PersonalDetailsPage');
     this.info = '';
  //this.platform.ready().then(() => {
//     this.splashscreen.hide();
    this.info2 = 'Loading..';
//    this.shareService.plan.subscribe((pln) => {
	    this.info2 = '';
		if(this.shareService.getREWARD()) {
			this.showSU = true;
			this.showCR = false;
			this.showASU = false;
			if(this.source == 'Yogas In Your Horoscope') 
			 this.showYO = true;
		} else if(this.plan.name == 'com.mypubz.eportal.astrologer' || this.plan.name == 'com.mypubz.eportal.adfree' || this.plan.name == 'com.mypubz.eportal.year' || this.plan.name == 'com.mypubz.eportal.month') {
			this.showSU = true;
			this.showCR = false;
			this.showASU = false;
			if(this.source == 'Yogas In Your Horoscope') 
			 this.showYO = true;
		} else if(Number(this.plan.credits) == 0) {
			this.showSU = false;
			this.showCR = true;
			this.showASU = false;
		} else {
			this.showSU = true;
			this.showCR = false;
			this.showASU = true;
			if(this.source == 'Yogas In Your Horoscope') 
			 this.showYO = true;
			
		}
		if(this.plan.name != 'com.mypubz.eportal.astrologer' && this.plan.name != 'com.mypubz.eportal.yogas') {
		   this.shareService.setYogAd(true);
		}
		console.log('pln-dobs', this.plan.dobs);
		//if(this.plan.dobs.trim() != '') {
		//   let dobs = this.plan.dobs.split('|');
		//   let i: number =  dobs.length-1;
		//  if(dobs.length > 0) {
		//	this.showH = true;
		//	let j: number = 0;
		//	this.oBirth = [];
		//	while(i > -1) {
		//		let dob: string = dobs[i];
		//		console.log('dob', dob);
		//		let db: string = dob.split('@')[0];
		//		let nam: string = '';
		//		let gen: string = '';
		//		let lat: string = '';
		//		let lng: string = '';
		//		let tz: string = '';
		//		if(db.indexOf('L') > -1) {
		//			//db = dob.split('L')[0].trim();
		//			console.log('db', db);
		//			lat = db.split('L')[1].split(',')[0].trim();
		//			lng = db.split('L')[1].split(',')[1].trim();
		//			tz = dob.split('@')[1].split('#')[0];
		//			console.log('tz', tz);
		//			if(dob.indexOf('#') > -1) {
		//				var ng = dob.split('#')[1];
		//				nam = ng.split('&')[0];
		//				gen = ng.split('&')[1];
		//				console.log(nam, gen);
		//			}
		//		}
		//		let oB: BirthInfo = {
		//			  dob: dob,
		//			  dob_short: db.split('L')[0],
		//			  lat: lat,
		//			  lng: lng,
		//			  timezone: tz,
		//			  lagna: '',
		//			  lagna_lord: '',
		//			  moon_sign: '',
		//			  sun_sign: '',
		//			  tithi: '',
		//			  birth_star: '',
		//			  star_lord: '',
		//			  moon_phase: '',
		//			  name: nam,
		//			  gender: gen,
		//			  ref: '',
		//			  fetch: false,
		//			  show: true,
		//			  genrep: false
		//		};
		//		this.oBirth[j++] = oB;
		//		i--;
		//	}
		//  }
		//}
  }
  buy()
  {
    this.product.gpid = 'com.mypubz.eportal.dob10';
  }
  buy5()
  {
    this.product.gpid = 'com.mypubz.eportal.dob5';
  }
  yog()
  {
    this.product.gpid = 'com.mypubz.eportal.yogas';
  }
  save(evt) {
	evt.stopPropagation();
     this.info = 'please wait...';
	if(this.place.length == 0) {
	    this.info = 'Please enter place of birth';
		return;
		}
	  if (this.nam.length == 0) {
		  this.info = 'Please enter name';
		  return;
	  } else {
		  var re = /^[a-zA-Z ]{2,30}$/;
		  if (!re.test(this.nam)) {
			  this.info = "Name should not contain special charcters or numbers, please enter a valid Name.";
			  return;
		  }
	  }
	if(this.gen.length == 0) {
			this.info = 'Please enter gender';
			return;
		}
	if(this.day == null || this.mon == null || this.year == null) {
		this.info = 'Please enter date of birth';
		return;
	} else {
        this.dob = this.year.toString()+'-'+ this.mon.toString()+'-'+this.day.toString();
	}
	if(this.hou == null || this.min == null) {
		this.info = 'Please enter time of birth';
		return;
	} else  {
		let s = (this.sec == null) ? '00Z':this.sec.toString()+'Z';
        this.tob = this.hou.toString()+':'+this.min.toString()+':'+s ;
	}
	if(!this.isValidDate(this.day, this.mon, this.year, this.hou, this.min, (this.sec == null) ? 0 : this.sec)) {
		this.info = 'Please enter valid date & time';
		return;
	}
	if(this.source == "Report") {
		let dobs = this.dob + 'T' + this.tob + ':00Z' + 'L' + this.shareService.getLAT() + ',' + this.shareService.getLNG() + '@' + this.shareService.getTimezone() + '%' + this.dstofset.toString() + '#' + this.nam + '&' + this.gen + '&'  + this.place;	
		this.horoService.addReport('web', dobs, this.chtyp, this.aynm, this.lan, this.eml, this.mob)
		.subscribe(res => {
			if(res['status'] != 'E') {
				this.info = '<strong>Submitted successfully, we will send you the report to your mail id in 24hrs. Please write to <a href="mailto:info@vedichoroo.com">info@vedichoroo.com</a> further you have any questions.</strong>';
				this.razpay(99);
			} else {
			   this.info2 = 'There was some internal failure, we regret inconvinience. Please report this error to <a href="mailto:info@vedichoroo.com">info@vedichoroo.com</a>.';
			}
		}, (err) => {
			this.info2 = JSON.stringify(err);
		});	  
	} else {
		this.shareService.setPersonDetails(this.place, this.dob + 'T' + this.tob );
	let bdob: boolean = false;
	console.log('oBirth-save', this.oBirth);
	let dob2: string = this.dob.toString().trim();
	for(var d=0; d < this.oBirth.length; d++) {
	    let dob1: string = this.oBirth[d].dob.split('T')[0].trim();
		
		console.log('dob1', dob1);
		console.log('dob2', dob2);
	    if( dob1 == dob2) { bdob = true; break; }
	}
	if(!bdob) {
	    console.log('before adding dob', this.oBirth);
		let pd: string = this.dob + 'T' + this.tob + 'L' + this.shareService.getLAT() + ',' + this.shareService.getLNG() + '@' + this.shareService.getTimezone();
		if(this.nam.length > 0) pd += '#' + this.nam + '&' + this.gen;
		this.info = 'storing DOB..';
		this.horoService.addDOB('', pd)
		   .subscribe(res => {
		    console.log('addDOB', res);
							let oB: BirthInfo = {
					  dob: this.dob + 'T' + this.tob,
					  dob_short: '',
					  lat: this.shareService.getLAT(),
					  lng: this.shareService.getLNG(),
					  timezone: this.shareService.getTimezone(),
					  lagna: '',
					  lagna_lord: '',
					  moon_sign: '',
					  sun_sign: '',
					  tithi: '',
					  birth_star: '',
					  star_lord: '',
					  moon_phase: '',
					  name: this.nam,
					  gender: this.gen,
					  ref: '',
					  fetch: false,
					  show: true,
					  genrep: false
				};
				this.oBirth.unshift(oB);
                if(this.showH == false) this.showH = true;
				let ob: string = '';
				if(res['dobs'].trim() != '') {
				 ob = res['dobs'] + '|' + this.dob + 'T' + this.tob + 'L' + this.shareService.getLAT() + ',' + this.shareService.getLNG() + '@' + this.shareService.getTimezone() + '#' + this.nam + '&' + this.gen;
				} else {
				  ob = this.dob + 'T' + this.tob  + 'L' + this.shareService.getLAT() + ',' + this.shareService.getLNG() + '@' + this.shareService.getTimezone() + '#' + this.nam + '&' + this.gen;
				}
			let pln: Plan = { uuid: res['uuid'], name: res['name'], credits: res['credits'], dobs: ob };
			this.plan = pln;
			console.log('after adding dob', this.plan);
		   this.shareService.setPLAN(pln);
			this.info = '';
			this.nwait = 0;
		}, (err) => {
			this.info = err;
			this.nwait = 0;
		}) ;
	  }
	  this.info = 'processing request..';
	  this.processReq(this.shareService.getLAT(), this.shareService.getLNG(), this.shareService.getDOB(), this.shareService.getTimezone(), this.nam);
	 }
	}
    processReq(lat, lng, dob, tz, nam)
    {
	 this.nwait = 18;
	 if(this.source == 'Personalized Calendar') {
		 let binf: BirthInfo = { dob: dob, dob_short: '', lat: lat, lng: lng, timezone: tz, lagna:'',lagna_lord:'',moon_sign:'',sun_sign:'',tithi:'',birth_star:'',star_lord:'',moon_phase:'',name:nam,gender:'',ref:'2', fetch: false, show: true, genrep: false};
		 this.router.navigate(['/star-const'], {state: binf});
	 }
	 else if(this.source == 'Birth Chart') {
		var dt = new Date();
		var n = dt.getTimezoneOffset();
		n = n/60;
		let ofset: number = Number(n.toFixed(1));
		let ayanid: number = 4;
		var res = this.shareService.getAYNM();
		if(res) ayanid = Number(res);
		   this.horoService.getBirthchartEx2(lat, lng, dob, tz, ofset, ayanid)
		   .subscribe(res => {
			this.shareService.setPLPOS(res['planetPos']);
			this.shareService.setRETRO(res['retroPls']);
			this.shareService.setPLSTR(res['plStren']);
			this.info = '';
			this.nwait = 0;
			let binf: BirthInfo = { dob: dob, dob_short: '', lat: lat, lng: lng, timezone: tz, lagna:'',lagna_lord:'',moon_sign:'',sun_sign:'',tithi:'',birth_star:'',star_lord:'',moon_phase:'',name:nam,gender:'',ref:'1', fetch: false, show: true, genrep: false};
			this.router.navigate(['/horoscope'], {state: binf});
		  }, (err) => {
			this.info = JSON.stringify(err);
			this.nwait = 0;
		  }) ;
	  } else if(this.source == 'KP Astrology') {
		var dt = new Date();
		var n = dt.getTimezoneOffset();
		n = n/60;
		let ofset: number = Number(n.toFixed(1));
		let ayanid: number = 3;
		var res = this.shareService.getKAYNM();
		if(res) ayanid = Number(res);
		this.horoService.getCuspsEx(lat, lng, dob, tz, ofset, ayanid)
		   .subscribe(res => {
			this.shareService.setPLPOS(res['planetPos']);
		    console.log(res['housePos']);
 		    this.shareService.setHPOS(res['housePos']);
			this.info = '';
			this.nwait = 0;
			let binf: BirthInfo = { dob: dob, dob_short: '', lat: lat, lng: lng, timezone: tz, lagna:'',lagna_lord:'',moon_sign:'',sun_sign:'',tithi:'',birth_star:'',star_lord:'',moon_phase:'',name:nam,gender:'',ref:'2', fetch: false, show: true, genrep: false};
			this.router.navigate(['/kp-astro'], {state: binf});
		  }, (err) => {
			this.info = JSON.stringify(err);
			this.nwait = 0;
		  }) ;
	  
	  } else if(this.source == 'Daily Horoscope') {
		let ayanid: number = 4;
		var res = this.shareService.getAYNM();
		if(res) ayanid = Number(res);
	    this.horoService.getProBirthStar(lat, lng, dob, tz, ayanid)
       .subscribe(res => {
	     this.shareService.setMoonSign(res['birthSign']);
		 this.info = '';
		 this.nwait = 0;
		 this.router.navigate(['/daily-forecast']);
		}, (err) => {
			this.info = JSON.stringify(err);
			this.nwait = 0;
		}) ;
	  }else if(this.source == 'Yogas In Your Horoscope') {
		var dt = new Date();
		var n = dt.getTimezoneOffset();
		n = n/60;
		let ofset: number = Number(n.toFixed(1));
		let ayanid: number = 4;
		var res = this.shareService.getAYNM();
		if(res) ayanid = Number(res);
		this.horoService.getBirthchartEx2(lat, lng, dob, tz, ofset, ayanid)
		   .subscribe(res => {
			this.shareService.setRETRO(res['retroPls']);
			this.shareService.setPLSTR(res['plStren']);
			this.shareService.setPLPOS(res['planetPos']);
			this.horoService.getYogas(lat, lng, dob, tz, this.shareService.getLANG())
				.subscribe(res => {
				this.shareService.setYOGAS(res);
				this.info = '';
				this.nwait = 0;
				let binf: BirthInfo = { dob: dob, dob_short: '', lat: lat, lng: lng, timezone: tz, lagna:'',lagna_lord:'',moon_sign:'',sun_sign:'',tithi:'',birth_star:'',star_lord:'',moon_phase:'',name:nam,gender:'',ref:'2', fetch: false, show: true, genrep: false};
				this.router.navigate(['/rajayoga'], {state: binf});
			}, (err) => {
				this.info = JSON.stringify(err);
				this.nwait = 0;
			}) ;
		  }, (err) => {
			this.info = JSON.stringify(err);
			this.nwait = 0;
		  }) ;
	  }else if(this.source == 'Transit Predictions') {
		var dt = new Date();
		var n = dt.getTimezoneOffset();
		n = n/60;
		let ofset: number = Number(n.toFixed(1));
		let ayanid: number = 4;
		var res = this.shareService.getAYNM();
		if(res) ayanid = Number(res);
	    this.horoService.getBirthchartEx2(lat, lng, dob, tz, ofset, ayanid)
		   .subscribe(res => {
			this.shareService.setPLPOS(res['planetPos']);
			this.shareService.setRETRO(res['retroPls']);
			this.shareService.setPLSTR(res['plStren']);
			this.info = '';
			this.nwait = 0;
			let binf: BirthInfo = { dob: dob, dob_short: '', lat: lat, lng: lng, timezone: tz, lagna:'',lagna_lord:'',moon_sign:'',sun_sign:'',tithi:'',birth_star:'',star_lord:'',moon_phase:'',name:nam,gender:'',ref:'4', fetch: false, show: true, genrep: false};
			this.router.navigate(['/transit-predictions'], {state: binf});
		}, (err) => {
			this.info = err;
			this.nwait = 0;
		});
	  } else if(this.source == 'Divisional Charts') {
		var dt = new Date();
		var n = dt.getTimezoneOffset();
		n = n/60;
		let ofset: number = Number(n.toFixed(1));
		let ayanid: number = 4;
		var res = this.shareService.getAYNM();
		if(res) ayanid = Number(res);
		this.horoService.getBirthchartEx2(lat, lng, dob, tz, ofset, ayanid)
		   .subscribe(res => {
			this.shareService.setPLPOS(res['planetPos']);
			this.shareService.setRETRO(res['retroPls']);
			this.shareService.setPLSTR(res['plStren']);
			this.info = '';
			this.nwait = 0;
			let binf: BirthInfo = { dob: dob, dob_short: '', lat: lat, lng: lng, timezone: tz, lagna:'',lagna_lord:'',moon_sign:'',sun_sign:'',tithi:'',birth_star:'',star_lord:'',moon_phase:'',name:nam,gender:'',ref:'5', fetch: false, show: true, genrep: false};
			this.router.navigate(['/divcharts'], {state: binf});
		  }, (err) => {
			this.info = err;
			this.nwait = 0;
		  }) ;
	  } else if(this.source == 'Career Horoscope') {
		var dt = new Date();
		var n = dt.getTimezoneOffset();
		n = n/60;
		let ofset: number = Number(n.toFixed(1));
		let ayanid: number = 4;
		var res = this.shareService.getAYNM();
		if(res) ayanid = Number(res);
		this.horoService.getBirthchartEx2(lat, lng, dob, tz, ofset, ayanid)
		   .subscribe(res => {
			this.shareService.setPLPOS(res['planetPos']);
			this.shareService.setRETRO(res['retroPls']);
			this.shareService.setPLSTR(res['plStren']);
				this.info = '';
				this.nwait = 0;
				let binf: BirthInfo = { dob: dob, dob_short: '', lat: lat, lng: lng, timezone: tz, lagna:'',lagna_lord:'',moon_sign:'',sun_sign:'',tithi:'',birth_star:'',star_lord:'',moon_phase:'',name:nam,gender:'',ref:'4', fetch: false, show: true, genrep: false};
				this.router.navigate(['/careerhoro'], {state: binf});
		  }, (err) => {
			this.info = err;
			this.nwait = 0;
		  }) ;
	  } else if(this.source == 'Money Horoscope') {
		var dt = new Date();
		var n = dt.getTimezoneOffset();
		n = n/60;
		let ofset: number = Number(n.toFixed(1));
		let ayanid: number = 4;
		var res = this.shareService.getAYNM();
		if(res) ayanid = Number(res);
		this.horoService.getBirthchartEx2(lat, lng, dob, tz, ofset, ayanid)
		   .subscribe(res => {
			this.shareService.setPLPOS(res['planetPos']);
			this.shareService.setRETRO(res['retroPls']);
			this.shareService.setPLSTR(res['plStren']);
				this.info = '';
				this.nwait = 0;
				let binf: BirthInfo = { dob: dob, dob_short: '', lat: lat, lng: lng, timezone: tz, lagna:'',lagna_lord:'',moon_sign:'',sun_sign:'',tithi:'',birth_star:'',star_lord:'',moon_phase:'',name:nam,gender:'',ref:'4', fetch: false, show: true, genrep: false};
				this.router.navigate(['/moneyhoro'], {state: binf});
		  }, (err) => {
			this.info = err;
			this.nwait = 0;
		  }) ;
	  }
	
    }	
    more()
	{
		this.router.navigate(['/subscriber']);
	}
	morecred()
	{
		this.router.navigate(['/credits']);
	}
	yoginf()
	{
		this.router.navigate(['/yoga-info']);
	}
  paymSel(paym)
  {
     this.paym = paym;
  }
  razpay(amt) {
    let paise: number = amt*100;
	let ccy: string = 'INR';
	let ccode = this.shareService.getCCODE();
	if(ccode && ccode != '' && ccode != 'IN') {
	  paise = amt*1.4;
	  ccy = 'USD';
	}
	   
    const options: any = {
      description: '126 Astrology - Report',
      image: 'https://i.imgur.com/YBQF1iV.png',
      currency: ccy, //'INR',
      key: 'rzp_live_B8Zi7S5GIm9G94',
      amount: paise,
      name: '126 Astrology',
      prefill: {
        email: this.eml,
        contact: this.mob,
        name: this.nam
      },
      theme: {
        color: '#488aff'
      },
      modal: {
        ondismiss: function() {
          alert('dismissed')
        }
      }
    };
	options.handler = ((response, error) => {
      options.response = response;
      console.log(response);
      console.log(options);
      // call your backend api to verify payment signature & capture transaction
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
    // var successCallback = (payment_id) => {
	  // this.showCR = false;
	  // this.showSU = true;
	  // if(this.showYO) {
		
	  // } else {
	    // this.horoService.addCredits('', (this.product.gpid == 'com.mypubz.eportal.dob5') ? 5 : 10)
		   // .subscribe(res => {
				// this.plan.credits += (this.product.gpid == 'com.mypubz.eportal.dob5') ? 5 : 10;
				//this.shareService.setPLAN(this.plan);
			// }, (err) => {
			// });	  
	  // } 
    // };

    // var cancelCallback = (error) => {
      // alert(error.description + ' (Error ' + error.code + ')');
    // };
    // RazorpayCheckout.open(options, successCallback, cancelCallback);
  }
  selDOB(evt, pd)
  {
    evt.stopPropagation();
    console.log('selDOB', pd);
	pd.fetch = true;
		this.processReq(pd.lat, pd.lng, pd.dob, pd.timezone, pd.name);
  }
  
  chooseItem(item: any) {
	this.place = item;
	this.autocomplete.query = item;
    this.geoCode(item);
	this.autocompleteItems = [];
  }
  geoCode(address:any) {
    this.info = 'geocoding..';
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
    let latitude = results[0].geometry.location.lat();
    let longitude = results[0].geometry.location.lng();
	this.shareService.setLAT( latitude);
	this.shareService.setLNG(longitude);
    this.horoService.getTimezone(results[0].geometry.location.lat(), results[0].geometry.location.lng(), (Math.round((new Date().getTime())/1000)).toString())
		.subscribe(res2 => {
		   this.shareService.setTimezone(res2['timeZoneId']);
		   this.dstofset = res2['dstOffset'];
		   console.log(res2['timeZoneId']);
		   this.info = '';
		}, (err) => {
		  console.log(err);
		  this.info = err;
		}) ;

   });
 }
 remDOB(evt, pd) {
    evt.stopPropagation();
	pd.show = false;
	let reps = this.shareService.getREPS().split('|');
	let efn: string = '';
	for(let i = 0; i < reps.length; i++) {
		if(reps[i].split('$')[1] == pd.dob_short) { 
		this.shareService.remREP(reps[i]);
		efn = reps[i].split('$')[1]; break;
		}
	}
	if(efn != '') {
	}
	
	this.horoService.remDOB('', pd.dob)
	.subscribe(res => {
			let pln: Plan = { uuid: res['uuid'], name: res['name'], credits: res['credits'], dobs: res['dobs'] };
			this.plan = pln;
	}, (err) => {
		console.log(err);
	});
	
 }
 genPDF(evt, pd) {
    evt.stopPropagation();
	let reps = this.shareService.getREPS().split('|');
	let efn: string = '';
	for(let i = 0; i < reps.length; i++) {
		if(reps[i].split('$')[0] == pd.name && reps[i].split('$')[1] == pd.dob_short) { efn = reps[i].split('$')[2]; break;}
	}
	
	pd.genrep = true;
 //   var latlng = new google.maps.LatLng(pd.lat, pd.lng);
 //   let geocoder = new google.maps.Geocoder();
	//geocoder.geocode({ 'latLng': latlng }, (results, status) => {
	//    console.log('geocoder result=', results);
	//	var dt = new Date();
	//	var n = dt.getTimezoneOffset();
	//	n = n/60;
	//	let ofset: number = Number(n.toFixed(1));
	//	let ayanid: number = 4;
	//	var ayn = this.shareService.getAYNM();
	//	if(ayn) ayanid = Number(ayn);
	//this.horoService.downloadPdf('', pd.name, pd.gender, pd.dob, results[0].formatted_address, pd.lat, pd.lng, pd.timezone, ofset, ayanid, this.shareService.getLANG(), (this.shareService.getCHTYP() == null) ? 'si':this.shareService.getCHTYP())
	//.subscribe(res => {
 //   }, (err) => {
	//	this.info = JSON.stringify(err);
	//	console.log(err);
	//});
 //  },(err) => {
	//  console.log(err);
	//  this.info = JSON.stringify(err);
	//});
 }
 showPdf(fl) {
 }

	subscribe(evt) {
		this.shareService.setVEVT('subscribe');
	}
rgeoCode(lat, lng) {
 //   console.log('lat=', lat);
	//console.log('lng=', lng);
 //   var latlng = new google.maps.LatLng(lat, lng);
 //   let geocoder = new google.maps.Geocoder();
	//geocoder.geocode({ 'latLng': latlng }, (results, status) => {
	//    console.log('geocoder result=', results);
	//    results[0].formatted_address;
 //  },(err) => {
	//  console.log(err);
	//  this.info = err;
	//});
 }
 isValidDate(d, m, y, hou, min, sec) {
  var dt = new Date(y,m,d,hou,min,sec);
  if (Object.prototype.toString.call(dt) === "[object Date]") {
  // it is a date
   if (isNaN(dt.getTime())) {  // dt.valueOf() could also work
    // date is not valid
    return false;
   } else {
    return true;
   }
  } 
  return false;
  }
 smrep(evt, lng) {
	    this.smp = lng;
		this.info = 'Getting the report, please wait..';
		evt.stopPropagation();
		let snam: string = 'John Doe';
		let sgen: string  = 'M';
		let sdob: string = '30-8-1930';
		let stob: string = '15:0:0';
		let saddr: string = 'Omaha, Nebraska, United States';
		let slat: number = 41.2565;
		let slng: number = 95.9345;
		let stz: string = 'America/Chicago';
		let sdstofset: number = -5;
		let sayn: number = 4;
		let schtyp: string = 'nind';
		this.showSU = false;
		let simg: string = 'https://i.imgur.com/9gRr3ME.jpg';
		let scnme: string = 'VEDIC HOROO';
		let scnum: string = '+919010263567';
		let sceml: string = 'info@vedichoroo.com';
	console.log(this.dob, this.tob);
	this.horoService.downloadPdfEx('web', snam, sgen, sdob+'T'+stob + 'Z', saddr, slat.toString(), slng.toString(), stz, sdstofset, sayn, lng, schtyp, simg, scnme, scnum, sceml)
	.subscribe(res => {
		    saveAs(res, 'sample-horoscope.pdf');
			this.smp = '';
			console.log('success');
                //success
				this.info = '';
    }, (err) => {
		this.smp = '';
		JSON.stringify(err);
		console.log(err);
	});
 }
}
