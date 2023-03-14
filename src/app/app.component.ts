<<<<<<< HEAD
import { Component, Directive, ViewChild, ContentChild, TemplateRef, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
=======
import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider} from "angularx-social-login";
//import { PubNubAngular } from 'pubnub-angular2';
>>>>>>> 03d5b8ae052c72bbedc83ed99f878b310b5156af
import { HoroscopeService } from './horoscope.service';
import { ShareService } from './share.service';
import { Plan } from './plan';
import { CallService } from './call.service';
<<<<<<< HEAD
declare const FB: any;
declare const gapi: any;
declare var Razorpay: any;
const timer = ms => new Promise(res => setTimeout(res, ms));
=======
//import { Astrologer } from './astrologer';
declare const FB: any;
declare const gapi: any;
declare var Razorpay: any;

>>>>>>> 03d5b8ae052c72bbedc83ed99f878b310b5156af
@Component({
  selector: 'my-app',
	templateUrl: './app.component.html'

})
export class AppComponent implements OnInit {
	auth2: any;
	@ViewChild('loginMdl', {static: true }) loginMdl: TemplateRef<any>;
	@ViewChild('actvMdl') actvMdl: TemplateRef<any>;
    @ViewChild('vhoring', {static: true}) vhoRing;
    oauth2Loaded: boolean = false;	
  title = 'app';
	mtitle: string = 'Login As,';
	showLogin = false;
	showReg = false;
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
	loading: boolean = false;
	constructor(private router: Router,  private callService: CallService, private modalService: NgbModal, private horoService: HoroscopeService, private shareService: ShareService) {
		let peerId = this.callService.initPeer();
		//this.callService.addLog('PeerId: ' + this.peerId);
		this.shareService.setPeerId(peerId);
		console.log('peerId', peerId);
		this.vring = new Audio('assets/sounds/ring.mp3');
			this.vring.addEventListener('ended', (evt) => {
			console.log('vring: call ended', this.ringing);
			this.ring();
		}, false);
	}
  async ring() {
 	if(this.ringing) {
		await timer(this.rngdely);
		this.rngdely = (this.rngdely == 1000 ) ? 2000 : 1000;
		console.log('vring: playing');
		this.vring.currentTime = 0;
		this.vring.play();
	}
 }	
  ngOnInit() {
     this.googleAuthSDK();
		
	  
  this.callService.isCallAnswered$
		.subscribe(res => {
			this.ringing = false;
		});
	this.callService.isCallStarted$
		.subscribe(res => {
			console.log('isCallStarted$', res);
			//this.callService.addLog('isCallStarted$: ' + res.toString())
			if(res && this.shareService.isAST()) {
				let cinf: any = {};
				cinf.uid = this.shareService.getUID();
				cinf.name =  '';
				cinf.avatar = 'https://i.imgur.com/LR7e1vw.png';
				cinf.iscaller = false;
				cinf.secs = 0;
				cinf.starttime = '';
				cinf.endtime = '';
				this.shareService.getItem('upro').then( upro => {
					if(upro) {
						if(upro['dob'].indexOf('#') > -1) {
							var ng = upro['dob'].split('#')[1];
							this.horoService.setAstStatus(this.shareService.getUID(), 'C')
							.subscribe(stat => {
							});
						}
					}
					this.router.navigate(['/astro-call'], {state: cinf});
				})	
				.catch(e => {
						console.log(e);
							this.horoService.setAstStatus(this.shareService.getUID(), 'C')
							.subscribe(stat => {
							});
					this.router.navigate(['/astro-call'], {state: cinf});
				}); 		
				
			}
			if(res) {
				this.ringing = true;
				this.vring.play();
			}
		});
  	this.callService.isCallClosed$
		.subscribe(res => {
			this.ringing = false;
			if(res && this.shareService.isAST()) {
				this.shareService.getItem('upro').then( upro => {
					if(upro) {
						if(upro['dob'].indexOf('#') > -1) {
							var ng = upro['dob'].split('#')[1];
							this.horoService.setAstStatus(this.shareService.getUID(), 'A')
							.subscribe(stat => {
							});
						}
					}
				})
				.catch(e => {
					console.log(e);
							this.horoService.setAstStatus(this.shareService.getUID(), 'A')
							.subscribe(stat => {
							});
				});
             }				
		});
		this.callService.isCallAnswered$
		.subscribe(res => {
			console.log('isCallAnswered$ triggered at app.component');
			this.ringing = false;
			//this.vring.loop = false;
		});
		this.callService.msgRecved$
		.subscribe(res => {
			if(this.router.url != '/astro-chat') {
				let cinf: any = {};
				let met: any = this.callService.getConnMetadata();
				let dob = met['dob'];
				cinf.name =  dob.split('#')[1].split('&')[0];
				cinf.avatar = 'https://i.imgur.com/LR7e1vw.png';
				cinf.iscaller = false;
				cinf.secs = 0;
				cinf.starttime = '';
				cinf.endtime = '';
				cinf.msg = res;
				cinf.dob = dob;
				this.router.navigate(['/astro-chat'], {state: cinf});
			}
		});
	// this.callService.enableCallAnswer();
		this.shareService.plan
			.subscribe(res => {
				if (res['name'] != '') {
					let pln: Plan = { uuid: res['uuid'], name: res['name'], credits: res['credits'], dobs: res['dobs'] };
					this.plan = pln;
					console.log('Plan', pln);
					if (res['name'].indexOf('#') != -1)
						this.shareService.setVEVT('activate');
					if (this.plan.name == 'com.mypubz.eportal.astrologer' || this.plan.name == 'com.mypubz.eportal.adfree' || this.plan.name == 'com.mypubz.eportal.year' || this.plan.name == 'com.mypubz.eportal.month') {
						this.shareService.setVEVT('subscriber');
					}
				}
			});
		this.shareService.vhevt
			.subscribe(res => {
				this.vhoevts(res);   
			});
		this.shareService.gevt
			.subscribe(res => {
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
  }
  googleAuthSDK() {
    (<any>window)['googleSDKLoaded'] = () => {
      (<any>window)['gapi'].load('auth2', () => {
        this.auth2 = (<any>window)['gapi'].auth2.init({
          client_id: '242286730499-tr8dq77hb8k2e0s55cvhh3m57cjabf1i.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        //this.callgLogin();
		console.log('goolge oauth2 loaded');
		this.oauth2Loaded = true;
		if (this.auth2.isSignedIn.get()) {
			let profile = this.auth2.currentUser.get().getBasicProfile();
			console.log('User is already signed in:', profile);
			const user = {
				name: profile.getName(),
				email: profile.getEmail(),
				imageUrl: profile.getImageUrl()
			};
			this.shareService.setVEVT(user);
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
	callreq(event, ast) {
  //this.info = 'callreq';
     event.stopPropagation();
	 this.loading = true;
     console.log(ast);
	 //this.info += 'getNAME';
	 if(!localStorage.getItem('authToken')) {
	    this.loading = false;
		this.vhoevts('login');
		return;
	 }
	 //this.info += 'getBAL';
   this.shareService.getItem('bal').then(bal => {
    if(bal < 100) {
	    this.loading = false;
		this.router.navigate(['/add-money'], {state: 'Astrologers' as any});
		return;
	}
   const pm1 = this.shareService.getItem('email');
   const pm2 = this.shareService.getItem('upro');
   Promise.all([pm1, pm2]).then(resps => {
	this.horoService.talkToAstro(ast.uid, resps[0] + '|' + this.shareService.getCLAT().toString() + ',' + this.shareService.getCLNG().toString(), 'C')
	   .subscribe(res => {
	   }, (err) => {
	     console.log(err);
	   });	 
		           let upro = resps[1] as any;
				   this.callService.establishMediaCall(upro['dob'], ast['status'].split('|')[1], resps[0] as string, true);
				   let cinf: any = {};
				   if(upro.dob.indexOf('#') > -1) cinf.caller_name = upro['dob'].split('#')[1].split('&')[0];
				   cinf.uid = ast.uid;
				   cinf.name =  ast.name;
				   cinf.avatar = ast.avatar;
				   cinf.iscaller = true;
				   cinf.secs = 0;
				   cinf.starttime = '';
				   cinf.endtime = '';
				   cinf.uuid = resps[0] as string;
				   cinf.cid = resps[0] as string;
				   if(upro['dob'].indexOf('#') > -1)
						cinf.caller_name = upro['dob'].split('#')[1].split('&')[0];
					this.loading = false;
			//	  this.info += 'astro-call';
				   this.router.navigate(['/astro-call'], {state: cinf});
			//} else {
				   
			//}
		})
		.catch(e => {
			console.log(e);
		});
	})
	.catch(e => {
	  this.router.navigate(['/add-money'], {state: 'Astrologers' as any});
	});	
  }

  vstory(s) {
    this.router.navigate(['/Article/' + s.title.replaceAll(' ', '-')], { state: s });
    window.scrollTo(0, 0);
	}
  vhoevts(evt) {
    if(!evt) {
	  this.signOut();
	}
   }
   gevts(evt) {
	if(evt == 'report') {
		
	} 
	if (evt == 'login') {
      this.mtitle = 'Login As,';
      this.showSO = true;
      this.showLogin = true;
      this.showReg = false;
      this.modalService.open(this.loginMdl).result.then((result) => {
        //this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        //	this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
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
      if (localStorage.getItem('user')!) {
        const usr = JSON.parse(localStorage.getItem('user')!);
        if (usr) {
          (<HTMLInputElement>document.getElementById('rnam')).value = usr.name;
          (<HTMLInputElement>document.getElementById('reml')).value = usr.email;
        }
      }
    } else if (evt == 'activatesub') {
      this.modalService.open(this.actvMdl).result.then((result) => {
      }, (reason) => {
      });
    }
    //else if (evt == 'logout') {
      //this.signOut();
    //}
	}
	loginGPLUS(evt) {
	  //evt.stopPropagation();
	  if(this.oauth2Loaded) {
		this.auth2.signIn().then((googleAuthUser:any) => {
			this.modalService.dismissAll();
			let profile = googleAuthUser.getBasicProfile();
			console.log('Token || ' + googleAuthUser.getAuthResponse().id_token);
			console.log('ID: ' + profile.getId());
			console.log('Name: ' + profile.getName());
			console.log('Image URL: ' + profile.getImageUrl());
			console.log('Email: ' + profile.getEmail());
			/* Write Your Code Here */
			const user = {
				name: profile.getName(),
				email: profile.getEmail(),
				imageUrl: profile.getImageUrl()
			};
			this.shareService.setVEVT(user);
			
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
 
	 loginFB(): void {
		// this.authService.initState.subscribe(() => {}, console.error, () => {console.log('all providers are ready');
		 // this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(usr => {
			// console.log('FB', usr);
			// localStorage.setItem('user', JSON.stringify(usr));
			// console.log('GET', localStorage.getItem('user')!);
			// this.shareService.setNAME(usr.name);
			// this.shareService.setItem('eml', usr.email);
			// this.shareService.setVEVT('authorized' + '|' + usr.name + '|' + usr.photoUrl + '|' + usr.provider);
			// this.horoService.getSubscriber('', usr.email)
				// .subscribe((sub) => {
					// if (sub['uuid'] == -1) {
					// } else {
						// this.horoService.getPlan(usr['uuid'])
							// .subscribe(res => {
								// console.log('Fetched the plan details loginFB');
								// let pln: Plan = { uuid: res['uuid'], name: res['name'], credits: res['credits'], dobs: res['dobs'] };
								// this.shareService.setPLAN(pln);
							// }, (err) => {
							// });	  
					// }
				// });
			// this.modalService.dismissAll();
		// });
	  // });
	 }

	 signOut(): void {
		if (this.auth2 && this.auth2.isSignedIn.get()) {
			this.auth2.signOut().then(() => {
			console.log('User signed out.');
			localStorage.removeItem('user');
			this.shareService.setVEVT('unauthorized');
			localStorage.removeItem('nam');
			localStorage.removeItem('eml');
			this.router.navigate(['/']);
		});
	   }
		//this.authService.signOut();
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
		if (!this.validateEml((<HTMLInputElement>document.getElementById('leml')).value)) {
			this.msg1 = "Please enter your valid email address";
			return;
		}
		if ((<HTMLInputElement>document.getElementById('lpwd')).value.length == 0) {
			this.msg1 = "Incorrect password";
			return;
		}
		if (!this.validateEml((<HTMLInputElement>document.getElementById('leml')).value)) {
			this.msg1 = "Incorrect email address";
			return;
		} else {
			if ((<HTMLInputElement>document.getElementById('lpwd')).value.length < 6) {
				this.msg1 = "Incorrect password";
				return;
			} else if ((<HTMLInputElement>document.getElementById('lpwd')).value.length > 16) {
				this.msg1 = "Incorrect password";
				return;
			}
		}
		//let uuid = genRanHex(16);
		this.horoService.getSubscriber((<HTMLInputElement>document.getElementById('lpwd')).value, (<HTMLInputElement>document.getElementById('leml')).value)
			.subscribe((usr) => {
				let eusr = localStorage.getItem('user');
				if (eusr && JSON.parse(eusr).provider == 'vhoroo') {
					if (usr['uuid'] == -1 )
						this.msg1 = 'Anthentication failed!';
					else {
						let nam = usr['nam'];
						this.horoService.getProfile(usr['uuid'])
							.subscribe((res) => {
								let pic = (res['avatar'] == '') ? 'https://i.imgur.com/LR7e1vw.png' : res['avatar'];
								let ousr = {
									name: nam,
									photoUrl: pic,
									provider: 'vhoroo'
								};
								localStorage.setItem('user', JSON.stringify(ousr));
								this.shareService.setVEVT('authorized');
								this.horoService.getPlan(usr['uuid'])
									.subscribe(res => {
										console.log('Fetched the plan details vauth');
										let pln: Plan = { uuid: res['uuid'], name: res['name'], credits: res['credits'], dobs: res['dobs'] };
										this.shareService.setPLAN(pln);
									}, (err) => {
									});
								this.modalService.dismissAll();
							}, (err) => {
								//this.msg1 = JSON.stringify(err);
								let pic = 'https://i.imgur.com/LR7e1vw.png';
								this.modalService.dismissAll();
							});
					}
				}
			}, (err) => {
				this.msg1 = JSON.stringify(err);
			});

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
		this.razpay((<HTMLInputElement>document.getElementById('rnam')).value, (<HTMLInputElement>document.getElementById('reml')).value, (<HTMLInputElement>document.getElementById('rmob')).value);
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
	razpay(nam, eml, mob) {
		console.log(nam, eml);
		console.log('razpay', mob);
		let amt: number = 399;
		amt = amt * 100;
		let ccy: string = 'INR';
		let ccode = 'IN';//this.shareService.getCCODE();
		//console.log('ccode', ccode);
		if (ccode && ccode != '' && ccode != 'IN') {
			amt = amt * 1.4;
			ccy = 'USD';
		}
		console.log('amt', amt);
		var options = {
			description: 'VEDIC HOROO SUBSCRIPTION',
			image: 'https://i.imgur.com/YBQF1iV.png',
			currency: ccy,//'INR',
			key: 'rzp_live_IQ6Vb53w3nrJRp',
			amount: amt,
			name: 'VEDIC HOROO',
			prefill: {
				email: eml,
				contact: mob,
				name: nam
			},
			theme: {
				color: '#d35400'
			},
			modal: {
				ondismiss: function () {
					alert('dismissed')
				}
			}
		};

		var successCallback = (payment_id) => {
			this.msg2 = 'Thank you for your subscription. We have sent you the activation code to your registered email address. Please follow the instruction to activate your subscription.';
			this.plan.name = 'com.mypubz.eportal.adfree#';
			let pic = 'https://i.imgur.com/LR7e1vw.png';
			if (localStorage.getItem('user') == null) {
				let usr = {
					name: (<HTMLInputElement>document.getElementById('rnam')).value,
					email: (<HTMLInputElement>document.getElementById('reml')).value,
					photoUrl: pic,
					provider: 'vhoroo'
				}
				localStorage.setItem('user', JSON.stringify(usr));
			}
			this.shareService.setPLAN(this.plan);
			this.horoService.addSubscriber('', nam, mob, eml)
				.subscribe(res => {
					if (res['eml'] != '') {
						this.horoService.setPlan(res['uuid'], this.plan.name)
							.subscribe(res => {
								let pln: Plan = { uuid: res['uuid'], name: res['name'], credits: res['credits'], dobs: res['dobs'] };
								this.shareService.setPLAN(pln);
							}, (err) => {
							});
					} else {
					}
				}, (err) => {
				});
		};
		var cancelCallback = (error) => {
			alert(error.description + ' (Error ' + error.code + ')');
		};
		Razorpay.open(options, successCallback, cancelCallback);
	}
}
