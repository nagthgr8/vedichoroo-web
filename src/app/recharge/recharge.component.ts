import { Component, OnInit, ViewChild, Output, EventEmitter, TemplateRef } from '@angular/core';
import { HoroscopeService } from '../horoscope.service';
import { ShareService } from '../share.service';
import { User } from '../user';
import { Location } from '../location';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.scss']
})
export class RechargeComponent {
	@ViewChild('recMdl', { static: true }) recMdl: TemplateRef<any>;
	@Output() recMdlLoaded = new EventEmitter<TemplateRef<any>>();
	@Output() paymentSubmitted = new EventEmitter<any>();
   constructor(private shareService: ShareService, private horoService: HoroscopeService) {
   }
   tsel: any = {
	m500: 'tsel',
	m1000: 'tunsel',
	m1500: 'tunsel'
  }
  m500: number = 500;
  m1000: number = 1000;
  m1500: number = 1500;
  //user: User;
  ccy: string = 'INR';
  info: string = '';
  ngOnInit() {
		this.shareService.getItem('vho:loc').then((loc: Location) => {
		this.shareService.getItem('vho:ccy').then((ccy: string) => { 
		     this.ccy = ccy.split(',')[0];
		     this.horoService.getCurrencyExchangeRate(loc.country_code, ccy.split(',')[0]).subscribe(res => {
			 console.log('ConversionRate', res);
		console.log('loc', loc);
		console.log('ccy', ccy);
		       if(res['conversionRate'] != 0) {
			    this.m500 = Math.round(this.m500*res['conversionRate']*10)/10;
			    this.m1000 = Math.round(this.m1000*res['conversionRate']*10)/10;
			    this.m1500 = Math.round(this.m1500*res['conversionRate']*10)/10;
				}
			});
		});
	   });	
  }
  ngAfterViewInit() {
	this.recMdlLoaded.emit(this.recMdl);
  }
  
  addmoney(evt,amt) {
	evt.stopPropagation();
	let payment = { 
  amt: amt,
  ccy: this.ccy 
}
    this.info = 'Please wait..';
	this.paymentSubmitted.emit(payment);
	//this.razpay(amt);
	//this.modalService.dismissAll();
  }
}
