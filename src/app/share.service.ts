import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { VimDasha } from './vim-das';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
    private dsPlan = new BehaviorSubject({ uuid: '', name: '', credits: 0, dobs: '' });
	plan = this.dsPlan.asObservable();
    private dsLang = new BehaviorSubject('');
	langc = this.dsLang.asObservable();
    private dsRep = new BehaviorSubject({ uuid: '', qta: 0 });
	frep = this.dsRep.asObservable();
	private dsVevts = new BehaviorSubject(null);
	vhevt = this.dsVevts.asObservable();
	private dsGevts = new BehaviorSubject('');
	gevt = this.dsGevts.asObservable();
	
    place: string;
	dob: string;
	timezone: string;
	lat: string;
	lng: string;
	ctimezone: string;
	clat: string;
	clng: string;
	tz: string;
    plpos: any;
    yogas: any;
	preds: any;
	hpos: any;
	moonSign: string;
	birthStar: string;
	oVim :VimDasha[] = [];
	lang: string = 'en';
	rahu: boolean;
	rahus: boolean;
	rahut1: boolean;
	rahut2: boolean;
	rahut3: boolean;
	sunrise: boolean;
	sunset: boolean;
	yogad: boolean = false;
	prasnas: number;
	prasdt: string;
	chtyp: string;
	aynm: string;
	kaynm: string;
	raynm: string;
	ccode: string;
	rpls: string;
	plstr: string;
    rew: boolean = false;
	reps: string;
	binf: any;
	usr: string = '';
	peerid: string = '';
	bAST: boolean = false;
	uid: string = '';
	nam: string = '';
	eml: string = '';
    constructor() {
     this.getItem('nam').then(nam => {
	    this.nam = nam as string;
     });	 
     this.getItem('eml').then(eml => {
	    this.eml = eml as string;
     });	 
     this.getItem('lang').then(lang => {
	    this.lang = lang as string;
     });	 
	}
	getEMAIL() { return this.eml; }
	
	getItem(key) {
		return new Promise((resolve, reject) => {
			try {
				const value = localStorage.getItem(key);
				
				if (value === null) {
					resolve(null);
				} else {
				  try {
					resolve(JSON.parse(value));
				   } catch (e) {
				     resolve(value);
				   }
				}
			} catch (err) {
				reject(err);
			}
		});
	}
	setItem(key, val) {
	   localStorage.setItem(key,val);
	}
	setUID(uid) { this.uid = uid; }
	getUID() { return this.uid; }
	isAST() { return this.bAST; }
	setPeerId(p) { this.peerid = p; }
	getPeerId() { return this.peerid; }
	setUSR(usr) { this.usr = usr; }
	getUSR() { return this.usr;}
	getUPRO() {
		return localStorage.getItem('UPRO');
	}
	getNAME() {
		return this.nam;
	}
	setNAME(n) { this.nam = n; localStorage.setItem('nam', n);}
	getToken() {
		return localStorage.getItem('authToken');
	}
	setToken(tok) {
		localStorage.setItem('authToken', tok);
	}    
	setMoonSign(moonSign) {
		this.moonSign = moonSign;
		// // this._storage.set('moonSign', moonSign);
	}
	setBirthStar(birthStar) {
	   this.birthStar = birthStar;
	  // // // this._storage.set('birthStar', birthStar);
	}
    setPersonDetails(place,dob) {
        this.place = place;   
        this.dob = dob;
		//// // this._storage.set('place', place);
		//// // this._storage.set('dob', dob);
	}
	setBINF(binf) {
		this.binf = binf;
	}
	setLAT(lat) {
	  this.lat = lat;
		//// this._storage.set('lat', lat);
	}
	setCLAT(lat) {
	  this.clat = lat;
	}
	setLNG(lng) {
	  this.lng = lng;
		//// this._storage.set('lng', lng);
	}
	setCLNG(lng) {
	  this.clng = lng;
	}	
	setTimezone(timezone) {
	  this.timezone = timezone;
	  //// this._storage.set('timezone', timezone);
	}
	setCTimezone(timezone) {
	  this.ctimezone = timezone;
	}	
	setPLPOS(plpos) {
	 this.plpos = plpos;
	}
	setYOGAS(yogas) {
	 this.yogas = yogas;
	}
	setPREDS(preds) {
	  this.preds = preds;
	}
	setHPOS(hpos) {
	 this.hpos = hpos;
	}
	setLANG(lang) {
	 this.lang = lang;
    console.log('setLANG()', lang);
		// this._storage.set('lang', lang);
		localStorage.setItem('lang', lang);
	this.dsLang.next(lang);
	}
	setRAHU(rahu) {
		this.rahu = rahu;
		// this._storage.set('rahu', rahu);
	}
	setRAHUS(rahus) {
		this.rahus = rahus;
		// this._storage.set('rahus', rahus);
	}
	setSUNR(sunrise) {
		this.sunrise = sunrise;
		// this._storage.set('sunrise', sunrise);
	}
	setSUNS(sunset) {
		this.sunset = sunset;
		// this._storage.set('sunset', sunset);
	}
	setRAHUT1(rahut1){
		this.rahut1 = rahut1;
		// this._storage.set('rahut1', rahut1);
	}
	setRAHUT2(rahut2){
		this.rahut2 = rahut2;
		// this._storage.set('rahut2', rahut2);
	}
	setRAHUT3(rahut3){
		this.rahut3 = rahut3;
		// this._storage.set('rahut3', rahut3);
	}
	setPRASDT(prasdt) {
	   this.prasdt = prasdt;
	   // this._storage.set('prasdt', prasdt);
	}
	setPRASNAS(prasnas) {
	   this.prasnas = prasnas;
	   // this._storage.set('prasnas', prasnas);
	}
	setCHTYP(chtyp) {
		this.chtyp = chtyp;
		localStorage.setItem('chtyp', chtyp);
	}
	setAYNM(aynm) {
		this.aynm = aynm;
	  localStorage.setItem('aynm', aynm);
	}
	setKAYNM(aynm) {
		this.kaynm = aynm;
	   // this._storage.set('kaynm', aynm);
	}
	setRAYNM(aynm) {
		this.raynm = aynm;
	   // this._storage.set('raynm', aynm);
	}
	setPLAN(pln) {
	  this.dsPlan.next(pln);
	}
	setQUOTA(quo) {
	  this.dsRep.next(quo);
	}
	setVEVT(evt) {
		this.dsVevts.next(evt);
	}
	setGEVT(evt) {
		this.dsGevts.next(evt);
	}
	addVIM(per, mdas, adas, pdas) {
	  let vimDas: VimDasha = {
		mdas: mdas,
		adas: adas,
		pdas: pdas
	  };
	  this.oVim[per] = vimDas;
	}
	setCCODE(ccode) {
	  this.ccode = ccode;
	}
	setRETRO(rpls) {
	  this.rpls = rpls;
	}
	setPLSTR(plstr) {
	  this.plstr = plstr;
	}
	setREP(rep) {
		this.reps += rep + '|';
		// this._storage.set('reps', this.reps);
	}
	remREP(rep) {
		let rps = this.reps.split('|');
		let urp: string = '';
		for(let i = 0; i < rps.length; i++) {
			if(rps[i] != rep) {
				urp += rps + '|';
			}
		}
		this.reps = urp;
		// this._storage.set('reps', this.reps);
	}
	getBINF() {
		return this.binf;
	}
	getREPS() {
		return this.reps;
	}
    getMoonSign() {
		return this.moonSign;
	}
	getBirthStar(){
	    return this.birthStar;
	}
	getPLPOS() {
	  return this.plpos;
	}
	getYOGAS() {
	  return this.yogas;
	}
	getPREDS() {
	  return this.preds;
	}
	getHPOS() {
	  return this.hpos;
	}
    getPlace() {
        return this.place;
    }  
    getDOB() {
        return this.dob;
    }  
    getTimezone() {
        return this.timezone;
    }
	getCTimezone() {
        return this.ctimezone;
    } 	
    getLAT() {
        return this.lat;
    }  
	getCLAT() {
        return this.clat;
    } 
    getLNG() {
        return this.lng;
    }
	getCLNG() {
        return this.clng;
    }
	getVIM() {
		return this.oVim;
	}
	getLANG() {
		return this.lang;
	}
	getRAHU() {
		return this.rahu;
	}
	getRAHUS() {
		return this.rahus;
	}
	getSUNR() {
		return this.sunrise;
	}
	getSUNS() {
		return this.sunset;
	}
	getRAHUT1() {
		return this.rahut1;
	}
	getRAHUT2() {
		return this.rahut2;
	}
	getRAHUT3() {
		return this.rahut3;
	}
	setYogAd(show) {
	  this.yogad = show;
	}
	getYogAd() {
	  return this.yogad;
	}
	getPRASDT() {
	  return this.prasdt;
	}
	getPRASNAS() {
	   return this.prasnas;
	}
	getCCODE() {
		return this.ccode;
	}
	getRETRO() {
		return this.rpls;
	}
	getPLSTR() {
		return this.plstr;
	}
	setREWARD(rew) {
		this.rew = rew;
	}
	getREWARD() {
		return this.rew;
	}
	getCHTYP() {
		return this.chtyp;
	}
	getAYNM() {
		return this.aynm;
	}
	getKAYNM() {
		return this.kaynm;
	}
	getRAYNM() {
		return this.raynm;
	}
	translate_func(lord: string)
	{
	  if(this.getLANG() == 'en') return lord;
	  let trn: string = lord;
		switch(lord.toLowerCase())
		{
			case 'sun':
			case 'su':
				if(this.getLANG() == 'te') {
					trn = 'సూర్యుడు';
				} else if(this.getLANG() == 'hi') { 
					trn = 'रवि ग्रह';
				} else if(this.getLANG() == 'ta') { 
					trn = 'சூரியன்';
				}
				break;
			case 'moon':
			case 'mo':
				if(this.getLANG() == 'te') {
					trn = 'చంద్రుడు';
				} else if(this.getLANG() == 'hi') { 
					trn = 'चांद ग्रह';
				} else if(this.getLANG() == 'ta') { 
					trn = 'சந்திரன்';
				}
				break;
			case 'jupiter':
			case 'ju':
				if(this.getLANG() == 'te') {
					trn = 'బృహస్పతి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'बृहस्पति';
				} else if(this.getLANG() == 'ta') { 
					trn = 'குரு';
				}
				break;
			case 'mercury':
			case 'me':
				if(this.getLANG() == 'te') {
					trn = 'బుధుడు';
				} else if(this.getLANG() == 'hi') { 
					trn = 'बुध गृह';
				} else if(this.getLANG() == 'ta') { 
					trn = 'புதன்';
				}
				break;
			case 'mars':
			case 'ma':
				if(this.getLANG() == 'te') {
					trn = 'కుజుడు';
				} else if(this.getLANG() == 'hi') { 
					trn = 'मंगल ग्रह';
				} else if(this.getLANG() == 'ta') { 
					trn = 'செவ்வாய்';
				}
				break;
			case 'venus':
			case 've':
				if(this.getLANG() == 'te') {
					trn = 'శుక్రుడు';
				} else if(this.getLANG() == 'hi') { 
					trn = 'शुक्र ग्रह';
				} else if(this.getLANG() == 'ta') { 
					trn = 'சுக்கிரன்';
				}
				break;
			case 'saturn':
			case 'sa':
				if(this.getLANG() == 'te') {
					trn = 'శనిగ్రహము';
				} else if(this.getLANG() == 'hi') { 
					trn = 'शनि ग्रह';
				} else if(this.getLANG() == 'ta') { 
					trn = 'சனி';
				}
				break;
			case 'rahu':
			case 'ra':
				if(this.getLANG() == 'te') {
					trn = 'రాహు';
				} else if(this.getLANG() == 'hi') { 
					trn = 'राहु ग्रह';
				} else if(this.getLANG() == 'ta') { 
					trn = 'ராகு';
				}
				break;
			case 'ketu':
			case 'ke':
				if(this.getLANG() == 'te') {
					trn = 'కేతు';
				} else if(this.getLANG() == 'hi') { 
					trn = 'केतु ग्रह';
				} else if(this.getLANG() == 'ta') { 
					trn = 'கேது';
				}
				break;
			case 'aries':
				if(this.getLANG() == 'te') {
					trn = 'మేషరాశి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'मेष राशि';
				} else if(this.getLANG() == 'ta') { 
					trn = 'மேஷம்';
				}
				break;
			case 'taurus':
				if(this.getLANG() == 'te') {
					trn = 'వృషభరాశి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'वृषभ राशि';
				} else if(this.getLANG() == 'ta') { 
					trn = 'ரிஷபம்';
				}
				break;
			case 'gemini':
				if(this.getLANG() == 'te') {
					trn = 'మిధునరాశి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'மிதுனம்';
				}
				break;
			case 'cancer':
				if(this.getLANG() == 'te') {
					trn = 'కర్కాటకరాశి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'कर्क राशि';
				} else if(this.getLANG() == 'ta') { 
					trn = 'கடகம்';
				}
				break;
			case 'leo':
				if(this.getLANG() == 'te') {
					trn = 'సిమ్హరాశి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'सिंह राशि';
				} else if(this.getLANG() == 'ta') { 
					trn = 'சிம்மம்';
				}
				break;
			case 'virgo':
				if(this.getLANG() == 'te') {
					trn = 'కన్యరాశి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'कन्या राशि';
				} else if(this.getLANG() == 'ta') { 
					trn = 'கன்னி';
				}
				break;
			case 'libra':
				if(this.getLANG() == 'te') {
					trn = 'తులారాసి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'तुला राशि';
				} else if(this.getLANG() == 'ta') { 
					trn = 'துலாம்';
				}
				break;
			case 'scorpio':
				if(this.getLANG() == 'te') {
					trn = 'వృశ్చికరాసి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'वृश्चिक राशि';
				} else if(this.getLANG() == 'ta') { 
					trn = 'விருச்சிகம்';
				}
				break;
			case 'saggitarius':
				if(this.getLANG() == 'te') {
					trn = 'ధనుస్సురాసి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'धनु राशि';
				} else if(this.getLANG() == 'ta') { 
					trn = 'தனுசு';
				}
				break;
			case 'capricorn':
				if(this.getLANG() == 'te') {
					trn = 'మకరరాసి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'மகரம்';
				}
				break;
			case 'aquarius':
				if(this.getLANG() == 'te') {
					trn = 'కుంభరాసి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'कुंभ राशि';
				} else if(this.getLANG() == 'ta') { 
					trn = 'கும்பம்';
				}
				break;
			case 'pisces':
				if(this.getLANG() == 'te') {
					trn = 'మీనరాసి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'मीन राशि';
				} else if(this.getLANG() == 'ta') { 
					trn = 'மீனம்';
				}
				break;
			case 'ashwini':
				if(this.getLANG() == 'te') {
					trn = 'అశ్వినీ';
				} else if(this.getLANG() == 'hi') { 
					trn = 'अश्विनी';
				} else if(this.getLANG() == 'ta') { 
					trn = 'அஸ்வினி';
				}
				break;
			case 'bharani':
				if(this.getLANG() == 'te') {
					trn = 'భరణి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'भरणी';
				} else if(this.getLANG() == 'ta') { 
					trn = 'பரணி';
				}
				break;
			case 'krittika':
				if(this.getLANG() == 'te') {
					trn = 'కృత్తికా';
				} else if(this.getLANG() == 'hi') { 
					trn = 'कृत्तिका';
				} else if(this.getLANG() == 'ta') { 
					trn = 'கிருத்திகை';
				}
				break;
			case 'rohini':
				if(this.getLANG() == 'te') {
					trn = 'రోహిణి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'रोहिणी';
				} else if(this.getLANG() == 'ta') { 
					trn = 'ரோகிணி';
				}
				break;
			case 'mrigashira':
				if(this.getLANG() == 'te') {
					trn = 'మ్రిగశిర';
				} else if(this.getLANG() == 'hi') { 
					trn = 'मृगशिरा';
				} else if(this.getLANG() == 'ta') { 
					trn = 'மிருகசிரீடம்';
				}
				break;
			case 'ardra':
				if(this.getLANG() == 'te') {
					trn = 'ఆర్ద్ర';
				} else if(this.getLANG() == 'hi') { 
					trn = 'आर्द्र';
				} else if(this.getLANG() == 'ta') { 
					trn = 'திருவாதிரை';
				}
				break;
			case 'punarvasu':
				if(this.getLANG() == 'te') {
					trn = 'పునర్వసు';
				} else if(this.getLANG() == 'hi') { 
					trn = 'पुनर्वसु';
				} else if(this.getLANG() == 'ta') { 
					trn = 'புனர்பூசம்';
				}
				break;
			case 'pushya':
				if(this.getLANG() == 'te') {
					trn = 'పుష్య';
				} else if(this.getLANG() == 'hi') { 
					trn = 'पुष्य';
				} else if(this.getLANG() == 'ta') { 
					trn = 'பூசம்';
				}
				break;
			case 'ashlesha':
				if(this.getLANG() == 'te') {
					trn = 'ఆశ్లేష';
				} else if(this.getLANG() == 'hi') { 
					trn = 'अश्लेषा';
				} else if(this.getLANG() == 'ta') { 
					trn = 'ஆயில்யம்';
				}
				break;
			case 'magha':
				if(this.getLANG() == 'te') {
					trn = 'మఘ';
				} else if(this.getLANG() == 'hi') { 
					trn = 'मघा';
				} else if(this.getLANG() == 'ta') { 
					trn = 'மகம்';
				}
				break;
			case 'purvaphalguni':
				if(this.getLANG() == 'te') {
					trn = 'పూర్వఫల్గుణి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'पूर्वाफाल्गुनी';
				} else if(this.getLANG() == 'ta') { 
					trn = 'பூரம்';
				}
				break;
			case 'uttaraaphalguni':
				if(this.getLANG() == 'te') {
					trn = 'ఉత్తరాఫల్గుణి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'उत्तराफाल्गुनी';
				} else if(this.getLANG() == 'ta') { 
					trn = 'உத்திரம்';
				}
				break;
			case 'hastha':
				if(this.getLANG() == 'te') {
					trn = 'హస్త';
				} else if(this.getLANG() == 'hi') { 
					trn = 'हस्ता';
				} else if(this.getLANG() == 'ta') { 
					trn = 'அஸ்தம்';
				}
				break;
			case 'chitra':
				if(this.getLANG() == 'te') {
					trn = 'చిత్ర';
				} else if(this.getLANG() == 'hi') { 
					trn = 'चित्र';
				} else if(this.getLANG() == 'ta') { 
					trn = 'சித்திரை';
				}
				break;
			case 'swati':
				if(this.getLANG() == 'te') {
					trn = 'స్వాతి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'स्वाति';
				} else if(this.getLANG() == 'ta') { 
					trn = 'ஸ்வாதி';
				}
				break;
			case 'vishakha':
				if(this.getLANG() == 'te') {
					trn = 'విశాఖ';
				} else if(this.getLANG() == 'hi') { 
					trn = 'विशाखा';
				} else if(this.getLANG() == 'ta') { 
					trn = 'விசாகம்';
				}
				break;
			case 'anuradha':
				if(this.getLANG() == 'te') {
					trn = 'అనురాధ';
				} else if(this.getLANG() == 'hi') { 
					trn = 'अनुराधा';
				} else if(this.getLANG() == 'ta') { 
					trn = 'அனுஷம்';
				}
				break;
			case 'jyestha':
				if(this.getLANG() == 'te') {
					trn = 'జ్యేష్ఠా';
				} else if(this.getLANG() == 'hi') { 
					trn = 'जयस्था';
				} else if(this.getLANG() == 'ta') { 
					trn = 'கேட்டை';
				}
				break;
			case 'mula':
				if(this.getLANG() == 'te') {
					trn = 'మూల';
				} else if(this.getLANG() == 'hi') { 
					trn = 'मूल';
				} else if(this.getLANG() == 'ta') { 
					trn = 'மூலம்';
				}
				break;
			case 'purvaashada':
				if(this.getLANG() == 'te') {
					trn = 'పూర్వాషాఢ';
				} else if(this.getLANG() == 'hi') { 
					trn = 'पूर्वाषाढ़ा';
				} else if(this.getLANG() == 'hi') { 
					trn = 'பூராடம்';
				}
				break;
			case 'uttaraashada':
				if(this.getLANG() == 'te') {
					trn = 'ఉత్తరాషాఢ';
				} else if(this.getLANG() == 'hi') { 
					trn = 'उत्तराषाढ़ा';
				} else if(this.getLANG() == 'ta') { 
					trn = 'உத்திராடம்';
				}
				break;
			case 'shravana':
				if(this.getLANG() == 'te') {
					trn = 'శ్రావణ';
				} else if(this.getLANG() == 'hi') { 
					trn = 'श्रवण';
				} else if(this.getLANG() == 'ta') { 
					trn = 'திருவோணம்';
				}
				break;
			case 'danishta':
				if(this.getLANG() == 'te') {
					trn = 'ధనిష్ఠ';
				} else if(this.getLANG() == 'hi') { 
					trn = 'धनिष्ठा';
				} else if(this.getLANG() == 'ta') { 
					trn = 'அவிட்டம்';
				}
				break;
			case 'shatabhisha':
				if(this.getLANG() == 'te') {
					trn = 'శతభిషా';
				} else if(this.getLANG() == 'hi') { 
					trn = 'शतभिषा';
				} else if(this.getLANG() == 'ta') { 
					trn = 'சதயம்';
				}
				break;
			case 'purvabhadra':
				if(this.getLANG() == 'te') {
					trn = 'పూర్వాభాద్ర';
				} else if(this.getLANG() == 'hi') { 
					trn = 'पूर्वभाद्र';
				} else if(this.getLANG() == 'ta') { 
					trn = 'பூரட்டாதி';
				}
				break;
			case 'uttarabhadra':
				if(this.getLANG() == 'te') {
					trn = 'ఉత్తరాభాద్ర';
				} else if(this.getLANG() == 'hi') { 
					trn = 'உத்திரட்டாதி';
				}
				break;
			case 'revati':
				if(this.getLANG() == 'te') {
					trn = 'రేవతి';
				} else if(this.getLANG() == 'hi') { 
					trn = 'रेवती';
				} else if(this.getLANG() == 'ta') { 
					trn = 'ரேவதி';
				}
				break;
			default:
				break;
		}
		return trn;
	}
	dmsToDec(d, m, s)
    {
       let v: number = d + (m /60) + (s /3600);
       return Number(v.toFixed(2));
    }

}
