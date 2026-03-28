import { Component, Directive, ViewChild, ContentChild, TemplateRef, ElementRef, OnInit} from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, onAuthStateChanged, signInWithCredential, GoogleAuthProvider, signOut  } from "firebase/auth"
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/internal/Subject';
import { environment } from '../environments/environment';
import { HoroscopeService } from './horoscope.service';
import { ShareService } from './share.service';
import { DobComponent } from './dob/dob.component';
import { RechargeComponent } from './recharge/recharge.component';
import { Plan } from './plan';
//import { CallService } from './call.service';
import { User } from './user';
import { Astrologer } from './astrologer';
import { Caller } from './caller';
import { Location } from './location';

declare const FB: any;
declare const gapi: any;
declare var Razorpay: any;
const app = initializeApp(environment);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const timer = ms => new Promise(res => setTimeout(res, ms));
@Component({
  selector: 'my-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']

})
export class AppComponent implements OnInit {
	@ViewChild('loginMdl') loginMdl: TemplateRef<any>;
	@ViewChild('orderMdl', {static: true }) orderMdl: TemplateRef<any>;
	@ViewChild('actvMdl') actvMdl: TemplateRef<any>;
    @ViewChild('vhoring', {static: true}) vhoRing;
    @ViewChild('recMdl') recMdl: TemplateRef<any>;
	@ViewChild('dobMdl') dobMdl: TemplateRef<any>;
	showAstroCallPage = false;
	showHomePage = true;
	isFullPage = false;   // true for routes that render without nav/footer
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
	constructor(private router: Router,  private route: ActivatedRoute, public modalService: NgbModal, private horoService: HoroscopeService, private shareService: ShareService) {
		this.user  = {
			email: '',
			pwd: ''
		};
	// Listen for changes in the authentication state
    onAuthStateChanged(auth, (user) => {
		if(user) {
			console.log('onAuthSatateChanged', user);
				let usr: User = {
					name: user.displayName,
					email: user.email,
					imageUrl: user.photoURL,
					balance: 0,
					ccy:'INR',
					peerid: '',
					dob: '',
					isprivate: true,
					issubscr: false,
				};
				this.shareService.getItem('user').then((cusr: User) => {
					console.log('getItem: User', cusr);
					usr.dob = cusr.dob;
					this.shareService.setItem('user', JSON.stringify(usr));
					this.shareService.emitSignIn(usr);
				}, (err) => { 
					console.log('getItem: User', err);
					this.shareService.setItem('user', JSON.stringify(usr));	
					this.shareService.emitSignIn(usr);
				});
			this.horoService.getBalance(user.email).subscribe((bal) => {
				usr.balance = bal['balance'];
				usr.ccy = (bal['currency_code'].length > 3) ? '' : bal['currency_code'];
				this.shareService.getItem('user').then((cusr: User) => {
					console.log('getItem: User', cusr);
					usr.dob = cusr.dob;
					this.shareService.setItem('user', JSON.stringify(usr));
					this.shareService.emitSignIn(usr);
				}, (err) => { 
					console.log('getItem: User', err);
					this.shareService.setItem('user', JSON.stringify(usr));	
					this.shareService.emitSignIn(usr);
				});
			})
		}
	  });
   
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
	this.horoService.getAllAstrologers().subscribe((oa: any[]) => {
		console.log('oa', oa);
		//this.showLD = false;
		//console.log('showLD', this.showLD);
		// build Astrologer array
		let a: number = 0;
		for (var i = 0; i < oa.length; i++) {
		  console.log(i, oa[i]);
		  let call: string = oa[i].mob;
		  let chat: string = oa[i].mob;
		  if (oa[i].mob.indexOf('|') > -1) {
			call = oa[i].mob.split('|')[0];
			chat = oa[i].mob.split('|')[1];
		  }
		  let smsg = 'Not Available';
		  let status = false;
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
			status: status,
			peerid: '',
			cfee: oa[i].cfee,
			ccy: 'INR',
			rating: oa[i].rating,
			tot_ratings: oa[i].tot_ratings,
			str1: 'fa fa-star-o',
			str2: 'fa fa-star-o',
			str3: 'fa fa-star-o',
			str4: 'fa fa-star-o',
			str5: 'fa fa-star-o',
			lng: oa[i].lng,
			eml: oa[i].eml
		  };
  
		  if (oa[i].rating >= 1 && oa[i].rating < 2) {
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
		  else if (oa[i].rating >= 3 && oa[i].rating < 4) {
			ast.str1 = 'fa-solid fa-star';
			ast.str2 = 'fa-solid fa-star';
			ast.str3 = 'fa-solid fa-star';
			ast.str4 = (oa[i].rating > 3) ? 'fa fa-star-half-o' : 'fa fa-star-o';
			ast.str5 = 'fa fa-star-o';
		  }
		  else if (oa[i].rating >= 4 && oa[i].rating < 5) {
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
		  this.shareService.addAST(ast);
		}
		// get connected astrologers
		this.horoService.getConnectedAstros().subscribe((casts: any[]) => {
		  console.log('casts', casts);
		
		  // Extract 'aid' property from each item after parsing JSON
		  const aids = casts.map(item => {
			const email: string = Object.keys(item)[0] as string;
			const astroData: any = JSON.parse(Object.values(item)[0] as string);
			return astroData?.aid;
		  }).filter(Boolean);
		
		  // Update status values
		  this.shareService.getASTS().forEach(item1 => {
			const index = aids.indexOf(item1.eml);
			if (index !== -1) {
			  console.log('astrologer found', casts[index]);
			  const astroData = JSON.parse(Object.values(casts[index])[0] as string);
			  item1.smsg = astroData.busy ? 'Busy' : 'Available';
			  item1.status = !astroData.busy;
			}
		  });
		}, (error) => {
		  console.log(error);
		});
	  }, (error) => {
		console.log(error);
	  });
  

	this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
          this.showHomePage = false;
      } else if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          this.showHomePage = true;
        }
        this.isFullPage = event.urlAfterRedirects.startsWith('/model-validation');
      }
    });	
 	// this.callService.callStarted.subscribe((cinf) => {
	//   console.log('AppComponent: callStarted');
	// 	  let callerInfo: Caller  = {
	// 	    uuid: '',
	// 		uid: cinf.cid,
	// 		dob: cinf.dob,
	// 	    aid: cinf.aid,
	// 	    caller_name: '',
	// 	    name: '',
	// 		avatar: cinf.pic,
	// 	    iscaller: cinf.is_caller,
	// 	    duration: 0,
	// 	    starttime: '',
	// 	    endtime: '',
    //        };
	// 	  console.log('emitting callerInfo', callerInfo);
    //       this.shareService.emitCallerInfo(callerInfo);		   
	// 	  console.log('showAstroCall');
	// 	  this.showHomePage = false;
	// 	  this.showAstroCall = true;
	// });
    // this.callService.callEnded.subscribe(() => {
    //   this.showAstroCall = false;
	//   this.showHomePage = true;
    // });  
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
   // this.callService.stopTracks();
  }
  loginGPLUS() {
	console.log('loginGPLUS');
	signInWithPopup(auth, provider)
	.then((result) => {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  const credential = GoogleAuthProvider.credentialFromResult(result);
	  const token = credential.accessToken;
  	  
	  result.user.getIdTokenResult().then((idTokenResult) => {
  		const expirationTime = idTokenResult.expirationTime; // ISO string
  		localStorage.setItem('tokenExpiry', expirationTime);
     });
	 result.user.getIdToken().then((idToken) => {
		console.log('idToken', idToken);
		this.horoService.setOAuthToken(token);
	});
	  // The signed-in user info.
	  const user = result.user;
	  console.log('user', user);
	  // IdP data available using getAdditionalUserInfo(result)
	  // ...
	}).catch((error) => {
	  // Handle Errors here.
	  const errorCode = error.code;
	  const errorMessage = error.message;
	  // The email of the user's account used.
	  const email = error.customData.email;
	  // The AuthCredential type that was used.
	  const credential = GoogleAuthProvider.credentialFromError(error);
	  // ...
	});
  }

  vstory(s) {
    this.router.navigate(['/Article/' + s.title.replaceAll(' ', '-')], { state: s });
    window.scrollTo(0, 0);
	}

   async gevts(evt) {
    console.log('gevts', evt);
	let sevt = evt.toString();
	if(sevt == 'login-gpls'){
		console.log('calling loginGPLUS');
	    this.loginGPLUS();
	} else if (sevt == 'login') {
	  const mRef = this.modalService.open(this.loginMdl);
    } else if(sevt == 'dob') {
	  console.log('dobMdl', this.dobMdl);
	  const user = await this.shareService.getItem('user') as User;
	  const mRef = this.modalService.open(this.dobMdl);
	  this.userSubject.next(user);
	  //mRef.componentInstance.user = user;
	} else if (sevt == 'subscribe') {
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
    else if (sevt == 'logout') {
		signOut(auth).then(() => {
			// Sign-out successful.
			console.log('signout successful');
			this.shareService.getItem("user").then((usr: User) => {
	//			this.callService.disconnect(usr.email);
				localStorage.removeItem('user');
			});
		  }).catch((error) => {
			// An error happened.
		  });
     } else if(sevt == 'recharge') {
		this.modalService.open(this.recMdl).result.then((result) => {
			}, (reason) => {
			});
	 }
	}
 
	 loginFB(): void {

	 }

  dismissAll() {
	this.modalService.dismissAll();
  }
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
