import { Component, Renderer2, ViewChild, ElementRef, OnInit, NgModule, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from '../share.service'
import { HoroscopeService } from '../horoscope.service';
import { PlanetDeity } from '../planet-deity';
import { PlanetRashi } from '../planet-rashi';
import { Observable, forkJoin } from 'rxjs';
@Component({
  selector: 'app-chart-analysis',
  templateUrl: './chart-analysis.component.html',
  styleUrls: ['./chart-analysis.component.scss'],
})
export class ChartAnalysisComponent implements OnInit {
  @ViewChild('divChart', {static: true}) divChart;
  signs_v: any;
  o_signs_v: any;
  rashis_v: any;
  o_rashis_v: any;
  ruler_name_v: any;
  rashi_lords_v: any;
  friend_pl_v: any;
  neutral_pl_v: any;
  enemy_pl_v: any;
  dcharts_v: any;
  dcharts_ta_v: any;
  istadevta_v: any;
  deities_v: any;
  svgHoro: any;
  title: string = '';
  asc_sign :string = '';
  trikona_lords :string = '';
  kendra_lords :string = '';
  device_width :number = 0;
  device_height :number = 0;
  akashWani :string = '';
  chart_id: string = '';
  atmk: string = '';
  oPlanet :PlanetDeity[] = [];
  oPR :PlanetRashi[] = [];
  showLS: boolean = false;
  objectKeys = Object.keys;
  binf: any;

  constructor(private router: Router, public renderer: Renderer2, el: ElementRef, public shareService: ShareService, public horoService: HoroscopeService) { 
	  if (this.router.getCurrentNavigation().extras.state) {
		  let item = this.router.getCurrentNavigation().extras.state;
		  this.chart_id = item['ID'];
		  this.atmk = item['atmk'];
		  this.binf = item['binf'];
	  } else {
		  let item = this.shareService.getBINF();
		  this.chart_id = item.ID;
		  this.atmk = item.atmk;
		  this.binf = item.binf;
		  console.log('binf', this.binf);
	  }
	  if (!this.binf) this.router.navigate(['/']);

  }

  ngOnInit() {
	  forkJoin(
		  this.horoService.getJson('assets/data/signs.json'),
		  this.horoService.getJson('assets/data/o_signs.json'),
		  this.horoService.getJson('assets/data/rashis.json'),
		  this.horoService.getJson('assets/data/o_rashis.json'),
		  this.horoService.getJson('assets/data/rashi_lords.json'),
		  this.horoService.getJson('assets/data/ruler_name.json'),
		  this.horoService.getJson('assets/data/friend_pl.json'),
		  this.horoService.getJson('assets/data/enemy_pl.json'),
		  this.horoService.getJson('assets/data/neutral_pl.json'),
		  this.horoService.getJson('assets/data/dcharts.json'),
		  this.horoService.getJson('assets/data/dcharts_ta.json'),
		  this.horoService.getJson('assets/data/istadevta.json'),
		  this.horoService.getJson('assets/data/dieties.json'),
	  )
		  .subscribe(dat => {
			  console.log('dat', dat);
			  this.signs_v = dat[0];
			  console.log('signs_v', this.signs_v);
			  this.o_signs_v = dat[1];
			  this.rashis_v = dat[2];
			  this.o_rashis_v = dat[3];
			  this.rashi_lords_v = dat[4];
			  this.ruler_name_v = dat[5];
			  this.friend_pl_v = dat[6];
			  this.enemy_pl_v = dat[7];
			  this.neutral_pl_v = dat[8];
			  this.dcharts_v = dat[9];
			  this.dcharts_ta_v = dat[10];
			  this.istadevta_v = dat[11];
			  this.deities_v = dat[12];

			  this.device_width = document.getElementById('bchart').offsetWidth;
			  this.device_height = document.getElementById('bchart').offsetWidth;
			  let plPos = this.updateNodePos();
			  console.log('plpos', plPos);
			  for (var i = 0; i < 16; i++) {
				  var sign = this.signs_v[i];
				  if (plPos.hasOwnProperty(sign)) {
					  var pls = plPos[sign].split('\|');
					  console.log(pls);
					  for (var k = 0; k < pls.length; k++) {
						  let pl = pls[k].split(' ')[1];
						  if (pl != 'Ra' && pl != 'Ke' && pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'AC' && pl != 'TR') {  //consider only true planets
							  let pn: string = this.translate(this.ruler_name_v[pl.toLowerCase()].toUpperCase());
							  let planetRashi: PlanetRashi = {
								  pos: pls[k].split(' ')[0].split('.')[0] + '\xB0' + pls[k].split(' ')[0].split('.')[1] + '\u2032' + pls[k].split(' ')[0].split('.')[2] + '"',
								  sign: this.translate(this.rashis_v[sign].split('\|')[1]),
								  star: '',
								  star_l: '',
								  sign_x: ''
							  };
							  this.oPR[pn] = planetRashi;
						  } else if (pl == 'Ra') { //consder Rahu
							  let pn: string = this.translate(this.ruler_name_v[pl.toLowerCase()].toUpperCase());
							  let planetRashi: PlanetRashi = {
								  pos: pls[k].split(' ')[0].split('.')[0] + '\xB0' + pls[k].split(' ')[0].split('.')[1] + '\u2032' + pls[k].split(' ')[0].split('.')[2] + '"',
								  sign: this.translate(this.rashis_v[sign].split('\|')[1]),
								  star: '',
								  star_l: '',
								  sign_x: ''
							  };
							  this.oPR[pn] = planetRashi;
						  } else if (pl == 'Ke') {
							  let pn: string = this.translate(this.ruler_name_v[pl.toLowerCase()].toUpperCase());
							  let planetRashi: PlanetRashi = {
								  pos: pls[k].split(' ')[0].split('.')[0] + '\xB0' + pls[k].split(' ')[0].split('.')[1] + '\u2032' + pls[k].split(' ')[0].split('.')[2] + '"',
								  sign: this.translate(this.rashis_v[sign].split('\|')[1]),
								  star: '',
								  star_l: '',
								  sign_x: ''
							  };
							  this.oPR[pn] = planetRashi;
						  } else if (pl == 'AC') {
							  let planetRashi: PlanetRashi = {
								  pos: pls[k].split(' ')[0].split('.')[0] + '\xB0' + pls[k].split(' ')[0].split('.')[1] + '\u2032' + pls[k].split(' ')[0].split('.')[2] + '"',
								  sign: this.translate(this.rashis_v[sign].split('\|')[1]),
								  star: '',
								  star_l: '',
								  sign_x: ''
							  };
							  this.oPR['ASC'] = planetRashi;
						  }
					  }
				  }
			  }

			  this.asc_sign = '';
			  this.trikona_lords = '';
			  this.kendra_lords = '';
			  this.akashWani = '';
			  console.log(this.chart_id);
			  let title: string = 'RASHI CHART';
			  let id: number = 1;
			  switch (this.chart_id) {
				  case 'D1':
					  title = 'RASHI CHART';
					  id = 1;
					  break;
				  case 'D2':
					  title = 'HORA CHART';
					  id = 2;
					  break;
				  case 'D3':
					  title = 'DRESHKANA'
					  id = 3;
					  break;
				  case 'D4':
					  title = 'CHATHURTHAMSA';
					  id = 4;
					  break;
				  case 'D7':
					  title = 'SAPTAMSA';
					  id = 7;
					  break;
				  case 'D9':
					  title = 'NAVAMSA';
					  id = 9;
					  break;
				  case 'D10':
					  title = 'DASAMSA';
					  id = 10;
					  break;
				  case 'D12':
					  title = 'DWADASAMSA';
					  id = 12;
					  break;
				  case 'D16':
					  title = 'SHODASAMSA';
					  id = 16;
					  break;
				  case 'D20':
					  title = 'VIMSAMSA';
					  id = 20;
					  break;
				  case 'D24':
					  title = 'CHATURVIMSAMSA';
					  id = 24;
					  break;
				  case 'D27':
					  title = 'SAPTAVIMSAMSA';
					  id = 27;
					  break;
				  case 'D30':
					  title = 'TRIMASAMSA';
					  id = 30
					  break;
				  case 'D40':
					  title = 'KHAVEDAMSA';
					  id = 40;
					  break;
				  case 'D45':
					  title = 'AKSHAVEDAMSA';
					  id = 45;
					  break;
				  case 'D60':
					  title = 'SHASTAMSA';
					  id = 60;
					  break;
				  default:
					  title = 'RASHI CHART';
					  id = 1;
					  break;
			  }
			  this.title = title + ' Analysis';

			  let oP: string[] = [];
			  oP = (this.chart_id == 'D2') ? this.calcHoraChart() : this.calcDivChart(id);
			  this.loadHoro(oP, this.divChart.nativeElement, title, id);

            let lang = this.shareService.getLANG();
			  if (lang == 'en')
				  this.akashWani = this.dcharts_v[this.chart_id];
			  else if (lang == 'ta')
				  this.akashWani = '<span><strong>' + this.dcharts_ta_v[this.chart_id] + '</strong></span>';
			  else
				  this.akashWani = this.dcharts_v[this.chart_id];
			// });
			  if (this.chart_id == 'D2') {
				  this.analyzHora(oP);
			  } else if (this.chart_id == 'D4') {
				  this.analyzeD4();
			  } else if (this.chart_id == 'D9') {
				  this.analyzeNav(oP);
			  } else if (this.chart_id == 'D60') {
				  this.showLS = true;
			  }
		});
  }
  analyzeD4()
  {
     this.akashWani = 'Analyzing chart please wait..';
  		let ayanid: number = 4;
		var res = this.shareService.getAYNM();
		if(res) ayanid = Number(res);

        let lang = this.shareService.getLANG();
  		 this.horoService.analyzeD4(this.binf.lat, this.binf.lng, this.binf.dob, this.binf.timezone, lang, ayanid)
			.subscribe(res2 => {
			    this.akashWani = this.dcharts_v[this.chart_id];
				let yogas = res2;
				for(let key of Object.keys(yogas)) {
					this.akashWani += yogas[key];
				}
			}, (err) => {
							//this.info = JSON.stringify(err);
			});

	

  }
	translate(lord: string)
	{

	 let lang = this.shareService.getLANG();
	  if(lang == 'en') return lord;
	  let trn: string = lord;
		switch(lord.toLowerCase())
		{
			case 'sun':
			case 'su':

				if(lang == 'te') {
					trn = 'సూర్యుడు';
				} else if(lang == 'hi') { 
					trn = 'रवि ग्रह';
				}
				break;
			case 'moon':
			case 'mo':

				if(lang == 'te') {
					trn = 'చంద్రుడు';
				} else if(lang == 'hi') { 
					trn = 'चांद ग्रह';
				}
				break;
			case 'jupiter':
			case 'ju':

				if(lang == 'te') {
					trn = 'బృహస్పతి';
				} else if(lang == 'hi') { 
					trn = 'बृहस्पति';
				}
				break;
			case 'mercury':
			case 'me':

				if(lang == 'te') {
					trn = 'బుధుడు';
				} else if(lang == 'hi') { 
					trn = 'बुध गृह';
				}
				break;
			case 'mars':
			case 'ma':

				if(lang == 'te') {
					trn = 'కుజుడు';
				} else if(lang == 'hi') { 
					trn = 'मंगल ग्रह';
				}
				break;
			case 'venus':
			case 've':

				if(lang == 'te') {
					trn = 'శుక్రుడు';
				} else if(lang == 'hi') { 
					trn = 'शुक्र ग्रह';
				}
				break;
			case 'saturn':
			case 'sa':

				if(lang == 'te') {
					trn = 'శనిగ్రహము';
				} else if(lang == 'hi') { 
					trn = 'शनि ग्रह';
				}
				break;
			case 'rahu':
			case 'ra':

				if(lang == 'te') {
					trn = 'రాహు';
				} else if(lang == 'hi') { 
					trn = 'राहु ग्रह';
				}
				break;
			case 'ketu':
			case 'ke':

				if(lang == 'te') {
					trn = 'కేతు';
				} else if(lang == 'hi') { 
					trn = 'केतु ग्रह';
				}
				break;
			case 'aries':

				if(lang == 'te') {
					trn = 'మేషరాశి';
				} else if(lang == 'hi') { 
					trn = 'मेष राशि';
				}
				break;
			case 'taurus':

				if(lang == 'te') {
					trn = 'వృషభరాశి';
				} else if(lang == 'hi') { 
					trn = 'वृषभ राशि';
				}
				break;
			case 'gemini':

				if(lang == 'te') {
					trn = 'మిధునరాశి';
				} else if(lang == 'hi') { 
					trn = 'मिथुन राशि';
				}
				break;
			case 'cancer':

				if(lang == 'te') {
					trn = 'కర్కాటకరాశి';
				} else if(lang == 'hi') { 
					trn = 'कर्क राशि';
				}
				break;
			case 'leo':

				if(lang == 'te') {
					trn = 'సిమ్హరాశి';
				} else if(lang == 'hi') { 
					trn = 'सिंह राशि';
				}
				break;
			case 'virgo':

				if(lang == 'te') {
					trn = 'కన్యరాశి';
				} else if(lang == 'hi') { 
					trn = 'कन्या राशि';
				}
				break;
			case 'libra':

				if(lang == 'te') {
					trn = 'తులారాసి';
				} else if(lang == 'hi') { 
					trn = 'तुला राशि';
				}
				break;
			case 'scorpio':

				if(lang == 'te') {
					trn = 'వృశ్చికరాసి';
				} else if(lang == 'hi') { 
					trn = 'वृश्चिक राशि';
				}
				break;
			case 'saggitarius':

				if(lang == 'te') {
					trn = 'ధనుస్సురాసి';
				} else if(lang == 'hi') { 
					trn = 'धनु राशि';
				}
				break;
			case 'capricorn':

				if(lang == 'te') {
					trn = 'మకరరాసి';
				} else if(lang == 'hi') { 
					trn = 'मकर राशि';
				}
				break;
			case 'aquarius':

				if(lang == 'te') {
					trn = 'కుంభరాసి';
				} else if(lang == 'hi') { 
					trn = 'कुंभ राशि';
				}
				break;
			case 'pisces':

				if(lang == 'te') {
					trn = 'మీనరాసి';
				} else if(lang == 'hi') { 
					trn = 'मीन राशि';
				}
				break;
			case 'ashwini':

				if(lang == 'te') {
					trn = 'అశ్వినీ';
				} else if(lang == 'hi') { 
					trn = 'अश्विनी';
				}
				break;
			case 'bharani':

				if(lang == 'te') {
					trn = 'భరణి';
				} else if(lang == 'hi') { 
					trn = 'भरणी';
				}
				break;
			case 'krittika':

				if(lang == 'te') {
					trn = 'కృత్తికా';
				} else if(lang == 'hi') { 
					trn = 'कृत्तिका';
				}
				break;
			case 'rohini':

				if(lang == 'te') {
					trn = 'రోహిణి';
				} else if(lang == 'hi') { 
					trn = 'रोहिणी';
				}
				break;
			case 'mrigashira':

				if(lang == 'te') {
					trn = 'మ్రిగశిర';
				} else if(lang == 'hi') { 
					trn = 'मृगशिरा';
				}
				break;
			case 'ardra':

				if(lang == 'te') {
					trn = 'ఆర్ద్ర';
				} else if(lang == 'hi') { 
					trn = 'आर्द्र';
				}
				break;
			case 'punarvasu':

				if(lang == 'te') {
					trn = 'పునర్వసు';
				} else if(lang == 'hi') { 
					trn = 'पुनर्वसु';
				}
				break;
			case 'pushya':

				if(lang == 'te') {
					trn = 'పుష్య';
				} else if(lang == 'hi') { 
					trn = 'पुष्य';
				}
				break;
			case 'ashlesha':

				if(lang == 'te') {
					trn = 'ఆశ్లేష';
				} else if(lang == 'hi') { 
					trn = 'अश्लेषा';
				}
				break;
			case 'magha':

				if(lang == 'te') {
					trn = 'మఘ';
				} else if(lang == 'hi') { 
					trn = 'मघा';
				}
				break;
			case 'purvaphalguni':

				if(lang == 'te') {
					trn = 'పూర్వఫల్గుణి';
				} else if(lang == 'hi') { 
					trn = 'पूर्वाफाल्गुनी';
				}
				break;
			case 'uttaraaphalguni':

				if(lang == 'te') {
					trn = 'ఉత్తరాఫల్గుణి';
				} else if(lang == 'hi') { 
					trn = 'उत्तराफाल्गुनी';
				}
				break;
			case 'hastha':

				if(lang == 'te') {
					trn = 'హస్త';
				} else if(lang == 'hi') { 
					trn = 'हस्ता';
				}
				break;
			case 'chitra':

				if(lang == 'te') {
					trn = 'చిత్ర';
				} else if(lang == 'hi') { 
					trn = 'चित्र';
				}
				break;
			case 'swati':

				if(lang == 'te') {
					trn = 'స్వాతి';
				} else if(lang == 'hi') { 
					trn = 'स्वाति';
				}
				break;
			case 'vishakha':

				if(lang == 'te') {
					trn = 'విశాఖ';
				} else if(lang == 'hi') { 
					trn = 'विशाखा';
				}
				break;
			case 'anuradha':

				if(lang == 'te') {
					trn = 'అనురాధ';
				} else if(lang == 'hi') { 
					trn = 'अनुराधा';
				}
				break;
			case 'jyestha':

				if(lang == 'te') {
					trn = 'జ్యేష్ఠా';
				} else if(lang == 'hi') { 
					trn = 'जयस्था';
				}
				break;
			case 'mula':

				if(lang == 'te') {
					trn = 'మూల';
				} else if(lang == 'hi') { 
					trn = 'मूल';
				}
				break;
			case 'purvaashada':

				if(lang == 'te') {
					trn = 'పూర్వాషాఢ';
				} else if(lang == 'hi') { 
					trn = 'पूर्वाषाढ़ा';
				}
				break;
			case 'uttaraashada':

				if(lang == 'te') {
					trn = 'ఉత్తరాషాఢ';
				} else if(lang == 'hi') { 
					trn = 'उत्तराषाढ़ा';
				}
				break;
			case 'shravana':

				if(lang == 'te') {
					trn = 'శ్రావణ';
				} else if(lang == 'hi') { 
					trn = 'श्रवण';
				}
				break;
			case 'danishta':

				if(lang == 'te') {
					trn = 'ధనిష్ఠ';
				} else if(lang == 'hi') { 
					trn = 'धनिष्ठा';
				}
				break;
			case 'shatabhisha':

				if(lang == 'te') {
					trn = 'శతభిషా';
				} else if(lang == 'hi') { 
					trn = 'शतभिषा';
				}
				break;
			case 'purvabhadra':

				if(lang == 'te') {
					trn = 'పూర్వాభాద్ర';
				} else if(lang == 'hi') { 
					trn = 'पूर्वभाद्र';
				}
				break;
			case 'uttarabhadra':

				if(lang == 'te') {
					trn = 'ఉత్తరాభాద్ర';
				} else if(lang == 'hi') { 
					trn = 'उत्तरभाद्र';
				}
				break;
			case 'revati':

				if(lang == 'te') {
					trn = 'రేవతి';
				} else if(lang == 'hi') { 
					trn = 'रेवती';
				}
				break;
			default:
				trn = lord;
				break;
		}
		return trn;
	}
  analyzeNav(plPos)
  {
       this.akashWani = 'Analyzing chart please wait..';
  		let ayanid: number = 4;
		var res = this.shareService.getAYNM();
		if(res) ayanid = Number(res);

        let lang = this.shareService.getLANG();
  		 this.horoService.analyzeD9(this.binf.lat, this.binf.lng, this.binf.dob, this.binf.timezone, lang, ayanid)
			.subscribe(res2 => {
			    this.akashWani = '<h2>Why Navamsha Chart Is Important</h2>';
			    this.akashWani += this.dcharts_v[this.chart_id];
				let ar: string = '';
				console.log('finding atm rashi in nav chart', this.atmk);
				for (var i = 0; i < 16; i++) {
					var sign = this.signs_v[i];
					if (plPos.hasOwnProperty(sign)) {
						var pls = plPos[sign].split('\|');
						console.log(pls);
						for (var k = 0; k < pls.length; k++) {
							if(pls[k].split(' ')[1] == this.atmk) { ar = sign; break; }
						}
					}
				}
				console.log('rashi is', ar);
				var arr = ['ar','ta','ge','cn','le','vi','li','sc','sa','cp','aq','pi'];
				let pos: number = 0;
				let basc: boolean = false;
				let istp: string = '';
				let kks: string = '';
				console.log('locating 12 house planets from rashi');
				for(var k = 0; k < 12; k++) {
				  if(arr[k] == ar) { console.log('ak sign match', arr[k]); basc = true};
				  if(basc) pos++;
				  if(pos == 12) { 
					  if (plPos.hasOwnProperty(arr[k])) {
						var pls = plPos[arr[k]].split('\|');
						console.log(pls);
						for (var j = 0; j < pls.length; j++) {
						   var pl = pls[j].split(' ')[1];
							if (pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'AC' && pl != 'TRUE_NODE' && pl != 'TR') istp += pl + ',';
						}
					}
					console.log('12th sign', arr[k]);
					kks = arr[k];
					
					break; 
				  }
				  if(k == 11) k = -1;
				}
				this.akashWani += '<h3>Your Atmakaraka & Istadivam(s)</h3>';
				console.log('12 house planets are', istp);
				let esp: string = (istp == '') ? ' No planets occupied.' : istp + ' occupied';
				let hes: string = (istp == '') ? ' Hence your Istadivam is the deity belong to house lord ' + this.rashi_lords_v[kks] : ' Hence your Istadivam is the diety belong to planet(s) ' + istp;
				this.akashWani += 'Your Atmakaraka is ' + this.ruler_name_v[this.atmk.toLowerCase()] + '<br>';
				this.akashWani += 'In your NAVAMSA chart, Atmakaraka has occupied ' + this.rashis_v[ar].split('|')[1] + ' which is your Karakamsha<br>';
				this.akashWani += 'Your Istadivam to be looked at the 12th sign from Karakamsha which is ' + this.rashis_v[kks].split('|')[1] + '<br>';
				this.akashWani += 'In ' + this.rashis_v[kks].split('|')[1] +  ' ' + esp + '<br>';
				this.akashWani += hes;
				var kpl = istp.split(',');
				let istdevs: string = '';
				
				if(istp == '') {
				   istdevs = this.istadevta_v[this.rashi_lords_v[kks].substring(0,2).toLowerCase()];
				} else  {
				  for(var p = 0; p < kpl.length; p++) {
					istdevs += this.istadevta_v[kpl[p].toLowerCase()] + ',';
					}
				}
				this.akashWani += '<br>Your Istadivam is: ' + istdevs ;
				this.akashWani += '<h2>Detailed Analysis</h2>';
				let yogas = res2;
				for(let key of Object.keys(yogas)) {
					this.akashWani += yogas[key];
				}
			}, (err) => {
							//this.info = JSON.stringify(err);
			});

  }
  analyzHora(plPos)
  {
	this.akashWani += '<br><br><span class="note"><strong>PLEASE NOTE: Below analysis is taken from one of references, the below point system need not be accurate, please consider expert analysis </strong></span><br><br>';
	let cn_p: number = 0, le_p: number = 0;
	let ju: number = 0, ve: number = 0, me: number = 0, mo: number = 0, su: number = 0, ma: number = 0, sa: number = 0;
	var ju_i = [], ve_i = [], me_i = [], mo_i = [], su_i = [], ma_i = [], sa_i = [];
	for(var i = 0; i < this.signs_v.length; i++) {
		var sign = this.signs_v[i];
		if (plPos.hasOwnProperty(sign)) {
			var pls = plPos[sign].split('\|');
			for (k = 0; k < pls.length; k++) {
				var pl = pls[k].split(' ')[1];
				if (pl != 'Ra' && pl != 'Ke' && pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'AC' && pl != 'TRUE_NODE') {  //consider only true planets
					var fp = 0;	
					if(sign == 'cn' && pl == 'Ju') {
						ju += 5;   //RULE-1 check if Ju is in cn(exalted sign)
						ju_i.push('Exaled Jupiter in Cancer gains 5 points');
					}
					if(sign == 'cn' && pl == 'Mo') {
						mo += 4;   //RULE-2 check if planet in its own sign
						mo_i.push('Lord of Cancer Moon in Cancer gains 4 points');
					}
					if(sign == 'le' && pl == 'Su') {
						su += 4;   //RULE-2 check if planet in its own sign
						su_i.push('Lord of Leo Sun in Leo gains 4 points');
					}
					var frPls = this.friend_pl_v[this.rashi_lords_v[sign]].split('\|');
					console.log('Friendly planets for ' + this.rashi_lords_v[sign] + ' are ' + frPls);
					for(fp = 0; fp < frPls.length; fp++) {
					    console.log(frPls[fp], pl.toLowerCase());
						if(frPls[fp] == pl.toLowerCase()) {
							 console.log('matched');
							switch(frPls[fp])
							{
								case 'ju':
									ju += 3;
									ju_i.push('Jupiter in friendly sign gains 3 points');
									break;
								case 've':
									ve += 3;
									ve_i.push('Venus in friendly sign gains 3 points');
									break;
								case 'me':
									me += 3;
									me_i.push('Mercury in friendly sign gains 3 points');
									break;
								case 'mo':
									mo += 3;
									mo_i.push('Moon in friendly sign gains 3 points');
									break;
								case 'su':
									su += 3;
									su_i.push('Sun in friendly sign gains 3 points');
									break;
								case 'ma':
									if(sign != 'cn') {
										ma += 3;
										ma_i.push('Mars in friendly sign gains 3 points');
									} else {
										ma_i.push('Debilitated Mars in Cancer gains 0 points');
									}
									break;
								case 'sa':
									sa += 3;
									sa_i.push('Saturn in friendly sign gains 3 points');
									break;
								default:
									break;
							}	
						}
					}
					frPls = this.neutral_pl_v[this.rashi_lords_v[sign]].split('\|');
					console.log('Neutral planets for ' + this.rashi_lords_v[sign] + ' are ' + frPls);
					for(fp = 0; fp < frPls.length; fp++) {
						if(frPls[fp] == pl.toLowerCase()) {
							switch(frPls[fp])
							{
								case 'ju':
									ju += 2;
									ju_i.push('Jupiter in neutral sign gains 2 points');
									break;
								case 've':
									ve += 2;
									ve_i.push('Venus in neutral sign gains 2 points');
									break;
								case 'me':
									me += 2;
									me_i.push('Mercury in neutral sign gains 2 points');
									break;
								case 'mo':
									mo += 2;
									mo_i.push('Moon in neutral sign gains 2 points');
									break;
								case 'su':
									su += 2;
									su_i.push('Sun in neutral sign gains 2 points');
									break;
								case 'ma':
									if(sign != 'cn') {
										ma += 2;
										ma_i.push('Mars in neutral sign gains 2 points');
									}
									break;
								case 'sa':
									sa += 2;
									sa_i.push('Saturn in neutral sign gains 2 points');
									break;
								default:
									break;
							}
						}
					}
					frPls = this.enemy_pl_v[this.rashi_lords_v[sign]].split('\|');
					console.log('Enemy planets for ' + this.rashi_lords_v[sign] + ' are ' + frPls);
					for(fp = 0; fp < frPls.length; fp++) {
						if(frPls[fp] == pl.toLowerCase()) {
							switch(frPls[fp])
							{
								case 'ju':
									ju += 1;
									ju_i.push('Jupiter in enemy sign gains 1 point');
									break;
								case 've':
									ve += 1;
									ve_i.push('Venus in enemy sign gains 1 point');
									break;
								case 'me':
									me += 1;
									me_i.push('Mercury in enemy sign gains 1 point');
									break;
								case 'mo':
									mo += 1;
									mo_i.push('Moon in enemy sign gains 1 point');
									break;
								case 'su':
									su += 1;
									su_i.push('Sun in enemy sign gains 1 point');
									break;
								case 'ma':
									if(sign != 'cn') {
										ma += 1;
										ma_i.push('Mars in enemy sign gains 1 point');
									} 
									break;
								case 'sa':
									sa += 1;
									sa_i.push('Saturn in enemy sign gains 1 point');
									break;
								default:
									break;
							}
						}						
					}
					switch(pl.toLowerCase())
					{
						case 'ju':
							(sign == 'le') ? ju *= 2 : ju /= 2;
							ju_i.push((sign == 'le') ? 'Jupiter is in the sign of its own gender thus doubles the points to ' + ju.toString() : 'Jupiter is in the sign of its opposite gender thus loses its points to half ' + ju.toString() );
							break;
						case 've':
							(sign == 'cn') ? ve *= 2 : ve /= 2;
							ve_i.push((sign == 'cn') ? 'Venus is in the sign of its own gender thus doubles the points to ' + ve.toString() : 'Venus is in the sign of its opposite gender thus loses its points to half ' + ve.toString() );
							break;
						case 'mo':
							(sign == 'cn') ? mo *= 2 : mo /= 2;
							mo_i.push((sign == 'cn') ? 'Moon is in the sign of its own gender thus doubles the points to ' + mo.toString() : 'Moon is in the sign of its opposite gender thus loses its points to half ' + mo.toString() );
							break;
						case 'su':
							(sign == 'le') ? su *= 2 : su /= 2;
							su_i.push((sign == 'le') ? 'Sun is in the sign of its own gender thus doubles the points to ' + su.toString() : 'Sun is in the sign of its opposite gender thus loses its points to half ' + su.toString() );
							break;
						case 'ma':
							(sign == 'le') ? ma *= 2 : ma /= 2;
							ma_i.push((sign == 'le') ? 'Mars is in the sign of its own gender thus doubles the points to ' + ma.toString() : 'Mars is in the sign of its opposite gender thus loses its points to half ' + ma.toString() );
							break;
						default:
							break;
					}	
				}
			}
		}
	}
	for(var p = 0; p < su_i.length; p++) {
		this.akashWani += '<span>' + su_i[p] + '</span><br/>';
	}
	this.akashWani += '<span>TOTALLY SUN GAINS ' + su.toString() + ' POINTS</span><br/><br/>';
	for(var p = 0; p < mo_i.length; p++) {
		this.akashWani += '<span>' + mo_i[p] + '</span><br/>';
	}
	this.akashWani += '<span>TOTALLY MOON GAINS ' + mo.toString() + ' POINTS</span><br/><br/>';
	for(var p = 0; p < ju_i.length; p++) {
		this.akashWani += '<span>' + ju_i[p] + '</span><br/>';
	}
	this.akashWani += '<span>TOTALLY JUPITER GAINS ' + ju.toString() + ' POINTS</span><br/><br/>';
	for(var p = 0; p < ve_i.length; p++) {
		this.akashWani += '<span>' + ve_i[p] + '</span><br/>';
	}
	this.akashWani += '<span>TOTALLY VENUS GAINS ' + ve.toString() + ' POINTS</span><br/><br/>';
	for(var p = 0; p < ma_i.length; p++) {
		this.akashWani += '<span>' + ma_i[p] + '</span><br/>';
	}
	this.akashWani += '<span>TOTALLY MARS GAINS ' + ma.toString() + ' POINTS</span><br/><br/>';
	for(var p = 0; p < me_i.length; p++) {
		this.akashWani += '<span>' + me_i[p] + '</span><br/>';
	}
	this.akashWani += '<span>TOTALLY MERCURY GAINS ' + me.toString() + ' POINTS</span><br/><br/>';
  	for(var p = 0; p < sa_i.length; p++) {
		this.akashWani += '<span>' + sa_i[p] + '</span><br/>';
	}
	this.akashWani += '<span>TOTALLY SATURN GAINS ' + sa.toString() + ' POINTS</span><br/><br/>';
    let cn_pls: string = '',le_pls: string = '';
	for(i = 0; i < this.signs_v.length; i++) {
		sign = this.signs_v[i];
		if(plPos.hasOwnProperty(sign)) {
			var pls = plPos[sign].split('\|');
			for (var k = 0; k < pls.length; k++) {
				var pl = pls[k].split(' ')[1];
				if (pl != 'Ra' && pl != 'Ke' && pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'AC' && pl != 'TRUE_NODE') {  //consider only true planets
					(sign == 'cn') ? cn_pls += this.ruler_name_v[pl.toLowerCase()] + ',' : le_pls += this.ruler_name_v[pl.toLowerCase()] + ',';
					switch(pl.toLowerCase())
					{
						case 'ju':
							(sign == 'cn') ? cn_p += ju : le_p += ju;
							break;
						case 've':
							(sign == 'cn') ? cn_p += ve : le_p += ve;
							break;
						case 'me':
							(sign == 'cn') ? cn_p += me : le_p += me;
							break;
						case 'su':
							(sign == 'cn') ? cn_p += su : le_p += su;
							break;
						case 'mo':
							(sign == 'cn') ? cn_p += mo : le_p += mo;
							break;
						case 'ma':
							(sign == 'cn') ? cn_p += ma : le_p += ma;
							break;
						case 'sa':
							(sign == 'cn') ? cn_p += sa : le_p += sa;
							break;
						default:
							break;
					}
				}
			}
		}
	}
	if(this.asc_sign == 'cn') {
		this.akashWani += '<span><strong>1st HOUSE CANCER sign hosting ' + cn_pls + ' has gained ' + cn_p.toString() + ' Points.</strong></span><br/>';
		this.akashWani += '<span><strong>2nd HOUSE LEO sign hosting ' + le_pls + ' has gained ' + le_p.toString() + ' Points.</strong></span><br/>';
		if(le_p > cn_p) 
			this.akashWani += '<span><strong>The native will accumulate more wealth</strong></span><br/>';
		
	} else {
		this.akashWani += '<span><strong>12th HOUSE CANCER sign hosting ' + cn_pls + ' has gained ' + cn_p.toString() + ' Points.</strong></span><br/>';
		this.akashWani += '<span><strong>1st HOUSE LEO sign hosting ' + le_pls + ' has gained ' + le_p.toString() + ' Points.</strong></span><br/>';
		if(cn_p > le_p)
			this.akashWani += '<span><strong>The native spends more</strong></span><br/>';
		else
			this.akashWani += '<span><strong>The native will be wealthy</strong></span><br/>';
	}
	if(cn_p == le_p)
			this.akashWani += '<span><strong>The native maintains whats inherited</strong></span><br/>';
  }
  updateNodePos() {
	var plPos = this.shareService.getPLPOS();
   		for (var i = 0; i < 16; i++) {
			var sign = this.signs_v[i];
			if (plPos.hasOwnProperty(sign)) {
				var pls = plPos[sign].split('\|');
				for (var k = 0; k < pls.length; k++) {
					if (pls[k].split(' ')[1] == 'MEAN_NODE') {
						var rpos = this.o_rashis_v[sign].split('\|')[0];
						var kpos = parseInt(rpos, 10) + 6;
						if (kpos > 12) kpos = (kpos - 12);
						if (plPos.hasOwnProperty(this.o_signs_v[kpos - 1])) {
							var eP = plPos[this.o_signs_v[kpos - 1]];
							plPos[this.o_signs_v[kpos - 1]] = eP + '|' + pls[k].split(' ')[0] + ' ' + 'Ke';
						} else {
							plPos[this.o_signs_v[kpos - 1]] = pls[k].split(' ')[0] + ' ' + 'Ke';
						}
						plPos[sign] = plPos[sign].replace('MEAN_NODE', 'Ra');
					} else if (pls[k].split(' ')[1] == 'AC') { 
						this.asc_sign = sign;
						console.log('ASCENDENT is ' + this.asc_sign);
					} else if (pls[k].split(' ')[1] == 'TRUE_NODE') {
						plPos[sign] = plPos[sign].replace('TRUE_NODE', 'TR');		
					}
				}
			}
		}
		return plPos;
	}
  loadHoro(plPos, ele, title, id)
  {
  console.log('loadHoro');
		for (var i = 0; i < 16; i++) {
			var sign = this.signs_v[i];
			if (plPos.hasOwnProperty(sign)) {
				var pls = plPos[sign].split('\|');
				console.log(pls);
				for (var k = 0; k < pls.length; k++) {
					let pl = pls[k].split(' ')[1];
					if (pl != 'Ra' && pl != 'Ke' && pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'AC' && pl != 'TR') {  //consider only true planets
						let pn: string = this.translate(this.ruler_name_v[pl.toLowerCase()].toUpperCase());
						this.oPR[pn].sign_x = this.translate(this.rashis_v[sign].split('\|')[1]);;
					} else if (pl == 'Ra') { //consder Rahu
						let pn: string = this.translate(this.ruler_name_v[pl.toLowerCase()].toUpperCase());
						this.oPR[pn].sign_x = this.translate(this.rashis_v[sign].split('\|')[1]);;
					} else if (pl == 'Ke') {
						let pn: string = this.translate(this.ruler_name_v[pl.toLowerCase()].toUpperCase());
						this.oPR[pn].sign_x = this.translate(this.rashis_v[sign].split('\|')[1]);;
					} else if(pl == 'AC') {
						this.asc_sign = sign;
						this.oPR['ASC'].sign_x = this.translate(this.rashis_v[sign].split('\|')[1]);;
					}
				}
			}
		}
		if(this.shareService.getCHTYP() == 'sind')
			this.svgHoro = this.grid(4, this.device_width/4, this.device_width, plPos, title, id);
		else if(this.shareService.getCHTYP() == 'nind')
			this.svgHoro = this.drawNIchart(plPos, title, id);
		else
			this.svgHoro = this.grid(4, this.device_width/4, this.device_width, plPos, title, id);
        this.renderer.appendChild(this.divChart.nativeElement, this.svgHoro);
		var h_code;
		var unq = [];
		h_code += '<span>';
		if (this.trikona_lords.length > 0) {
			var lords = this.trikona_lords.split('\|');
			for (i = 0; i < lords.length; i++) {
				if (unq.indexOf(lords[i]) < 0) {
					h_code += ' ' + this.translate(lords[i]);
					unq.push(lords[i]);
				}
			}
		}
		if (this.kendra_lords.length > 0) {
			lords = this.kendra_lords.split('\|');
			for (i = 0; i < lords.length; i++) {
				if (unq.indexOf(lords[i]) < 0) {
					h_code += ' ' + this.translate(lords[i]);
					unq.push(lords[i]);
				}
			}
		}
		h_code += '</span>';
		var ausp = 0;
		var ausp_lords = '';
		var klord_in_tri = '';
		var tlord_in_ken = '';
		var klord_in_ken = '';
		var tlord_in_tri = '';
		var vp_rulers = '';
		var vp_owners = '';
		for (i = 0; i < 12; i++) {
			if (this.o_signs_v[i] == this.asc_sign) {
				if (plPos.hasOwnProperty(this.asc_sign)) {
					pls = plPos[this.asc_sign].split('\|');
					for (k = 0; k < pls.length; k++) {
						var pl = pls[k].split(' ')[1];
						if (pl != 'Ra' && pl != 'Ke' && pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'AC' && pl != 'TRUE_NODE') {  //consider only true planets
							if (this.kendra_lords.indexOf(this.ruler_name_v[pls[k].split(' ')[1].toLowerCase()]) > -1) {
								ausp_lords += this.ruler_name_v[pls[k].split(' ')[1].toLowerCase()] + ' ';
								klord_in_tri += '1|' + this.ruler_name_v[pls[k].split(' ')[1].toLowerCase()] + '&';
								ausp++;
							}
							if (this.trikona_lords.indexOf(this.ruler_name_v[pls[k].split(' ')[1].toLowerCase()]) > -1) {
								if (ausp_lords.indexOf(this.ruler_name_v[pls[k].split(' ')[1].toLowerCase()]) == -1) {
									ausp_lords += this.ruler_name_v[pls[k].split(' ')[1].toLowerCase()] + ' ';
									tlord_in_tri += '1|' + this.ruler_name_v[pls[k].split(' ')[1].toLowerCase()] + '&';
									ausp++;
								}
							}
						}
					}
					if (ausp > 1) {
					}
				}
				var as = 1;
				this.rashis_v[this.asc_sign] = '1|' + this.rashis_v[this.asc_sign].split('\|')[1];
				for (var j = i + 1; j < 12; j++) {
					as++;
					this.rashis_v[this.o_signs_v[j]] = (as).toString() + '|' + this.rashis_v[this.o_signs_v[j]].split('\|')[1];
					if (as == 5 || as == 9) {
						if (plPos.hasOwnProperty(this.o_signs_v[j])) {
							ausp_lords = '';
							ausp = 0;
							pls = plPos[this.o_signs_v[j]].split('\|');
							for (k = 0; k < pls.length; k++) {
								pl = pls[k].split(' ')[1];
								if (pl != 'Ra' && pl != 'Ke' && pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'AC' && pl != 'TRUE_NODE') {  //consider only true planets
									if (this.kendra_lords.indexOf(this.ruler_name_v[pls[k].split(' ')[1].toLowerCase()]) > -1) {
										ausp_lords += this.ruler_name_v[pls[k].split(' ')[1].toLowerCase()] + ' ';
										klord_in_tri += (as).toString() + '|' + this.ruler_name_v[pls[k].split(' ')[1].toLowerCase()] + '&';
										ausp++;
									}
									if (this.trikona_lords.indexOf(this.ruler_name_v[pls[k].split(' ')[1].toLowerCase()]) > -1) {
										if (ausp_lords.indexOf(this.ruler_name_v[pls[k].split(' ')[1].toLowerCase()]) == -1) {
											ausp_lords += this.ruler_name_v[pls[k].split(' ')[1].toLowerCase()] + ' ';
											tlord_in_tri += (as).toString() + '|' + this.ruler_name_v[pls[k].split(' ')[1].toLowerCase()] + '&';
											ausp++;
										}
									}
								}
							}
							if (ausp > 1) {
							}
						}
					}
					else if (as == 4 || as == 7 || as == 10) {
						if (plPos.hasOwnProperty(this.o_signs_v[j])) {
							ausp_lords = '';
							ausp = 0;
							pls = plPos[this.o_signs_v[j]].split('\|');
							for (l = 0; l < pls.length; l++) {
								pl = pls[l].split(' ')[1];
								if (pl != 'Ra' && pl != 'Ke' && pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'AC' && pl != 'TRUE_NODE') {  //consider only true planets
									if (this.kendra_lords.indexOf(this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()]) > -1) {
										ausp_lords += this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()] + ' ';
										klord_in_ken += (as).toString() + '|' + this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()] + '|' + this.rashi_lords_v[this.o_signs_v[j]] + '&';
										ausp++;
									}
									if (this.trikona_lords.indexOf(this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()]) > -1) {
										if (ausp_lords.indexOf(this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()]) == -1) {
											ausp_lords += this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()] + ' ';
											tlord_in_ken += (as).toString() + '|' + this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()] + '&';
											ausp++;
										}
									}
								}
							}
							if (ausp > 1) {
							}
						}
					}
					else if(as == 6 || as == 8 || as == 12) {
						if (plPos.hasOwnProperty(this.o_signs_v[j])) {
							ausp_lords = '';
							ausp = 0;
							pls = plPos[this.o_signs_v[j]].split('\|');
							for (l = 0; l < pls.length; l++) {								
							    pl = pls[l].split(' ')[1];
								if (pl != 'Ra' && pl != 'Ke' && pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'AC' && pl != 'TRUE_NODE') {  //consider only true planets
								  vp_rulers += this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()] + '-' + (as).toString() + '|';
								  vp_owners += this.rashi_lords_v[this.o_signs_v[j]] + '-' + (as).toString() + '|';
								}
							}
						}
					}
				}
				for (k = 0; k < i; k++) {
					var hno = ((12 - i) + (k + 1));
					this.rashis_v[this.o_signs_v[k]] = hno.toString() + '|' + this.rashis_v[this.o_signs_v[k]].split('\|')[1];
					if (plPos.hasOwnProperty(this.o_signs_v[k])) {
					if (hno == 5 || hno == 9) {
						ausp_lords = '';
						ausp = 0;
						pls = plPos[this.o_signs_v[k]].split('\|');
						for (l = 0; l < pls.length; l++) {
							pl = pls[l].split(' ')[1];
							if (pl != 'Ra' && pl != 'Ke' && pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'AC' && pl != 'TRUE_NODE') {  //consider only true planets
								if (this.kendra_lords.indexOf(this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()]) > -1) {
									ausp_lords += this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()] + ' ';
									klord_in_tri += (hno).toString() + '|' + this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()] + '&';
									ausp++;
								}
								if (this.trikona_lords.indexOf(this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()]) > -1) {
									if (ausp_lords.indexOf(this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()]) == -1) {
										ausp_lords += this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()] + ' ';
										tlord_in_tri += (hno).toString() + '|' + this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()] + '&';
										ausp++;
									}
								}
							}
						}
						if (ausp > 1) {
						}
					}
					else if (hno == 4 || hno == 7 || hno == 10) {
						ausp_lords = '';
						ausp = 0;
						pls = plPos[this.o_signs_v[k]].split('\|');
						for (var l = 0; l < pls.length; l++) {
							pl = pls[l].split(' ')[1];
							if (pl != 'Ra' && pl != 'Ke' && pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'AC' && pl != 'TRUE_NODE') {  //consider only true planets
								if (this.kendra_lords.indexOf(this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()]) > -1) {
									ausp_lords += this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()] + ' ';
									klord_in_ken += (hno).toString() + '|' + this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()] + '|' + this.rashi_lords_v[this.o_signs_v[k]] + '&';
									ausp++;
								}
								if (this.trikona_lords.indexOf(this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()]) > -1) {
									if (ausp_lords.indexOf(this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()]) == -1) {
										ausp_lords += this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()] + ' ';
										tlord_in_ken += (hno).toString() + '|' + this.ruler_name_v[pls[l].split(' ')[1].toLowerCase()] + '&';
										ausp++;
									}
								}
							}
						}
						if (ausp > 1) {
						}
					}
				  }
				}
			}
		}
		var tklords = '';
		if(tlord_in_tri.length > 0) {
			var tlords = tlord_in_tri.split('&');
			for(var tlt = 0; tlt < tlords.length-1; tlt++) {
			    if(this.shareService.getLANG() == 'en') {
					h_code += '<h4>Trikona Lord ' + tlords[tlt].split('|')[1] + ' in Trikona ' + tlords[tlt].split('|')[0] + ' House</h4>';
				} else if(this.shareService.getLANG() == 'te') {
					h_code += '<h4>త్రికొనా ' +  tlords[tlt].split('|')[0] + ' House లో త్రికొనాధిపతి ' + this.translate(tlords[tlt].split('|')[1]) + ' ఉన్నారు</h4>';
				} else if(this.shareService.getLANG() == 'hi') {
					h_code += '<h4>त्रिकोणा ' +  tlords[tlt].split('|')[0] + ' House में त्रिकोणादिपति ' + this.translate(tlords[tlt].split('|')[1]) + ' रहा है</h4>';
				}
				tklords += tlords[tlt].split('|')[1] + ' ';
			}
		}
		if(tlord_in_ken.length > 0) {
			var tlordss = tlord_in_tri.split('&');
			for(var tlk = 0; tlk < tlordss.length-1; tlk++) {
			    if(this.shareService.getLANG() == 'en') {
					h_code += '<h4>Trikona Lord ' + tlordss[tlk].split('|')[1] + ' in Kendra ' + tlordss[tlk].split('|')[0] + ' House</h4>';
				} else if(this.shareService.getLANG() == 'te') {
					h_code += '<h4>ఖెన్ద్ర ' +  tlords[tlk].split('|')[0] + ' House లో త్రికొనాధిపతి ' + this.translate(tlords[tlk].split('|')[1]) + 'ఉన్నారు</h4>';
				} else if(this.shareService.getLANG() == 'hi') {
					h_code += '<h4>केंद्र ' +  tlords[tlk].split('|')[0] + ' House में त्रिकोणादिपति '  + this.translate(tlords[tlk].split('|')[1]) + ' रहा है</h4>';
				}
				tklords += tlordss[tlk].split('|')[1] + ' ';
			}
		}
		if(klord_in_tri.length > 0) {
			var klords = klord_in_tri.split('&');
			for(var klt = 0; klt < klords.length-1; klt++) {
			    if(this.shareService.getLANG() == 'en') {
					h_code += '<h4>Kendra Lord ' + klords[klt].split('|')[1] + ' in Trikona ' + klords[klt].split('|')[0] + ' House</h4>';
				} else if(this.shareService.getLANG() == 'te') {
					h_code += '<h4>త్రికొనా ' +  klords[klt].split('|')[0] + ' House లో ఖెన్ద్రాధిపతి ' + this.translate(klords[klt].split('|')[1]) + 'ఉన్నారు</h4>';
				} else if(this.shareService.getLANG() == 'hi') {
					h_code += '<h4>त्रिकोण ' +  klords[klt].split('|')[0] + ' House में  केन्द्राधिपति ' + this.translate(klords[klt].split('|')[1]) + ' रहा है</h4>';
				}
				tklords += klords[klt].split('|')[1] + ' ';
			}
		}
		if(klord_in_ken.length > 0) {
			var klordss = klord_in_ken.split('&');
			var pyoga = 0;
			for(var klk = 0; klk < klordss.length-1; klk++) {
			    if(this.shareService.getLANG() == 'en') {
					h_code += '<h4>Kendra Lord ' + klordss[klk].split('|')[1] + ' in Kendra ' + klordss[klk].split('|')[0] + ' House';
				}  else if(this.shareService.getLANG() == 'te') {
					h_code += '<h4>ఖెన్ద్ర ' +  klordss[klk].split('|')[0] + ' House లో ఖెన్ద్రాధిపతి  '  + this.translate(klordss[klk].split('|')[1]) + ' ఉన్నారు';
				}  else if(this.shareService.getLANG() == 'hi') {
					h_code += '<h4>केंद्र ' +  klordss[klk].split('|')[0] + ' House  में  केन्द्राधिपति ' + this.translate(klordss[klk].split('|')[1]) +  ' रहा है';
				}  
				h_code += '</h4>';
				tklords += klordss[klk].split('|')[1] + ' ';
			}
		}
		if(tlord_in_tri.length > 0 || tlord_in_ken.length > 0 || klord_in_tri.length > 0 || klord_in_ken.length > 0)
		{
		   if(this.shareService.getLANG() == 'en') {
			h_code += '<span style="color:blue;"><strong>You can expect a favourable period during Maha Dasha or Antar Dasha of kendra/triknoda lord(s) ' + tklords + '</strong></span>';
			} else if(this.shareService.getLANG() == 'te') {
			  h_code += '<span style="color:blue;"><strong>ఖెన్ద్రాధిపతి/ త్రికొనాధిపతి అగు ' + this.translate(tklords) + ' మహా దశ/అన్తర్ దశ ల లొ మీకు మంచి అభివ్రుధి కలుగును';
			}  else if(this.shareService.getLANG() == 'hi') {
			  h_code += '<span style="color:blue;"><strong>केन्द्राधिपति/त्रिकोणादिपति '  + this.translate(tklords) + ' के महा दस या अंतर दस में आप को शुभ योजना प्रप्थ होसकता है';
			}
		}
		var vown = vp_owners.split('|');
		var vrul = vp_rulers.split('|');
		var bvpr = 0;
		var vprl = '';
		for(var vp1 = 0; vp1 < vown.length -1; vp1++) {
			for(var vp2 = 0; vp2 < vrul.length -1;vp2++) {
			  if(vown[vp1] == vrul[vp2]) {
			    bvpr = 1;
				if(this.shareService.getLANG() == 'en') {
					h_code += '<h4>' + vown[vp1].split('-')[1] + ' house lord ' + vown[vp1].split('-')[0] + ' is also the ruler of ' + vrul[vp2].split('-')[1] + ' house.</h4>';
					vprl += vown[vp1].split('-')[0] + ',';
				} else if(this.shareService.getLANG() == 'te') {
					h_code += '<h4>' + vown[vp1].split('-')[1] + ' అధిపతి ' + this.translate(vown[vp1].split('-')[0]) + ' ' + vrul[vp2].split('-')[1] + ' house.కూడా రూల్ చేస్తునారు</h4> ';
					vprl += vown[vp1].split('-')[0] + ',';
			  }  else if(this.shareService.getLANG() == 'hi') {
					h_code += '<h4>' + vown[vp1].split('-')[1] + ' अधिपति ' + this.translate(vown[vp1].split('-')[0]) + ' ' + vrul[vp2].split('-')[1] + ' house भी रूल कररहे है</h4> ';
					vprl += vown[vp1].split('-')[0] + ',';
			  }

			  }
			}
		}
		h_code += '<br\>';
		h_code = '';
		let pcnt :number = 0;
		var frPls = this.friend_pl_v[this.rashi_lords_v[sign]].split('\|');
		if (frPls.length > 0) {
			if(this.shareService.getLANG() == 'en') {
				h_code += '<span>' + this.rashi_lords_v[sign] + ' is Friendly with ';
				for (i = 0; i < frPls.length; i++) {
					h_code += this.ruler_name_v[frPls[i]] + ' ';
				} 
				h_code += '</span>';
			}  else if(this.shareService.getLANG() == 'te') {
					h_code += '<span>' + this.translate(this.rashi_lords_v[sign]) + ' మరియు ';
					for (i = 0; i < frPls.length; i++) {
						h_code += this.translate(this.ruler_name_v[frPls[i]]) + ' ';
					} 
					h_code += ' మిత్రులు</span>';
			}   else if(this.shareService.getLANG() == 'hi') {
					h_code += '<span>' + this.translate(this.rashi_lords_v[sign]) + ' और ';
					for (i = 0; i < frPls.length; i++) {
						h_code += this.translate(this.ruler_name_v[frPls[i]]) + ' ';
					} 
					h_code += ' मित्र है</span>';
			}
		}
		if (this.rashi_lords_v[sign] != 'Moon') {  //Moon has no enemies
				var eyPls = this.enemy_pl_v[this.rashi_lords_v[sign]].split('\|');
			if (eyPls.length > 0) {
				if(this.shareService.getLANG() == 'en') {
					h_code += '<span>, is Enemy with ';
					for (i = 0; i < eyPls.length; i++) {
						h_code += this.ruler_name_v[eyPls[i]] + ' ';
					}
					h_code += '</span><br/>';
				} else if(this.shareService.getLANG() == 'te') {
						h_code += ' మరియు ' ;
						for (i = 0; i < eyPls.length; i++) {
							h_code += this.translate(this.ruler_name_v[eyPls[i]]) + ' ';
						}
						h_code += ' కి  శత్రువులు';
						h_code += '</span><br/>';
				} else if(this.shareService.getLANG() == 'hi') {
						h_code += '  और ' ;  
						for (i = 0; i < eyPls.length; i++) {
							h_code += this.translate(this.ruler_name_v[eyPls[i]]) + ' ';
						}
						h_code += '  दुश्मन है';
						h_code += '</span><br/>';
				}
			}
		}
	}
  grid(numberPerSide, size, pixelsPerSide, plps, title, id) {
  		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.renderer.setAttribute(svg, "width", pixelsPerSide);
		this.renderer.setAttribute(svg, "height", pixelsPerSide);
		this.renderer.setProperty(svg, "id", id);
		this.renderer.setAttribute(svg, "viewBox", [0, 0, numberPerSide * size, numberPerSide * size].join(" "));
        var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		var s1 = 24;
		var xp = size - 24;
        var pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
		this.renderer.setAttribute(pattern, "id", "sign-0");
		this.renderer.setAttribute(pattern,"patternUnits", "userSpaceOnUse");
		this.renderer.setAttribute(pattern, "height", size.toString());
		this.renderer.setAttribute(pattern, "width", size.toString());
        var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
		this.renderer.setAttribute(image, "x", xp.toString());
		this.renderer.setAttribute(image, "y", "0");
		this.renderer.setAttribute(image, "height", s1.toString());
		this.renderer.setAttribute(image, "width", s1.toString());
		image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
							 "https://i.imgur.com/XFXS4vf.png");
		this.renderer.appendChild(pattern, image);
		this.renderer.appendChild(defs, pattern);

        pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
		this.renderer.setAttribute(pattern, "id", "sign-1");
		this.renderer.setAttribute(pattern, "patternUnits", "userSpaceOnUse");
		this.renderer.setAttribute(pattern, "height", size.toString());
		this.renderer.setAttribute(pattern, "width", size.toString());
        image = document.createElementNS("http://www.w3.org/2000/svg", "image");
		this.renderer.setAttribute(image, "x", xp.toString());
		this.renderer.setAttribute(image, "y", "0");
		this.renderer.setAttribute(image, "height", s1.toString());
		this.renderer.setAttribute(image, "width", s1.toString());
		image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
							 "https://i.imgur.com/Fo8bboN.png");
		this.renderer.appendChild(pattern, image);
		this.renderer.appendChild(defs, pattern);
        pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
		this.renderer.setAttribute(pattern, "id", "sign-2");
		this.renderer.setAttribute(pattern, "patternUnits", "userSpaceOnUse");
		this.renderer.setAttribute(pattern, "height", size.toString());
		this.renderer.setAttribute(pattern, "width", size.toString());
        image = document.createElementNS("http://www.w3.org/2000/svg", "image");
		this.renderer.setAttribute(image, "x", xp.toString());
		this.renderer.setAttribute(image, "y", "0");
		this.renderer.setAttribute(image, "height", s1.toString());
		this.renderer.setAttribute(image, "width", s1.toString());
		image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
							 "https://i.imgur.com/xFmaeBF.png");
		this.renderer.appendChild(pattern, image);
		this.renderer.appendChild(defs, pattern);
        pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
		this.renderer.setAttribute(pattern, "id", "sign-3");
		this.renderer.setAttribute(pattern, "patternUnits", "userSpaceOnUse");
		this.renderer.setAttribute(pattern, "height", size.toString());
		this.renderer.setAttribute(pattern, "width", size.toString());
        image = document.createElementNS("http://www.w3.org/2000/svg", "image");
		this.renderer.setAttribute(image, "x", xp.toString());
		this.renderer.setAttribute(image, "y", "0");
		this.renderer.setAttribute(image, "height", s1.toString());
		this.renderer.setAttribute(image, "width", s1.toString());
		image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
							 "https://i.imgur.com/5WRr5Ki.png");
		this.renderer.appendChild(pattern, image);
		this.renderer.appendChild(defs, pattern);
        pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
		this.renderer.setAttribute(pattern, "id", "sign-4");
		this.renderer.setAttribute(pattern, "patternUnits", "userSpaceOnUse");
		this.renderer.setAttribute(pattern, "height", size.toString());
		this.renderer.setAttribute(pattern, "width", size.toString());
        image = document.createElementNS("http://www.w3.org/2000/svg", "image");
		this.renderer.setAttribute(image, "x", xp.toString());
		this.renderer.setAttribute(image, "y", "0");
		this.renderer.setAttribute(image, "height", s1.toString());
		this.renderer.setAttribute(image, "width", s1.toString());
		image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
							 "https://i.imgur.com/xCYOz4A.png");
		this.renderer.appendChild(pattern, image);
		this.renderer.appendChild(defs, pattern);
		pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
		this.renderer.setAttribute(pattern, "id", "sign-7");
		this.renderer.setAttribute(pattern, "patternUnits", "userSpaceOnUse");
		this.renderer.setAttribute(pattern, "height", size.toString());
		this.renderer.setAttribute(pattern, "width", size.toString());
		image = document.createElementNS("http://www.w3.org/2000/svg", "image");
		this.renderer.setAttribute(image, "x", xp.toString());
		this.renderer.setAttribute(image, "y", "0");
		this.renderer.setAttribute(image, "height", s1.toString());
		this.renderer.setAttribute(image, "width", s1.toString());
		image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
							 "https://i.imgur.com/Hxhvh6c.png");
		this.renderer.appendChild(pattern, image);
		this.renderer.appendChild(defs, pattern);
		pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
		this.renderer.setAttribute(pattern, "id", "sign-8");
		this.renderer.setAttribute(pattern, "patternUnits", "userSpaceOnUse");
		this.renderer.setAttribute(pattern, "height", size.toString());
		this.renderer.setAttribute(pattern, "width", size.toString());
		image = document.createElementNS("http://www.w3.org/2000/svg", "image");
		this.renderer.setAttribute(image, "x", xp.toString());
		this.renderer.setAttribute(image, "y", "0");
		this.renderer.setAttribute(image, "height", s1.toString());
		this.renderer.setAttribute(image, "width", s1.toString());
		image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
							 "https://i.imgur.com/7JLgHKU.png");
		this.renderer.appendChild(pattern, image);
		this.renderer.appendChild(defs, pattern);
		pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
		this.renderer.setAttribute(pattern, "id", "sign-11");
		this.renderer.setAttribute(pattern, "patternUnits", "userSpaceOnUse");
		this.renderer.setAttribute(pattern, "height", size.toString());
		this.renderer.setAttribute(pattern, "width", size.toString());
		image = document.createElementNS("http://www.w3.org/2000/svg", "image");
		this.renderer.setAttribute(image, "x", xp.toString());
		this.renderer.setAttribute(image, "y", "0");
		this.renderer.setAttribute(image, "height", s1.toString());
		this.renderer.setAttribute(image, "width", s1.toString());
		image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
							 "https://i.imgur.com/aUmKT4G.png");
		this.renderer.appendChild(pattern, image);
		this.renderer.appendChild(defs, pattern);
		pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
		this.renderer.setAttribute(pattern, "id", "sign-12");
		this.renderer.setAttribute(pattern, "patternUnits", "userSpaceOnUse");
		this.renderer.setAttribute(pattern, "height", size.toString());
		this.renderer.setAttribute(pattern, "width", size.toString());
		image = document.createElementNS("http://www.w3.org/2000/svg", "image");
		this.renderer.setAttribute(image, "x", xp.toString());
		this.renderer.setAttribute(image, "y", "0");
		this.renderer.setAttribute(image, "height", s1.toString());
		this.renderer.setAttribute(image, "width", s1.toString());
		image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
							 "https://i.imgur.com/SZdChh9.png");
		this.renderer.appendChild(pattern, image);
		this.renderer.appendChild(defs, pattern);
		pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
		this.renderer.setAttribute(pattern, "id", "sign-13");
		this.renderer.setAttribute(pattern, "patternUnits", "userSpaceOnUse");
		this.renderer.setAttribute(pattern, "height", size.toString());
		this.renderer.setAttribute(pattern, "width", size.toString());
		image = document.createElementNS("http://www.w3.org/2000/svg", "image");
		this.renderer.setAttribute(image, "x", xp.toString());
		this.renderer.setAttribute(image, "y", "0");
		this.renderer.setAttribute(image, "height", s1.toString());
		this.renderer.setAttribute(image, "width", s1.toString());
		image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
							 "https://i.imgur.com/SCqbk62.png");

		this.renderer.appendChild(pattern, image);
		this.renderer.appendChild(defs, pattern);
		pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
		this.renderer.setAttribute(pattern, "id", "sign-14");
		this.renderer.setAttribute(pattern, "patternUnits", "userSpaceOnUse");
		this.renderer.setAttribute(pattern, "height", size.toString());
		this.renderer.setAttribute(pattern, "width", size.toString());
		image = document.createElementNS("http://www.w3.org/2000/svg", "image");
		this.renderer.setAttribute(image, "x", xp.toString());
		this.renderer.setAttribute(image, "y", "0");
		this.renderer.setAttribute(image, "height", s1.toString());
		this.renderer.setAttribute(image, "width", s1.toString());
		image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
							 "https://i.imgur.com/nqQnnFY.png");

		this.renderer.appendChild(pattern, image);
		this.renderer.appendChild(defs, pattern);
		pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
		this.renderer.setAttribute(pattern, "id", "sign-15");
		this.renderer.setAttribute(pattern, "patternUnits", "userSpaceOnUse");
		this.renderer.setAttribute(pattern, "height", size.toString());
		this.renderer.setAttribute(pattern, "width", size.toString());
		image = document.createElementNS("http://www.w3.org/2000/svg", "image");
		this.renderer.setAttribute(image, "x", xp.toString());
		this.renderer.setAttribute(image, "y", "0");
		this.renderer.setAttribute(image, "height", s1.toString());
		this.renderer.setAttribute(image, "width", s1.toString());
		image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href",
							 "https://i.imgur.com/t4KBJ4z.png");

		this.renderer.appendChild(pattern, image);
		this.renderer.appendChild(defs, pattern);
		this.renderer.appendChild(svg, defs);
		var border = 1;
		var s2 = size * 2;
		var s3 = size;
		var s5 = s3-14;
		var s4 = 15;
		for (var i = 0; i < numberPerSide; i++) {
			for (var j = 0; j < numberPerSide; j++) {
				if ((i * numberPerSide + j) == 5 || (i * numberPerSide + j) == 6 || (i * numberPerSide + j) == 9 || (i * numberPerSide + j) == 10) {
					if ((i * numberPerSide + j) == 5) {
						var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
						this.renderer.setAttribute(g, "transform", ["translate(", i * size, ",", j * size, ")"].join(""));
						var number = numberPerSide * i + j;
						var box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
						this.renderer.setAttribute(box, "width", s2.toString());
						this.renderer.setAttribute(box, "height", s2.toString());
						this.renderer.setAttribute(box, "border", border.toString());
						this.renderer.setAttribute(box, "stroke", "#d35400");
						this.renderer.setAttribute(box, "fill", "#ffd9a3");
						this.renderer.setAttribute(box, "id", "b" + number);
						this.renderer.appendChild(g, box);
						var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.renderer.appendChild(text, document.createTextNode(title.toUpperCase()));
						this.renderer.setAttribute(text, "fill", "#d35400");
						this.renderer.setAttribute(text, "font-size", "1.35rem");
						this.renderer.setAttribute(text, "font-weight", "bold");
						this.renderer.setAttribute(text, "alignment-baseline", "middle");
						this.renderer.setAttribute(text, "text-anchor", "middle");
						this.renderer.setAttribute(text, "x", s3.toString());
						this.renderer.setAttribute(text, "y", (s5).toString());
						this.renderer.setAttribute(text, "id", "t" + number);
						g.appendChild(text);
						svg.appendChild(g);
					}
					continue;
				}
				g = document.createElementNS("http://www.w3.org/2000/svg", "g");
				this.renderer.setAttribute(g, "transform", ["translate(", i * size, ",", j * size, ")"].join(""));
				number = numberPerSide * i + j;
				box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
				var sign = "url(#sign-" + (number).toString() + ")";
				this.renderer.setAttribute(box, "width", size.toString());
				this.renderer.setAttribute(box, "height", size.toString());
				this.renderer.setAttribute(box, "stroke", (this.signs_v[number] == this.asc_sign) ? "#FF5733" : "#d35400");
				this.renderer.setAttribute(box, "stroke-width", (this.signs_v[number] == this.asc_sign) ? (border+2).toString() : border.toString());
				this.renderer.setAttribute(box, "fill", sign);
				this.renderer.setAttribute(box, "id", "b" + number.toString());
				this.renderer.appendChild(g, box);
				sign = this.signs_v[number];
				if (plps.hasOwnProperty(sign)) {
					var pls = plps[sign].split('\|');
					var pcnt = 0;
					var s6 = 10;
					var s7 = 5;
					for (var k = 0; k < pls.length; k++) {
						if (pls[k].split(' ')[1] == 'me' || pls[k].split(' ')[1] == 'os') continue;
						pcnt++;
						text = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.renderer.appendChild(text, document.createTextNode(pls[k]));
						this.renderer.setAttribute(text, "font-size", s6.toString());
						this.renderer.setAttribute(text, "font-weight", "bold");
						if(pls[k].split(' ')[1] == 'AC') this.renderer.addClass(text, "redText");
						else if(pls[k].split(' ')[1] == 'Mo') this.renderer.addClass(text, "blueText");
						this.renderer.setAttribute(text, "x", s7.toString());
						var s8 = 10 * pcnt;
						this.renderer.setAttribute(text, "y",  s8.toString());
						this.renderer.setAttribute(text, "id", "t" + number.toString());
						g.appendChild(text);
					}
				}
				svg.appendChild(g);
			}
		}
		return svg;
	};
  calcHoraChart()
  {
	let navPls: string[] = [];
	var plPos = this.updateNodePos();
	var sgns = ["ar","ta","ge","cn","le","vi","li","sc","sa","cp","aq","pi"];
	for (var i = 0; i < 12; i++) {
		var sign = sgns[i];
		let hora_sign: string = '';
		if (plPos.hasOwnProperty(sign)) {
			var pls = plPos[sign].split('\|');
			for (var k = 0; k < pls.length; k++) {
				var pl = pls[k].split(' ')[1];
				if (pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'TRUE_NODE') {  //consider only true planets
				    let sd: string = pls[k].split(' ')[0];
				    let po: number = this.shareService.dmsToDec(Number(sd.split('.')[0]), Number(sd.split('.')[1]), Number(sd.split('.')[2]));
					switch(sign)
					{
						case 'ar':
						case 'ge':
						case 'le':
						case 'li':
						case 'sa':
						case 'aq':
							hora_sign = (po <= 15) ?  "le" : "cn";
							break;
						case 'ta':
						case 'cn':
						case 'vi':
						case 'sc':
						case 'cp':
						case 'pi':
							hora_sign = (po <= 15) ? "cn" : "le";
							break;
						default:
							break;
					}
				    if(!navPls.hasOwnProperty(hora_sign))
						navPls[hora_sign] = pls[k];
					else
						navPls[hora_sign] += '|' + pls[k];
				}
			}
		}
	}
	return navPls;
  }
	
  calcDivChart(ndivs)
  {
     if(ndivs == 4) return this.calcD4();
     else if(ndivs == 9) return this.calcNavamsa();
	 else if(ndivs == 10) return this.calcDasamsa();
	 else return this.calcChart(ndivs);
  }
  calcChart(ndivs) 
  {
	let navPls: string[] = [];
	var plPos = this.updateNodePos();
	var sgns = ["ar|M|Ma|1|O", "ta|F|Ve|2|E", "ge|D|Me|3|O", "cn|M|Mo|4|E", "le|F|Su|5|O", "vi|D|Me|6|E", "li|M|Ve|7|O", "sc|F|Ma|8|E", "sa|D|Ju|9|O", "cp|M|Sa|10|E", "aq|F|Sa|11|O", "pi|D|Ju|12|E" ];
	var divs = [];
	let n: number = 1;
	let sec: number = 30/ndivs, secp: number = 0;
	console.log('no. of divs=' + sec.toString());
	while((secp = sec*n) <= 30) {
		  divs.push(secp);
		  n++;
	}
	console.log('part complete..');
	console.log(divs);
	 let spos: number = 0;
	  for (var i = 0; i < 12; i++) {
		var sign = sgns[i];
		if (plPos.hasOwnProperty(sign.split('|')[0])) {
			var pls = plPos[sign.split('|')[0]].split('\|');
			for (var k = 0; k < pls.length; k++) {
			   console.log('pl=' + pls[k]);
				var pl = pls[k].split(' ')[1];
				if(pl == 'AC') 	this.asc_sign = sign.split('|')[0];
				    let sd: string = pls[k].split(' ')[0];
				    let po: number = this.shareService.dmsToDec(Number(sd.split('.')[0]), Number(sd.split('.')[1]), Number(sd.split('.')[2]));
					console.log(sign.split('|')[0]);
					console.log(pl);
					console.log(po);
					let spos: number;
					n = 0;
					for(var dp = 0;  dp < Object.keys(divs).length; dp++)
					{
						if(po >= n && po <= divs[dp]) spos = dp+1;
						n = divs[dp];
					}
					if (pl != 'Ra' && pl != 'Ke' && pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'AC' && pl != 'TR') {  
						if(ndivs == 60) {
							let planetDeity: PlanetDeity = {
								sno: spos,
								hno: -1,
								deity: this.deities_v[spos].split('|')[0],
								sign: '',
								nat: this.deities_v[spos].split('|')[2],
								desc: this.deities_v[spos].split('|')[1]
							};
							this.oPlanet[pls[k].split(' ')[1]] = planetDeity;					
						}
					}
					while(spos > 12 ) spos -= 12;
					if (pl != 'Ra' && pl != 'Ke' && pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'AC' && pl != 'TR') {  
						if(ndivs == 60) { 
							this.oPlanet[pls[k].split(' ')[1]].hno = spos;
							this.oPlanet[pls[k].split(' ')[1]].sign = sgns[spos-1].split('|')[0];
						}
					}
					console.log('spos=' + spos.toString());
					let sord: number;
					let spnt: number = ndivs, x: number = 1;
					console.log('spnt=',ndivs+1);
					switch(sign.split('|')[0])
					{
					  case 'ar':
						sord = 1;
						break;
					  case 'ta':
					    spnt = ndivs+1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'ge':
					    spnt = 2*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'cn':
					    spnt = 3*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'le':
					    spnt = 4*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'vi':
					    spnt = 5*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'li':
					    spnt = 6*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'sc':
					    spnt = 7*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'sa':
					    spnt = 8*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'cp':
					    spnt = 9*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'aq':
					    spnt = 10*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'pi':
					    spnt = 11*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  default:
						break;
					}
					console.log('sord=' + sord.toString());
				let navp :number = sord + (spos-1);
				navp = (navp > 12) ? navp - 12: navp;
				console.log(navp);
				switch(navp)
				{
				  case 1:
				    if(!navPls.hasOwnProperty('ar'))
						navPls['ar'] = pls[k];
					else
						navPls['ar'] += '|' + pls[k];
				    break;
				  case 2:
				    if(!navPls.hasOwnProperty('ta'))
						navPls['ta'] = pls[k];
					else
						navPls['ta'] += '|' + pls[k];
				    break;
				  case 3:
				    if(!navPls.hasOwnProperty('ge'))
						navPls['ge'] = pls[k];
					else
						navPls['ge'] += '|' + pls[k];
					
				    break;
				  case 4:
				    if(!navPls.hasOwnProperty('cn'))
						navPls['cn']=pls[k];
					else
						navPls['cn'] += '|' + pls[k];
				    break;
				  case 5:
				    if(!navPls.hasOwnProperty('le'))
						navPls['le'] = pls[k];
					else
						navPls['le'] += '|' + pls[k];
				    break;
				  case 6:
				    if(!navPls.hasOwnProperty('vi'))
						navPls['vi']=pls[k];
					else
						navPls['vi'] += '|' + pls[k];
				    break;
				  case 7:
				    if(!navPls.hasOwnProperty('li'))
						navPls['li']=pls[k];
					else
						navPls['li'] += '|' + pls[k];
				    break;
				  case 8:
				    if(!navPls.hasOwnProperty('sc'))
						navPls['sc']=pls[k];
					else
						navPls['sc'] += '|' + pls[k];
				    break;
				  case 9:
				    if(!navPls.hasOwnProperty('sa'))
						navPls['sa']=pls[k];
					else
						navPls['sa'] += '|' + pls[k];
				    break;
				  case 10:
				    if(!navPls.hasOwnProperty('cp'))
						navPls['cp']=pls[k];
					else
						navPls['cp'] += '|' + pls[k];
				    break;
				  case 11:
				    if(!navPls.hasOwnProperty('aq'))
						navPls['aq'] = pls[k];
					else
						navPls['aq'] += '|' + pls[k];
				    break;
				  case 12:
				    if(!navPls.hasOwnProperty('pi'))
						navPls['pi']=pls[k];
					else
						navPls['pi'] += '|' + pls[k];
				    break;
				  default:
				    break;
				}
			}
		}
	}
	console.log(navPls);
	return navPls;
  }
  calcNavamsa() {
	let navPls: string[] = [];
	var plPos = this.updateNodePos();
	var sgns = ["ar|M|Ma|1|O", "ta|F|Ve|2|E", "ge|D|Me|3|O", "cn|M|Mo|4|E", "le|F|Su|5|O", "vi|D|Me|6|E", "li|M|Ve|7|O", "sc|F|Ma|8|E", "sa|D|Ju|9|O", "cp|M|Sa|10|E", "aq|F|Sa|11|O", "pi|D|Ju|12|E" ];
	var divs = [];
	let n: number = 1;
	let sec: number = 30/9, secp: number = 0;
	console.log('no. of divs=' + sec.toString());
	while((secp = sec*n) <= 30) {
		  divs.push(secp);
		  n++;
	}
	console.log('part complete..');
	console.log(divs);
	 let spos: number = 0;
	 for (var i = 0; i < 12; i++) {
		var sign = sgns[i];
        if(sign.split('|')[1] == "M")
           spos = Number(sign.split('|')[3]);
        else if(sign.split('|')[1] == "F")
           spos = Number(sign.split('|')[3])+8;
        else if(sign.split('|')[1] == "D")
           spos = Number(sign.split('|')[3])+4;
		
		if (plPos.hasOwnProperty(sign.split('|')[0])) {
			var pls = plPos[sign.split('|')[0]].split('\|');
			for (var k = 0; k < pls.length; k++) {
			   let ppos: number = spos;
			   console.log('pl=' + pls[k]);
				var pl = pls[k].split(' ')[1];
				    let sd: string = pls[k].split(' ')[0];
				    let po: number = this.shareService.dmsToDec(Number(sd.split('.')[0]), Number(sd.split('.')[1]), Number(sd.split('.')[2]));
					console.log(sign);
					console.log(pl);
					console.log(po);
					n = 0;
					for(var dp = 0;  dp < Object.keys(divs).length; dp++)
					{
						if(po >= n && po <= divs[dp]) {break;}
						n = divs[dp];
						ppos++;
					}
					let rpos: number = ppos;
					while(rpos > 12 ) rpos -= 12;
					console.log('spos=' + spos.toString());
					let sord: number;
				let navp :number = rpos;
				switch(navp)
				{
				  case 1:
				    if(!navPls.hasOwnProperty('ar'))
						navPls['ar'] = pls[k];
					else
						navPls['ar'] += '|' + pls[k];
				    break;
				  case 2:
				    if(!navPls.hasOwnProperty('ta'))
						navPls['ta'] = pls[k];
					else
						navPls['ta'] += '|' + pls[k];
				    break;
				  case 3:
				    if(!navPls.hasOwnProperty('ge'))
						navPls['ge'] = pls[k];
					else
						navPls['ge'] += '|' + pls[k];
					
				    break;
				  case 4:
				    if(!navPls.hasOwnProperty('cn'))
						navPls['cn']=pls[k];
					else
						navPls['cn'] += '|' + pls[k];
				    break;
				  case 5:
				    if(!navPls.hasOwnProperty('le'))
						navPls['le'] = pls[k];
					else
						navPls['le'] += '|' + pls[k];
				    break;
				  case 6:
				    if(!navPls.hasOwnProperty('vi'))
						navPls['vi']=pls[k];
					else
						navPls['vi'] += '|' + pls[k];
				    break;
				  case 7:
				    if(!navPls.hasOwnProperty('li'))
						navPls['li']=pls[k];
					else
						navPls['li'] += '|' + pls[k];
				    break;
				  case 8:
				    if(!navPls.hasOwnProperty('sc'))
						navPls['sc']=pls[k];
					else
						navPls['sc'] += '|' + pls[k];
				    break;
				  case 9:
				    if(!navPls.hasOwnProperty('sa'))
						navPls['sa']=pls[k];
					else
						navPls['sa'] += '|' + pls[k];
				    break;
				  case 10:
				    if(!navPls.hasOwnProperty('cp'))
						navPls['cp']=pls[k];
					else
						navPls['cp'] += '|' + pls[k];
				    break;
				  case 11:
				    if(!navPls.hasOwnProperty('aq'))
						navPls['aq'] = pls[k];
					else
						navPls['aq'] += '|' + pls[k];
				    break;
				  case 12:
				    if(!navPls.hasOwnProperty('pi'))
						navPls['pi']=pls[k];
					else
						navPls['pi'] += '|' + pls[k];
				    break;
				  default:
				    break;
				}
				console.log(navPls);
			}
		}
      }  
	  return navPls;
	}
	calcDasamsa()
	{
	let navPls: string[] = [];
	let sec: number = 30/10, secp: number = 0;
	console.log('no. of divs=' + sec.toString());
	var plPos = this.updateNodePos();
	var sgns = ["ar|M|Ma|1|O", "ta|F|Ve|2|E", "ge|D|Me|3|O", "cn|M|Mo|4|E", "le|F|Su|5|O", "vi|D|Me|6|E", "li|M|Ve|7|O", "sc|F|Ma|8|E", "sa|D|Ju|9|O", "cp|M|Sa|10|E", "aq|F|Sa|11|O", "pi|D|Ju|12|E" ];
	var divs = [];
	let n: number = 1;
	while((secp = sec*n) <= 30) {
		  divs.push(secp);
		  n++;
	}
	console.log('part complete..');
	console.log(divs);
	let spos: number = 0;
	for (var i = 0; i < 12; i++) {
		var sign = sgns[i];
                    if(sign.split('|')[4] == "O")
                        spos = Number(sign.split('|')[3]);
                    else 
                        spos = Number(sign.split('|')[3])+8;
		if (plPos.hasOwnProperty(sign.split('|')[0])) {
			var pls = plPos[sign.split('|')[0]].split('\|');
			for (var k = 0; k < pls.length; k++) {
			   let ppos: number = spos;
				var pl = pls[k].split(' ')[1];
				    let sd: string = pls[k].split(' ')[0];
				    let po: number = this.shareService.dmsToDec(Number(sd.split('.')[0]), Number(sd.split('.')[1]), Number(sd.split('.')[2]));
					n = 0;
					for(var dp = 0;  dp < Object.keys(divs).length; dp++)
					{
						if(po >= n && po <= divs[dp]) {break;}
						n = divs[dp];
						ppos++;
					}
					let rpos: number = ppos;
					while(rpos > 12 ) rpos -= 12;
					console.log('spos=' + spos.toString());
					let sord: number;
				let navp :number = rpos;
				console.log(navp);
				switch(navp)
				{
				  case 1:
				    if(!navPls.hasOwnProperty('ar'))
						navPls['ar'] = pls[k];
					else
						navPls['ar'] += '|' + pls[k];
				    break;
				  case 2:
				    if(!navPls.hasOwnProperty('ta'))
						navPls['ta'] = pls[k];
					else
						navPls['ta'] += '|' + pls[k];
				    break;
				  case 3:
				    if(!navPls.hasOwnProperty('ge'))
						navPls['ge'] = pls[k];
					else
						navPls['ge'] += '|' + pls[k];
					
				    break;
				  case 4:
				    if(!navPls.hasOwnProperty('cn'))
						navPls['cn']=pls[k];
					else
						navPls['cn'] += '|' + pls[k];
				    break;
				  case 5:
				    if(!navPls.hasOwnProperty('le'))
						navPls['le'] = pls[k];
					else
						navPls['le'] += '|' + pls[k];
				    break;
				  case 6:
				    if(!navPls.hasOwnProperty('vi'))
						navPls['vi']=pls[k];
					else
						navPls['vi'] += '|' + pls[k];
				    break;
				  case 7:
				    if(!navPls.hasOwnProperty('li'))
						navPls['li']=pls[k];
					else
						navPls['li'] += '|' + pls[k];
				    break;
				  case 8:
				    if(!navPls.hasOwnProperty('sc'))
						navPls['sc']=pls[k];
					else
						navPls['sc'] += '|' + pls[k];
				    break;
				  case 9:
				    if(!navPls.hasOwnProperty('sa'))
						navPls['sa']=pls[k];
					else
						navPls['sa'] += '|' + pls[k];
				    break;
				  case 10:
				    if(!navPls.hasOwnProperty('cp'))
						navPls['cp']=pls[k];
					else
						navPls['cp'] += '|' + pls[k];
				    break;
				  case 11:
				    if(!navPls.hasOwnProperty('aq'))
						navPls['aq'] = pls[k];
					else
						navPls['aq'] += '|' + pls[k];
				    break;
				  case 12:
				    if(!navPls.hasOwnProperty('pi'))
						navPls['pi']=pls[k];
					else
						navPls['pi'] += '|' + pls[k];
				    break;
				  default:
				    break;
				}
				console.log(navPls);
			}
		}
	 }
	return navPls;
	}
	calcD4()
	{
	console.log('calcD4');
	let navPls: string[] = [];
	var plPos = this.updateNodePos();
	console.log('D4', plPos);
	var sgns = ["ar|M|Ma|1|O", "ta|F|Ve|2|E", "ge|D|Me|3|O", "cn|M|Mo|4|E", "le|F|Su|5|O", "vi|D|Me|6|E", "li|M|Ve|7|O", "sc|F|Ma|8|E", "sa|D|Ju|9|O", "cp|M|Sa|10|E", "aq|F|Sa|11|O", "pi|D|Ju|12|E" ];
	 for (var i = 0; i < 12; i++) {
		var sign = sgns[i];
		if (plPos.hasOwnProperty(sign.split('|')[0])) {
			var pls = plPos[sign.split('|')[0]].split('\|');
			for (var k = 0; k < pls.length; k++) {
			   let spos: number = Number(sign.split('|')[3]);
			   console.log('pl=' + pls[k]);
				var pl = pls[k].split(' ')[1];
				    let sd: string = pls[k].split(' ')[0];
				    let po: number = this.shareService.dmsToDec(Number(sd.split('.')[0]), Number(sd.split('.')[1]), Number(sd.split('.')[2]));
				if(po >= 0 && po < 7.30) {
					//no change
				} else if(po >= 7.30 && po < 15) {
					spos += 3;
				} else if(po >= 15 && po < 22) {
					spos += 6;
				} else if(po >= 22 && po < 30) {
					spos += 9;
				}
				if(spos > 12) spos -= 12;
				console.log('D4', sign);
				console.log('D4', spos);
				console.log('D4', pls[k]);
				switch(spos)
				{
				  case 1:
				    if(!navPls.hasOwnProperty('ar'))
						navPls['ar'] = pls[k];
					else
						navPls['ar'] += '|' + pls[k];
				    break;
				  case 2:
				    if(!navPls.hasOwnProperty('ta'))
						navPls['ta'] = pls[k];
					else
						navPls['ta'] += '|' + pls[k];
				    break;
				  case 3:
				    if(!navPls.hasOwnProperty('ge'))
						navPls['ge'] = pls[k];
					else
						navPls['ge'] += '|' + pls[k];
					
				    break;
				  case 4:
				    if(!navPls.hasOwnProperty('cn'))
						navPls['cn']=pls[k];
					else
						navPls['cn'] += '|' + pls[k];
				    break;
				  case 5:
				    if(!navPls.hasOwnProperty('le'))
						navPls['le'] = pls[k];
					else
						navPls['le'] += '|' + pls[k];
				    break;
				  case 6:
				    if(!navPls.hasOwnProperty('vi'))
						navPls['vi']=pls[k];
					else
						navPls['vi'] += '|' + pls[k];
				    break;
				  case 7:
				    if(!navPls.hasOwnProperty('li'))
						navPls['li']=pls[k];
					else
						navPls['li'] += '|' + pls[k];
				    break;
				  case 8:
				    if(!navPls.hasOwnProperty('sc'))
						navPls['sc']=pls[k];
					else
						navPls['sc'] += '|' + pls[k];
				    break;
				  case 9:
				    if(!navPls.hasOwnProperty('sa'))
						navPls['sa']=pls[k];
					else
						navPls['sa'] += '|' + pls[k];
				    break;
				  case 10:
				    if(!navPls.hasOwnProperty('cp'))
						navPls['cp']=pls[k];
					else
						navPls['cp'] += '|' + pls[k];
				    break;
				  case 11:
				    if(!navPls.hasOwnProperty('aq'))
						navPls['aq'] = pls[k];
					else
						navPls['aq'] += '|' + pls[k];
				    break;
				  case 12:
				    if(!navPls.hasOwnProperty('pi'))
						navPls['pi']=pls[k];
					else
						navPls['pi'] += '|' + pls[k];
				    break;
				  default:
				    break;
				}
				console.log(navPls);
			}
		}
	 }
	 return navPls; 
	}
	drawNIchart(plps, title, id) {
	   var roms = ['I', 'II', 'III', 'IV', 'V', 'V1', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
       var ras = ['ar', 'ta', 'ge', 'cn', 'le', 'vi', 'li', 'sc', 'sa', 'cp', 'aq', 'pi'];
	   let ah: number = 0;
	   var s6 = 12;
	    for(var r = 0; r < 12; r++) {
  		 if (plps.hasOwnProperty(ras[r])) {
			var pls = plps[ras[r]].split('\|');
			for (var k = 0; k < pls.length; k++) {
				if (pls[k].split(' ')[1] == 'me' || pls[k].split(' ')[1] == 'os') continue;
				if (pls[k].split(' ')[1] == 'AC') { 
				   this.asc_sign = ras[r];
				   ah = r+1;
				   break;
				}
			}
	     }
		}
        var size = this.device_width;
  		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.renderer.setAttribute(svg, "width", (this.device_width).toString());
		this.renderer.setAttribute(svg, "height", (this.device_width).toString());
		var bxz = size/4;
		var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.renderer.setAttribute(line, "x1", "0"); 
		this.renderer.setAttribute(line, "y1", "0"); 
		this.renderer.setAttribute(line, "x2", (size).toString()); 
		this.renderer.setAttribute(line, "y2", "0"); 
		this.renderer.setAttribute(line, "stroke", "#d35400");
		this.renderer.setAttribute(line, "stroke-width", "2");
		this.renderer.setAttribute(line, "id", "l1");
		this.renderer.appendChild(g, line);
		line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.renderer.setAttribute(line, "x1", "0"); 
		this.renderer.setAttribute(line, "y1", "0"); 
		this.renderer.setAttribute(line, "x2", "0"); 
		this.renderer.setAttribute(line, "y2", (size).toString()); 
		this.renderer.setAttribute(line, "stroke", "#d35400");
		this.renderer.setAttribute(line, "stroke-width", "2");
		this.renderer.setAttribute(line, "id", "l2");
		this.renderer.appendChild(g, line);
		line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.renderer.setAttribute(line, "x1", "0"); 
		this.renderer.setAttribute(line, "y1", (size).toString()); 
		this.renderer.setAttribute(line, "x2", (size).toString()); 
		this.renderer.setAttribute(line, "y2", (size).toString()); 
		this.renderer.setAttribute(line, "stroke", "#d35400");
		this.renderer.setAttribute(line, "stroke-width", "2");
		this.renderer.setAttribute(line, "id", "l3");
		this.renderer.appendChild(g, line);
		line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.renderer.setAttribute(line, "x1", (size).toString()); 
		this.renderer.setAttribute(line, "y1", (size).toString()); 
		this.renderer.setAttribute(line, "x2", (size).toString()); 
		this.renderer.setAttribute(line, "y2", "0"); 
		this.renderer.setAttribute(line, "stroke", "#d35400");
		this.renderer.setAttribute(line, "stroke-width", "2");
		this.renderer.setAttribute(line, "id", "14");
		this.renderer.appendChild(g, line);
		line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.renderer.setAttribute(line, "x1", "0"); 
		this.renderer.setAttribute(line, "y1", "0"); 
		this.renderer.setAttribute(line, "x2", (size).toString()); 
		this.renderer.setAttribute(line, "y2", (size).toString()); 
		this.renderer.setAttribute(line, "stroke", "#d35400");
		this.renderer.setAttribute(line, "stroke-width", "2");
		this.renderer.setAttribute(line, "id", "l5");
		this.renderer.appendChild(g, line);
		line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.renderer.setAttribute(line, "x1", "0"); 
		this.renderer.setAttribute(line, "y1", (size).toString()); 
		this.renderer.setAttribute(line, "x2", (size).toString()); 
		this.renderer.setAttribute(line, "y2", "0"); 
		this.renderer.setAttribute(line, "stroke", "#d35400");
		this.renderer.setAttribute(line, "stroke-width", "2");
		this.renderer.setAttribute(line, "id", "l6");
		this.renderer.appendChild(g, line);
		line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.renderer.setAttribute(line, "x1", "0"); 
		this.renderer.setAttribute(line, "y1", (size/2).toString()); 
		this.renderer.setAttribute(line, "x2", (size/2).toString()); 
		this.renderer.setAttribute(line, "y2", "0"); 
		this.renderer.setAttribute(line, "stroke", "#d35400");
		this.renderer.setAttribute(line, "stroke-width", "2");
		this.renderer.setAttribute(line, "id", "l7");
		this.renderer.appendChild(g, line);
		line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.renderer.setAttribute(line, "x1", "0"); 
		this.renderer.setAttribute(line, "y1", (size/2).toString()); 
		this.renderer.setAttribute(line, "x2", (size/2).toString()); 
		this.renderer.setAttribute(line, "y2", (size).toString()); 
		this.renderer.setAttribute(line, "stroke", "#d35400");
		this.renderer.setAttribute(line, "stroke-width", "2");
		this.renderer.setAttribute(line, "id", "l8");
		this.renderer.appendChild(g, line);
		line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.renderer.setAttribute(line, "x1", (size/2).toString()); 
		this.renderer.setAttribute(line, "y1", (size).toString()); 
		this.renderer.setAttribute(line, "x2", (size).toString()); 
		this.renderer.setAttribute(line, "y2", (size/2).toString()); 
		this.renderer.setAttribute(line, "stroke", "#d35400");
		this.renderer.setAttribute(line, "stroke-width", "2");
		this.renderer.setAttribute(line, "id", "l9");
		this.renderer.appendChild(g, line);
		line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.renderer.setAttribute(line, "x1", (size).toString()); 
		this.renderer.setAttribute(line, "y1", (size/2).toString()); 
		this.renderer.setAttribute(line, "x2", (size/2).toString()); 
		this.renderer.setAttribute(line, "y2", "0"); 
		this.renderer.setAttribute(line, "stroke", "#d35400");
		this.renderer.setAttribute(line, "stroke-width", "2");
		this.renderer.setAttribute(line, "id", "l10");
		this.renderer.appendChild(g, line);
		line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.renderer.setAttribute(line, "x1", (size/4).toString()); 
		this.renderer.setAttribute(line, "y1", (size/4).toString()); 
		this.renderer.setAttribute(line, "x2", (size/2).toString()); 
		this.renderer.setAttribute(line, "y2", "0"); 
		this.renderer.setAttribute(line, "stroke", "red");
		this.renderer.setAttribute(line, "stroke-width", "2");
		this.renderer.setAttribute(line, "id", "l11");
		this.renderer.appendChild(g, line);
		line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.renderer.setAttribute(line, "x1", (size/4).toString()); 
		this.renderer.setAttribute(line, "y1", (size/4).toString()); 
		this.renderer.setAttribute(line, "x2", (size/2).toString()); 
		this.renderer.setAttribute(line, "y2", (size/2).toString()); 
		this.renderer.setAttribute(line, "stroke", "red");
		this.renderer.setAttribute(line, "stroke-width", "2");
		this.renderer.setAttribute(line, "id", "l12");
		this.renderer.appendChild(g, line);
		line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.renderer.setAttribute(line, "x1", (size/2).toString()); 
		this.renderer.setAttribute(line, "y1", (size/2).toString()); 
		this.renderer.setAttribute(line, "x2", ((size/2)+bxz).toString()); 
		this.renderer.setAttribute(line, "y2", (bxz).toString()); 
		this.renderer.setAttribute(line, "stroke", "red");
		this.renderer.setAttribute(line, "stroke-width", "2");
		this.renderer.setAttribute(line, "id", "l13");
		this.renderer.appendChild(g, line);
		line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.renderer.setAttribute(line, "x1", ((size/2)+bxz).toString()); 
		this.renderer.setAttribute(line, "y1", (bxz).toString()); 
		this.renderer.setAttribute(line, "x2", (size/2).toString()); 
		this.renderer.setAttribute(line, "y2", "0"); 
		this.renderer.setAttribute(line, "stroke", "red");
		this.renderer.setAttribute(line, "stroke-width", "2");
		this.renderer.setAttribute(line, "id", "l14");
		this.renderer.appendChild(g, line);
		console.log('ah',ah);
		var hcord = this.getHXY(1, this.device_width);
		var htxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
		this.renderer.appendChild(htxt, document.createTextNode(roms[ah-1]));
		this.renderer.setAttribute(htxt, "font-size", s6.toString());
		this.renderer.setAttribute(htxt, "font-weight", "bold");
		this.renderer.setAttribute(htxt, "alignment-baseline", "middle");
		this.renderer.setAttribute(htxt, "text-anchor", "middle");
		this.renderer.setAttribute(htxt, "x", (Math.floor(hcord[0])).toString());
		this.renderer.setAttribute(htxt, "y", (Math.floor(hcord[1])).toString());
		this.renderer.setAttribute(htxt, "id", "RH" + ah.toString());
		this.renderer.appendChild(g, htxt);
		let np: number = 0;
  		 if (plps.hasOwnProperty(ras[ah-1])) {
			var pls = plps[ras[ah-1]].split('\|');
			for (var k = 0; k < pls.length; k++) {
				if (pls[k].split(' ')[1] == 'me' || pls[k].split(' ')[1] == 'os') continue;
				console.log('getXY', pls[k]);
				var cord = this.getXY(1, this.device_width, Number(pls[k].split(' ')[0]));
				console.log('getXY-cord', cord);
				var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
				this.renderer.appendChild(text, document.createTextNode(pls[k]));
				this.renderer.setAttribute(text, "font-size", s6.toString());
				this.renderer.setAttribute(text, "font-weight", "bold");
				this.renderer.setAttribute(text, "alignment-baseline", "middle");
				this.renderer.setAttribute(text, "text-anchor", "middle");
				this.renderer.setAttribute(text, "x", (Math.floor(cord[0])).toString());
				this.renderer.setAttribute(text, "y", (Math.floor(cord[1]+np)).toString());
				this.renderer.setAttribute(text, "id", "R1" + k.toString());
				this.renderer.appendChild(g, text);
				np += 12;
			}
		}
		let ch: number = ah;
	    let hou: number = 2;
		while(hou < 13) {
		   ch++;
		   if(ch > 12) ch = 1;
		   console.log('hno=', hou);
			np = 0;
		    hcord = this.getHXY(hou, this.device_width);
		    htxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
			this.renderer.appendChild(htxt, document.createTextNode(roms[ch-1]));
			this.renderer.setAttribute(htxt, "font-size", s6.toString());
			this.renderer.setAttribute(htxt, "font-weight", "bold");
			this.renderer.setAttribute(htxt, "alignment-baseline", "middle");
			this.renderer.setAttribute(htxt, "text-anchor", "middle");
			this.renderer.setAttribute(htxt, "x", (Math.floor(hcord[0])).toString());
			this.renderer.setAttribute(htxt, "y", (Math.floor(hcord[1])).toString());
			this.renderer.setAttribute(htxt, "id", "RH" + ch.toString());
			this.renderer.appendChild(g, htxt);
			console.log("fixing planets to hou");
  		 if (plps.hasOwnProperty(ras[ch-1])) {
			var pls = plps[ras[ch-1]].split('\|');
			for (var k = 0; k < pls.length; k++) {
			    console.log("k=", k);
				if (pls[k].split(' ')[1] == 'me' || pls[k].split(' ')[1] == 'os') continue;
			console.log("ch", ch);
				var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
				console.log('getXY', pls[k]);
				var cord = this.getXY(hou, this.device_width, Number(pls[k].split(' ')[0]));
				console.log('getXY', cord);
				this.renderer.appendChild(text, document.createTextNode(pls[k]));
				this.renderer.setAttribute(text, "font-size", s6.toString());
				this.renderer.setAttribute(text, "font-weight", "bold");
				this.renderer.setAttribute(text, "alignment-baseline", "middle");
				this.renderer.setAttribute(text, "text-anchor", "middle");
				this.renderer.setAttribute(text, "x", (Math.floor(cord[0])).toString());
				this.renderer.setAttribute(text, "y", (Math.floor(cord[1]+np)).toString());
				this.renderer.setAttribute(text, "id", "R" + ch.toString() + k.toString());
				this.renderer.appendChild(g, text);
				np += 12;
			}
		}
		hou++;
	}
								var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.renderer.appendChild(text, document.createTextNode(title.toUpperCase()));
						this.renderer.setAttribute(text, "fill", "#0f0f0f");
						this.renderer.setAttribute(text, "font-size", "15");
						this.renderer.setAttribute(text, "font-weight", 'bold');
						this.renderer.setAttribute(text, "x", (bxz*2).toString());
						this.renderer.setAttribute(text, "y", (bxz*2).toString());
						this.renderer.setAttribute(text, "alignment-baseline", "middle");
						this.renderer.setAttribute(text, "text-anchor", "middle");
						this.renderer.setAttribute(text, "id", id);
						g.appendChild(text);
	
	svg.appendChild(g);
	return svg;
 }
 
 getXY(h, w, p) {
	let side: number = Math.floor(w/4);
	console.log('h', h);
	console.log('side', side);
	let x1: number = 0;
	let x2: number = 0;
	let y1: number = 0;
	let y2: number = 0;
	switch(h) {
		case 1:
			x1 = side;
			x2 = side*3;
			y1 = 0;
			y2 = side*2;
			break;
		case 2:
			x1 = 0;
			x2 = side*2;
			y1 = 0;
			y2 = side;
			break;
		case 3:
			x1 = 0;
			x2 = side;
			y1 = 0;
			y2 = side*2;
			break;
		case 4:
			x1 = 0;
			x2 = side*2;
			y1 = side;
			y2 = side*3;
			break;
		case 5:
			x1 = 0;
			x2 = side;
			y1 = side*2;
			y2 = w;
			break;
		case 6:
			x1 = 0;
			x2 = side*2;
			y1 = side*3;
			y2 = w;
			break;
		case 7:
			x1 = side;
			x2 = side*2;
			y1 = side*2;
			y2 = w;
			break;
		case 8:
			x1 = side*2;
			x2 = w;
			y1 = side*3;
			y2 = w;
			break;
		case 9:
			x1 = side*3;
			x2 = w;
			y1 = side*2;
			y2 = w;
			break;
		case 10:
			x1 = side*2;
			x2 = w;
			y1 = side;
			y2 = side*3;
			break;
		case 11:
			x1 = side*3;
			x2 = w;
			y1 = 0;
			y2 = side*2;
			break;
		case 12:
			x1 = side*2;
			x2 = w;
			y1 = 0;
			y2 = side;
			break;
		default:
			break;
	}
	let xw: number = x2 - x1;
	let yh: number = y2 - y1;
	//let part: number = Math.floor((x2-x1)/30);
	var x = x1 + (Math.floor(xw/2));
	var y = y1 + (Math.floor(yh/2));
	console.log(x,y);
	return [x, y];
 }
 getHXY(h, w) {
	let side: number = Math.floor(w/4);
	console.log('h', h);
	console.log('side', side);
	let x1: number = 0;
	let x2: number = 0;
	let y1: number = 0;
	let y2: number = 0;
	switch(h) {
		case 1:
			x1 = side;
			x2 = side*3;
			y1 = 0;
			y2 = side*2;
			break;
		case 2:
			x1 = 0;
			x2 = side*2;
			y1 = 0;
			y2 = side;
			break;
		case 3:
			x1 = 0;
			x2 = side;
			y1 = 0;
			y2 = side*2;
			break;
		case 4:
			x1 = 0;
			x2 = side*2;
			y1 = side;
			y2 = side*3;
			break;
		case 5:
			x1 = 0;
			x2 = side;
			y1 = side*2;
			y2 = w;
			break;
		case 6:
			x1 = 0;
			x2 = side*2;
			y1 = side*3;
			y2 = w;
			break;
		case 7:
			x1 = side;
			x2 = side*2;
			y1 = side*2;
			y2 = w;
			break;
		case 8:
			x1 = side*2;
			x2 = w;
			y1 = side*3;
			y2 = w;
			break;
		case 9:
			x1 = side*3;
			x2 = w;
			y1 = side*2;
			y2 = w;
			break;
		case 10:
			x1 = side*2;
			x2 = w;
			y1 = side;
			y2 = side*3;
			break;
		case 11:
			x1 = side*3;
			x2 = w;
			y1 = 0;
			y2 = side*2;
			break;
		case 12:
			x1 = side*2;
			x2 = w;
			y1 = 0;
			y2 = side;
			break;
		default:
			break;
	}
	let xw: number = x2 - x1;
	let yh: number = y2 - y1;
	var x = x1 + (Math.floor(xw/2));
	var y = y1 + (Math.floor(yh/2) - 12);
	console.log(x,y);
	return [x, y];
 }
}
