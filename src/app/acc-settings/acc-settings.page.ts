import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HoroscopeService } from '../horoscope.service';

@Component({
  selector: 'app-acc-settings',
  templateUrl: './acc-settings.page.html',
  styleUrls: ['./acc-settings.page.scss'],
})
export class AccSettingsPage implements OnInit {
  nam: string = '';
  bnam: string = '';
  ifs: string = '';
  info: string = '';
  anum: string = '';
  ranum: string = '';
  amsg: string = 'We will need your bank details to process your payments in the future. Please write to info@vedichoroo.com for more details.';
  constructor(private horoService: HoroscopeService, private router: Router) { }

  ngOnInit() {
	let acc = this.router.getCurrentNavigation().extras.state;
	if(acc.uuid != '') {
		this.horoService.getAcc(acc.uuid).subscribe(res => {
			if(res['full_name'] != 'Not Found') {
				this.nam = res['full_name'];
				this.bnam = res['bank_name'];
				this.ifs = res['ifsc_code'];
				this.anum = res['acc_no'];
				this.ranum = res['acc_no'];
			}
		});
	}
  }
  save(evt) {
    evt.stopPropagation();
	this.info = 'Saving your information...';
	if(this.anum == '') {this.info = 'Please Enter Your Bank Accunt Number'; return; }
	else if(this.ranum == '') {this.info = 'Please Re-enter Your Bank Account Number'; return; }
	else if(this.anum != this.ranum) {this.info = 'Account Number did not match with the Re-entered Number.'; return;}
	else if(this.ifs == '') {this.info = 'Please enter your Bank IFSC Code'; return;}
	else if(this.bnam == 'Not Found') {this.info = 'Could not locate your bank with IFSC code.'; return;}
	else if(this.bnam == '') {
	   this.horoService.getBankName(this.ifs).subscribe(res => {
		  if(res['bank'] != 'Not Found') {
			this.bnam = res['bank'] + ',' + res['branch'];
			   this.horoService.updateAcc(this.device.uuid, this.nam, this.anum, this.bnam, this.ifs).subscribe(acc => {
				this.info = '';
				this.router.navigate(['/tabs'], {replaceUrl : true});
			  }, (err) => {
			  });
			} else {
			  this.bnam = 'Not Found';
			  this.info = 'Could not locate your bank with IFSC code.'; 
			  return;
			}
		}, (err) => {
		  this.info = JSON.stringify(err);
		});
	}
	else {
		this.horoService.updateAcc(this.device.uuid, this.nam, this.anum, this.bnam, this.ifs).subscribe(acc => {
			this.info = '';
			this.router.navigate(['/tabs'], {replaceUrl : true});
		}, (err) => {
		});
	}
  }
  fsearch() {
   this.bnam = 'Searching..';
   this.horoService.getBankName(this.ifs).subscribe(res => {
      if(res['bank'] != 'Not Found') this.bnam = res['bank'] + ',' + res['branch'];
	  else this.bnam = 'Not Found';
 	}, (err) => {
	  this.info = JSON.stringify(err);
	  this.bnam = this.info;
	});
  }
	msgok() {
		this.amsg = '';
	}
}
