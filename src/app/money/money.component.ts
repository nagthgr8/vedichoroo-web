import { Component, Renderer2, AfterViewInit, ViewChild, ViewEncapsulation, ElementRef, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Router } from '@angular/router';
import { HoroscopeService } from '../horoscope.service';
import { ShareService } from '../share.service'
import { Observable, forkJoin } from 'rxjs';
import { BirthInfo } from '../birth-info';
import { Yoga } from '../yoga';
@Component({
  selector: 'app-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MoneyComponent implements OnInit {
  @ViewChild('birthChart', {static: true}) birthChart;
  @ViewChild('navChart', {static: true}) navChart;
  signs_v: any;
  o_signs_v: any;
  o_rashis_v: any;
  ruler_name_v: any;
  nakshatras_v: any;
  rashi_lords_v: any;
  friend_pl_v: any;
  neutral_pl_v: any;
  enemy_pl_v: any;
  dob: string = '';
  svgHoro: any;
  lagna: string = '';
  lagna_lord: string = '';
  moon_sign: string = '';
	moon_sign_f: string = '';
  moon_deg :string = '';
  sun_sign: string = '';
  tithi: string = '';
  birth_star: string = '';
  star_lord: string = '';
  moon_phase: string = '';
  device_width :number = 0;
  device_height :number = 0;
  objectKeys = Object.keys;
  oYog: Yoga[] = [];
  aYog: Yoga[] = [];
  nYog: Yoga[] = [];
  oBif :BirthInfo;
  navPls: string[] = [];
  binf: any;
  mdas1: string = '';adas1: string = '';pdas1: string = '';pend1: string = '';
  info: string;
  msg: string = '';
  showBD: boolean = false;
  akashWani: string = '';
  asc_sign :string = '';
	pnam1: string = ''; pnam2: string = ''; pnam3: string = ''; pnam4: string = ''; pnam5: string = ''; pnam6: string = ''; pnam7: string = ''; pnam8: string = ''; pnam9: string = '';
	ppos1: string = ''; ppos2: string = ''; ppos3: string = ''; ppos4: string = ''; ppos5: string = ''; ppos6: string = ''; ppos7: string = ''; ppos8: string = ''; ppos9: string = '';
	pras1: string = ''; pras2: string = ''; pras3: string = ''; pras4: string = ''; pras5: string = ''; pras6: string = ''; pras7: string = ''; pras8: string = ''; pras9: string = '';
	pnak1: string = ''; pnak2: string = ''; pnak3: string = ''; pnak4: string = ''; pnak5: string = ''; pnak6: string = ''; pnak7: string = ''; pnak8: string = ''; pnak9: string = '';
	nakl1: string = ''; nakl2: string = ''; nakl3: string = ''; nakl4: string = ''; nakl5: string = ''; nakl6: string = ''; nakl7: string = ''; nakl8: string = ''; nakl9: string = '';
 constructor(private router: Router, public shareService: ShareService, private horoService: HoroscopeService, public renderer: Renderer2) { 
	 if (this.router.getCurrentNavigation().extras.state) {
		 this.binf = this.router.getCurrentNavigation().extras.state;
	 } else {
		 this.binf = this.shareService.getBINF();
		 console.log('binf', this.binf);
	 }
	 if (!this.binf) this.router.navigate(['/']);
 }

	ngOnInit() {
		this.info = 'Fetching..';
	  forkJoin(
		  this.horoService.getJson('assets/data/signs.json'),
		  this.horoService.getJson('assets/data/o_signs.json'),
		  this.horoService.getJson('assets/data/o_rashis.json'),
		  this.horoService.getJson('assets/data/rashi_lords.json'),
		  this.horoService.getJson('assets/data/ruler_name.json'),
		  this.horoService.getJson('assets/data/friend_pl.json'),
		  this.horoService.getJson('assets/data/enemy_pl.json'),
		  this.horoService.getJson('assets/data/nakshatras.json'),
		  this.horoService.getJson('assets/data/neutral_pl.json'),
	  )
		  .subscribe(dat => {
			  console.log('dat', dat);
			  this.signs_v = dat[0];
			  console.log('signs_v', this.signs_v);
			  this.o_signs_v = dat[1];
			  this.o_rashis_v = dat[2];
			  this.rashi_lords_v = dat[3];
			  this.ruler_name_v = dat[4];
			  this.friend_pl_v = dat[5];
			  this.enemy_pl_v = dat[6];
			  this.nakshatras_v = dat[7];
			  this.neutral_pl_v = dat[8];
	  this.device_width = document.getElementById('bchart').offsetWidth;
	  this.device_height = document.getElementById('bchart').offsetWidth;
		let yogs = this.shareService.getYOGAS();
		let jf: string = '';
		this.info = 'Getting birth star info...';
	  let ayanid: number = 4;
	  var res = this.shareService.getAYNM();
	  if (res) ayanid = Number(res);
	  this.horoService.getBirthInfoEx(this.binf.lat, this.binf.lng, this.binf.dob, this.binf.timezone, ayanid)
		  .subscribe(res => {
			  this.info = '';
			  this.dob = res['dob'];
			  this.lagna = this.shareService.translate_func(res['lagna']); this.lagna = this.shareService.translate_func(res['lagna']);
			  this.lagna_lord = this.shareService.translate_func(res['lagna_lord']);
			  this.moon_sign_f = this.shareService.translate_func(res['moon_sign']);
			  this.sun_sign = this.shareService.translate_func(res['sun_sign']);
			  this.tithi = this.shareService.translate_func(res['tithi']);
			  this.birth_star = this.shareService.translate_func(res['birth_star']);
			  this.star_lord = this.shareService.translate_func(res['star_lord']);
			  this.moon_phase = this.shareService.translate_func(res['moon_phase']);
			  this.showBD = true;
	  this.info = 'Loading..';
	  this.loadHoro(this.shareService.getPLPOS(), this.birthChart.nativeElement, 'RASHI CHART');
	  let ayanid: number = 4;
	  var ayn = this.shareService.getAYNM();
	  if (ayn) ayanid = Number(ayn);
	  let mdeg: number = 0;
	  console.log('moondeg', this.moon_deg);
	  if (this.moon_deg.indexOf('.') > -1)
		  mdeg = this.shareService.dmsToDec(Number(this.moon_deg.split('.')[0]), Number(this.moon_deg.split('.')[1]), Number(this.moon_deg.split('.')[2]));
	  else
		  mdeg = Number(this.moon_deg);
	  let bstar: string = this.calcStar(mdeg, this.moon_sign);
	  console.log(bstar);
	  this.shareService.setBirthStar(bstar.split('|')[0]);
	  var ras_num = Number(this.o_rashis_v[this.moon_sign].split('\|')[0]);
	  var ras_num2 = Number(this.o_rashis_v[bstar.split('|')[3]].split('\|')[0]);
	  this.info = 'Identiying current dasha...';
	  this.horoService.calcVim(this.binf.dob, bstar.split('|')[2], mdeg, Number(bstar.split('|')[1]), ras_num, ras_num2
		  , this.shareService.getLANG())
		  .subscribe(res => {
			  this.info = '';
			  for (let key of Object.keys(res)) {
				  if (res[key].style == 'mdasc') this.mdas1 = key;
				  else if (res[key].style == 'adasc') this.adas1 = this.ruler_name_v[key.split('-')[1].toLowerCase()];
				  else if (res[key].style == 'pdasc') {
					  this.pdas1 = this.ruler_name_v[key.split('-')[2].toLowerCase()];
				  }
			  }
			  let das: string = this.mdas1.charAt(0).toUpperCase() + this.mdas1[1] + '|' + this.adas1.charAt(0).toUpperCase() + this.adas1[1] + '|' + this.pdas1.charAt(0).toUpperCase() + this.pdas1[1];
			  this.info = 'Analyzing wealth in your horoscope...';
			  this.horoService.getMoney(das, this.binf.lat, this.binf.lng, this.binf.dob, this.binf.timezone, this.shareService.getLANG(), ayanid)
				  .subscribe(res2 => {
					  this.info = '';
					  let yogas = res2;
					  for (let key of Object.keys(yogas)) {
						  let yg: Yoga = {
							  name: key,
							  desc: yogas[key]
						  };
						  this.oYog[key] = yg;
					  }
				  }, (err) => {
					  this.info = JSON.stringify(err);
				  });

		  }, (err) => {
		  });
	  this.info = 'Calculating Hora..';
	  this.navPls = this.calcHoraChart();
	  this.info = 'Loading..';
	  this.loadHoro(this.navPls, this.navChart.nativeElement, 'HORA');
	  this.info = 'Analyzing Hora..';
	  this.analyzHora(this.navPls);
		  });
		});
  }
  calcHoraChart()
  {
	let navPls: string[] = [];
	var plPos = this.shareService.getPLPOS();
	var sgns = ["ar","ta","ge","cn","le","vi","li","sc","sa","cp","aq","pi"];
	for (var i = 0; i < 12; i++) {
		var sign = sgns[i];
		let hora_sign: string = '';
		if (plPos.hasOwnProperty(sign)) {
			var pls = plPos[sign].split('\|');
			for (var k = 0; k < pls.length; k++) {
				var pl = pls[k].split(' ')[1];
				if (pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'TRUE_NODE') {  //consider only true planets
				    let po: number = Number(pls[k].split(' ')[0]);
					switch(sign)
					{
						case 'ar':
						case 'ge':
						case 'le':
						case 'li':
						case 'sa':
						case 'aq':
						    (po <= 15) ? hora_sign = 'le' : hora_sign = 'cn';
							break;
						case 'ta':
						case 'cn':
						case 'vi':
						case 'sc':
						case 'cp':
						case 'pi':
						    (po <= 15) ? hora_sign = 'cn' : hora_sign = 'le';
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

  loadHoro(plPos, ele, title)
  {
    console.log('loadHoro');
	console.log(plPos);
	  let ksn: string = '';
 		for (var i = 0; i < 16; i++) {
			var sign = this.signs_v[i];
			if (plPos.hasOwnProperty(sign)) {
			    
				var pls = plPos[sign].split('\|');
				console.log(pls);
				for (var k = 0; k < pls.length; k++) {
					if (pls[k].split(' ')[1] == 'MEAN_NODE') {
						var rpos = this.o_rashis_v[sign].split('\|')[0];
						var kpos = parseInt(rpos, 10) + 6;
						if (kpos > 12) kpos = (kpos - 12);
						if (plPos.hasOwnProperty(this.o_signs_v[kpos - 1])) {
							var eP = plPos[this.o_signs_v[kpos - 1]];
							ksn = this.o_signs_v[kpos - 1];
							plPos[ksn] = eP + '|' + pls[k].split(' ')[0] + ' ' + 'Ke';
						} else {
							ksn = this.o_signs_v[kpos - 1];
							plPos[ksn] = pls[k].split(' ')[0] + ' ' + 'Ke';
						}
						plPos[sign] = plPos[sign].replace('MEAN_NODE', 'Ra');
					} else if (pls[k].split(' ')[1] == 'Mo') {
						this.moon_sign = sign;
						this.moon_deg = pls[k].split(' ')[0];
					} else if (pls[k].split(' ')[1] == 'AC') { 
						this.asc_sign = sign;
						console.log('ASCENDENT is ' + this.asc_sign);
					}
					let pps: number = this.shareService.dmsToDec(Number(pls[k].split(' ')[0].split('.')[0]), Number(pls[k].split(' ')[0].split('.')[1]), Number(pls[k].split(' ')[0].split('.')[2]));
					let star: string = this.calcStar(pps, sign);
					let kstar = '';
					if (pls[k].split(' ')[1] == 'MEAN_NODE') kstar = this.calcStar(pps, ksn);
					let vg: string = (title == 'RASHI CHART') ? 'D1' : 'D10';
					switch (pls[k].split(' ')[1]) {
						case 'Su':
							this.pnam1 = 'Sun';
							this.ppos1 = pls[k].split(' ')[0];
							this.pras1 += this.o_rashis_v[sign].split('|')[1] + '(' + vg + ')' + '<br>';
							this.pnak1 += star.split('|')[0] + '(' + vg + ')' + '<br>';
							this.nakl1 += star.split('|')[2] + '(' + vg + ')' + '<br>';
							break;
						case 'Mo':
							this.pnam2 = 'Moon';
							this.ppos2 = pls[k].split(' ')[0];
							this.pras2 += this.o_rashis_v[sign].split('|')[1] + '(' + vg + ')' + '<br>';
							this.pnak2 += star.split('|')[0] + '(' + vg + ')' + '<br>';
							this.nakl2 += star.split('|')[2] + '(' + vg + ')' + '<br>';
							break;
						case 'Ma':
							this.pnam3 = 'Mars';
							this.ppos3 = pls[k].split(' ')[0];
							this.pras3 += this.o_rashis_v[sign].split('|')[1] + '(' + vg + ')' + '<br>';
							this.pnak3 += star.split('|')[0] + '(' + vg + ')' + '<br>';
							this.nakl3 += star.split('|')[2] + '(' + vg + ')' + '<br>';
							break;
						case 'Me':
							this.pnam4 = 'Mercury';
							this.ppos4 = pls[k].split(' ')[0];
							this.pras4 += this.o_rashis_v[sign].split('|')[1] + '(' + vg + ')' + '<br>';
							this.pnak4 += star.split('|')[0] + '(' + vg + ')' + '<br>';
							this.nakl4 += star.split('|')[2] + '(' + vg + ')' + '<br>';
							break;
						case 'Ju':
							this.pnam5 = 'Jupiter';
							this.ppos5 = pls[k].split(' ')[0];
							this.pras5 += this.o_rashis_v[sign].split('|')[1] + '(' + vg + ')' + '<br>';
							this.pnak5 += star.split('|')[0] + '(' + vg + ')' + '<br>';
							this.nakl5 += star.split('|')[2] + '(' + vg + ')' + '<br>';
							break;
						case 'Ve':
							this.pnam6 = 'Venus';
							this.ppos6 = pls[k].split(' ')[0];
							this.pras6 += this.o_rashis_v[sign].split('|')[1] + '(' + vg + ')' + '<br>';
							this.pnak6 += star.split('|')[0] + '(' + vg + ')' + '<br>';
							this.nakl6 += star.split('|')[2] + '(' + vg + ')' + '<br>';
							break;
						case 'Sa':
							this.pnam7 = 'Saturn';
							this.ppos7 = pls[k].split(' ')[0];
							this.pras7 += this.o_rashis_v[sign].split('|')[1] + '(' + vg + ')' + '<br>';
							this.pnak7 += star.split('|')[0] + '(' + vg + ')' + '<br>';
							this.nakl7 += star.split('|')[2] + '(' + vg + ')' + '<br>';
							break;
						case 'MEAN_NODE':
							this.pnam8 = 'Rahu';
							this.ppos8 = pls[k].split(' ')[0];
							this.pras8 = this.o_rashis_v[sign].split('|')[1];
							this.pnak8 = star.split('|')[0];
							this.nakl8 = star.split('|')[2];
							this.pnam9 = 'Ketu';
							this.ppos9 = pls[k].split(' ')[0];
							this.pras9 = this.o_rashis_v[ksn].split('|')[1];
							this.pnak9 = kstar.split('|')[0];
							this.nakl9 = kstar.split('|')[2];
							break;
						default:
							break;
					}
				}
			}
		}
		if(this.shareService.getCHTYP() == 'sind')
			this.svgHoro = this.grid(4, this.device_width/4, this.device_width, plPos, title);
		else if(this.shareService.getCHTYP() == 'nind')
			this.svgHoro = this.drawNIchart(plPos, title);
		else
			this.svgHoro = this.grid(4, this.device_width/4, this.device_width, plPos, title);
	this.renderer.appendChild(ele, this.svgHoro);
  }
	grid(numberPerSide, size, pixelsPerSide, plps, title) {
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.renderer.setAttribute(svg, "width", pixelsPerSide);
		this.renderer.setAttribute(svg, "height", pixelsPerSide);
		this.renderer.setAttribute(svg, "viewBox", [0, 0, numberPerSide * size, numberPerSide * size].join(" "));
		var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		var s1 = 24;
		var xp = size - 24;
		var pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
		this.renderer.setAttribute(pattern, "id", "sign-0");
		this.renderer.setAttribute(pattern, "patternUnits", "userSpaceOnUse");
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
		var s5 = s3 - 14;
		var s4 = 15;
		let db: string = this.binf.dob;
		let latlng: string = '';
		if (this.binf.dob.indexOf('L') > -1) {
			db = this.binf.dob.split('L')[0].trim();
			let lat: string = this.binf.dob.split('L')[1].split('@')[0].split(',')[0].trim();
			let lng: string = this.binf.dob.split('L')[1].split('@')[0].split(',')[1].trim();
			latlng = lat + ',' + lng;
		} else {
			latlng = this.binf.lat + ',' + this.binf.lng;
		}
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
						this.renderer.appendChild(text, document.createTextNode(title));
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
				this.renderer.setAttribute(box, "stroke-width", (this.signs_v[number] == this.asc_sign) ? (border + 2).toString() : border.toString());
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
						//if (pls[k].split(' ')[1] == 'AC');
						if (pls[k].split(' ')[1] == 'Mo') {
							this.moon_sign = sign;
							this.moon_deg = pls[k].split(' ')[0];
						}
						pcnt++;
						text = document.createElementNS("http://www.w3.org/2000/svg", "text");
						var plt = pls[k];
						if (this.shareService.getRETRO().indexOf(pls[k].split(' ')[1]) > -1) plt += '[R]';
						this.renderer.appendChild(text, document.createTextNode(plt));
						this.renderer.setAttribute(text, "font-size", s6.toString());
						this.renderer.setAttribute(text, "font-weight", "bold");
						if (pls[k].split(' ')[1] == 'AC') this.renderer.addClass(text, "redText");
						else if (pls[k].split(' ')[1] == 'Mo') this.renderer.addClass(text, "blueText");
						this.renderer.setAttribute(text, "x", s7.toString());
						var s8 = 10 * pcnt;
						this.renderer.setAttribute(text, "y", s8.toString());
						this.renderer.setAttribute(text, "id", "t" + number.toString());
						g.appendChild(text);
					}
				}
				svg.appendChild(g);
			}
		}
		g = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.renderer.setAttribute(g, "transform", ["translate(", i * size, ",", j * size, ")"].join(""));
		number = numberPerSide * i + j;
		return svg;
	};
	more()
	{
	let item: any = {};
	item.title = 'Talk to Astrologer';
	this.router.navigate(['/astrologers'], {state: item});
	}	
	days_of_a_year(year) {
		return this.isLeapYear(year) ? 366 : 365;
	}
	isLeapYear(year) {
     return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
	}
	days_in_month(month, year) {
		return new Date(year, month, 0).getDate();
	}		
        calcStar(plpos: number, sign: string)
        {
			for(var i = 0; i < Object.keys(this.nakshatras_v).length; i++)
			{
				var nak = this.nakshatras_v[i];
                if (nak.location.start.split(',')[1] == sign && nak.location.end.split(',')[1] == sign)
                {
                    if (plpos >= this.shareService.dmsToDec(Number(nak.location.start.split(',')[0].split('.')[0]),Number(nak.location.start.split(',')[0].split('.')[1]),0) && plpos < this.shareService.dmsToDec(Number(nak.location.end.split(',')[0].split('.')[0]),Number(nak.location.end.split(',')[0].split('.')[1]),0))
                    {
						return nak.name + '|' + nak.location.start.split(',')[0] + '|' + nak.ruler + '|' + nak.location.start.split(',')[1] + '|' + nak.location.end.split(',')[1];
                    }
				}
                else if (nak.location.start.split(',')[1] == sign.toString())
                {
                     if (plpos >= this.shareService.dmsToDec(Number(nak.location.start.split(',')[0].split('.')[0]), Number(nak.location.start.split(',')[0].split('.')[1]),0))
                     {
						return nak.name + '|' + nak.location.start.split(',')[0] + '|' + nak.ruler + '|' + nak.location.start.split(',')[1] + '|' + nak.location.end.split(',')[1];                     
					 }
                }
                else if (nak.location.end.split(',')[1] == sign.toString())
                {
                     if (plpos < this.shareService.dmsToDec(Number(nak.location.end.split(',')[0].split('.')[0]), Number(nak.location.end.split(',')[0].split('.')[1]),0))
                     {
						 return nak.name + '|' + nak.location.start.split(',')[0] + '|' + nak.ruler + '|' + nak.location.start.split(',')[1] + '|' + nak.location.end.split(',')[1];	                     
					 }
                }
			}
			return '';
        }
  analyzHora(plPos)
  {
	let cn_p: number = 0, le_p: number = 0;
	let ju: number = 1, ve: number = 1, me: number = 1, mo: number = 1, su: number = 1, ma: number = 1, sa: number = 1;
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
					console.log('su=',su);
					console.log('mo=',mo);
					console.log('ju=',ju);
					console.log('ve=',ve);
					console.log('me=',me);
					console.log('ma=',ma);
					console.log('sa=',sa);
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
		this.akashWani += '<span>1st HOUSE CANCER sign hosting ' + cn_pls + ' has gained ' + cn_p.toString() + ' Points.</span><br/>';
		this.akashWani += '<span>2nd HOUSE LEO sign hosting ' + le_pls + ' has gained ' + le_p.toString() + ' Points.</span><br/>';
		if(le_p > cn_p) 
			this.akashWani += '<span style="font-weight:bold;font-size:15px">The native will accumulate more wealth</span><br/>';
		
	} else {
		this.akashWani += '<span>12th HOUSE CANCER sign hosting ' + cn_pls + ' has gained ' + cn_p.toString() + ' Points.</span><br/>';
		this.akashWani += '<span>1st HOUSE LEO sign hosting ' + le_pls + ' has gained ' + le_p.toString() + ' Points.</span><br/>';
		if(cn_p > le_p)
			this.akashWani += '<span style="font-weight:bold;font-size:15px">The native spends more</span><br/>';
		else
			this.akashWani += '<span style="font-weight:bold;font-size:15px">The native will be wealthy</span><br/>';
	}
	if(cn_p == le_p)
			this.akashWani += '<span style="font-weight:bold;font-size:15px">The native maintains whats inherited</span><br/>';
  }
	drawNIchart(plps, title) {
	   var roms = ['I', 'II', 'III', 'IV', 'V', 'V1', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
       var ras = ['ar', 'ta', 'ge', 'cn', 'le', 'vi', 'li', 'sc', 'sa', 'cp', 'aq', 'pi'];
	   let ah: number = 0;
	   var s6 = 10;
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
		this.renderer.setAttribute(svg, "width", (size).toString());
		this.renderer.setAttribute(svg, "height", (size).toString());
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
		var hcord = this.getHXY(1, this.device_width/2);
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
				var cord = this.getXY(1, this.device_width/2, Number(pls[k].split(' ')[0]));
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
		    hcord = this.getHXY(hou, this.device_width/2);
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
				var cord = this.getXY(hou, this.device_width/2, Number(pls[k].split(' ')[0]));
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
						this.renderer.setAttribute(text, "font-size", "7");
						this.renderer.setAttribute(text, "font-weight", 'bold');
						this.renderer.setAttribute(text, "x", (bxz*2).toString());
						this.renderer.setAttribute(text, "y", (bxz*2).toString());
						this.renderer.setAttribute(text, "alignment-baseline", "middle");
						this.renderer.setAttribute(text, "text-anchor", "middle");
						this.renderer.setAttribute(text, "id", "title");
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
	console.log('x1', x1);
	console.log('x2', x2);
	console.log('y1', y1);
	console.log('y2', y2);
	let xw: number = x2 - x1;
	let yh: number = y2 - y1;
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
	console.log('x1', x1);
	console.log('x2', x2);
	console.log('y1', y1);
	console.log('y2', y2);
	let xw: number = x2 - x1;
	let yh: number = y2 - y1;
	var x = x1 + (Math.floor(xw/2));
	var y = y1 + (Math.floor(yh/2) - 12);
	console.log(x,y);
	return [x, y];
 }
}
