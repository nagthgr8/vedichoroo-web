import { Component, Directive, ViewChild, ContentChild, TemplateRef, ElementRef, OnInit} from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/internal/Subject';
import { environment } from '../environments/environment';
import { HoroscopeService } from './horoscope.service';
import { ShareService } from './share.service';
import { DobComponent } from './dob/dob.component';
import { RechargeComponent } from './recharge/recharge.component';
import { Plan } from './plan';
import { CallService } from './call.service';
import { User } from './user';
import { Astrologer } from './astrologer';
import { Caller } from './caller';
import { Location } from './location';
declare const FB: any;
declare const gapi: any;
declare var Razorpay: any;
const timer = ms => new Promise(res => setTimeout(res, ms));
@Component({
  selector: 'my-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']

})
export class AppComponent implements OnInit {
	auth2: any;
	@ViewChild('loginMdl') loginMdl: TemplateRef<any>;
	@ViewChild('orderMdl', {static: true }) orderMdl: TemplateRef<any>;
	@ViewChild('actvMdl') actvMdl: TemplateRef<any>;
    @ViewChild('vhoring', {static: true}) vhoRing;
    @ViewChild('recMdl') recMdl: TemplateRef<any>;
	@ViewChild('dobMdl') dobMdl: TemplateRef<any>;
    showAstroCallPage = false;
	showHomePage = true;
	callEnded: any;
	callEndedEvent: any;
	oauth2Loaded: boolean = false;	
	userSubject: Subject<User> = new Subject<User>();
    ordermsg: string = 'Please wailt while your order is processing..';
    title = 'app';
	mtitle: string = 'Login As,';
	showLogin = false;
	showReg = false;
	showAstroCall = false;
	showSO = true;
	msg1: string = '';
	msg2: string = '';
	msg3: string = '';
	plan: Plan;
	articles: any;
	stories: any;
    ringing: boolean = false;
    vring: any;
    rngdely: number = 1000;
    name: string = '';
    bal: number = 0;
    upro: any = {};
	user: any;
	
	loading: boolean = false;
	constructor(private router: Router,  private callService: CallService, public modalService: NgbModal, private horoService: HoroscopeService, private shareService: ShareService) {
		this.user  = {
			email: '',
			pwd: ''
		};
   
		// this.vring = new Audio('assets/sounds/ring.mp3');
			// this.vring.addEventListener('ended', (evt) => {
			// console.log('vring: call ended', this.ringing);
			// this.ring();
		// }, false);
	}
  // async ring() {
 	// if(this.ringing) {
		// await timer(this.rngdely);
		// this.rngdely = (this.rngdely == 1000 ) ? 2000 : 1000;
		// console.log('vring: playing');
		// this.vring.currentTime = 0;
		// this.vring.play();
	// }
 // }	
  ngOnInit() {
	this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
          this.showHomePage = false;
      } else if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          this.showHomePage = true;
        }
      }
    });	
	this.googleAuthSDK();
	this.callService.callStarted.subscribe((cinf) => {
	  console.log('AppComponent: callStarted');
		  let callerInfo: Caller  = {
		    uuid: '',
			uid: cinf.cid,
		    aid: cinf.aid,
		    caller_name: '',
		    name: '',
			avatar: cinf.pic,
		    iscaller: cinf.is_caller,
		    duration: 0,
		    starttime: '',
		    endtime: '',
           };
		  console.log('emitting callerInfo', callerInfo);
          this.shareService.emitCallerInfo(callerInfo);		   
		  console.log('showAstroCall');
		  this.showHomePage = false;
		  this.showAstroCall = true;
	});
    this.callService.callEnded.subscribe(() => {
	  this.showHomePage = false;
      this.showAstroCall = false;
    });  
	this.shareService.plan
			.subscribe(res => {
				if (res['name'] != '') {
					let pln: Plan = { uuid: res['uuid'], name: res['name'], credits: res['credits'], dobs: res['dobs'] };
					this.plan = pln;
					console.log('Plan', pln);
					if (res['name'].indexOf('#') != -1)
						//this.shareService.setVEVT('activate');
					if (this.plan.name == 'com.mypubz.eportal.astrologer' || this.plan.name == 'com.mypubz.eportal.adfree' || this.plan.name == 'com.mypubz.eportal.year' || this.plan.name == 'com.mypubz.eportal.month') {
						//this.shareService.setVEVT('subscriber');
					}
				}
			});
		this.shareService.signin
			.subscribe(usr => {
			    if(usr) {
					console.log('app.component signin', usr);
					this.horoService.isAstro(usr.email).subscribe((ast) => {
 					 console.log('isAstro', ast);
					 this.callService.initPeer(usr.email, ast).then((peer) => {
						console.log('initPeer', peer);
						if(peer.id != '-1') {
							usr.peerid = peer.id;
							this.shareService.setItem('user', JSON.stringify(usr));
							if(ast) this.callService.listenToCalls(usr.email, usr.peerid);
						}
					 });
					});
				}
			});
		this.shareService.gevt
			.subscribe(res => {
			console.log('gevt app', res);
				this.gevts(res);   
			});
				
	let cc = window as any;
       cc.cookieconsent.initialise({
         palette: {
           popup: {
             background: "#164969"
           },
           button: {
             background: "#ffe000",
             text: "#164969"
           }
         },
         theme: "classic",
         content: {
           message: 'This website uses cookies to ensure you get the best experience of our website.',
           dismiss: 'Got It!',
           link: 'Learn more',
           href: "/privacy-policy" 
         }				
    });
	console.log('dobMdl-ngOnInit', this.dobMdl);
  }
  onCallEnded(cEnd: any) {
	this.showAstroCall = false;
  }
  ngAfterViewInit() {
 	//console.log('dobMdl-ngAfterViewInit', this.dobMdl);
	//this.showHomePage = true;
  }
  ngOnDestroy() {
    this.callService.stopTracks();
  }
   	loginGPLUS() {
	  if(this.oauth2Loaded) {
		this.auth2.signIn().then((googleAuthUser:any) => {
			this.modalService.dismissAll();
			localStorage.setItem('id_token', googleAuthUser.getAuthResponse().id_token);
			localStorage.setItem('access_token', googleAuthUser.getAuthResponse().access_token);			
			let profile = googleAuthUser.getBasicProfile();
			console.log('Token || ' + googleAuthUser.getAuthResponse().id_token);
			console.log('ID: ' + profile.getId());
			console.log('Name: ' + profile.getName());
			console.log('Image URL: ' + profile.getImageUrl());
			console.log('Email: ' + profile.getEmail());
			/* Write Your Code Here */
			this.horoService.getBalance(profile.getEmail()).subscribe((res) => {
				let user: User = {
					name: profile.getName(),
					email: profile.getEmail(),
					imageUrl: null,
					balance: res['balance'],
					ccy: (res['currency_code'].length > 3) ? '' : res['currency_code'],
					peerid: '',
					dob: '',
					isprivate: true
				};
				this.horoService.getgapiProfilePic(googleAuthUser.getAuthResponse().access_token).subscribe((resp) => {
				    console.log('getgapiProfilePic', resp);
					user.imageUrl = resp['photos'][0].url;
					user.isprivate =  resp['photos'][0]['metadata'] && resp['photos'][0]['metadata']['source'] && resp['photos'][0]['metadata']['source']['type'] === 'PROFILE';7
					if(user.isprivate) user.imageUrl = null;
					this.shareService.setItem('user', JSON.stringify(user));
					this.shareService.emitSignIn(user);
				}, (err) => {
					console.log('getgapiProfilePic', err);
					this.shareService.setItem('user', JSON.stringify(user));
					this.shareService.emitSignIn(user);
				});
				
			}, (err) => {
				let user: User = {
					name: profile.getName(),
					email: profile.getEmail(),
					imageUrl: null,
					balance: -1,
					ccy: JSON.stringify(err),
					peerid: '',
					dob: '',
					isprivate: true
				};
				this.shareService.setItem('user', JSON.stringify(user));
				this.shareService.emitSignIn(user);
			});
			
		}).catch((error:any) => {
			//alert(JSON.stringify(error, undefined, 2));
			console.log('Error:', error);
			if (error && error.error && error.error.error_description) {
				alert(error.error.error_description);
			} else {
				alert('Error signing in with Google. Please try again later.');
			}		
	  });	  
	  } else {
		alert('Please wait for OAuth2 library to load.');
	  }
	}

  async googleAuthSDK() {
    (<any>window)['googleSDKLoaded'] = () => {
      (<any>window)['gapi'].load('auth2', () => {
		const idToken = localStorage.getItem('id_token');
		const accessToken = localStorage.getItem('access_token');
		console.log('id_token', idToken);	
		console.log('accessToken', accessToken);
		
		if(idToken && accessToken) {
			(<any>window)['gapi'].auth2.init({
			  client_id: '242286730499-tr8dq77hb8k2e0s55cvhh3m57cjabf1i.apps.googleusercontent.com',
			  scope: 'email profile openid',
			  id_token: idToken, // Stored ID token
			  access_token: accessToken // Stored access token
			}).then((auth2) => {
			    const expiresIn = auth2.currentUser.get().getAuthResponse().expires_in;
				const expiresAt = new Date().getTime() + expiresIn * 1000;
  const expirationDate = new Date(expiresAt);
console.log('expiresIn', expiresIn);
console.log('expiresAt', expirationDate.toString());
				// Check if the access token has expired
				if (expiresAt < new Date().getTime()) {
				  console.log('Access token has expired');
				  localStorage.removeItem('id_token');
				  localStorage.removeItem('access_token');
				  return this.loginGPLUS();
				} else {
				  console.log('Access token is still valid');
				}
			  this.auth2 = auth2;
				let profile = auth2.currentUser.get().getBasicProfile();
				console.log('profile', profile);
				console.log('Name: ' + profile.getName());
				console.log('Image URL: ' + profile.getImageUrl());
				console.log('Email: ' + profile.getEmail());
				/* Write Your Code Here */
				this.shareService.getItem('user').then((usr: User) => {
				   console.log('user', usr);
				   if(usr) {
				    if(!usr.hasOwnProperty('balance') || usr.ccy == '' || usr.ccy.length > 3) {
				     this.horoService.getBalance(profile.getEmail()).subscribe((res) => {
						usr.balance = res['balance'];
						usr.ccy = (res['currency_code'] > 3) ? '': res['currency_code'];
						this.shareService.setItem('user', JSON.stringify(usr));
						this.shareService.emitSignIn(usr);
					 });
				   } 
					else this.shareService.emitSignIn(usr);
				  }
				}, (error) => {
				  
				  console.error(error);
				});
	
			}).catch((error) => {
			  console.error('Failed to initialize auth2:', error);
			});		
		} else {
		    localStorage.removeItem('user');
			this.auth2 = (<any>window)['gapi'].auth2.init({
			client_id: '242286730499-tr8dq77hb8k2e0s55cvhh3m57cjabf1i.apps.googleusercontent.com',
			cookiepolicy: 'single_host_origin',
			scope: 'profile email'
			});
        //this.callgLogin();
			console.log('goolge oauth2 loaded');
			this.oauth2Loaded = true;
		}
      });
    }
     
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement('script'); 
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs?.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
   }

  vstory(s) {
    this.router.navigate(['/Article/' + s.title.replaceAll(' ', '-')], { state: s });
    window.scrollTo(0, 0);
	}

   async gevts(evt) {
    console.log('gevts', evt);
	if(evt == 'login-gpls'){
	    this.loginGPLUS();
	} else if (evt == 'login') {
	  const mRef = this.modalService.open(this.loginMdl);
      
    } else if(evt == 'dob') {
	  console.log('dobMdl', this.dobMdl);
	  const user = await this.shareService.getItem('user') as User;
	  const mRef = this.modalService.open(this.dobMdl);
	  this.userSubject.next(user);
	  //mRef.componentInstance.user = user;
	} else if (evt == 'subscribe') {
      this.mtitle = 'Subscribe As,';
      this.showLogin = false;
      this.showSO = false;
      this.showReg = true;
      this.modalService.open(this.loginMdl).result.then((result) => {
        //this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        //	this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
 
    } 
    else if (evt == 'logout') {
      this.signOut();
     } else if(evt == 'recharge') {
		this.modalService.open(this.recMdl).result.then((result) => {
			}, (reason) => {
			});
	 }
	}
 
	 loginFB(): void {

	 }

  signOut(): void {
    this.shareService.getItem('user').then((usr: User) => {
      this.callService.disconnect(usr.email);
      if (this.auth2 && this.auth2.isSignedIn.get()) {
        this.auth2.signOut().then(() => {
          console.log('User signed out.');
          localStorage.removeItem('id_token');
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          //this.shareService.setGEVT('log');
          this.router.navigate(['/']);
        });
      }
    });
	 }
  // addmoney(evt,amt) {
	// evt.stopPropagation();
	// this.razpay(amt);
	// this.modalService.dismissAll();
  // }
  onLoginMdlLoaded(loginMdl: TemplateRef<any>) {
    console.log('this.loginMdl-OnLoginMdlLoaded', loginMdl);
    this.loginMdl = loginMdl;
  }	 
  onDobMdlLoaded(dobMdl: TemplateRef<any>) {
    console.log('this.dobMdl-OnDobMdlLoaded', this.dobMdl);
	console.log('dobMdl-OnDobMdlLoaded-Arg', dobMdl);
    this.dobMdl = dobMdl;
	console.log('this.dobMdl-OnDobMdlLoaded - After', this.dobMdl);
  }	 
    onRecMdlLoaded(recMdl: TemplateRef<any>) {
	console.log('recMdl-OnRecMdlLoaded-Arg', recMdl);
    this.recMdl = recMdl;
	console.log('this.recMdl-OnRecMdlLoaded - After', this.recMdl);
   }	
    handlePaymentSubmitted(payment) {
	   console.log('payment submitted', payment);
	   this.horoService.createOrder(payment.amt, payment.ccy).subscribe(res => {
	      if(res['gatewayOrderId'] == '-1') alert('Internal error, please try after some time.'); 
		  this.modalService.dismissAll();
	      this.razpay(payment.amt, payment.ccy, res['gatewayOrderId']);
	   }, (err) => {
	      console.log(JSON.stringify(err));
		  alert('Inernal Server Error. Please try after some time.');
	   });
	   
	}
	log() {
		this.showReg = false;
		this.showLogin = true;
	}
	reg() {
		this.showLogin = false;
		this.showReg = true;
	}
	logusr(evt) {
		evt.stopPropagation();

	}
	regusr(evt) {
		evt.stopPropagation();
		if (!this.validateNam((<HTMLInputElement>document.getElementById('rnam')).value)) {
			this.msg2 = "Please enter your valid name";
			return;
		}
		if (!this.validateEml((<HTMLInputElement>document.getElementById('reml')).value)) {
			this.msg2 = "Please enter your valid email address";
			return;
		}
		if ((<HTMLInputElement>document.getElementById('rmob')).value.length == 0) {
			this.msg2 = "Please enter your mobile number";
			return;
		}
		if (!this.validateMob((<HTMLInputElement>document.getElementById('rmob')).value)) {
			this.msg2 = "Please enter valid mobile number";
			return;
		}
		//this.razpay((<HTMLInputElement>document.getElementById('rnam')).value, (<HTMLInputElement>document.getElementById('reml')).value, //(<HTMLInputElement>document.getElementById('rmob')).value);
	}
	validateEml(inp) {
		console.log('validate eml', inp);
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!re.test(String(inp).toLowerCase())) return false;
		return true;
	}
	validatePwd(inp) {
		const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
		if (!re.test(String(inp).toLowerCase())) return false;
		return true;
	}
	validateNam(inp) {
		const re = /^[a-zA-Z ]{2,30}$/;
		if (!re.test(String(inp).toLowerCase())) return false;
		return true;
	}
	validateMob(inp) {
		const re = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
		if (!re.test(String(inp).toLowerCase())) return false;
		return true;
	}
	actvusr(evt) {
		evt.stopPropagation();
		let aid: string = (<HTMLInputElement>document.getElementById('actc')).value;
		if (this.validatePwd(aid)) {
			const usr = JSON.parse(localStorage.getItem('user')!);
			if (usr) {
				this.horoService.getSubscriber(aid, usr.email)
					.subscribe(res => {
						if (res['uuid'] == "-1")
							this.msg3 = "Invalid Activation Code";
						else {
							if (usr) {
								if (usr.email != res['eml'])
									this.msg3 = "Activation failed!";
								else {
									this.msg3 = "Activation is successful";
									this.plan.name = this.plan.name.split('#')[0];
									this.shareService.setPLAN(this.plan);
									this.modalService.dismissAll();
								}
							}
						}
					});
			}
		}
	}
	razpay(amt, ccy, orderid) {
	  console.log('razpay-amt', amt);
	  console.log('razpay-ccy', ccy);
	  console.log('razpay-orderid', orderid);
	  this.shareService.getItem('user').then((usr: User)=> {
	  this.horoService.getJson('assets/data/currency_data.json')
					 .subscribe(cur => {
		let subunits = Math.pow(10, cur[ccy]);
		amt = amt * subunits;
		console.log('amt', amt);
		var options = {
			description: 'VEDICHOROO ASTRO SERVICE',
			image: 'https://i.imgur.com/YBQF1iV.png',
			currency: ccy,
			key: 'rzp_live_H9aUztvl3jiG01',
			order_id: orderid,
			amount: amt,
			name: 'VEDICHOROO',
			prefill: {
				email: usr.email,
				contact: '',
				name: usr.name
			},
			theme: {
				color: '#ff9900'
			},
			modal: {
			    escape: false,
				ondismiss: function () {
					alert('dismissed')
				}
			},
			"handler": (response:any) => {
			    console.log('razpay response', response);
				this.modalService.open(this.orderMdl).result.then((result) => {
					
				  }, (reason) => {
				  });
				this.horoService.getOrderStatus(orderid).subscribe((res) => {
					    console.log('order status', res);
						if(res['status'] == 'paid') {
						   this.shareService.setGEVT('get-bal');
						   this.modalService.dismissAll();
						} else {
							this.ordermsg = 'Our server did not respond in time. Order may be still in progress. Please check after some time.';
						}
					}, (err) => {
					    this.ordermsg = 'There is some internal error fetching the order status. Please try after some time.';
						console.log(JSON.stringify(err));
					});				  
			}
		};
		
		var successCallback = (payment_id) => {
		   alert('payment is successful ' + payment_id.toString());
		};
		var cancelCallback = (error) => {
				alert(error.description + ' (Error ' + error.code + ')');
		};
			Razorpay.open(options, successCallback, cancelCallback);
		});
	  });
	}
}
