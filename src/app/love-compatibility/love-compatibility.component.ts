import { Component, OnInit, NgZone, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { HoroscopeService } from '../horoscope.service';
import { ShareService } from '../share.service'
import { Observable, forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { Love } from '../love';
declare var google; 

@Component({
  selector: 'app-love-compatibility',
  templateUrl: './love-compatibility.component.html',
  styleUrls: ['./love-compatibility.component.scss'],
})
export class LoveCompatibilityComponent implements OnInit {
	@ViewChild("cnvCC", {static: false}) cnvCC;
	signs_short_v: any;
	rashis_v: any;
	rashi_lords_v: any;
	ruler_name_v: any;
	friend_pl_v: any;
	enemy_pl_v: any;
	neutral_pl_v: any;
	nakshatras_v: any;
	nakshatra_o_v: any;
	vasya_v: any;
	plChart: any;
 service = new google.maps.places.AutocompleteService();
	autocomplete;
  autocompleteItems1;
	autocompleteItems2;
  htz: string = '';
  rtz: string = '';
  latlng1: string = '';
  latlng2: string = '';
  birthStar: string;
  birthSign: string;
  partnerBirthStar: string;
  partnerBirthSign: string;
  birthSignDeg: string;
  partnerBirthSignDeg: string;
  objectKeys = Object.keys;
  frep: string = '';
	day1: number;
	mon1: number;
	year1: number;
	hou1: number;
	min1: number;
	sec1: number;
	day2: number;
	mon2: number;
	year2: number;
	hou2: number;
	min2: number;
	sec2: number;
  nam1: string = '';
	nam2: string = '';
	place1: string = '';
	place2: string = '';
  info: string = '';
  strii: string = ''
  showList: boolean;
  showGrid: boolean;
  mdob: string = '';
  wdob: string = '';
  mstar: string = '';
  wstar: string = '';
  mpl: string = '';
  wpl: string = '';
  maml: string = '';
  waml: string = '';
  mchr: string = '';
  wchr: string = '';
  nadi: string = '';
  bha: string = '';
  gana: string = '';
  grha: string = '';
  yoni: string = '';
  tara: string = '';
  vsya: string = '';
  vrna: string = '';
  totl: string = '';
  mah: string = '';
  vedh: string = '';
  raju: string = '';
  attr: string = '';
  pap: string = '';
  kal: string = '';
  mngl: string = '';
  msign: string = '';
  wsign: string = '';
  oLove: Love[] = [];
  oKota: Love[] = [];
  pada: number = 0;
	ptnPada: number = 0;
	hisdb: string = '';
	herdb: string = '';
  dos: any;
  wait: boolean = false;
  constructor(private router: Router, private zone: NgZone, public horoService: HoroscopeService, public renderer: Renderer2, public shareService: ShareService) {//, public admob: AdMob) { 
	Chart.register(...registerables);
	 this.dos = {};
	this.showGrid = false;
	this.showList = true;
    this.autocompleteItems1 = [];
	  this.autocompleteItems2 = [];
    this.autocomplete = {
      query1: '',
	  query2: ''
    };
  }
	public AddressChange(evt, hc) {
		//setting address from API to local variable
		let q: string = '';
		if (hc == 1) {
			if (this.autocomplete.query1 == '' || this.autocomplete.query1.length < 3 || this.autocomplete.query1 == this.place1) {
				this.autocompleteItems1 = [];
				return;
			}
			q = this.autocomplete.query1;
		} else {
			if (this.autocomplete.query2 == '' || this.autocomplete.query2.length < 3 || this.autocomplete.query2 == this.place2) {
				this.autocompleteItems2 = [];
				return;
			}
			q = this.autocomplete.query2;
		}
		console.log('getPlacePredictions');
		let me = this;
		this.service.getPlacePredictions({
			input:q,

		}, (predictions, status) => {
			console.log('getPlacePredictions', predictions);
				if(hc == 1) me.autocompleteItems1 = [];
				else me.autocompleteItems2 = [];
			me.zone.run(() => {
				console.log('zone.run', predictions);
				if (predictions != null) {
					predictions.forEach((prediction) => {
						if (hc == 1)
							me.autocompleteItems1.push(prediction.description);
            else 
							me.autocompleteItems2.push(prediction.description);
					});
				}
			});
		});
	} 

  ngOnInit() {
	  forkJoin(
		  this.horoService.getJson('assets/data/signs_short.json'),
		  this.horoService.getJson('assets/data/rashis.json'),
		  this.horoService.getJson('assets/data/rashi_lords.json'),
		  this.horoService.getJson('assets/data/ruler_name.json'),
		  this.horoService.getJson('assets/data/friend_pl.json'),
		  this.horoService.getJson('assets/data/enemy_pl.json'),
		  this.horoService.getJson('assets/data/neutral_pl.json'),
		  this.horoService.getJson('assets/data/nakshatras.json'),
		  this.horoService.getJson('assets/data/nakshatra_o.json'),
		  this.horoService.getJson('assets/data/vasya.json'),
	  )
		  .subscribe(dat => {
			  console.log('dat', dat);
			  this.signs_short_v = dat[0];
			  this.rashis_v = dat[1];
			  this.rashi_lords_v = dat[2];
			  this.ruler_name_v = dat[3];
			  this.friend_pl_v = dat[4];
			  this.enemy_pl_v = dat[5];
			  this.neutral_pl_v = dat[6];
			  this.nakshatras_v = dat[7];
			  this.nakshatra_o_v = dat[8];
			  this.vasya_v = dat[9];
		  });

  }
  save(event: Event) {
   event.preventDefault();	  
	  this.info = 'please wait...';
	  let dob1: string = '';
	  let tob1: string = '';
	  let dob2: string = '';
	  let tob2: string = '';
	  if (this.place1.length == 0) {
		  this.info = 'Please enter his place of birth';
		  return;
	  }
	  if (this.nam1.length == 0) {
		  this.info = 'Please enter his name';
		  return;
	  } else {
		  var re = /^[a-zA-Z ]{2,30}$/;
		  if (!re.test(this.nam1)) this.info = "His Name should not contain special charcters or numbers, please enter a valid Name.";
	  }
	  if (this.day1 == null || this.mon1 == null || this.year1 == null) {
		  this.info = 'Please enter date of birth';
		  return;
	  } else {
		  dob1 = this.year1.toString() + '-' + this.mon1.toString() + '-' + this.day1.toString();
	  }
	  if (this.hou1 == null || this.min1 == null) {
		  this.info = 'Please his enter time of birth';
		  return;
	  } else {
		  let s = (this.sec1 == null) ? '00Z' : this.sec1.toString() + 'Z';
		  tob1 = this.hou1.toString() + ':' + this.min1.toString() + ':' + s;
	  }
	  if (!this.isValidDate(this.day1, this.mon1, this.year1, this.hou1, this.min1, (this.sec1 == null) ? 0 : this.sec1)) {
		  this.info = 'Please enter valid date & time';
		  return;
	  }
	  if (this.place2.length == 0) {
		  this.info = 'Please enter Her place of birth';
		  return;
	  }
	  if (this.nam2.length == 0) {
		  this.info = 'Please enter Her name';
		  return;
	  } else {
		  var re = /^[a-zA-Z ]{2,30}$/;
		  if (!re.test(this.nam1)) this.info = "Her Name should not contain special charcters or numbers, please enter a valid Name.";
	  }
	  if (this.day2 == null || this.mon2 == null || this.year2 == null) {
		  this.info = 'Please enter Her date of birth';
		  return;
	  } else {
		  dob2 = this.year2.toString() + '-' + this.mon2.toString() + '-' + this.day2.toString();
	  }
	  if (this.hou2 == null || this.min2 == null) {
		  this.info = 'Please his enter time of birth';
		  return;
	  } else {
		  let s = (this.sec2 == null) ? '00Z' : this.sec2.toString() + 'Z';
		   tob2 = this.hou2.toString() + ':' + this.min2.toString() + ':' + s;
	  }
	  if (!this.isValidDate(this.day2, this.mon2, this.year2, this.hou2, this.min2, (this.sec2 == null) ? 0 : this.sec2)) {
		  this.info = 'Please enter Her valid date & time';
		  return;
	  }
	  this.hisdb = dob1 + 'T' + tob1;
	  this.herdb = dob2 + 'T' + tob2;
		let ayanid: number = 4;
		var res = this.shareService.getAYNM();
		if(res) ayanid = Number(res);
		this.info = 'Analyzing stars..';
		this.wait = true;
	this.horoService.getBirthStars(dob1 + 'T' + tob1 + ':00Z', dob2 + 'T' + tob2 + ':00Z', this.latlng1 + 'L' + this.latlng2, this.htz + '|' + this.rtz, ayanid)
       .subscribe(res => {
		   this.wait = false;
	   this.birthStar = res['birthStar'];
	   this.pada = Number(res['pada']);
	   this.birthSign = res['birthSign'];
	   this.birthSignDeg = res['birthSignDeg'];
	     this.partnerBirthStar = res['partnerBirthStar'];
	     this.ptnPada = Number(res['partnerPada']);
		 this.partnerBirthSign = res['partnerBirthSign'];
		 this.partnerBirthSignDeg = res['partnerBirthSignDeg'];
		 this.info = 'Generating report..';
		 this.getLoveReport();
		 let str: string = '<strong>' + res['papaSamyam'] + '</strong>';
		 this.pap = str;
		 this.dos.pap = res['papaSamyam'] ;
		 str = '<strong>' + res['kalatraDosh'] + '</strong>';
		 this.kal = str;
		 this.dos.kal = res['kalatraDosh'] ;
		 let mdm: boolean = false;
		 let md1: string = (res['manglik'] == '0') ? 'Manglik dosh does not exists in ' + this.nam1 + ' chart' : 'Manglik dosh exists in ' + this.nam1 + ' chart';
		 let md2: string = (res['partnerManglik'] == '0') ?  ', Manglik dosh does not exists in ' + this.nam2  + ' chart' : ', Manglik dosh exists in ' + this.nam2 + ' chart';
		 if(md1.indexOf('not') > -1 && md2.indexOf('not') > -1) 
			 mdm = true;
		 if(md1.indexOf('not') == -1 && md2.indexOf('not') == -1) 
			 mdm = true;
		 str = '<strong>' + md1 + md2 + '</strong>';
		 this.mngl = '<strong>' + str + '</strong>';
		 this.dos.mngl = md1 + md2;
		 this.info = '';
      }, (err) => {
		this.wait = false;
        this.info = 'Huf! Our server did not respond, please try after sometime';
      }) ;
  }
	isValidDate(d, m, y, hou, min, sec) {
		var dt = new Date(y, m, d, hou, min, sec);
		if (Object.prototype.toString.call(dt) === "[object Date]") {
			// it is a date
			if (isNaN(dt.getTime())) {  // dt.valueOf() could also work
				// date is not valid
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}

	chooseItem(item: any, hc) {
		if (hc == 1) {
			this.place1 = item;
			this.autocomplete.query1 = item;
		} else {
			this.place2 = item;
			this.autocomplete.query2 = item;
		}
		this.geoCode(item, hc);
		if (hc == 1) this.autocompleteItems1 = [];
		else this.autocompleteItems2 = [];
	}
	geoCode(address: any, hc) {
		this.info = 'geocoding..';
		let geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'address': address }, (results, status) => {
			if (hc == 1)
				this.latlng1 = results[0].geometry.location.lat() + '|' + results[0].geometry.location.lng();
			else this.latlng2 = results[0].geometry.location.lat() + '|' + results[0].geometry.location.lng();
			this.horoService.getTimezone(results[0].geometry.location.lat(), results[0].geometry.location.lng(), (Math.round((new Date().getTime()) / 1000)).toString())
				.subscribe(res2 => {
					if (hc == 1)
						this.htz = res2['timeZoneId'];
					else
						this.rtz = res2['timeZoneId'];
					this.info = '';
				}, (err) => {
					console.log(err);
					this.info = err;
				});
		});
	}
  
  getLoveReport()
  {
	this.info = '';
    this.showList = false;
	this.showGrid = true;
	this.msign = this.translate(this.birthSign);
	this.wsign = this.translate(this.partnerBirthSign);
	this.mdob = this.hisdb;
	this.wdob = this.herdb;
	var bS = null;
	var partnerbS = null;
	let bvedh: boolean = false;
	let bmah: boolean = false;
	let brju: boolean = false;
	this.frep = '<span class="text-info text-center"><strong>Analyzing...</strong></span>';
	console.log(this.birthSign);
	console
	var kpts = [];
    let akpts: number = 0;
	var bkclr = ['rgba(255,102,0,0.2)', 'rgba(102,102,255,0.2)', 'rgba(204,0,0,0.2)', 'rgba(255,255,0,0.2)','rgba(255,51,102,0.2)','rgba(0,153,0,0.2)', 'rgba(255,102,255,0.2)', 'rgba(119,119,119,0.2)','rgba(0, 0, 0, 0.45)'];
	var bdclr = ['rgba(255,102,0,1)', 'rgba(102,102,255,1)', 'rgba(204,0,0,1)', 'rgba(255,255,0,1)','rgba(255,51,102,1)','rgba(0,153,0,1)', 'rgba(255,102,255,1)', 'rgba(119,119,119,1)','rgba(0, 0, 0, 0.45)'];
	var lbls = ['Excess/Nadi Koota', 'Constructivism/Bha Koota', 'Temperment/Gana Koota', 'Friendship/Grahamitram Koota', 'Instrinctive Compatibility/Yoni Koota', 'Comfort/Tara Koota','Innate Giving/Vasya Koota', 'Mutation/Varna Koota','Not Matching'];
	
	for(var i = 0; i < Object.keys(this.nakshatras_v).length; i++)
	{
		var nak = this.nakshatras_v[i];	
		if(nak.name.toLowerCase() == this.birthStar.toLowerCase())
		{
		   bS = nak;
		}
		if(nak.name.toLowerCase() == this.partnerBirthStar.toLowerCase())
		{
			partnerbS = nak;
		}
		if(bS != null && partnerbS != null)
		{
		    this.mstar =  this.translate(bS.name) + ' ' + this.pada.toString() + ' Pada';
			this.wstar = this.translate(partnerbS.name) + ' ' + this.ptnPada.toString() + ' Pada';
			this.mpl = this.translate(bS.ruler);
			this.wpl = this.translate(partnerbS.ruler);
			this.maml = this.translate(bS.rulingAnimal);
			this.waml = this.translate(partnerbS.rulingAnimal);
			this.mchr = bS.characteristics;
			this.wchr = partnerbS.characteristics;
		    var res = '';
			var html = '';
			var stri = 1;
			if(bS.order != partnerbS.order) {
				while(stri <= 27)
				{
				  var snak;
				  snak = (bS.order + stri > 27) ?  this.nakshatra_o_v[bS.order + stri - 27] : this.nakshatra_o_v[bS.order+stri];
				  console.log(snak, partnerbS.name);
				  if(snak.trim() == partnerbS.name.trim()) break;
				  stri++;
				  
				}
			} else {
			 stri = 0;
			}
			//this.strii = '<strong>Respect / Strii Diirgha</strong>'
			if(stri >= 14) {
				res = (this.shareService.getLANG() == 'en') ? 'Good': (this.shareService.getLANG() == 'te') ? 'మంచిది' : 'अच्छा है';
				//this.strii += '<img src="assets/imgs/thumbsup.png" alt="Marriage Compatibility" />';
				this.dos.striis = 'greenText';
			}
			else {
				res = (this.shareService.getLANG() == 'en') ? 'Not Good' :(this.shareService.getLANG() == 'te') ? 'మంచిది కాదు': 'अच्छा नही';
				//this.strii += '<img src="assets/imgs/lovewarn.png" alt="Marriage Compatibility" />';
				this.dos.striis = 'redText';
			}
			//this.strii += '<br/>';
			if(this.shareService.getLANG() == 'en') {
				this.dos.strii = this.nam1 + ' birthstar ' + bS.name + ' is ' + stri + ' away from ' + this.nam2 + ' birthstar ' + partnerbS.name + ' which is ' + res;
			} else if(this.shareService.getLANG() == 'te') {
				this.dos.strii = 'వరుని  జన్మ నక్షత్రమ్  వధువు   జన్మ నక్షత్రమ్ నుంచి' + stri + ' నక్షత్రాల దూరం లో ఉంది  అది ' + res;
			} else if(this.shareService.getLANG() == 'hi') { 
				this.dos.strii = 'दूल्हा जन्म नक्षत्र  दुल्हन  जन्म नक्षत्र  से' + stri + ' नक्षत्र आगे है ये ' + res;
			}
			
			let pts: number = 0;
			let love: Love = {
				name: 'Respect / Strii Diirgha',
				desc: 'The technique used to determine whether a couple will be inclined to respect each other is known as Strii Diirgha. The Nakshatra (Moons asterism) of the man should be at least 14 away from the womans. If it is not at least 14 away, problems will be likely. If it is not at least 14 away, but only nine to thirteen away, then the problems will be somewhat reduced.<br/>When there are at least 14 Nakshatras from the womans from the mans the shortest flow of energy is from the man to the woman, allowing him to naturally play the masculine role and her to play the feminine. When there is less than 14 the shortest flow of energy is from her to him. This creates a flow of energy that forces her to play the masculine role and him the feminine. The result is a short circuit in their relationship. When there is less then 9 Nakshatras separating them this manifests at its worse',
				pts: pts,
				rem: html
			};
			this.oLove.push(love);
			akpts += pts;
			pts = 0;
			res = (this.shareService.getLANG() == 'en') ? 'Not Good': (this.shareService.getLANG() == 'te') ? 'మంచిది కాదు' : 'अच्छा नही';
			if(bS.nadikuta != partnerbS.nadikuta) {
			   pts = 8;
			   res = (this.shareService.getLANG() == 'en') ? 'Good': (this.shareService.getLANG() == 'te') ? 'మంచిి' : 'अच्छा है';
			}
			
			akpts += pts;
			let g1: Love = {
				name:'Excess/Nadi Koota',
				desc: '',
			    pts: pts,
				rem: res
			}
			
			this.oKota['Excess/Nadi Koota'] = g1;
			kpts.push(pts);
			//this.nadi = pts + ' points ' + res;
			
			//this.nadi = pts + ' points ' + res;
			pts = 0;
			res = '';
			console.log('Bha Kuta');
			//this.add2ColRow('Excess / Nadi Kuta', pts + ' points ' + res );
			//console.log(this.birthSign);
			var ssgn = this.signs_short_v[this.birthSign.toLowerCase()];
			console.log(ssgn);
			var num1 = this.rashis_v[ssgn].split('|')[0];
			var rashiNum = Number(num1);
			console.log(rashiNum);
			console.log(this.partnerBirthSign);
			ssgn = this.signs_short_v[this.partnerBirthSign.toLowerCase()];
			num1 = this.rashis_v[ssgn].split('|')[0];
			var partnerRashiNum = Number(num1);
			console.log(partnerRashiNum);
			var iscomp = 1;
			var s1 = (rashiNum + 2) > 12 ? (rashiNum + 2) - 12: rashiNum + 2;
			var s2 = (partnerRashiNum + 2) > 12 ? (partnerRashiNum + 2) - 12 : partnerRashiNum + 2;
			var s3 = (rashiNum + 3) > 12 ? (rashiNum + 3) - 12 : rashiNum + 3;
			var s4 = (partnerRashiNum + 3) > 12 ? (partnerRashiNum + 3) - 12 : partnerRashiNum + 3;
			var s5 = (rashiNum + 6) > 12 ? (rashiNum + 6) - 12 : rashiNum + 6;
			var s6 = (partnerRashiNum + 6) > 12 ? (partnerRashiNum + 6) - 12 : partnerRashiNum + 6;
			var s7 = (rashiNum + 9) > 12 ? (rashiNum + 9) - 12: rashiNum + 9;
			var s8 = (partnerRashiNum + 9) > 12 ? (partnerRashiNum + 9) - 12 : partnerRashiNum + 9;
			var s9 = (rashiNum + 10) > 12 ? (rashiNum + 10) - 12 : rashiNum + 10;
			var s10 = (partnerRashiNum + 10) > 12 ? (partnerRashiNum + 10) - 12 : partnerRashiNum + 10;
			if( s1 == partnerRashiNum || s2 == rashiNum) iscomp = 1;
			else if( s3 == partnerRashiNum || s4 == rashiNum) iscomp = 1;
			else if( s5 == partnerRashiNum || s6 == rashiNum) iscomp = 1;
			else if( s7 == partnerRashiNum || s8 == rashiNum) iscomp = 1;
			else if( s9 == partnerRashiNum || s10 == rashiNum) iscomp = 1;
			
			var s11 = (rashiNum + 1) > 12 ? (rashiNum + 1) - 12 : rashiNum + 1;
			var s12 = (partnerRashiNum + 1) > 12 ? (partnerRashiNum + 1) - 12 : partnerRashiNum + 1;
			var s13 = (rashiNum + 4) > 12 ? (rashiNum + 4) - 12: rashiNum + 4;
			var s14 = (partnerRashiNum + 4) > 12 ? (partnerRashiNum + 4) - 12: partnerRashiNum + 4;
			var s15 = (rashiNum + 5) > 12 ? (rashiNum + 5) - 12 : rashiNum + 5;
			var s16 = (partnerRashiNum + 5) > 12 ? (partnerRashiNum + 5) - 12: partnerRashiNum + 5;
			var s17 = (rashiNum + 7) > 12 ? (rashiNum + 7) - 12 : rashiNum + 7;
			var s18 = (partnerRashiNum + 7) > 12 ? (partnerRashiNum + 7) - 12: partnerRashiNum + 7;
			var s19 = (rashiNum + 8) > 12 ? (rashiNum + 8) - 12 : rashiNum + 8;
			var s20 = (partnerRashiNum + 8) > 12 ? (partnerRashiNum + 8) - 12 : partnerRashiNum + 8;
			var s21 = (rashiNum + 11) > 12 ? (rashiNum + 11) - 12: rashiNum + 11;
			var s22 = (partnerRashiNum + 11) > 12 ? 12 - (partnerRashiNum + 11) : partnerRashiNum + 11;
			var rem = '';
			if( s11 == partnerRashiNum || s12 == rashiNum) {
			  iscomp = 0;
			  if(this.shareService.getLANG() == 'en') {
				rem = 'His or Her birth sign is at the 2nd position from each other which is not good.'
			  }else if(this.shareService.getLANG() == 'te') {
				rem = 'వధువు లేదా వరుని జన్మ రశి వధువు లేదా వరుని జన్మ రశి నుంచి  2 house లో ఉంది ఇది ప్రతికూలమైనది.'
			  } else if(this.shareService.getLANG() == 'hi') {
				rem = 'वधू या वर जन्म राशि वधू या वर जन्म राशि  से  2 house में है जो प्रतिकूल है.'
			  }
			}
			else if( s13 == partnerRashiNum || s14 == rashiNum){
 			  iscomp = 0;
			  if(this.shareService.getLANG() == 'en') {
				rem = 'His or Her birth sign is at the 5th position from each other which is not good.'
			  }else if(this.shareService.getLANG() == 'te') {
				rem = 'వధువు లేదా వరుని జన్మ రశి వధువు లేదా వరుని జన్మ రశి నుంచి  5 house లో ఉంది ఇది ప్రతికూలమైనది.'
			  } else if(this.shareService.getLANG() == 'hi') {
				rem = 'वधू या वर जन्म राशि वधू या वर जन्म राशि  से  5 house में है जो प्रतिकूल है.'
			  }
			}
			else if( s15 == partnerRashiNum || s16 == rashiNum){
			  iscomp = 0;
			  if(this.shareService.getLANG() == 'en') {
				rem = 'His or Her birth sign is at the 6th position from each other which is not good.'
			  }else if(this.shareService.getLANG() == 'te') {
				rem = 'వధువు లేదా వరుని జన్మ రశి వధువు లేదా వరుని జన్మ రశి నుంచి  6 house లో ఉంది ఇది ప్రతికూలమైనది.'
			  } else if(this.shareService.getLANG() == 'hi') {
				rem = 'वधू या वर जन्म राशि वधू या वर जन्म राशि  से  6 house में है जो प्रतिकूल है.'
			  }
			}
			else if( s17 == partnerRashiNum || s18 == rashiNum){
    		  iscomp = 0;
			  if(this.shareService.getLANG() == 'en') {
				rem = 'His or Her birth sign is at the 8th position from each other which is not good.'
			  }else if(this.shareService.getLANG() == 'te') {
				rem = 'వధువు లేదా వరుని జన్మ రశి వధువు లేదా వరుని జన్మ రశి నుంచి  8 house లో ఉంది ఇది ప్రతికూలమైనది.'
			  } else if(this.shareService.getLANG() == 'hi') {
				rem = 'वधू या वर जन्म राशि वधू या वर जन्म राशि  से  8 house में है जो प्रतिकूल है.'
			  }
		    }
			else if( s19 == partnerRashiNum || s20 == rashiNum) {
			  iscomp = 0;
			  if(this.shareService.getLANG() == 'en') {
				rem = 'His or Her birth sign is at the 9th position from each other which is not good.'
			  }else if(this.shareService.getLANG() == 'te') {
				rem = 'వధువు లేదా వరుని జన్మ రశి వధువు లేదా వరుని జన్మ రశి నుంచి  9 house లో ఉంది ఇది ప్రతికూలమైనది.'
			  } else if(this.shareService.getLANG() == 'hi') {
				rem = 'वधू या वर जन्म राशि वधू या वर जन्म राशि  से  9 house में है जो प्रतिकूल है.'
			  }
			}
			else if( s21 == partnerRashiNum || s22 == rashiNum) {
			  iscomp = 0;
			  if(this.shareService.getLANG() == 'en') {
				rem = 'His or Her birth sign is at the 12th position from each other which is not good.'
			  }else if(this.shareService.getLANG() == 'te') {
				rem = 'వధువు లేదా వరుని జన్మ రశి వధువు లేదా వరుని జన్మ రశి నుంచి  12 house లో ఉంది ఇది ప్రతికూలమైనది.'
			  } else if(this.shareService.getLANG() == 'hi') {
				rem = 'वधू या वर जन्म राशि वधू या वर जन्म राशि  से  12 house में है जो प्रतिकूल है.'
			  }
			}
			if(iscomp == 1) {
			  pts = 7; 
			  rem = (this.shareService.getLANG() == 'en') ? 'Good': (this.shareService.getLANG() == 'te') ? 'మంచిి' : 'अच्छा है';
			} else {
			  pts = 0;
			}
			akpts += pts;
			
			//this.add2ColRow('Constructivism / Bha Kuta', pts + ' points ' + rem );
			//this.bha = pts + ' points ' + rem;
			love.name = 'Constructivism/BhaKoota';
			love.desc = '';
			love.pts = pts;
			love.rem = rem;
			let g2: Love = {
				name:'Constructivism/BhaKoota',
				desc: '',
			    pts: pts,
				rem: res
			}
			this.oKota['Constructivism/BhaKoota'] = g2;
			kpts.push(pts);
		
			pts = 0;
			rem = 'Bad';
			if(bS.ganakuta == partnerbS.ganakuta) {
			    pts = 6;
				rem = (this.shareService.getLANG() == 'en') ? 'Good': (this.shareService.getLANG() == 'te') ? 'మంచిి' : 'अच्छा है';
			} else if(partnerbS.gnakuta == 'divine' && bS.ganakuta == 'human'){
			   pts = 3;
			   rem = (this.shareService.getLANG() == 'en') ? 'Average': (this.shareService.getLANG() == 'te') ? 'అవేరేజ్' : 'मध्यम';
			} else if(partnerbS.ganakuta == 'divine' && bS.ganakuta == 'daemon') {
			   pts = 1;
			   rem = (this.shareService.getLANG() == 'en') ? 'Below Average': (this.shareService.getLANG() == 'te') ? 'సగటు కన్నా తక్కువ' : 'औसत से कम';
			} else if(partnerbS.ganakuta == 'human' && bS.ganakuta == 'divine') {
			   pts = 5;
			   rem = 'OK';
			} else if (partnerbS.gnakuta == 'human' && bS.ganakuta == 'daemon') {
			   pts = 3;
			   rem = (this.shareService.getLANG() == 'en') ? 'Average': (this.shareService.getLANG() == 'te') ? 'అవేరేజ్' : 'मध्यम';
			} else if(partnerbS.ganakuta == 'daemon' && bS.ganakuta != 'daemon') {
			   pts = 0;
			   rem = (this.shareService.getLANG() == 'en') ? 'Bad': (this.shareService.getLANG() == 'te') ? 'మంచిది కాదు' : 'बुरा';
			}
			rem += ' According to the classical texts, Gana Kuta keeps the couple ever young, happy and increasing in love for one another';
			akpts += pts;
			//this.gana = pts + ' points ' + rem;
			let g3: Love = {
				name:'Temperment/GanaKoota',
				desc: '',
			    pts: pts,
				rem: res
			}
			this.oKota['Temperment/GanaKoota'] = g3;
			kpts.push(pts);
			//this.add2ColRow('Temperment / Gana Kuta', pts + ' points ' + rem );
			pts = 0;
			rem = '';
			if( s5 == partnerRashiNum || s6 == rashiNum) {
			  pts = 5;
			  rem = 'Good';
 			  //this.add2ColRow('Friendship / Graha mitram Kuta', pts + ' points ' + rem );
			}
			else {
				var sign1 = this.signs_short_v[this.birthSign.toLowerCase()];
				console.log(sign1);
				var f1 = this.friend_pl_v[this.rashi_lords_v[sign1]].split('\|');  
				console.log(f1);
				var sign2 = this.signs_short_v[this.partnerBirthSign.toLowerCase()];
				console.log(sign2);
				var f2 = this.friend_pl_v[this.rashi_lords_v[sign2]].split('\|'); 
				console.log(f2);
				var n1 = this.neutral_pl_v[this.rashi_lords_v[sign1]].split('\|');
				console.log(n1);
				var n2 = this.neutral_pl_v[this.rashi_lords_v[sign2]].split('\|');
				console.log(n2);
				var e1 = this.enemy_pl_v[this.rashi_lords_v[sign1]].split('\|');
				console.log(e1);
				var e2 = this.enemy_pl_v[this.rashi_lords_v[sign2]].split('\|');
				console.log(e2);
				var bsf = 0;
				var pbsf = 0;
				var bsn = 0;
				var pbsn = 0;
				var bse = 0;
				var pbse = 0;
				for(var x = 0; x < f1.length; x++)
				{
					if(this.rashi_lords_v[sign2] == this.ruler_name_v[f1[x]]) {
					  bsf = 1;
					  break;
					}
				}
				if(n1.length == 0)
				{
				   if(this.rashi_lords_v[sign2] == n1) {
					 bsn = 1;
				   }
				} else {
				  for(var k=0; k < n1.length; k++) {
					if(this.rashi_lords_v[sign2] == n1[k]) {
					  bsn = 1;
					  break;
					}
				  }
				}
				if(n2.length == 0)
				{
				   if(this.rashi_lords_v[sign1] == n2) {
					 pbsn = 1;
				   }
				} else {
				  for(var k1=0; k1 < n2.length; k1++) {
					if(this.rashi_lords_v[sign1] == n2[k1]) {
					  pbsn = 1;
					  break;
					}
				  }
				}
				if(e1.length == 0)
				{
				   if(this.rashi_lords_v[sign2] == e1) {
					 bse = 1;
				   }
				} else {
				  for(var y=0; y < n1.length; y++) {
					if(this.rashi_lords_v[sign2] == e1[y]) {
					  bse = 1;
					  break;
					}
				  }
				}
				if(e2.length == 0)
				{
				   if(this.rashi_lords_v[sign2] == e2) {
					 pbse = 1;
				   }
				} else {
				  for(var k2=0; k2 < e2.length; k2++) {
					if(this.rashi_lords_v[sign2] == e2[k2]) {
					  pbse = 1;
					  break;
					}
				  }
				}
				
				for(var j = 0; j < f2.length; j++)
				{
					if(this.rashi_lords_v[sign1] == this.ruler_name_v[f2[j]]) {
					  pbsf = 1;
					  break;
					}
				}
				if(this.rashi_lords_v[sign1] == this.rashi_lords_v[sign2]) {
				  pts = 5;
				  rem = (this.shareService.getLANG() == 'en') ? 'Good': (this.shareService.getLANG() == 'te') ?  'మంచిి' : 'अच्छा है';
				} else if (bsf == 1 && pbsf == 1) {
				  pts = 5;
				  rem = (this.shareService.getLANG() == 'en') ? 'Good': (this.shareService.getLANG() == 'te') ?  'మంచిి' : 'अच्छा है';
				} else if((bsf == 1 && pbsn == 1) || (bsn == 1 && pbsf == 1)) {
				  pts = 4;
				  rem = 'OK';
				} else if(bsn == 1 && pbsn == 1) {
				  pts = 3;
			      rem = (this.shareService.getLANG() == 'en') ? 'Average': (this.shareService.getLANG() == 'te') ? 'అవేరేజ్' : 'मध्यम';
				} else if((bse == 1 && pbsf == 1) || (pbse == 1 && bsf == 1)) {
				  pts = 1;
			      rem = (this.shareService.getLANG() == 'en') ? 'Below Average': (this.shareService.getLANG() == 'te') ? 'సగటు కన్నా తక్కువ' : 'औसत से कम';
				} else if((bse == 1 && pbsn == 1) || (pbse == 1 && bsn == 1)) {
				  pts = 0.5;
			      rem = (this.shareService.getLANG() == 'en') ? 'Below Average': (this.shareService.getLANG() == 'te') ? 'సగటు కన్నా తక్కువ' : 'औसत से कम';
				} else if(bse == 1 && pbse == 1) {
				  pts = 0;
			      rem = (this.shareService.getLANG() == 'en') ? 'Not Good': (this.shareService.getLANG() == 'te') ? 'మంచిది కాదు' : 'अच्छा नही';
				}
				//this.add2ColRow('Friendship / Graha mitram Kuta', pts + ' points ' + rem );
			}
			akpts += pts;
			this.grha = pts + ' points ' + rem;
			let g4: Love = {
				name:'Friendship/Grahamitram Koota',
				desc: '',
			    pts: pts,
				rem: res
			}
			this.oKota['Friendship/Grahamitram Koota'] = g4;
			kpts.push(pts);
			
			pts = 0;
			rem = '';
			console.log('bS', bS);
			console.log('partnerbS', partnerbS);
			if(bS.rulingAnimal == partnerbS.rulingAnimal) {
			   pts = 4;
			   rem = 'Good';
			   //this.add2ColRow('Instrinctive Compatibility/  Yoni Kuta', pts + ' points ' + rem);
			} else {
			  var bsfanm = bS.friendlyAnimals.split(',');
			  if(bsfanm.length > 0) {
			    for(var v = 0; v < bsfanm.length; v++) {
				  if(partnerbS.rulingAnimal == bsfanm[v]) {
				    pts = 3;
					rem = 'OK';
					break;
				  }
				}
			  }
			  var pbsfanm = partnerbS.friendlyAnimals.split(',');
			  if(pbsfanm.length > 0) {
			    for(var v1 = 0; v1 < pbsfanm.length; v1++) {
				  if(bS.rulingAnimal == pbsfanm[v1]) {
				    pts = 3;
					rem = 'OK';
					break;
				  }
				}
			  }
			  if(pts == 0) {
				  var bsnanm = bS.neutralAnimals.split(',');
				  if(bsnanm.length > 0) {
					for(var k3 = 0; k3 < bsnanm.length; k3++) {
					  if(partnerbS.rulingAnimal == bsnanm[k3]) {
						pts = 2;
						rem = (this.shareService.getLANG() == 'en') ? 'Average': (this.shareService.getLANG() == 'te') ? 'అవేరేజ్' : 'मध्यम';
						break;
					  }
					}
				  }
				  var pbsnanm = partnerbS.neutralAnimals.split(',');
				  if(pbsnanm.length > 0) {
					for(var k4 = 0; k4 < pbsnanm.length; k4++) {
					  if(bS.rulingAnimal == pbsnanm[k4]) {
						pts = 2;
						rem = (this.shareService.getLANG() == 'en') ? 'Average': (this.shareService.getLANG() == 'te') ? 'అవేరేజ్' : 'मध्यम';
						break;
					  }
					}
				  }
			  }
			  if(pts == 0) {
				  var bsunfanm = bS.unfriendlyAnimals.split(',');
				  if(bsunfanm.length > 0) {
					for(var k5 = 0; k5 < bsunfanm.length; k5++) {
					  if(partnerbS.rulingAnimal == bsunfanm[k5]) {
						pts = 1;
						rem = (this.shareService.getLANG() == 'en') ? 'Below Average': (this.shareService.getLANG() == 'te') ? 'సగటు కన్నా తక్కువ' : 'औसत से कम';
						break;
					  }
					}
				  }
				  var pbsunfanm = partnerbS.unfriendlyAnimals.split(',');
				  if(pbsunfanm.length > 0) {
					for(var k6 = 0; k6 < pbsunfanm.length; k6++) {
					  if(bS.rulingAnimal == pbsunfanm[k6]) {
						pts = 1;
						rem = (this.shareService.getLANG() == 'en') ? 'Below Average': (this.shareService.getLANG() == 'te') ? 'సగటు కన్నా తక్కువ' : 'औसत से कम';
						break;
					  }
					}
				  }
			  }
			  //this.add2ColRow('Instrinctive Compatibility/  Yoni Kuta', pts + ' points ' + rem);
			  
			}
			akpts += pts;
			rem += 'The technique used to determine the instinctive compatibility is known as Yoni Kuta. Yoni means, source,and refers to the sexual organ from which we are created. The Nakshatra of the Moon is related to an animal, which symbolizes the primal/instinctive nature of a person';
			this.yoni = pts + ' points ' + rem;
			let g5: Love = {
				name:'Instrinctive Compatibility/Yoni Kuta',
				desc: '',
			    pts: pts,
				rem: res
			}
			this.oKota['Instrinctive Compatibility/Yoni Kuta'] = g5;
			kpts.push(pts);
			pts = 0;
			rem = '';
			var cnt = 1;
			console.log('confort');
			while(cnt <= 27)
			{
			  var nakk;
			  (bS.order + cnt > 27) ? nakk = this.nakshatra_o_v[bS.order + cnt - 27]: nakk = this.nakshatra_o_v[bS.order+cnt]
			  if(nakk == partnerbS.name) break;
			  cnt++;
			  
			}
			var cf = cnt%9;
			if(cf == 0 || cf == 1 || cf == 2 || cf == 4 || cf == 6 || cf == 8) {
				pts = 3;
			    rem = (this.shareService.getLANG() == 'en') ? 'Good': (this.shareService.getLANG() == 'te') ? 'మంచి' : 'अच्छा';
			}
			rem += '  is said to grant luck and long life. When Tara Kuta is met the mans Nakshatra falls in an auspicious Nakshatra in respect to the womans, thereby insuring that the woman is feels comfortable and good with receiving any good that the male has to offer'
		   //this.add2ColRow('Comfort/  Tara Kuta', pts + ' points ' + rem );
		   akpts += pts;
		   this.tara = pts + ' points ' + rem;
			let g6: Love = {
				name:'Comfort/Tara Kuta',
				desc: '',
			    pts: pts,
				rem: res
			}
			this.oKota['Comfort/Tara Kuta'] = g6;
			kpts.push(pts);
		   pts = 0;
		   rem = '';
		   //var bSDeg = parseFloat(this.birthSignDeg);
		   //var pbSDeg = parseFloat(this.partnerBirthSignDeg);
		   
		   var manv = this.vasya_v[this.birthSign.toLowerCase()];
		   var womenv = this.vasya_v[this.partnerBirthSign.toLowerCase()];
		   
		   var mvs = manv.split('|');
		   var wvs = womenv.split('|');
		   for(var vs1 = 0; vs1 < mvs.length; vs1++)
		   {
		     for(var vs2 = 0; vs2 < wvs.length; vs2++)
			 {
			    if(mvs[vs1] == wvs[vs2]) {
				  pts = 2;
			      rem = (this.shareService.getLANG() == 'en') ? 'Good': (this.shareService.getLANG() == 'te') ? 'మంచి' : 'अच्छा';
				} else{
				   pts = this.calcVasya(mvs[vs1], wvs[vs2]);
				   if(pts == 1) rem = 'OK';
				   else if(pts != 0) rem = (this.shareService.getLANG() == 'en') ? 'Average': (this.shareService.getLANG() == 'te') ? 'అవేరేజ్' : 'मध्यम';
				}
				if(pts > 0) break;
			 }
			 if(pts > 0) break;
		   }
		   //this.add2ColRow('Innate Giving / Vasya Kuta', pts + ' points ' + rem );
		   akpts += pts;
		   this.vsya = pts + ' points ' + rem;
			let g7: Love = {
				name:'Innate Giving/Vasya Kuta',
				desc: '',
			    pts: pts,
				rem: res
			}
			this.oKota['Innate Giving/Vasya Kuta'] = g7;
			kpts.push(pts);
		   
		   pts = 0;
		   rem = '';
		   var mvarna = '';
		   var wvarna = ''
		   if(this.birthSign.toLowerCase() == 'cancer' || this.birthSign.toLowerCase() == 'scorpio' || this.birthSign.toLowerCase() == 'pisces') mvarna = 'priests';
		   else if(this.birthSign.toLowerCase() == 'aries' || this.birthSign.toLowerCase() == 'leo' || this.birthSign.toLowerCase() == 'sagittarius') mvarna = 'warriors';
		   else if(this.birthSign.toLowerCase() == 'libra' || this.birthSign.toLowerCase() == 'aquarius' || this.birthSign.toLowerCase() == 'gemini') mvarna = 'merchants';
		   else mvarna = 'labourers';
		   if(this.partnerBirthSign.toLowerCase() == 'cancer' || this.partnerBirthSign.toLowerCase() == 'scorpio' || this.partnerBirthSign.toLowerCase() == 'pisces') wvarna = 'priests';
		   else if(this.partnerBirthSign.toLowerCase() == 'cancer' || this.partnerBirthSign.toLowerCase() == 'scorpio' || this.partnerBirthSign.toLowerCase() == 'pisces') wvarna = 'warriors';
		   else if(this.partnerBirthSign.toLowerCase() == 'cancer' || this.partnerBirthSign.toLowerCase() == 'scorpio' || this.partnerBirthSign.toLowerCase() == 'pisces') wvarna = 'merchants';
		   else wvarna = 'labourers';
		   
		   if(mvarna == wvarna) {
		     pts = 1;
			 rem = 'OK';
		   } else if(mvarna != 'labourers' && (wvarna == 'warriors' || wvarna == 'merchants')) {
		     pts = 1;
			 rem = 'OK';
		   }
		   //this.add2ColRow('Mutation / Varna Kuta', pts + ' points ' + rem);
		   akpts += pts;
		   this.vrna = pts + ' points ' + rem;
		   if(akpts > 19) rem = 'Good';
		   else if(akpts > 15 && akpts < 20) rem = 'OK';
		   else {
			rem = (this.shareService.getLANG() == 'en') ? 'Bad, need expert consultation' : (this.shareService.getLANG() == 'te') ? 'చెడు, నిపుణుల సంప్రదింపులు అవసరం' : 'बुरा, विशेषज्ञ परामर्श की आवश्यकता है';
		   }
			let g8: Love = {
				name:'Mutation/Varna Kuta',
				desc: '',
			    pts: pts,
				rem: res
			}
			this.oKota['Mutation/Varna Kuta'] = g8;
			kpts.push(pts);
			let tg: Love = {
				name:'TOTAL GUNAS',
				desc: '',
			    pts: akpts,
				rem: res
			}
			this.oKota['TOTAL GUNAS'] = tg;
		   
		   this.totl = akpts + ' points ' + rem;
		   
		   cnt = 1;
			while(cnt <= 27)
			{
			  var nak2;
			  (partnerbS.order + cnt > 27) ? nak2 = this.nakshatra_o_v[partnerbS.order + cnt - 27]: nak2 = this.nakshatra_o_v[partnerbS.order+cnt]
			  if(nak2 == bS.name) break;
			  cnt++;
			}
			if(cnt == 4 || cnt == 7 || cnt == 10 || cnt == 13 || cnt == 16 || cnt == 19 || cnt ==  22 || cnt == 25)
			{
			  rem = (this.shareService.getLANG() == 'en') ? 'exists' : (this.shareService.getLANG() == 'te') ? 'ఉంది' : 'मौजूद है'
			  bmah = true;
			}
			else
			{
			  rem = (this.shareService.getLANG() == 'en') ? 'not exists' : (this.shareService.getLANG() == 'te') ? 'లేదు' : 'मौजूद नहीं है'
			  bmah = false;
			}
			
			html = 'Innate Sense of Purpose / Mahendra\n';
			html += rem + '\n';
			html += 'According to classical texts Mahendra indicates longevity and well being; and grants children, grandchildren and prosperity. Mahendra indicates a special affinity and friendship that provides for a sense of meaning and purpose throughout life. If Mahendra is present, and if the rest of the compatibility is solid, even if the couple gets together for the worst of reasons, or immaturely, they will have a great chance of feeling like they should still be together years down the road. If Mahendra is not present the couple should make sure they know the reasons for getting together and that they will be lasting or, years later, they may likely find that they dont have that much reason to be together.';	
			//this.add1ColRow(html);
			this.dos.mah = rem;
			if(bmah) {
				this.dos.mahs = 'greenText';
				//this.mah += '<img src="assets/imgs/thumbsup.png" alt="Kundali Dosha" ></img>'
			} else {
				this.dos.mahs = 'redText';
			}
			
			html = (this.shareService.getLANG() == 'en') ? 'Obstructions / Vedha Dosh\n' : (this.shareService.getLANG() == 'te') ? 'అడ్డంకులు / వేదా దోషా' : 'अवरोधों / वेधा दोष';
			var vdh = (this.shareService.getLANG() == 'en') ? 'Obstructions/Vedh Dosha' : (this.shareService.getLANG() == 'te') ? 'వేదా దోషా' : 'वेधा दोष';
			var vext = (this.shareService.getLANG() == 'en') ? 'Exists' : (this.shareService.getLANG() == 'te') ? ' ఉంది' : ' मौजूद';
			var vnext = (this.shareService.getLANG() == 'en') ? 'Not Exists' : (this.shareService.getLANG() == 'te') ? ' లేదు' : ' मौजूद नहीं';
			rem = vnext;
			if(bS.name == 'ashwini' && partnerbS.name == 'jyestha') { rem = vext; bvedh = true; }
			else if(bS.name == 'jyestha' && partnerbS.name == 'ashwini') { rem = vext; bvedh = true; }
			else if(bS.name == 'punarvasu' && partnerbS.name == 'uttarashada') { rem = vext; bvedh = true; }
			else if(bS.name == 'uttarashada' && partnerbS.name == 'punarvasu') { rem = vext; bvedh = true; }
			else if(bS.name == 'uttaraphalguni' && partnerbS.name == 'purvabhadra') { rem = vext; bvedh = true; }
			else if(bS.name == 'purvabhadra' && partnerbS.name == 'uttaraphalguni') { rem = vext; bvedh = true; }
			else if(bS.name == 'bharani' && partnerbS.name == 'anuradha') { rem = vext; bvedh = true; }
			else if(bS.name == 'anuradha' && partnerbS.name == 'bharani') { rem = vext; bvedh = true; }
			else if(bS.name == 'pushyami' && partnerbS.name == 'purvashada') { rem = vext; bvedh = true; }
			else if(bS.name == 'purvashada' && partnerbS.name == 'pushyami') { rem = vext; bvedh = true; }
			else if(bS.name == 'hastha' && partnerbS.name == 'sathabhisha') { rem = vext; bvedh = true; }
			else if(bS.name == 'sathabhisha' && partnerbS.name == 'hastha') { rem = vext; bvedh = true; }
			else if(bS.name == 'krittika' && partnerbS.name == 'vishakha') { rem = vext; bvedh = true; }
			else if(bS.name == 'vishakha' && partnerbS.name == 'krittika') { rem = vext; bvedh = true; }
			else if(bS.name == 'ashlesha' && partnerbS.name == 'moola') { rem = vext; bvedh = true; }
			else if(bS.name == 'moola' && partnerbS.name == 'ashlesha') { rem = vext; bvedh = true; }
			else if(bS.name == 'rohini' && partnerbS.name == 'swati') { rem = vext; bvedh = true; }
			else if(bS.name == 'swati' && partnerbS.name == 'rohini') { rem = vext; bvedh = true; }
			else if(bS.name == 'magha' && partnerbS.name == 'revati') { rem = vext; bvedh = true; }
			else if(bS.name == 'revati' && partnerbS.name == 'magha') { rem = vext; bvedh = true; }
			else if(bS.name == 'ardra' && partnerbS.name == 'saravana') { rem = vext; bvedh = true; }
			else if(bS.name == 'saravana' && partnerbS.name == 'ardra') { rem = vext; bvedh = true; }
			else if(bS.name == 'purvaphalguni' && partnerbS.name == 'uttarabhadra') { rem = vext; bvedh = true; }
			else if(bS.name == 'uttarabhadra' && partnerbS.name == 'purvaphalguni') { rem = vext; bvedh = true; }
			else if(bS.name == 'mrigashira' && (partnerbS.name == 'chitra' || partnerbS.name == 'danista')) { rem = vext; bvedh = true; }
			else if((bS.name == 'chitra' || bS.name == 'danista') && partnerbS.name == 'chitra') { rem = vext; bvedh = true; }
			//html += rem + '\n';
			//html += 'Vedha is one of the two Maha Doshas, Great Blemishes, that can affect a relationship';
			//this.add1ColRow(html);
			this.dos.vedh = rem;
			this.dos.vedhs = (bvedh ==  true) ? 'redText' : 'greenText';
			//html = 'Misfortune / Rajju Dosha\n';
			var rju = (this.shareService.getLANG() == 'en') ? 'Misfortune/Rajju Dosha' : (this.shareService.getLANG() == 'te') ? 'రజ్జు దోషా' : 'रज्जु दोष';
			var rext = (this.shareService.getLANG() == 'en') ? ' Exists' : (this.shareService.getLANG() == 'te') ? ' ఉంది' : ' मौजूद';
			var rnext = (this.shareService.getLANG() == 'en') ? ' Not Exists' : (this.shareService.getLANG() == 'te') ? ' లేదు' : ' मौजूद नहीं';
			rem = rnext;
			//rem = 'Rajju Dosha Does Not Exist';
			if(bS.rajju == partnerbS.rajju)
			{
				brju = true;
				rem = rext;//'Rajju Dosha Exist';
				this.dos.rajus = 'redText';
			} else {
				this.dos.rajus = 'greenText';
			}
			//html += rem + '\n';
			//html += 'According to the ancient texts, the following are the results of the Moons falling in Nakshatras that are of the same body part\nIf they //both fall in the feet there will always be wandering. If the both fall in the hip there will be poverty.\nIf they both fall in the navel there //will be loss of children.<br/>If they both fall in the neck the wife will die.<br/>If they both fall in the head the husband will die.\nTHESE //RESULTS ARE MEANT TO BE TAKEN SYMBOLICALLY AND NOT LITERALLY';
			//this.add1ColRow(html);
			this.dos.raju = rem;
			//if(brju) this.raju += '<img src="assets/imgs/lovewarn.png" alt="Kundali Dosha" ></img>';
			//html = 'Magnetic Attraction / Vasya\n';
			var vsy = (this.shareService.getLANG() == 'en') ? '<strong>Magnetic Attraction/Vasya</strong>' : (this.shareService.getLANG() == 'te') ? '<strong>వాస్య గుణ</strong>' : '<strong>वश्य गुण</strong>';
			var vext = (this.shareService.getLANG() == 'en') ? ' Exists' : (this.shareService.getLANG() == 'te') ? ' ఉంది' : ' मौजूद';
			var vnext = (this.shareService.getLANG() == 'en') ? ' Not Exists' : (this.shareService.getLANG() == 'te') ? ' లేదు' : ' मौजूद नहीं';
			rem = vnext;
			let bvsy: Boolean = false;
			//rem = 'Magnetic Attraction Does Not Exist';
		    if(this.birthSign.toLowerCase() == 'aries' && (this.partnerBirthSign.toLowerCase() == 'leo' || this.partnerBirthSign.toLowerCase() == 'scorpio')){ rem = vext; bvsy = true; }
		    else if(this.birthSign.toLowerCase() == 'taurus' && (this.partnerBirthSign.toLowerCase() == 'cancer' || this.partnerBirthSign.toLowerCase() == 'libra')){ rem = vext; bvsy = true; }
		    else if(this.birthSign.toLowerCase() == 'gemini' && this.partnerBirthSign.toLowerCase() == 'virgo'){ rem = vext; ; bvsy = true; }
		    else if(this.birthSign.toLowerCase() == 'cancer' && (this.partnerBirthSign.toLowerCase() == 'scorpio' || this.partnerBirthSign.toLowerCase() == 'sagittarius')){ rem = vext; bvsy = true; }
		    else if(this.birthSign.toLowerCase() == 'leo' && this.partnerBirthSign.toLowerCase() == 'libra'){ rem = vext; ; bvsy = true; }
		    else if(this.birthSign.toLowerCase() == 'virgo' && (this.partnerBirthSign.toLowerCase() == 'gemini' || this.partnerBirthSign.toLowerCase() == 'pisces')){ rem = vext; bvsy = true; }
		    else if(this.birthSign.toLowerCase() == 'libra' && (this.partnerBirthSign.toLowerCase() == 'capricorn' || this.partnerBirthSign.toLowerCase() == 'virgo')){ rem = vext; bvsy = true; }
		    else if(this.birthSign.toLowerCase() == 'scorpio' && this.partnerBirthSign.toLowerCase() == 'cancer'){ rem = vext; bvsy = true; }
		    else if(this.birthSign.toLowerCase() == 'sagittarius' && this.partnerBirthSign.toLowerCase() == 'pisces'){ rem = vext; bvsy = true; }
		    else if(this.birthSign.toLowerCase() == 'capricorn' && this.partnerBirthSign.toLowerCase() == 'aquarius'){ rem = vext; bvsy = true; }
		    else if(this.birthSign.toLowerCase() == 'aquarius' && this.partnerBirthSign.toLowerCase() == 'aries'){ rem = vext; bvsy = true; }
		    else if(this.birthSign.toLowerCase() == 'pisces' && this.partnerBirthSign.toLowerCase() == 'capricorn'){ rem = vext; bvsy = true; }
		    else if(this.birthSign.toLowerCase() == 'leo' && this.partnerBirthSign.toLowerCase() == 'libra'){ rem = vext; bvsy = true; }
			//html += rem + '\n';
			this.dos.attr = rem;
			
			this.dos.attrs = (bvsy == true) ? 'greenText' : 'redText';//'<img src="assets/imgs/thumbsup.png" alt="Gun Milan, Marriage Compatibility" ></img>';
			//else this.attrs = 'redText';//'<img src="assets/imgs/lovewarn.png" alt="Gun Milan, Marriage Compatibility" ></img>';
			//html += 'This magnetic attraction or draw can cause the person who is drawn to the other to do almost anything for the relationship';
			//this.add1ColRow(html);
			//this.showList = false;
			break;
		}
    }
	kpts.push(36-akpts);
	this.plChart = new Chart(this.cnvCC.nativeElement, {
			  type: "pie",
			  data: {
				labels: lbls,
				datasets: [
				  {
					label: "Asta Kuta Points",
					data: kpts,
					backgroundColor: bkclr,
					hoverBackgroundColor: bdclr
				  }
				]
			  },
			});
	html = '<h4 class="font-weight-bold text-secondary">Total ' + akpts.toString() + ' Gunas are matched out of 36 Gunas for this Kundali.';
	if(akpts > 24 && akpts < 33) {
		 html += '<span class="text-success">Which is a GOOD match </span>' ;
		if(brju || bvedh) {
			html += ' But where as ';
			if(brju) html += '<span class="badge badge-warning">Rajju Dosha</span> ';
			if(bvedh) {
				if(brju) html += ' &'; 
				 html += '<span class="badge badge-warning">Vedh Dosha</span>';
			}
			html += '<span class="text-warning"> exists which needs astrological guidance & remidies. Please talk to one of our expert astrologers</span>';
		} 
	} else if(akpts > 32) {
		html += '<span class="text-success">Which is a VERY GOOD match, consider to be best on earth.</span> ';
		if(brju || bvedh) {
			html += ' But where as ';
			if(brju) html += '<span class="badge badge-warning">Rajju Dosha</span> ';
			if(bvedh) {
				if(brju) html += ' &'; 
				 html += '<span class="badge badge-warning">Vedh Dosha</span>';
			}
			html += '<span class="text-warning"> exists which needs astrological guidance & remidies. Please talk to one of our expert astrologers</span>';
		}
	} else if(akpts > 17 && akpts < 24){
		html += '<span class="text-warning"> which is considered AVERAGE match</span>';
		if(bmah) html += '<span class="text-secondary"> but where as <span class="badge badge-success">Mahendra</span> (Innate sense of Purpose) is identified in the match . It is believed that regardless of any doshas if Mahendra is identified in the match then all doshas get nullified.</span>';
	} else {
		html += '<span class="text-warning">which is considered BAD match</span>';
		if(bmah) html += '<span class="text-secondary"> but where as <span class="badge badge-success">Mahendra</span> (Innate sense of Purpose) is identified in the match. It is believed that regardless of any doshas if Mahendra is identified in the match then all doshas get nullified.</span>';
	}
	html += '<h4>';
	this.frep = html;
  }
  calcVasya(v1, v2)
  {
	  var pts = 0;
	  var rem = '';
	  if(v1 == 'wild' || v2 == 'wild')
	  {
		if(v1 == 'wild' && v2 != 'insect') {
		  if(v2 == 'quad') {
			pts = 0.5;
			rem = 'Average';
		  } else {
			pts = 1;
			rem = 'OK';
		  }
		} else if(v2 == 'wild' && v1 != 'insect') {
		  if(v1 == 'quad') {
			pts = 0.5;
			rem = 'Average';
		  } else {
			pts = 1;
			rem = 'OK';
		  }				
		}
	  }
	  else if(v1 == 'human' && v2 != 'human')
	  {
		if(v2 == 'quad')
		{
		  pts = 1;
		  rem = 'OK';
		} else if(v2 == 'water') {
		  pts = 0.5;
		  rem = 'Average';
		} else {
		  pts = 1;
		  rem = 'OK';
		}
	  }
	  else if(v2 == 'human' && v2 != 'human')
	  {
		if(v2 == 'quad')
		{
		  pts = 1;
		  rem = 'OK';
		} else if(v2 == 'water') {
		  pts = 0.5;
		  rem = 'Average';
		} else {
		  pts = 1;
		  rem = 'OK';
		}
	  }
	return pts;
  }	
	translate(lord: string)
	{
	  if(this.shareService.getLANG() == 'en') return lord;
	  let trn: string = lord;
		switch(lord.toLowerCase())
		{
			case 'sun':
			case 'su':
				if(this.shareService.getLANG() == 'te') {
					trn = 'సూర్యుడు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'रवि ग्रह';
				}
				break;
			case 'moon':
			case 'mo':
				if(this.shareService.getLANG() == 'te') {
					trn = 'చంద్రుడు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'चांद ग्रह';
				}
				break;
			case 'jupiter':
			case 'ju':
				if(this.shareService.getLANG() == 'te') {
					trn = 'బృహస్పతి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'बृहस्पति';
				}
				break;
			case 'mercury':
			case 'me':
				if(this.shareService.getLANG() == 'te') {
					trn = 'బుధుడు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'बुध गृह';
				}
				break;
			case 'mars':
			case 'ma':
				if(this.shareService.getLANG() == 'te') {
					trn = 'కుజుడు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मंगल ग्रह';
				}
				break;
			case 'venus':
			case 've':
				if(this.shareService.getLANG() == 'te') {
					trn = 'శుక్రుడు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'शुक्र ग्रह';
				}
				break;
			case 'saturn':
			case 'sa':
				if(this.shareService.getLANG() == 'te') {
					trn = 'శనిగ్రహము';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'शनि ग्रह';
				}
				break;
			case 'rahu':
			case 'ra':
				if(this.shareService.getLANG() == 'te') {
					trn = 'రాహు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'राहु ग्रह';
				}
				break;
			case 'ketu':
			case 'ke':
				if(this.shareService.getLANG() == 'te') {
					trn = 'కేతు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'केतु ग्रह';
				}
				break;
			case 'aries':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మేషరాశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मेष राशि';
				}
				break;
			case 'taurus':
				if(this.shareService.getLANG() == 'te') {
					trn = 'వృషభరాశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'वृषभ राशि';
				}
				break;
			case 'gemini':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మిధునరాశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मिथुन राशि';
				}
				break;
			case 'cancer':
				if(this.shareService.getLANG() == 'te') {
					trn = 'కర్కాటకరాశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'कर्क राशि';
				}
				break;
			case 'leo':
				if(this.shareService.getLANG() == 'te') {
					trn = 'సిమ్హరాశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'सिंह राशि';
				}
				break;
			case 'virgo':
				if(this.shareService.getLANG() == 'te') {
					trn = 'కన్యరాశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'कन्या राशि';
				}
				break;
			case 'libra':
				if(this.shareService.getLANG() == 'te') {
					trn = 'తులారాసి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'तुला राशि';
				}
				break;
			case 'scorpio':
				if(this.shareService.getLANG() == 'te') {
					trn = 'వృశ్చికరాసి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'वृश्चिक राशि';
				}
				break;
			case 'saggitarius':
			case 'sagittarius':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ధనుస్సురాసి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'धनु राशि';
				}
				break;
			case 'capricorn':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మకరరాసి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मकर राशि';
				}
				break;
			case 'aquarius':
				if(this.shareService.getLANG() == 'te') {
					trn = 'కుంభరాసి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'कुंभ राशि';
				}
				break;
			case 'pisces':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మీనరాసి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मीन राशि';
				}
				break;
			case 'ashwini':
				if(this.shareService.getLANG() == 'te') {
					trn = 'అశ్వినీ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'अश्विनी';
				}
				break;
			case 'bharani':
				if(this.shareService.getLANG() == 'te') {
					trn = 'భరణి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'भरणी';
				}
				break;
			case 'krittika':
				if(this.shareService.getLANG() == 'te') {
					trn = 'కృత్తికా';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'कृत्तिका';
				}
				break;
			case 'rohini':
				if(this.shareService.getLANG() == 'te') {
					trn = 'రోహిణి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'रोहिणी';
				}
				break;
			case 'mrigashira':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మ్రిగశిర';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मृगशिरा';
				}
				break;
			case 'ardra':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ఆర్ద్ర';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'आर्द्र';
				}
				break;
			case 'ardra':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ఆర్ద్ర';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'आर्द्र';
				}
				break;
			case 'punarvasu':
				if(this.shareService.getLANG() == 'te') {
					trn = 'పునర్వసు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'पुनर्वसु';
				}
				break;
			case 'pushya':
				if(this.shareService.getLANG() == 'te') {
					trn = 'పుష్య';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'पुष्य';
				}
				break;
			case 'ashlesha':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ఆశ్లేష';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'अश्लेषा';
				}
				break;
			case 'magha':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మఘ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मघा';
				}
				break;
			case 'purvaphalguni':
				if(this.shareService.getLANG() == 'te') {
					trn = 'పూర్వఫల్గుణి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'पूर्वाफाल्गुनी';
				}
				break;
			case 'uttaraaphalguni':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ఉత్తరాఫల్గుణి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'उत्तराफाल्गुनी';
				}
				break;
			case 'hastha':
				if(this.shareService.getLANG() == 'te') {
					trn = 'హస్త';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'हस्ता';
				}
				break;
			case 'chitra':
				if(this.shareService.getLANG() == 'te') {
					trn = 'చిత్ర';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'चित्र';
				}
				break;
			case 'swati':
				if(this.shareService.getLANG() == 'te') {
					trn = 'స్వాతి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'स्वाति';
				}
				break;
			case 'vishakha':
				if(this.shareService.getLANG() == 'te') {
					trn = 'విశాఖ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'विशाखा';
				}
				break;
			case 'anuradha':
				if(this.shareService.getLANG() == 'te') {
					trn = 'అనురాధ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'अनुराधा';
				}
				break;
			case 'jyestha':
				if(this.shareService.getLANG() == 'te') {
					trn = 'జ్యేష్ఠా';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'जयस्था';
				}
				break;
			case 'mula':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మూల';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मूल';
				}
				break;
			case 'purvaashada':
				if(this.shareService.getLANG() == 'te') {
					trn = 'పూర్వాషాఢ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'पूर्वाषाढ़ा';
				}
				break;
			case 'uttaraashada':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ఉత్తరాషాఢ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'उत्तराषाढ़ा';
				}
				break;
			case 'shravana':
				if(this.shareService.getLANG() == 'te') {
					trn = 'శ్రావణ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'श्रवण';
				}
				break;
			case 'danishta':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ధనిష్ఠ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'धनिष्ठा';
				}
				break;
			case 'shatabhisha':
				if(this.shareService.getLANG() == 'te') {
					trn = 'శతభిషా';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'शतभिषा';
				}
				break;
			case 'purvabhadra':
				if(this.shareService.getLANG() == 'te') {
					trn = 'పూర్వాభాద్ర';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'पूर्वभाद्र';
				}
				break;
			case 'uttarabhadra':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ఉత్తరాభాద్ర';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'उत्तरभाद्र';
				}
				break;
			case 'revati':
				if(this.shareService.getLANG() == 'te') {
					trn = 'రేవతి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'रेवती';
				}
				break;
			case 'prathama':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ప్రథమ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'प्रथम';
				}
				break;
			case 'dwitiya':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ద్వితీయ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'द्वितीय';
				}
				break;
			case 'tritiya':
				if(this.shareService.getLANG() == 'te') {
					trn = 'తృతీయ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'तृतीया';
				}
				break;
			case 'chaturthi':
				if(this.shareService.getLANG() == 'te') {
					trn = 'చవితి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'चतुर्थी';
				}
				break;
			case 'panchami':
				if(this.shareService.getLANG() == 'te') {
					trn = 'పంచమి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'पंचमी';
				}
				break;
			case 'shashthi':
				if(this.shareService.getLANG() == 'te') {
					trn = 'షష్ఠి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'साष्टी';
				}
				break;
			case 'sapthami':
				if(this.shareService.getLANG() == 'te') {
					trn = 'సప్తమి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'सप्तमी';
				}
				break;
			case 'asthami':
				if(this.shareService.getLANG() == 'te') {
					trn = 'అష్టమి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'अष्ठमी';
				}
				break;
			case 'navami':
				if(this.shareService.getLANG() == 'te') {
					trn = 'నవమి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'रेवती';
				}
				break;
			case 'dasami':
				if(this.shareService.getLANG() == 'te') {
					trn = 'దశమి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'दशमी';
				}
				break;
			case 'ekadashi':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ఏకాదశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'एकादशी';
				}
				break;
			case 'dwadashi':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ద్వాదశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'द्वादशी';
				}
				break;
			case 'trayodashi':
				if(this.shareService.getLANG() == 'te') {
					trn = 'త్రయోదశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'त्रयोदशी';
				}
				break;
			case 'chaturdashi':
				if(this.shareService.getLANG() == 'te') {
					trn = 'చతుర్దశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'चतुर्दशी';
				}
				break;
			case 'purnima':
				if(this.shareService.getLANG() == 'te') {
					trn = 'పూర్ణిమ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'पूर्णिमा';
				}
				break;
			case 'amavasya':
				if(this.shareService.getLANG() == 'te') {
					trn = 'అమావాస్య';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'अमावस्या';
				}
				break;
			case 'janma/ danger to body':
				if(this.shareService.getLANG() == 'te') {
					trn = 'జన్మ / శరీరానికి ప్రమాదం';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'जैनमा / शरीर के लिए खतरा';
				}
				break;
			case 'sampath/ wealth and prosperity':
				if(this.shareService.getLANG() == 'te') {
					trn = 'సంపత్ / సంపద మరియు శ్రేయస్సు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'सम्पत / धन और समृद्धि';
				}
				break;
			case 'vipat/ dangers, losses, accidents':
				if(this.shareService.getLANG() == 'te') {
					trn = 'విపత్ / ప్రమాదాలు, నష్టాలు, దుర్ఘటనలు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'विपत / खतरे, नुकसान, दुर्घटनाएं';
				}
				break;
			case 'kshema/ prosperity':
				if(this.shareService.getLANG() == 'te') {
					trn = 'క్షేమ / శ్రేయస్సు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'क्षेम / समृद्धि';
				}
				break;
			case 'pratyak/ obstacles':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ప్రత్యక్ / అడ్డంకులు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'प्रत्येक / बाधाओं';
				}
				break;
			case 'sadhana/ realisation and ambitions':
				if(this.shareService.getLANG() == 'te') {
					trn = 'సాధనా / పరిపూర్ణత మరియు లక్ష్యాలు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'साधना / अहसास और महत्वाकांक्षा';
				}
				break;
			case 'naidhana/ dangers':
				if(this.shareService.getLANG() == 'te') {
					trn = 'నైదాన / ప్రమాదములు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'नायदाणा / खतरे';
				}
				break;
			case 'mitra/ good':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మిత్ర / మంచి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मित्र / अच्छा';
				}
				break;
			case 'prama mitra/ very favourable':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ప్రమా మిత్ర / చాలా అనుకూలమైన';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'प्रामा मित्रा / बहुत अनुकूल है';
				}
				break;
			default:
				trn = lord;
				break;
		}
		return trn;
	}
  showInf(tpc) {
	this.horoService.getArticle(tpc)
	.subscribe(res => {
		if(res['title'].indexOf('ERROR') == -1)
			this.router.navigate(['/article'], {state: res});
	}, (err) => {
	});
 }
 calcPap(plp) {
 }
 dosdtl(nam) {
	 let dos: any = {};
	 dos.nam = nam;
	 dos.dtl = this[nam];
//	 this.router.navigate(['/dosha-info'], {state: dos});
 }

}
