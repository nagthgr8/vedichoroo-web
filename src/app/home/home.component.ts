import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { astroStatus, CallService } from '../call.service';
import { HoroscopeService } from '../horoscope.service';
import { ShareService } from '../share.service';
import { Astrologer } from '../astrologer';
import { Location } from '../location';
import { User } from '../user';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    
  //dobMdl: any;
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
  bal: number;
  constructor(private router: Router,  private modalService: NgbModal, private horoService: HoroscopeService, private shareService: ShareService) {
  }
  ngOnDestroy() {
  }
  ngOnInit(): void {
  // astroStatus.subscribe((ast) => {
  //   console.log('astroStatus', ast);
  //   console.log('oAst', this.shareService.getASTS());
	// let a = this.shareService.getASTS().find((o) => o.eml === ast.aid);
  // console.log('a', a);
	// a.smsg = (ast.busy) ? 'Not Available': 'Available';
	// a.status = !ast.busy;
  // });
 this.horoService.getDailyHoro('Aries')
		.subscribe(res => {
			//this.showLD = false;
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
      this.showLD = false;
  		this.asts = [];
    //get panel astrologers
  }
	astro(ast) {

	}
	async callreq(evt, ast) {
	  console.log('ast', ast);
	  evt.stopPropagation();
	  //check balance, if is insufficient invoke the recharge dialog 
	  let user: User = await this.shareService.getItem('user') as User;
	  if(!user) { this.shareService.setGEVT('login'); return; }
	  else if(user.dob == ''){
	      this.shareService.setGEVT('dob');
	  } else {
	    console.log('user', user);
		this.horoService.getBalance(user.email).subscribe((res) => {	
      //this.callService.callAstro(ast.eml, ast.name, ast.avatar, user.email, user.dob, (user.isprivate) ? 'https://i.imgur.com/LR7e1vw.png' : user.imageUrl).then(() => {
							   
      //});
      return;
		  if(res['balance'] > 0) {
		  // Parse the astrologer's fee from the string format
		   this.shareService.getItem('vho:loc').then((loc: Location) => {
			this.getMinBal(ast.cfee, ast.ccy, loc.country_code).then(minBal => {
				//const estimatedCallCost = astrologerFeePerMinute*5; //minimum 5 minutes of balance is required;
				if (user.balance >= minBal) {
			      //this.callService.callAstro(ast.eml, ast.name, ast.avatar, user.email, user.dob, (user.isprivate) ? 'https://i.imgur.com/LR7e1vw.png' : user.imageUrl).then(() => {
							   
							//});
				} else {
							//display recharge dialog
					this.shareService.setGEVT('recharge');
				}
			});
		   });
		} else {
			if(res['balance'] == 0) {
				this.shareService.setGEVT('recharge');
			} else {
				alert('Our server did not respond, please try afer sometime.');
			}
	    }
	}, (err) => {
		      console.log(JSON.stringify(err));
	}); 
	
     }
	  
	}
	async getMinBal(fee: string, ccy: string, ccode: string): Promise<number> {
	  const res = await this.horoService.getCurrencyExchangeRate(ccode, ccy);

	  const [price,per,unit] = fee.split(' ');

	  let rate: number;
	  if (per === 'per' && (unit === 'min' || unit === 'minute')) {
		rate = Number(price) * res['ConversionRate'] * 5;
	  } else if (per === 'per' && unit === 'hour') {
		rate = Number(price) * res['ConversionRate'];
	  } else {
		rate = parseFloat(price);
	  }
	  return rate;
	}
	
  getConnAstros() {
	this.horoService.getConnectedAstros().subscribe((casts: any[]) => {
        console.log('casts', casts);
		console.log('oAst', this.shareService.getASTS());
		this.shareService.getASTS().forEach(item1 => {
		  //console.log('ast', item1.eml);
		  const cast = casts.find(item2 => item2.aid === item1.eml);
		  
		  if (cast) {
		    console.log('astrologer found', cast);
			item1.smsg = (cast.busy) ? 'Busy' : 'Available';
			item1.status = !cast.busy;
		  }
		});
	  },(error) => {
		console.log(error);
	  });
  }
  getAstros() {
    return this.shareService.getASTS();
  }
  updateAstros(oa: Astrologer[], casts: any[]) {
    oa.forEach(ast => {
      if (casts.length > 0) {
        let cast = casts.find(item => item.aid === ast.eml);
        if (cast) {
          console.log('astrologer found', cast);
          ast.smsg = (cast.busy) ? 'Busy' : 'Available';
          ast.status = !cast.busy;
        }
      }
    });
  }
}
