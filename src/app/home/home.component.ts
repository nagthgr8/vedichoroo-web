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
}
