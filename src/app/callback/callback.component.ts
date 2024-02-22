// callback.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HoroscopeService } from '../horoscope.service';
import { ShareService } from '../share.service';
import { AuthService } from '../auth.service'; // Your authentication service
import { User } from '../user';

@Component({
  selector: 'app-callback',
  template: '', // No HTML template for this example
})
export class CallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private authService: AuthService, private horoService: HoroscopeService, private shareService: ShareService) {}

  ngOnInit() {
    this.authService.tryLogin().then((usr: User) => {
      if(usr != null) {
        //get user account balance
        this.horoService.getBalance(usr.email).subscribe((res) => { 
          usr.balance = res['balance'];
          usr.ccy = (res['currency_code'].length > 3) ? '' : res['currency_code'];
           this.shareService.setItem('user', JSON.stringify(usr));
           this.shareService.emitSignIn(usr);
        });
      }
    });
  }
}
