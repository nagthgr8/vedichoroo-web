import {throwError as observableThrowError} from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HoroscopeService {
  private apiUrl = 'https://charts.vedichoroo.com/v1/Birthchart';
  private apiUrl43 = 'https://charts.vedichoroo.com/v1/BirthchartEx';
  private apiUrl54 = 'https://charts.vedichoroo.com/v1/BirthchartPro';
  private apiUrl2 = 'https://charts.vedichoroo.com/v1/DailyHoroscope';
  private apiUrl3 = 'https://charts.vedichoroo.com/v1/SubscribeAstroUser';
  private apiUrl4 = 'https://charts.vedichoroo.com/v1/BirthstarsEx';
  private apiUrl5 = 'https://charts.vedichoroo.com/v1/Birthstar';
  private apiUrl6 = 'https://charts.vedichoroo.com/v1/StarsForMonth';
  private apiUrl7 = 'https://maps.googleapis.com/maps/api/timezone/json';
  private apiUrl8 = 'https://www.126news.com/api/AstroStories';
  private apiUrl9 = 'https://charts.vedichoroo.com/v1/Getcusps';
  private apiUrl10 = 'https://charts.vedichoroo.com/v1/GetTransits';
  private apiUrl20 = 'https://charts.vedichoroo.com/v1/GetDashTrans';
  private apiUrl11 = 'https://charts.vedichoroo.com/v1/GetDashaTransits';
  private apiUrl111 = 'https://translation.googleapis.com/language/translate/v2';
  private apiUrl1111 = 'https://charts.vedichoroo.com/v1/GetYogas';
  private apiUrl22 = 'https://charts.vedichoroo.com/v1/RecfyBTEx';
  private apiUrl23 = 'https://charts.vedichoroo.com/v1/GetPlan';
  private apiUrl24 = 'https://charts.vedichoroo.com/v1/SetPlan';
  private apiUrl25 = 'https://charts.vedichoroo.com/v1/AddCredits';
  private apiUrl26 = 'https://charts.vedichoroo.com/v1/AddDOB';
  private apiUrl27 = 'https://charts.vedichoroo.com/v1/AddTicket';
  private apiUrl28 = 'https://charts.vedichoroo.com/v1/FollowTicket';
  private apiUrl29 = 'https://charts.vedichoroo.com/v1/GetNotif';
  private apiUrl30 = 'https://charts.vedichoroo.com/v1/AddSubscriber';
  private apiUrl31 = 'https://charts.vedichoroo.com/v1/Birthinfo';
  private apiUrl32 = 'https://charts.vedichoroo.com/v1/GetAstrologer';
  private apiUrl33 = 'https://charts.vedichoroo.com/v1/AstrologerStatus';
  private apiUrl34 = 'https://charts.vedichoroo.com/v1/AstrologerTagline';
  private apiUrl35 = 'https://charts.vedichoroo.com/v1/AstrologerAvatar';
  private apiUrl36 = 'https://charts.vedichoroo.com/v1/GetAllAstrologers';
  private apiUrl37 = 'https://charts.vedichoroo.com/v1/PrashnaJyotish';
  private apiUrl38 = 'https://charts.vedichoroo.com/v1/GetTransPreds';
  private apiUrl39 = 'https://www.126news.com/Publication/AstroBlogs';
  private apiUrl40 = 'https://www.126news.com/api/PublishBlog';
  private apiUrl41 = 'https://www.126news.com/Publication/GetUserId';
  private apiUrl42 = 'https://charts.vedichoroo.com/v1/GetMoonPhase';
  private apiUrl44 = 'https://www.126news.com/api/GetArticle';
  private apiUrl45 = 'https://charts.vedichoroo.com/v1/GetBirthstar';
  private apiUrl46 = 'https://charts.vedichoroo.com/v1/StarsForMonthEx2';
  private apiUrl47 = 'https://charts.vedichoroo.com/v1/GetMoonPhaseEx';
  private apiUrl48 = 'https://charts.vedichoroo.com/v1/GetcuspsEx2';
  private apiUrl49 = 'https://charts.vedichoroo.com/v1/TalkToAstro';
  private apiUrl50 = 'https://charts.vedichoroo.com/v1/AnalyzeDasamsa';
  private apiUrl51 = 'https://charts.vedichoroo.com/v1/AnalyzeDasamsaDasha';
  private apiUrl52 = 'https://charts.vedichoroo.com/v1/GetAllHobbyAsts';
  private apiUrl53 = 'https://charts.vedichoroo.com/v1/GetOffer';
  private apiUrl55 = 'https://charts.vedichoroo.com/v1/CalcVim';
  private apiUrl56 = 'https://charts.vedichoroo.com/v1/GetTransPredsEx';
  private apiUrl57 = 'https://charts.vedichoroo.com/v1/AnalyzeMoney';
  private apiUrl58 = 'https://charts.vedichoroo.com/v1/AnalyzeD4';
  private apiUrl59 = 'https://charts.vedichoroo.com/v1/GetDashTransEx';
  private apiUrl60 = 'https://charts.vedichoroo.com/v1/AnalyzeD9';
  private apiUrl61 = 'https://charts.vedichoroo.com/v1/GetHouseGroup';
  private apiUrl62 = 'https://charts.vedichoroo.com/v1/AddHouseGroup';
  private apiUrl63 = 'https://charts.vedichoroo.com/v1/Astakvarga';
  private apiUrl64 = 'https://charts.vedichoroo.com/v1/AstroBio';
  private apiUrl65 = 'https://charts.vedichoroo.com/v1/Shadbala';
  private apiUrl67 = 'https://charts.vedichoroo.com/v1/IsAdmin';
  private apiUrl68 = 'https://charts.vedichoroo.com/v1/GetAllReports';
  private apiUrl69 = 'https://charts.vedichoroo.com/v1/AddReport';
  private apiUrl70 = 'https://charts.vedichoroo.com/v1/GetReports';
  private apiUrl71 = 'https://charts.vedichoroo.com/v1/UpdateReport';
  private apiUrl72 = 'https://charts.vedichoroo.com/v1/GetProfile';
  private apiUrl73 = 'https://charts.vedichoroo.com/v1/SetProfile';
  private apiUrl74 = 'https://www.126news.com/api/GetStory';
  private apiUrl75 = 'https://www.126news.com/api/GetMsg';
  private apiUrl76 = 'https://charts.vedichoroo.com/v1/GetAdv';
  private apiUrl77 = 'https://charts.vedichoroo.com/v1/GetQuota';
  private apiUrl78 = 'https://charts.vedichoroo.com/v1/SetQuota';
  private apiUrl79 = 'https://charts.vedichoroo.com/v1/BirthinfoEx';
  private apiUrl80 = 'https://charts.vedichoroo.com/v1/BirthchartEx2';
  private apiUrl81 = 'https://charts.vedichoroo.com/v1/RemDOB';
  private apiUrl82 = 'https://charts.vedichoroo.com/v1/CalForMon';
  private apiUrl83 = 'https://www.126news.com/GetComment';
  private apiUrl84 = 'https://www.126news.com/PostComment';
	private apiUrl85 = 'https://charts.vedichoroo.com/v1/GeneratePDFDoc';
	private apiUrl86 = 'https://ipapi.co/json';
	private apiUrl87 = 'https://charts.vedichoroo.com/v1/GetSubscriber';
	private apiUrl88 = 'https://charts.vedichoroo.com/v1/ProfileBanner';
	private apiUrl89 = 'https://charts.vedichoroo.com/v1/ProfileBio';
  private apiUrl90 = 'https://charts.vedichoroo.com/v1/GeneratePDFDocEx';
  private apiUrl91 = 'https://charts.vedichoroo.com/v1/GetExchangeRate';
  private apiUrl92 = 'https://charts.vedichoroo.com/v1/GetBalance';
  private apiUrl93 = 'https://charts.vedichoroo.com/v1/CreateOrder';
  private apiUrl94 = 'https://charts.vedichoroo.com/v1/Orders';
  private apiUrl95 = 'https://charts.vedichoroo.com/v1/IsAstrologer';
  private monthList = [
	{name: "January",   numdays: 31, abbr: "Jan"},
	{name: "February",  numdays: 28, abbr: "Feb"},
	{name: "March",     numdays: 31, abbr: "Mar"},
	{name: "April",     numdays: 30, abbr: "Apr"},
	{name: "May",       numdays: 31, abbr: "May"},
	{name: "June",      numdays: 30, abbr: "Jun"},
	{name: "July",      numdays: 31, abbr: "Jul"},
	{name: "August",    numdays: 31, abbr: "Aug"},
	{name: "September", numdays: 30, abbr: "Sep"},
	{name: "October",   numdays: 31, abbr: "Oct"},
	{name: "November",  numdays: 30, abbr: "Nov"},
	{name: "December",  numdays: 31, abbr: "Dec"},
];

  constructor(private http: HttpClient) { }
  getConnectedAstros() : Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	return this.http.get('https://ast.vedichoroo.com/astrologers', {headers: headers}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
    
  }
 getActivePeers(): Observable<any> {
  let headers = new HttpHeaders().set('Accept', 'application/json; charset=utf-8');
  return this.http.get('https://ast.vedichoroo.com/active-peers', {headers: headers}).pipe(
    map(this.extractData),
    catchError(this.handleError)
  );
}
  getgapiProfilePic(accessToken) : Observable<{}> {
  const headers = { Authorization: `Bearer ${accessToken}` }; 
	
  return this.http.get('https://people.googleapis.com/v1/people/me?personFields=photos', {headers: headers}).pipe(
    map(this.extractData),
    catchError(this.handleError)
  );
}
  
  loginUser(email, password) : Observable<{}> {
	  var oDat = {
		  Email: email,
		  Password: password
	  };
	  let headers = new HttpHeaders()
		  .set('Accept', 'application/json; charset=utf-8')
		  .set('Content-Type', 'application/json; charset=utf-8');
	  return this.http.post('https://reg.vedichoroo.com/User/login', JSON.stringify(oDat), { headers: headers }).pipe(
		  map(this.extractData),
		  catchError(this.handleError)
		  );
  }  
  createUser(name, email, password) : Observable<{}> {
	  var oDat = {
		  UserName: name,
		  Email: email,
		  Password: password
	  };
	  let headers = new HttpHeaders()
		  .set('Accept', 'application/json; charset=utf-8')
		  .set('Content-Type', 'application/json; charset=utf-8');
	  return this.http.post('https://reg.vedichoroo.com/User/create', JSON.stringify(oDat), { headers: headers }).pipe(
		  map(this.extractData),
		  catchError(this.handleError)
		  );
  }
  getCurrencyExchangeRate(ccode, ccy): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('ccode', ccode)
						.set('ccy', ccy);
	return this.http.get(this.apiUrl91, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getOrderStatus(orderid): Observable<{}> {
     let url = this.apiUrl94 + '/' + orderid + '/status';
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	return this.http.get(url, {headers: headers}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  createOrder(amt, ccy):Observable<{}> {
	  var oDat = {
		  Amount: amt,
		  Currency: ccy
	  };
	  let headers = new HttpHeaders()
		  .set('Accept', 'application/json; charset=utf-8')
		  .set('Content-Type', 'application/json; charset=utf-8');
	  return this.http.post(this.apiUrl93, JSON.stringify(oDat), { headers: headers }).pipe(
		  map(this.extractData),
		  catchError(this.handleError)
		  );
   }
   isAstro(eml):Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('eml', eml);
	return this.http.get(this.apiUrl95, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
	map((res: any) => res === true),
    catchError(this.handleError)
	);
   }
  getBalance(uid):Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('cid', uid);
	return this.http.get(this.apiUrl92, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
	);
  }
  getJson(url: string): Observable<{}> {
	return this.http.get(url).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
	}
	getIP(): Observable<{}> {
		let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
		return this.http.get(this.apiUrl86, { headers: headers}).pipe(
			map(this.extractData),
			catchError(this.handleError)
		);
	}
	setProfileBnr(uuid: string, banner: string): Observable<{}> {
	  var oDat = {
		  uuid: uuid,
		  banner: banner
	  };
	  let headers = new HttpHeaders()
		  .set('Accept', 'application/json; charset=utf-8')
		  .set('Content-Type', 'application/json; charset=utf-8');
	  return this.http.post(this.apiUrl88, JSON.stringify(oDat), { headers: headers }).pipe(
		  map(this.extractData),
		  catchError(this.handleError)
	  );
  }  
  setProfileBio(uuid: string, bio: string): Observable<{}> {
	  var oDat = {
		  uuid: uuid,
		  bio: bio
	  };
	  let headers = new HttpHeaders()
		  .set('Accept', 'application/json; charset=utf-8')
		  .set('Content-Type', 'application/json; charset=utf-8');
	  return this.http.post(this.apiUrl89, JSON.stringify(oDat), { headers: headers }).pipe(
		  map(this.extractData),
		  catchError(this.handleError)
	  );
  } 
  downloadPdfEx(uuid: string, name: string, gender: string, dob: string, pob: string, lat: string, lng: string, timezone: string, dstofset: number, ayanid: number, lang: string, chtyp, cimg: string, cnme: string, cnum: string, ceml: string ) : Observable<Blob> {
 let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
 console.log(tsec);
 tsec = (tsec == '00') ? '0' : tsec;
 var oDat = {
	 uuid: uuid,
	 name: name,
	 gender: gender,
	 dob: dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0],
	 tob: dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + tsec,
	 pob: pob,
	 latlng: lat + '|'+lng,
	 timezone: timezone,
	 dstofset: dstofset,
	 ayanid: ayanid,
	 lang: lang,
	 chtyp: chtyp,
	 cimg: cimg,
	 cnme: cnme,
	 cnum: cnum,
	 ceml: ceml
   };
	let headers = new HttpHeaders()
			.set('Accept', 'application/pdf; charset=utf-8') 
			.set('Content-Type', 'application/json; charset=utf-8');
return this.http.post<Blob>(this.apiUrl90, JSON.stringify(oDat), { headers : headers,responseType : 
         'blob' as 'json'});			
	//return this.http.post(this.apiUrl85, JSON.stringify(oDat), {headers: headers}).pipe(
    // map(this.extractData),
    //catchError(this.handleError)
   //);
   }
  
  getDailyHoro(moonSign: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8')
	let httpParams = new HttpParams()
                        .set('sign', moonSign);
	console.log('calling api', this.apiUrl2);
  return this.http.get(this.apiUrl2, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  subscribeAstroUser(token: string, moonSign: string, moonDeg: number): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('token', token)
						.set('sign', moonSign)
						.set('deg', moonDeg.toString());
  return this.http.get(this.apiUrl3, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  addSubscriber(uuid: string, nam: string, mob: string, eml: string): Observable<{}> {
	  var oDat = {
		  uuid: uuid,
		  nam: nam,
		  mob: mob,
      eml: eml
	  };
	  let headers = new HttpHeaders()
		  .set('Accept', 'application/json; charset=utf-8')
		  .set('Content-Type', 'application/json; charset=utf-8');
	  return this.http.post(this.apiUrl30, JSON.stringify(oDat), { headers: headers }).pipe(
		  map(this.extractData),
		  catchError(this.handleError)
	  );
  }  
  getYogas(lat: any, lng: any, dob: string, tz: string, lang: string): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';

   var oDat = {
   dob: '',
   tob: '',
   latlng: '',
   timezone: '',
   lang: ''
   };
   oDat.dob = dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0];
   oDat.tob = dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0';
   oDat.latlng = latlng;
   oDat.timezone = tz;
   oDat.lang = lang;
   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0')
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('lang', lang);
	return this.http.get(this.apiUrl1111, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  calcVim(dob: string, lord: string, mpos: number, nsp: number, msi: number, nsi: number, lang: string): Observable<{}> {

   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob)
						.set('lord', lord)
						.set('mpos', mpos.toString())
						.set('nsp', nsp.toString())
						.set('msi', msi.toString())
						.set('nsi', nsi.toString())
						.set('lang', lang);
	return this.http.get(this.apiUrl55, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getCareer(lat: any, lng: any, dob: string, tz: string, lang: string, ayanid: number): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';

   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0')
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('lang', lang)
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl50, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getMoney(das: string, lat: any, lng: any, dob: string, tz: string, lang: string, ayanid: number): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';

   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
						.set('das', das)
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0')
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('lang', lang)
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl57, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  analyzeD4(lat: any, lng: any, dob: string, tz: string, lang: string, ayanid: number): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';

   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0')
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('lang', lang)
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl58, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  analyzeD9(lat: any, lng: any, dob: string, tz: string, lang: string, ayanid: number): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';

   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0')
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('lang', lang)
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl60, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getCareerDas(mdas: string, lat: any, lng: any, dob: string, tz: string, lang: string, ayanid: number): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';
   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
						.set('mdas', mdas)
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0')
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('lang', lang)
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl51, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getTransPreds(dob: string): Observable<{}> {

   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0');
	return this.http.get(this.apiUrl38, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getNotif(uuid: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid);
	return this.http.get(this.apiUrl29, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getQuota(uuid: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid);
	return this.http.get(this.apiUrl77, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
	getSubscriber(uuid: string, eml: string): Observable<{}> {
		let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');
		let httpParams = new HttpParams()
			.set('uuid', uuid)
			.set('eml', eml);
		return this.http.get(this.apiUrl87, { headers: headers, params: httpParams }).pipe(
			map(this.extractData),
			catchError(this.handleError)
		);
	}
  getPlan(uuid: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid);
	return this.http.get(this.apiUrl23, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getOffer(uuid: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid);
	return this.http.get(this.apiUrl53, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
  getAllAstrologers(): Observable<{}> {
    let headers = new HttpHeaders()
    .set('Accept', 'application/json; charset=utf-8');  
	return this.http.get(this.apiUrl36, {headers: headers}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
  getAllReports(): Observable<{}> {
	return this.http.get(this.apiUrl68).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
  getReports(uuid: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid);
	return this.http.get(this.apiUrl70, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
  getAllHobbyAsts(): Observable<{}> {
	return this.http.get(this.apiUrl52).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }   
  getAstrologer(uuid: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid);
	return this.http.get(this.apiUrl32, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getStory(uuid: string, title: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('title', title);
	return this.http.get(this.apiUrl74, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getComments(title: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
						.set('page_id', title);
	return this.http.get(this.apiUrl83, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getMsg(uuid: string, tag: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('tag', tag);
	return this.http.get(this.apiUrl75, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getProfile(uuid: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid);
	return this.http.get(this.apiUrl72, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  setProfile(uuid: string, avatar: string, dob: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('avatar', avatar)
						.set('dob', dob);
	return this.http.get(this.apiUrl73, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
  
  isAdmin(uuid: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid);
	return this.http.get(this.apiUrl67, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getAstroBio(uid: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uid', uid);
	return this.http.get(this.apiUrl64, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  setAstStatus(uuid: string, status: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('status', status);
	return this.http.get(this.apiUrl33, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  setAstTagline(uuid: string, tagline: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('tagline', tagline);
	return this.http.get(this.apiUrl34, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  setAstAvatar(uuid: string, avatar: string): Observable<{}> {
   var oDat = {
	uuid: uuid,
	avatar: avatar
   };
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('avatar', avatar);
	return this.http.get(this.apiUrl35, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
setQuota(uuid: string, qta: number): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('qta', qta.toString());
	return this.http.get(this.apiUrl78, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
  setPlan(uuid: string, name: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('name', name);
	return this.http.get(this.apiUrl24, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  addCredits(uuid: string, credits: number): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('credits', credits.toString());
	return this.http.get(this.apiUrl25, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  addDOB(uuid: string, dob: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('dob', dob);
	return this.http.get(this.apiUrl26, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  remDOB(uuid: string, dob: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('dob', dob);
	return this.http.get(this.apiUrl81, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  addTicket(uuid: string, cat: string, sub: string, msg: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('cat', cat)
						.set('sub', sub)
						.set('msg', msg);
	return this.http.get(this.apiUrl27, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
  addComment(uuid: string, title: string, pid: string, name: string, avatar: string, msg: string): Observable<{}> {
 let oDat = {
   content: msg,
   created: '',
   created_by_current_user: true,
   fullname: name,
   id: uuid,
   modified: '',
   parent: pid,
   profile_picture_url: avatar,
   upvote_count: 0,
   user_has_upvoted: false,
   page_id: title,
   email: '',
   upvote_users: ''
 };
 let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8')
			.set('Content-Type', 'application/json; charset=utf-8');
 	return this.http.post(this.apiUrl84, JSON.stringify(oDat), {headers: headers}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
  followTicket(uuid: string, guid: string, msg: string): Observable<{}> {
   var oDat = {
   uuid: uuid,
   guid: guid,
   msg: msg
   };
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('guid', guid)
						.set('msg', msg);
	return this.http.get(this.apiUrl28, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  } 
  addReport(uuid: string, dobs: string, chtyp: string, aynm: string, lan: string, eml: string, mob: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('dobs', dobs)
						.set('chtyp', chtyp)
						.set('aynm', aynm)
						.set('lan', lan)
						.set('eml', eml)
						.set('mob', mob);
	return this.http.get(this.apiUrl69, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
  updateReport(uuid: string, guid: string, lnk: string): Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid)
						.set('guid', guid)
						.set('lnk', lnk);
	return this.http.get(this.apiUrl71, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
getHoro(lat: any, lng: any, dob: string, tz: string): Observable<{}> {
    console.log('getHoro', lat);
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';

   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0')
						.set('latlng', latlng)
						.set('timezone', tz);
	return this.http.get(this.apiUrl, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
getProHoro(lat: any, lng: any, dob: string, tz: string, ofset: number, ayanid: number): Observable<{}> {
	//var lat = dmslat.split("º")[0] + '.' + dmslat.split("º")[1].split("'")[0];
	//var lng = dmslng.split("º")[0] + '.' + dmslng.split("º")[1].split("'")[0];
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';

   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0')
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('tzofset', ofset.toString())
						.set('name', '')
						.set('eml', '')
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl54, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
getBirthchartEx2(lat: any, lng: any, dob: string, tz: string, ofset: number, ayanid: number): Observable<{}> {
	//var lat = dmslat.split("º")[0] + '.' + dmslat.split("º")[1].split("'")[0];
	//var lng = dmslng.split("º")[0] + '.' + dmslng.split("º")[1].split("'")[0];
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';

   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
   let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
    tsec = (tsec == '00') ? '0' : tsec;
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + tsec)
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('tzofset', ofset.toString())
						.set('name', '')
						.set('eml', '')
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl80, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
 getAstakvarga(lat: any, lng: any, dob: string, tz: string, ofset: number, ayanid: number): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';

   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
    let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
	 tsec = (tsec == '00') ? '0' : tsec;
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + tsec)
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('tzofset', ofset.toString())
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl63, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
 getShadbala(lat: any, lng: any, dob: string, tz: string, ofset: number, ayanid: number): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';

   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
   let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
    tsec = (tsec == '00') ? '0' : tsec;
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + tsec)
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('tzofset', ofset.toString())
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl65, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  
getTransPredsEx(lat: any, lng: any, dob: string, tz: string, ofset: number, ayanid: number): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';

   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
   let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
    tsec = (tsec == '00') ? '0' : tsec;
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + tsec)
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('tzofset', ofset.toString())
						.set('name', '')
						.set('eml', '')
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl56, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
 getMoonPhase(lat: any, lng: any, dob: string, tz: string): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';
   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
   let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
    tsec = (tsec == '00') ? '0' : tsec;
	let headers = new HttpHeaders();
	headers = headers.set('Accept', 'application/json; charset=utf-8');  
    headers.append('Cache-control', 'no-cache');
	headers.append('Cache-control', 'no-store');
	headers.append('Expires', '0');
	headers.append('Pragma', 'no-cache');	
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' +  tsec)
						.set('latlng', latlng)
						.set('timezone', tz);
	return this.http.get(this.apiUrl42, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
 getProMoonPhase(lat: number, lng: number, dob: string, tz: string, ayanid: number): Observable<{}> {
	//var lat = dmslat.split("º")[0] + '.' + dmslat.split("º")[1].split("'")[0];
	//var lng = dmslng.split("º")[0] + '.' + dmslng.split("º")[1].split("'")[0];
	var latlng = lat.toString() + '|' + lng.toString();
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';
   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
   let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
   (tsec == '00') ? '0' :  tsec;
   console.log(tsec);
	let headers = new HttpHeaders();
	headers = headers.set('Accept', 'application/json; charset=utf-8');  
    headers.append('Cache-control', 'no-cache');
	headers.append('Cache-control', 'no-store');
	headers.append('Expires', '0');
	headers.append('Pragma', 'no-cache');	
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + tsec)
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl47, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
 getCusps(lat: any, lng: any, dob: string, tz: string): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';
 let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
 tsec = (tsec == '00') ? '0' : tsec;
   var oDat = {
   dob: '',
   tob: '',
   latlng: '',
   timezone: ''
   };
   oDat.dob = dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0];
   oDat.tob = dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + tsec;
   oDat.latlng = latlng;
   oDat.timezone = tz;
   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
	let headers = new HttpHeaders();
	headers = headers.set('Accept', 'application/json; charset=utf-8');  
    headers.append('Cache-control', 'no-cache');
	headers.append('Cache-control', 'no-store');
	headers.append('Expires', '0');
	headers.append('Pragma', 'no-cache');	
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' +  tsec)
						.set('latlng', latlng)
						.set('timezone', tz);
	return this.http.get(this.apiUrl9, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
 getCuspsEx(lat: any, lng: any, dob: string, tz: string, ofset: number, ayanid: number): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';
   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
   let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
   tsec = (tsec == '00') ? '0' : tsec;
	let headers = new HttpHeaders();
	headers = headers.set('Accept', 'application/json; charset=utf-8');  
    headers.append('Cache-control', 'no-cache');
	headers.append('Cache-control', 'no-store');
	headers.append('Expires', '0');
	headers.append('Pragma', 'no-cache');	
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + tsec)
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('tzofset', ofset.toString())
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl48, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
 getPrashna(lat: any, lng: any, dob: string, tz: string, znum: number): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';
   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
	let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
	tsec = (tsec == '00') ? '0' : tsec;
	let headers = new HttpHeaders();
	headers = headers.set('Accept', 'application/json; charset=utf-8');  
    headers.append('Cache-control', 'no-cache');
	headers.append('Cache-control', 'no-store');
	headers.append('Expires', '0');
	headers.append('Pragma', 'no-cache');	
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + tsec)
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('znum', znum.toString());
	return this.http.get(this.apiUrl37, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  recfyBT(lat: any, lng: any, dob: string, tz: string, ofset: number, ayanid: number ): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';
   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
 let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
 tsec = (tsec == '00') ? '0' : tsec;
	let headers = new HttpHeaders();
	headers = headers.set('Accept', 'application/json; charset=utf-8');  
    headers.append('Cache-control', 'no-cache');
	headers.append('Cache-control', 'no-store');
	headers.append('Expires', '0');
	headers.append('Pragma', 'no-cache');	
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + tsec)
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('tzofset', ofset.toString())
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl22, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
  getBirthStars(dob: string, partnerdob: string, latlng: string, tz: string, ayanid: number): Observable<{}> {
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '-' + //partnerdob.split('T')[0].split('-')[2] + '|' + partnerdob.split('T')[0].split('-')[1] + '|' + partnerdob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '-' + partnerdob.split('T')[1].split(':')[0]  + '|' + //partnerdob.split('T')[1].split(':')[1] + '|' + '0';
	let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
	tsec = (tsec == '00') ? '0' : tsec;
	let tsec2: string = partnerdob.split('T')[1].split(':')[2].split('Z')[0]; 
	tsec2 = (tsec2 == '00') ? '0' : tsec2;
	let headers = new HttpHeaders();
	headers = headers.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '-' + partnerdob.split('T')[0].split('-')[2] + '|' + partnerdob.split('T')[0].split('-')[1] + '|' + partnerdob.split('T')[0].split('-')[0])
						.set('tob',  dob.split('T')[1].split(':')[0] + '|'+ dob.split('T')[1].split(':')[1]+'|' + tsec + '-'+ partnerdob.split('T')[1].split(':')[0]+'|' + partnerdob.split('T')[1].split(':')[1]+ '|'+ tsec2)
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl4, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getBirthStar(dob: string): Observable<{}> {
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0';
	let headers = new HttpHeaders()
				.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0');
  return this.http.get(this.apiUrl5, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getProBirthStar(lat: any, lng: any, dob: string, tz: string, ayanid: number): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0';
   let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
   tsec = (tsec == '00') ? '0' : tsec;
	let headers = new HttpHeaders()
				.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + tsec)
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('ayanid', ayanid.toString());
  return this.http.get(this.apiUrl45, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getStarConst(star: string, sign: string, moondeg: string): Observable<{}> {
	//var oDat = 'star=' + star + '&sign=' + sign + '&moondeg=' + moondeg;
	let headers = new HttpHeaders()
				.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('star', star)
						.set('sign', sign)
						.set('moondeg', moondeg);
  return this.http.get(this.apiUrl6, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getProStarConst(star: string, sign: string, moondeg: string, latlng: string, tz: string, ayanid: number): Observable<{}> {
	//var oDat = 'star=' + star + '&sign=' + sign + '&moondeg=' + moondeg;
	let headers = new HttpHeaders()
				.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('star', star)
						.set('sign', sign)
						.set('moondeg', moondeg)
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('ayanid', ayanid.toString());
  return this.http.get(this.apiUrl46, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  calForMon(mon: number, yer: number, latlng: string, tz: string, ayanid: number): Observable<{}> {
	//var oDat = 'star=' + star + '&sign=' + sign + '&moondeg=' + moondeg;
	let headers = new HttpHeaders()
				.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('mon', mon.toString())
						.set('yer', yer.toString())
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('ayanid', ayanid.toString());
  return this.http.get(this.apiUrl82, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getTimezone(lat: any, lng: any, timestamp: string): Observable<{}> {
   //var oDat = 'location=' + lat + ',' + lng + '&timestamp=' + timestamp + '&key=' + 'AIzaSyANvr-rVst44P0DMBpDxsu6s0GXUVPrl9M';
	let headers = new HttpHeaders()
				.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('location', lat + ',' + lng)
						.set('timestamp', timestamp)
						.set('key', 'AIzaSyCx1IH3j2RVc6hT12jR0kG3D8g-cDDq3MA');
  return this.http.get(this.apiUrl7, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
 getStories(): Observable<{}> {
   return this.http.get(this.apiUrl8).pipe(
	map(this.extractData),
    catchError(this.handleError)
	);
  }
getArticle(tok: string): Observable<{}> {
  let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');
	let httpParams = new HttpParams()
                        .set('tok', tok);
   return this.http.get(this.apiUrl44, {headers: headers, params: httpParams}).pipe(
	map(this.extractData),
    catchError(this.handleError)
	);
  }  
  
getBlogs(uid: string): Observable<{}> {
  let headers = new HttpHeaders()
  .set('Accept', 'application/json; charset=utf-8');
	let httpParams = new HttpParams()
                        .set('uid', uid);
   return this.http.get(this.apiUrl39, {headers: headers, params: httpParams}).pipe(
	map(this.extractData),
    catchError(this.handleError)
	);
  }  
pubBlog(uuid: string, name: string, avatar: string, title: string, story: string, img: string): Observable<{}> {
 var oDat = {
   uuid: uuid,
   name: name,
   avatar: avatar,
   title: title,
   story: story,
   img: img
 };
  let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8')
			.set('Content-Type', 'application/json; charset=utf-8');
   return this.http.post(this.apiUrl40, JSON.stringify(oDat), {headers: headers}).pipe(
	map(this.extractData),
    catchError(this.handleError)
	);
  }   
addSuggestion(uuid: string, cat: string, msg: string): Observable<{}> {
 var oDat = {
   uuid: uuid,
   cat: cat,
   msg: msg
 };
  let headers = new HttpHeaders()
		.set('Accept', 'application/json; charset=utf-8');
   return this.http.post(this.apiUrl44, JSON.stringify(oDat), {headers: headers}).pipe(
	map(this.extractData),
    catchError(this.handleError)
	);
  }   
getTransits(mdas: string, adas: string, pdas: string, pend: string): Observable<{}> {
	let headers = new HttpHeaders();
	headers = headers.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('mdas', mdas)
						.set('adas', adas)
						.set('pdas', pdas)
						.set('pend', pend);
  return this.http.get(this.apiUrl10, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
getDashTransEx(mdas: string, adas: string, pdas: string, pend: string, lat: any, lng: any, tz: string, ayanid: number): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('mdas', mdas)
						.set('adas', adas)
						.set('pdas', pdas)
						.set('pend', pend)
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('ayanid', ayanid.toString());
  return this.http.get(this.apiUrl59, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
getDashTrans(mdas: string, adas: string, pdas: string, pend: string): Observable<{}> {
   var oDat = {
   mdas: '',
   adas: '',
   pdas: '',
   pend: ''
   };
   oDat.mdas = mdas;
   oDat.adas = adas;
   oDat.pdas = pdas;
   oDat.pend = pend;
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');  
	let httpParams = new HttpParams()
                        .set('mdas', mdas)
						.set('adas', adas)
						.set('pdas', pdas)
						.set('pend', pend);
			
  return this.http.get(this.apiUrl20, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }  
getDashaTransits(vim: any): Observable<{}> {
   
	let headers = new HttpHeaders();
	headers = headers.set('Accept', 'application/json; charset=utf-8');   
  return this.http.post(this.apiUrl11, JSON.stringify(vim), {headers: headers}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }    
 translateText(txt: string, tgt: string) : Observable<{}> {
 let httpParams = new HttpParams()
			.append('q', txt)
			.append('source', 'en')
			.append('target', tgt)
			.append('key ', 'AIzaSyByRjvoxkrwrCgMTmawQcm7zo0m2a5wg2s');

   return this.http.get(this.apiUrl111, {params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   ); 
}
getBirthInfo(lat: any, lng: any, dob: string, tz: string): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';

   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
   let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
   tsec = (tsec == '00') ? '0' : tsec;
	let headers = new HttpHeaders()
				.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + tsec)
						.set('latlng', latlng)
						.set('timezone', tz);
	return this.http.get(this.apiUrl31, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
getBirthInfoEx(lat: any, lng: any, dob: string, tz: string, ayanid: number): Observable<{}> {
	if(lat.toString().indexOf('º') > -1)
		lat = lat.split("º")[0] + '.' + lat.split("º")[1].split("'")[0];
	if(lng.toString().indexOf('º') > -1)
		lng = lng.split("º")[0] + '.' + lng.split("º")[1].split("'")[0];
	var latlng = lat + '|' + lng;
	//var oDat = 'dob=' + dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0] + '&tob=' + //dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + '0' + '&latlng=' + latlng + '&timezone=' + tz + '&name=' + '&eml=';

   //let headers = new Headers({ 'Accept': 'application/json; charset=utf-8' });
 let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
 tsec = (tsec == '00') ? '0' : tsec;
	let headers = new HttpHeaders()
				.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('dob', dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0])
						.set('tob', dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + tsec)
						.set('latlng', latlng)
						.set('timezone', tz)
						.set('ayanid', ayanid.toString());
	return this.http.get(this.apiUrl79, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  getKPHouseGroup(uuid: string) : Observable<{}> {
	let headers = new HttpHeaders()
				.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uuid', uuid);
	return this.http.get(this.apiUrl61, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  addKPHouseGroup(uuid: string, hgp: string) : Observable<{}> {
   var oDat = {
	 uuid: uuid,
	 hgp: hgp
   };
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8') 
			.set('Content-Type', 'application/json; charset=utf-8');   
	return this.http.post(this.apiUrl62, JSON.stringify(oDat), {headers: headers}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
  }
  downloadPdf(uuid: string, name: string, gender: string, dob: string, pob: string, lat: string, lng: string, timezone: string, tzofset: number, ayanid: number, lang: string, chtyp ) : Observable<Blob> {
 let tsec: string = dob.split('T')[1].split(':')[2].split('Z')[0]; 
 console.log(tsec);
 tsec = (tsec == '00') ? '0' : tsec;
 var oDat = {
	 uuid: uuid,
	 name: name,
	 gender: gender,
	 dob: dob.split('T')[0].split('-')[2] + '|' + dob.split('T')[0].split('-')[1] + '|' + dob.split('T')[0].split('-')[0],
	 tob: dob.split('T')[1].split(':')[0]  + '|' + dob.split('T')[1].split(':')[1] + '|' + tsec,
	 pob: pob,
	 latlng: lat + '|'+lng,
	 timezone: timezone,
	 tzofset: tzofset,
	 ayanid: ayanid,
	 lang: lang,
	 chtyp: chtyp
   };
	let headers = new HttpHeaders()
			.set('Accept', 'application/pdf; charset=utf-8') 
			.set('Content-Type', 'application/json; charset=utf-8');
return this.http.post<Blob>(this.apiUrl85, JSON.stringify(oDat), { headers : headers,responseType : 
         'blob' as 'json'});			
	//return this.http.post(this.apiUrl85, JSON.stringify(oDat), {headers: headers}).pipe(
    // map(this.extractData),
    //catchError(this.handleError)
   //);
   }
  talkToAstro(uid: string, uuid: string, aid: string) : Observable<{}> {
	let headers = new HttpHeaders()
			.set('Accept', 'application/json; charset=utf-8');   
	let httpParams = new HttpParams()
                        .set('uid', uid)
						.set('uuid', uuid)
						.set('aid', aid);
	return this.http.get(this.apiUrl49, {headers: headers, params: httpParams}).pipe(
    map(this.extractData),
    catchError(this.handleError)
   );
   
  }
  private extractData(res: Response) {
  let body = res;
  return body || { };
 }
  
  private handleError (error: Response | any) {
  let errMsg: string;
  if (error instanceof Response) {
    const err = error || '';
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  } else {
    errMsg = error.message ? error.message : error.toString();
  }
  console.error(errMsg);
  return observableThrowError(errMsg);
 }
calcSunDeclination(t)
{
  var e = this.calcObliquityCorrection(t);
  var lambda = this.calcSunApparentLong(t);

  var sint = Math.sin(this.degToRad(e)) * Math.sin(this.degToRad(lambda));
  var theta = this.radToDeg(Math.asin(sint));
  return theta;		// in degrees
}  
calcSunApparentLong(t)
{
  var o = this.calcSunTrueLong(t);
  var omega = 125.04 - 1934.136 * t;
  var lambda = o - 0.00569 - 0.00478 * Math.sin(this.degToRad(omega));
  return lambda;		// in degrees
}
calcSunTrueLong(t)
{
  var l0 = this.calcGeomMeanLongSun(t);
  var c = this.calcSunEqOfCenter(t);
  var O = l0 + c;
  return O;		// in degrees
}
calcSunEqOfCenter(t)
{
  var m = this.calcGeomMeanAnomalySun(t);
  var mrad = this.degToRad(m);
  var sinm = Math.sin(mrad);
  var sin2m = Math.sin(mrad+mrad);
  var sin3m = Math.sin(mrad+mrad+mrad);
  var C = sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin2m * (0.019993 - 0.000101 * t) + sin3m * 0.000289;
  return C;		// in degrees
}
calcSunriseSetUTC(rise, JD, latitude, longitude)
{
  var t = this.calcTimeJulianCent(JD);
  //console.log('TimeJulianCent', t);
  var eqTime = this.calcEquationOfTime(t);
  //console.log('eqTime', eqTime);
  var solarDec = this.calcSunDeclination(t);
  //console.log('solarDec', solarDec);
  var hourAngle = this.calcHourAngleSunrise(latitude, solarDec);
  //console.log('hourAngle', hourAngle);
  //alert("HA = " + radToDeg(hourAngle));
  if (!rise) hourAngle = -hourAngle;
//  var deg = this.radToDeg(hourAngle);
 // console.log('radToDeg', deg);
  var delta = longitude + this.radToDeg(hourAngle);
  //console.log('delta', delta);
  var timeUTC = 720 - (4.0 * delta) - eqTime;	// in minutes
  return timeUTC
} 
calcHourAngleSunrise(lat, solarDec)
{
  var latRad = this.degToRad(lat);
  var sdRad  = this.degToRad(solarDec);
  var HAarg = (Math.cos(this.degToRad(90.833))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad));
  var HA = Math.acos(HAarg);
  return HA;		// in radians (for sunset, use -HA)
} 
calcSunriseSet(rise, JD, latitude, longitude, timezone, dst)
// rise = 1 for sunrise, 0 for sunset
{
  //var id = ((rise) ? "risebox" : "setbox")
  var timeUTC = this.calcSunriseSetUTC(rise, JD, latitude, longitude);
  console.log('timeUTC', timeUTC);
  var newTimeUTC = this.calcSunriseSetUTC(rise, JD + timeUTC/1440.0, latitude, longitude); 
  console.log('newTimeUTC', newTimeUTC);
  if (this.isNumber(newTimeUTC)) {
    var timeLocal = newTimeUTC + (timezone * 60.0)
    timeLocal += ((dst) ? 60.0 : 0.0);
	console.log('timeLocal', timeLocal);
    if ( (timeLocal >= 0.0) && (timeLocal < 1440.0) ) {
      return this.timeString(timeLocal,2)
    } else  {
      var jday = JD
      var increment = ((timeLocal < 0) ? 1 : -1)
      while ((timeLocal < 0.0)||(timeLocal >= 1440.0)) {
        timeLocal += increment * 1440.0
	jday -= increment
      }
      return this.timeDateString(jday,timeLocal)
    }
  } else { // no sunrise/set found
    console.log('no sunrise/set found');
	return '';
  }
}  
timeDateString(JD, minutes)
{
  var output = this.timeString(minutes, 2) + " " + this.dayString(JD, 0, 2);
  return output;
}

timeString(minutes, flag)
// timeString returns a zero-padded string (HH:MM:SS) given time in minutes
// flag=2 for HH:MM, 3 for HH:MM:SS
{
  if ( (minutes >= 0) && (minutes < 1440) ) {
    var floatHour = minutes / 60.0;
    var hour = Math.floor(floatHour);
    var floatMinute = 60.0 * (floatHour - Math.floor(floatHour));
    var minute = Math.floor(floatMinute);
    var floatSec = 60.0 * (floatMinute - Math.floor(floatMinute));
    var second = Math.floor(floatSec + 0.5);
    if (second > 59) {
      second = 0
      minute += 1
    }
    if ((flag == 2) && (second >= 30)) minute++;
    if (minute > 59) {
      minute = 0
      hour += 1
    }
    var output = this.zeroPad(hour,2) + ":" + this.zeroPad(minute,2);
    if (flag > 2) output = output + ":" + this.zeroPad(second,2);
  } else { 
    var output = "error"
  }
  return output;
}
zeroPad(n, digits) {
  n = n.toString();
  while (n.length < digits) {
    n = '0' + n;
  }
  return n;
}
isNumber(inputVal) 
{
  var oneDecimal = false;
  var inputStr = "" + inputVal;
  for (var i = 0; i < inputStr.length; i++) 
  {
    var oneChar = inputStr.charAt(i);
    if (i == 0 && (oneChar == "-" || oneChar == "+"))
    {
      continue;
    }
    if (oneChar == "." && !oneDecimal) 
    {
      oneDecimal = true;
      continue;
    }
    if (oneChar < "0" || oneChar > "9")
    {
      return false;
    }
  }
  return true;
}
getJD(day, mon, yer)
{
  var docmonth = mon;
  var docday =   day;
  var docyear =  yer;
  if ( (this.isLeapYear(docyear)) && (docmonth == 2) ) {
    if (docday > 29) {
      docday = 29;
    } 
  } else {
    if (docday > this.monthList[docmonth-1].numdays) {
      docday = this.monthList[docmonth-1].numdays;
    }
  }
  if (docmonth <= 2) {
    docyear -= 1;
    docmonth += 12;
  }
  var A = Math.floor(docyear/100);
  var B = 2 - A + Math.floor(A/4);
  var JD = Math.floor(365.25*(docyear + 4716)) + Math.floor(30.6001*(docmonth+1)) + docday + B - 1524.5
  return JD
} 
getDateString(date) {

        var s = date.year 
		+ '-' 
		+ this.zeroPad(date.month,2) 
		+ '-' 
		+ this.zeroPad(date.day,2) 
		+ 'T' 
		+ this.zeroPad(date.hour,2) 
		+ ':' 
		+ this.zeroPad(date.minute,2) 
		+ ':'
		+ this.zeroPad(date.second,2)

	return s
}

calcTimeJulianCent(jd)
{
  var T = (jd - 2451545.0)/36525.0
  return T
}
calcSunTrueAnomaly(t)
{
  var m = this.calcGeomMeanAnomalySun(t);
  var c = this.calcSunEqOfCenter(t);
  var v = m + c;
  return v;		// in degrees
}
calcSunRadVector(t)
{
  var v = this.calcSunTrueAnomaly(t);
  var e = this.calcEccentricityEarthOrbit(t);
  var R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(this.degToRad(v)));
  return R;		// in AUs
}
calcAzEl(T, localtime, latitude, longitude, zone)
{
  var eqTime = this.calcEquationOfTime(T)
  var theta  = this.calcSunDeclination(T)
 
  var solarTimeFix = eqTime + 4.0 * longitude - 60.0 * zone
  var earthRadVec = this.calcSunRadVector(T)
  var trueSolarTime = localtime + solarTimeFix
  while (trueSolarTime > 1440)
  {
    trueSolarTime -= 1440
  }
  var hourAngle = trueSolarTime / 4.0 - 180.0;
  if (hourAngle < -180) 
  {
    hourAngle += 360.0
  }
  var haRad = this.degToRad(hourAngle)
  var csz = Math.sin(this.degToRad(latitude)) * Math.sin(this.degToRad(theta)) + Math.cos(this.degToRad(latitude)) * Math.cos(this.degToRad(theta)) * Math.cos(haRad)
  if (csz > 1.0) 
  {
    csz = 1.0
  } else if (csz < -1.0) 
  { 
    csz = -1.0
  }
  var zenith = this.radToDeg(Math.acos(csz))
  var azRad;
  var azDenom = ( Math.cos(this.degToRad(latitude)) * Math.sin(this.degToRad(zenith)) )
  if (Math.abs(azDenom) > 0.001) {
    azRad = (( Math.sin(this.degToRad(latitude)) * Math.cos(this.degToRad(zenith)) ) - Math.sin(this.degToRad(theta))) / azDenom
    if (Math.abs(azRad) > 1.0) {
      if (azRad < 0) {
	azRad = -1.0
      } else {
	azRad = 1.0
      }
    }
    var azimuth = 180.0 - this.radToDeg(Math.acos(azRad))
    if (hourAngle > 0.0) {
      azimuth = -azimuth
    }
  } else {
    if (latitude > 0.0) {
      azimuth = 180.0
    } else { 
      azimuth = 0.0
    }
  }
  if (azimuth < 0.0) {
    azimuth += 360.0
  }
  var exoatmElevation = 90.0 - zenith

// Atmospheric Refraction correction

  if (exoatmElevation > 85.0) {
    var refractionCorrection = 0.0;
  } else {
    var te = Math.tan (this.degToRad(exoatmElevation));
    if (exoatmElevation > 5.0) {
      var refractionCorrection = 58.1 / te - 0.07 / (te*te*te) + 0.000086 / (te*te*te*te*te);
    } else if (exoatmElevation > -0.575) {
      var refractionCorrection = 1735.0 + exoatmElevation * (-518.2 + exoatmElevation * (103.4 + exoatmElevation * (-12.79 + exoatmElevation * 0.711) ) );
    } else {
      var refractionCorrection = -20.774 / te;
    }
    refractionCorrection = refractionCorrection / 3600.0;
  }

  var solarZen = zenith - refractionCorrection;

  return (azimuth)
} 
calcEquationOfTime(t)
{
  var epsilon = this.calcObliquityCorrection(t);
  var l0 = this.calcGeomMeanLongSun(t);
  var e = this.calcEccentricityEarthOrbit(t);
  var m = this.calcGeomMeanAnomalySun(t);

  var y = Math.tan(this.degToRad(epsilon)/2.0);
  y *= y;

  var sin2l0 = Math.sin(2.0 * this.degToRad(l0));
  var sinm   = Math.sin(this.degToRad(m));
  var cos2l0 = Math.cos(2.0 * this.degToRad(l0));
  var sin4l0 = Math.sin(4.0 * this.degToRad(l0));
  var sin2m  = Math.sin(2.0 * this.degToRad(m));

  var Etime = y * sin2l0 - 2.0 * e * sinm + 4.0 * e * y * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;
  return this.radToDeg(Etime)*4.0;	// in minutes of time
}
calcMeanObliquityOfEcliptic(t)
{
  var seconds = 21.448 - t*(46.8150 + t*(0.00059 - t*(0.001813)));
  var e0 = 23.0 + (26.0 + (seconds/60.0))/60.0;
  return e0;		// in degrees
}

calcObliquityCorrection(t)
{
  var e0 = this.calcMeanObliquityOfEcliptic(t);
  var omega = 125.04 - 1934.136 * t;
  var e = e0 + 0.00256 * Math.cos(this.degToRad(omega));
  return e;		// in degrees
}
calcGeomMeanLongSun(t)
{
  var L0 = 280.46646 + t * (36000.76983 + t*(0.0003032))
  while(L0 > 360.0)
  {
    L0 -= 360.0
  }
  while(L0 < 0.0)
  {
    L0 += 360.0
  }
  return L0		// in degrees
}
calcEccentricityEarthOrbit(t)
{
  var e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  return e;		// unitless
}
calcGeomMeanAnomalySun(t)
{
  var M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  return M;		// in degrees
}
radToDeg(angleRad) 
{
  return (180.0 * angleRad / Math.PI);
}
isLeapYear(yr) 
{
  return ((yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0);
}

dayString(jd, next, flag)
{
// returns a string in the form DDMMMYYYY[ next] to display prev/next rise/set
// flag=2 for DD MMM, 3 for DD MM YYYY, 4 for DDMMYYYY next/prev
  if ( (jd < 900000) || (jd > 2817000) ) {
    var output = "error"
  } else {
  var z = Math.floor(jd + 0.5);
  var f = (jd + 0.5) - z;
  if (z < 2299161) {
    var A = z;
  } else {
    var alpha = Math.floor((z - 1867216.25)/36524.25);
    var A = z + 1 + alpha - Math.floor(alpha/4);
  }
  var B = A + 1524;
  var C = Math.floor((B - 122.1)/365.25);
  var D = Math.floor(365.25 * C);
  var E = Math.floor((B - D)/30.6001);
  var day = B - D - Math.floor(30.6001 * E) + f;
  var month = (E < 14) ? E - 1 : E - 13;
  var year = ((month > 2) ? C - 4716 : C - 4715);
  if (flag == 2)
    var output = this.zeroPad(day,2) + " " + this.monthList[month-1].abbr;
  if (flag == 3)
    var output = this.zeroPad(day,2) + this.monthList[month-1].abbr + year.toString();
  if (flag == 4)
    var output = this.zeroPad(day,2) + this.monthList[month-1].abbr + year.toString() + ((next) ? " next" : " prev");
  }
  return output;
}
degToRad(angleDeg) 
{
  return (Math.PI * angleDeg / 180.0);
}
 
}
