import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from '../share.service';
import { HoroscopeService } from '../horoscope.service';
declare var RazorpayCheckout: any;

@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.page.html',
  styleUrls: ['./add-money.page.scss'],
})
export class AddMoneyPage implements OnInit {
  amt: number = 500;
  sub: string = '';
  tsel: any = {
	m500: 'tsel',
	m1000: 'tunsel',
	m1500: 'tunsel'
  }
  info: string = '';
  source: any;
  constructor(public router: Router, public horoService: HoroscopeService, public shareService: ShareService) { }

  ngOnInit() {
    this.source = this.router.getCurrentNavigation().extras.state;
	if(this.source == 'Astrologers') this.sub = 'Your have low balance, please add money to your account to talk to our Astrologers.';
  }
  admon(n) {
    this.tsel.m500 = 'tunsel';
	this.tsel.m1000 = 'tunsel';
	this.tsel.m1500 = 'tunsel';
	switch(n) 
	{
		case 500:
			this.tsel.m500 = 'tsel';
			break;
		case 1000:
			this.tsel.m1000 = 'tsel';
			break;
		case 1500:
			this.tsel.m1500 = 'tsel';
			break;
		default:
			break;
	}
	this.amt = n;
  }
  addmoney(evt) {
	evt.stopPropagation();
	this.razpay(this.amt);
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
      description: '126 Astrology - Add Money',
      image: 'https://i.imgur.com/YBQF1iV.png',
      currency: ccy, //'INR',
      key: 'rzp_live_B8Zi7S5GIm9G94',
      amount: paise,
      name: '126 Astrology',
      prefill: {
        email: this.shareService.getEMAIL(),
        contact: '',
        name: this.shareService.getNAME()
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
}
