import { Component, OnInit } from '@angular/core';
import { NgwWowService } from 'ngx-wow';
import { HoroscopeService } from '../horoscope.service';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	showHM = false;
  showLD = true;
  ari: string = '';
  tau: string = '';
  gem: string = '';
  can: string = '';
  leo: string = '';
  vir: string = '';
  lib: string = '';
  sco: string = '';
  sag: string = '';
  cap: string = '';
  aqu: string = '';
  pis: string = '';
  asts: any;
  constructor(private wowService: NgwWowService, private horoService: HoroscopeService, private shareService: ShareService) {
  		this.wowService.init();
	  }

  ngOnInit(): void {
 this.horoService.getDailyHoro('Aries')
		.subscribe(res => {
			this.showLD = false;
			this.showHM = true;
       this.ari = JSON.stringify(res);
     }, (err) => {
       this.ari = JSON.stringify(err);
     });
   this.horoService.getDailyHoro('Taurus')
     .subscribe(res => {
       this.tau = JSON.stringify(res);
     }, (err) => {
       this.tau = JSON.stringify(err);
     });
   this.horoService.getDailyHoro('Gemini')
     .subscribe(res => {
       this.gem = JSON.stringify(res);
     }, (err) => {
       this.gem = JSON.stringify(err);
     });
   this.horoService.getDailyHoro('Cancer')
     .subscribe(res => {
       this.can = JSON.stringify(res);
     }, (err) => {
       this.can = JSON.stringify(err);
     });
   this.horoService.getDailyHoro('Leo')
     .subscribe(res => {
       this.leo = JSON.stringify(res);
     }, (err) => {
       this.leo = JSON.stringify(err);
     });
   this.horoService.getDailyHoro('Virgo')
     .subscribe(res => {
       this.vir = JSON.stringify(res);
     }, (err) => {
       this.vir = JSON.stringify(err);
     });
   this.horoService.getDailyHoro('Scorpio')
     .subscribe(res => {
       this.sco = JSON.stringify(res);
     }, (err) => {
       this.sco = JSON.stringify(err);
     });
   this.horoService.getDailyHoro('Libra')
     .subscribe(res => {
       this.lib = JSON.stringify(res);
     }, (err) => {
       this.lib = JSON.stringify(err);
     });
   this.horoService.getDailyHoro('Sagittarius')
     .subscribe(res => {
       this.sag = JSON.stringify(res);
     }, (err) => {
       this.sag = JSON.stringify(err);
     });
   this.horoService.getDailyHoro('Capricorn')
     .subscribe(res => {
       this.cap = JSON.stringify(res);
     }, (err) => {
       this.cap = JSON.stringify(err);
     });
   this.horoService.getDailyHoro('Aquarius')
     .subscribe(res => {
       this.aqu = JSON.stringify(res);
     }, (err) => {
       this.aqu = JSON.stringify(err);
     });
    this.horoService.getDailyHoro('Pisces')
      .subscribe(res => {
        this.pis = JSON.stringify(res);
      }, (err) => {
        this.pis = JSON.stringify(err);
      });
  		this.asts = [];
		this.horoService.getAllAstrologers()
			.subscribe(res => {
				let oa: any = res;
				for (var i = 0; i < oa.length; i++) {
					this.asts.push(oa[i]);
				}
			}, (err) => {
				console.log(err);
			});
  }
	astro(ast) {

	}
	publishReport(oa) {
		for(var i = 0; i < oa.length; i++) {
			console.log(i, oa[i]);
			let call: string = oa[i].mob;
			let chat: string = oa[i].mob;
			if(oa[i].mob.indexOf('|') > -1) {
			call = oa[i].mob.split('|')[0];
			chat = oa[i].mob.split('|')[1];
			}
			//let walnk = 'https://wa.me/' + chat + '?text=I%20am%20interested%20to%20consult%20you%20for%20astrology';
			let smsg = (oa[i].status.indexOf('|') != -1 && oa[i].status.split('|')[0] == 'A') ? 'Available' :  (oa[i].status.split('|')[0] == 'C') ?  'Busy' : 'Not Available';
			let cfee: string = '';
			let ast: Astrologer = {
			   uuid: oa[i].uuid,
			name: oa[i].name,
			tagline: oa[i].tagline,
			avatar: oa[i].avatar,
			uid: oa[i].uid,
			mob: call,
			walnk: '',
			smsg: smsg,
			status: (oa[i].status.indexOf('|') != -1 && oa[i].status.split('|')[0] == 'A') ? true : false,
			peerid: (oa[i].status.split('|')[0] != 'NA') ? oa[i].status.split('|')[1] : '',
			cfee: oa[i].cfee,
			rating: oa[i].rating,
								tot_ratings: oa[i].tot_ratings,
								str1: 'fa fa-star-o',
								str2: 'fa fa-star-o',
								str3: 'fa fa-star-o',
								str4: 'fa fa-star-o',
								str5: 'fa fa-star-o',
			lng: oa[i].lng
			};

			if(oa[i].rating >= 1 && oa[i].rating < 2) {
			   ast.str1 = 'fa-solid fa-star';
			   ast.str2 = (oa[i].rating > 1) ? 'fa fa-star-half-o' : 'fa fa-star-o';
			ast.str3 = 'fa fa-star-o';
			ast.str4 = 'fa fa-star-o';
			ast.str5 = 'fa fa-star-o';
			}
			else if (oa[i].rating >= 2 && oa[i].rating < 3) {
			   ast.str1 = 'fa-solid fa-star';
			ast.str2 = 'fa-solid fa-star';
			   ast.str3 = (oa[i].rating > 2) ? 'fa fa-star-half-o' : 'fa fa-star-o';
			ast.str4 = 'fa fa-star-o';
			ast.str5 = 'fa fa-star-o';
			}
			else if(oa[i].rating >= 3 && oa[i].rating < 4) {
			   ast.str1 = 'fa-solid fa-star';
			ast.str2 = 'fa-solid fa-star';
			ast.str3 = 'fa-solid fa-star';
			   ast.str4 = (oa[i].rating > 3) ? 'fa fa-star-half-o' : 'fa fa-star-o';
			ast.str5 = 'fa fa-star-o';
			}
			else if(oa[i].rating >= 4 && oa[i].rating < 5){
			   ast.str1 = 'fa-solid fa-star';
			ast.str2 = 'fa-solid fa-star';
			ast.str3 = 'fa-solid fa-star';
			ast.str4 = 'fa-solid fa-star';
			ast.str5 = (oa[i].rating > 4) ? 'fa fa-star-half-o' : 'fa fa-star-o';
			} else {
			   ast.str1 = 'fa-solid fa-star';
			ast.str2 = 'fa-solid fa-star';
			ast.str3 = 'fa-solid fa-star';
			ast.str4 = 'fa-solid fa-star';
			ast.str5 = 'fa-solid fa-star';
			}
			console.log(ast.name, ast.status);
			this.oAst[a++] = ast;
			//if(oa[i].status.indexOf('|') != -1) {
			// if(oa[i].status.split('|')[0] == 'A') this.oAst[a++] = ast;
			// else this.oAstb[b++] = ast;
			//} else {
			//this.oAstb[b++] = ast;
			//}
		}
	}
}
