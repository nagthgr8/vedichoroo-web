import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider} from "angularx-social-login";
//import { PubNubAngular } from 'pubnub-angular2';
import { HoroscopeService } from './horoscope.service';
import { ShareService } from './share.service';
import { Plan } from './plan';
import { CallService } from './call.service';
//import { Astrologer } from './astrologer';
declare const FB: any;
declare const gapi: any;
declare var Razorpay: any;

@Component({
  selector: 'my-app',
	templateUrl: './app.component.html'

})
export class AppComponent implements OnInit {
	@ViewChild('loginMdl') loginMdl: TemplateRef<any>;
	@ViewChild('actvMdl') actvMdl: TemplateRef<any>;
    @ViewChild('vhoring', {static: true}) vhoRing;
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
	constructor(private router: Router,    private callService: CallService, private modalService: NgbModal, private authService: SocialAuthService, private horoService: HoroscopeService, private shareService: ShareService) {
		//pubnub.init({ publishKey: 'pub-c-8b05f8ad-9452-4d4e-9413-009199c16c4b', subscribeKey: 'sub-c-df97f024-c6cd-11ec-8bed-a6fdca316470' });
    //this.isCallStarted$ = this.callService.isCallStarted$;
    let peerId = this.callService.initPeer();
	//this.callService.addLog('PeerId: ' + this.peerId);
	this.shareService.setPeerId(peerId);
	console.log('peerId', peerId);
	this.vring = new Audio('assets/sounds/telephone-ring-03a.mp3');
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
				this.shareService.getUPRO().then( upro => {
					if(upro) {
						if(upro['dob'].indexOf('#') > -1) {
							var ng = upro['dob'].split('#')[1];
							this.horoService.setAstStatus(this.device.uuid, ng.split('&')[0], 'C', this.shareService.getPeerId())
							.subscribe(stat => {
							});
						}
					}
					this.router.navigate(['/astro-call'], {state: cinf});
				})	
				.catch(e => {
						console.log(e);
							this.horoService.setAstStatus(this.device.uuid, 'Astrologer', 'C', this.shareService.getPeerId())
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
				this.shareService.getUPRO().then( upro => {
					if(upro) {
						if(upro['dob'].indexOf('#') > -1) {
							var ng = upro['dob'].split('#')[1];
							this.horoService.setAstStatus(this.device.uuid, ng.split('&')[0], 'A', this.shareService.getPeerId())
							.subscribe(stat => {
							});
						}
					}
				})
				.catch(e => {
					console.log(e);
							this.horoService.setAstStatus(this.device.uuid, 'Astrologer', 'A', this.shareService.getPeerId())
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
		if (localStorage.getItem('user')!) {
			const usr = JSON.parse(localStorage.getItem('user')!);
			if (usr && usr.provider == 'vhoroo') {
				console.log('usr', usr);
				this.horoService.getSubscriber('', usr.email)
					.subscribe((sub) => {
						if (sub['uuid'] == -1) {
						} else {
							this.horoService.getPlan(sub['uuid'])
								.subscribe(res => {
									console.log('Fetched the plan details loginFB');
									let pln: Plan = { uuid: res['uuid'], name: res['name'], credits: res['credits'], dobs: res['dobs'] };
									this.shareService.setPLAN(pln);
								}, (err) => {
								});
						}
					});
				this.shareService.setVEVT('authorized' + '|' + usr.name + '|' + usr.photoUrl + '|' + usr.provider);
			}
				this.authService.initState.subscribe(() => { }, console.error, () => {
					console.log('all providers are ready')
					FB.getLoginStatus((fusr) => {
						console.log('FB.getLoginStatus');
						if (fusr.status === 'connected') {
								this.shareService.setVEVT('authorized' + '|' + usr.name + '|' + usr.photoUrl + '|' + usr.provider);
								this.horoService.getSubscriber('', usr.email)
									.subscribe((sub) => {
										if (sub['uuid'] == -1) {
										} else {
											this.horoService.getPlan(sub['uuid'])
												.subscribe(res => {
													console.log('Fetched the plan details authFB');
													let pln: Plan = { uuid: res['uuid'], name: res['name'], credits: res['credits'], dobs: res['dobs'] };
													this.shareService.setPLAN(pln);
												}, (err) => {
												});
										}
									});
						}
					});
					//console.log('google-getAuthInstance', gapi.auth2.getAuthInstance());
					console.log('google-getAuthInstance', gapi.auth2.getAuthInstance().isSignedIn.get());
					if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
						if (usr) {
							console.log('google', usr);
							this.shareService.setVEVT('authorized' + '|' + usr.name + '|' + usr.photoUrl + '|' + usr.provider);
							this.horoService.getSubscriber('', usr.email)
								.subscribe((sub) => {
									if (sub['uuid'] == -1) {
									} else {
										this.horoService.getPlan(sub['uuid'])
											.subscribe(res => {
												console.log('Fetched the plan details authGP');
												let pln: Plan = { uuid: res['uuid'], name: res['name'], credits: res['credits'], dobs: res['dobs'] };
												this.shareService.setPLAN(pln);
											}, (err) => {
											});
									}
								});
						}
					}
				});
		}
				
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
    callreq(event, ast) {
  //this.info = 'callreq';
     event.stopPropagation();
	 this.loading = true;
     console.log(ast);
	 //this.info += 'getNAME';
	 if(this.shareService.getNAME() == '') {
	    this.loading = false;
		this.vhoevts('login');
		return;
	 }
	 //this.info += 'getBAL';
   this.shareService.getBAL().then(bal => {
    if(bal < 100) {
	    this.loading = false;
		this.router.navigate(['/add-money'], {state: 'Astrologers' as any});
		return;
	}
	//this.info += 'getCSTATS';
	 //this.info += 'talkToAstro';
	this.horoService.talkToAstro(ast.uid, this.shareService.getEMAIL() + '|' + this.shareService.getCLAT().toString() + ',' + this.shareService.getCLNG().toString(), 'C')
	   .subscribe(res => {
	   }, (err) => {
	     console.log(err);
	   });	 
	   //this.info += 'getUPRO';
		this.shareService.getUPRO().then( upro => {
		//   if(ast['status'].split('|')[0] == 'A'){
		//this.info = 'establishMediaCall';
				   this.callService.establishMediaCall(upro['dob'], ast['status'].split('|')[1], this.shareService.getEMAIL(), true);
				   let cinf: any = {};
				   if(upro.dob.indexOf('#') > -1) cinf.caller_name = upro['dob'].split('#')[1].split('&')[0];
				   cinf.uid = ast.uid;
				   cinf.name =  ast.name;
				   cinf.avatar = ast.avatar;
				   cinf.iscaller = true;
				   cinf.secs = 0;
				   cinf.starttime = '';
				   cinf.endtime = '';
				   cinf.uuid = this.shareService.getEMAIL();
				   cinf.cid = this.shareService.getEMAIL();
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
			//this.info = 'getProfile';
			this.horoService.getProfile(this.shareService.getEMAIL()).subscribe( upro => {
			  // if(ast['status'].split('|')[0] == 'A'){
			  //this.info += 'establishMediaCall' + JSON.stringify(upro);
				this.callService.establishMediaCall(upro['dob'], ast.peerid, this.shareService.getEMAIL(), true);
			  //this.info += 'ESTABLISHED';
				let cinf: any = {};
			   cinf.uid = ast.uid;
			   cinf.name =  ast.name;
			   cinf.avatar = ast.avatar;
			   cinf.iscaller = true;
			   cinf.secs = 0;
			   cinf.starttime = '';
			   cinf.endtime = '';
			   cinf.uuid = this.shareService.getEMAIL();
			   cinf.cid = this.shareService.getEMAIL();
			   if(upro['dob'].indexOf('#') > -1)
					cinf.caller_name = upro['dob'].split('#')[1].split('&')[0];
			   //this.info += 'astro-call';
			   this.loading = false;
			   this.router.navigate(['/astro-call'], {state: cinf});
				// } else {
				   
				 //}
			}, (err) => {
			this.loading = false;
	     console.log(err);
		 this.info += JSON.stringify(err);
		});
		});
	  })
	  .catch(e => {
	    this.loading = false;
		this.router.navigate(['/add-money'], {state: 'Astrologers' as any});
		return;
	  });
	   //this.callNumber.callNumber('+' + ast.mob, true)
		//.then(res => console.log('Launched dialer!', res))
		//.catch(err => console.log('Error launching dialer', err));
		
  }
/*     if (localStorage.getItem('DHORO')!) {
      var cdt = new Date();
      const dho = JSON.parse(localStorage.getItem('DHORO')!);
      if (dho.date != cdt.getDate().toString() + '-' + cdt.getMonth().toString() + '-' + cdt.getFullYear()) {
        this.horoService.getDailyHoros()
          .subscribe(res => {
            res['date'] = cdt.getDate().toString() + '-' + cdt.getMonth().toString() + '-' + cdt.getFullYear();
            localStorage.setItem('DHORO', JSON.stringify(res));
            this.ari = res['Aries'];
            this.tau = res['Taurus'];
            this.gem = res['Gemini'];
            this.can = res['Cancer'];
            this.leo = res['Leo'];
            this.vir = res['Virgo'];
            this.lib = res['Libra'];
            this.sco = res['Scorpio'];
            this.sag = res['Sagittarius'];
            this.cap = res['Capricorn'];
            this.aqu = res['Aquarius'];
            this.pis = res['Pisces'];
          });
      } else {
        this.ari = dho['Aries'];
        this.tau = dho['Taurus'];
        this.gem = dho['Gemini'];
        this.can = dho['Cancer'];
        this.leo = dho['Leo'];
        this.vir = dho['Virgo'];
        this.lib = dho['Libra'];
        this.sco = dho['Scorpio'];
        this.sag = dho['Sagittarius'];
        this.cap = dho['Capricorn'];
        this.aqu = dho['Aquarius'];
        this.pis = dho['Pisces'];
      }
    } else {
      this.horoService.getDailyHoros()
        .subscribe(res => {
          var cdt = new Date();
          res['date'] = cdt.getDate().toString() + '-' + cdt.getMonth().toString() + '-' + cdt.getFullYear();
          localStorage.setItem('DHORO', JSON.stringify(res));
          this.ari = res['Aries'];
          this.tau = res['Taurus'];
          this.gem = res['Gemini'];
          this.can = res['Cancer'];
          this.leo = res['Leo'];
          this.vir = res['Virgo'];
          this.lib = res['Libra'];
          this.sco = res['Scorpio'];
          this.sag = res['Sagittarius'];
          this.cap = res['Capricorn'];
          this.aqu = res['Aquarius'];
          this.pis = res['Pisces'];
        });
    }
 */  
//		this.articles = [];
//		this.stories = [];
//		//this.info = 'fetching...';
//		this.horoService.getStories()
//			.subscribe(res => {
//				let stys: any = res;
//	//			let np: number = 0;
//				//stys = res;//this.publishStories(res);
//				for (var i = stys.length-1; i > -1; i--) {
//					if (stys[i].img == null) stys[i].img = 'assets/images/vedichoroo.png';
////					if (np < stys.length - 4) {
//						this.articles.push(stys[i]);
//	//				} else {
//	//					this.stories.push(stys[i]);
//	//				}
//	//				np++;
//				}
//			}, (err) => {
//			});
		//this.info = 'fetching...';

	
  vstory(s) {
    this.router.navigate(['/Article/' + s.title.replaceAll(' ', '-')], { state: s });
    window.scrollTo(0, 0);
	}
	vhoevts(evt) {
	if(evt == 'report') {
		
	} if (evt == 'login') {
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
    else if (evt == 'logout') {
      this.signOut();
    }
	}
	loginGPLUS(): void {
		this.authService.initState.subscribe(() => {}, console.error, () => {console.log('all providers are ready');
		 this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(usr => {
			console.log('GPLUS', usr);
			localStorage.setItem('user', JSON.stringify(usr));
			this.shareService.setVEVT('authorized' + '|' + usr.name + '|' + usr.photoUrl + '|' + usr.provider);
			this.shareService.setNAME(usr.name);
			this.shareService.setEMAIL(usr.email);
			this.horoService.getSubscriber('', usr.email)
				.subscribe((sub) => {
					if (sub['uuid'] == -1) {
					} else {
						this.horoService.getPlan(sub['uuid'])
							.subscribe(res => {
								console.log('Fetched the plan details loginGP');
								let pln: Plan = { uuid: res['uuid'], name: res['name'], credits: res['credits'], dobs: res['dobs'] };
								this.shareService.setPLAN(pln);
							}, (err) => {
							});
					}
				});
			this.modalService.dismissAll();
		});
	  });

	}

	loginFB(): void {
		this.authService.initState.subscribe(() => {}, console.error, () => {console.log('all providers are ready');
		 this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(usr => {
//		FB.Login((usr) => {
			console.log('FB', usr);
			localStorage.setItem('user', JSON.stringify(usr));
			console.log('GET', localStorage.getItem('user')!);
			this.shareService.setNAME(usr.name);
			this.shareService.setEMAIL(usr.email);
			this.shareService.setVEVT('authorized' + '|' + usr.name + '|' + usr.photoUrl + '|' + usr.provider);
			this.horoService.getSubscriber('', usr.email)
				.subscribe((sub) => {
					if (sub['uuid'] == -1) {
					} else {
						this.horoService.getPlan(usr['uuid'])
							.subscribe(res => {
								console.log('Fetched the plan details loginFB');
								let pln: Plan = { uuid: res['uuid'], name: res['name'], credits: res['credits'], dobs: res['dobs'] };
								this.shareService.setPLAN(pln);
							}, (err) => {
							});	  
					}
				});
			this.modalService.dismissAll();
		});
	  });
	}

	signOut(): void {
		this.authService.signOut();
		localStorage.removeItem('user');
		this.shareService.setVEVT('unauthorized');
			this.shareService.setNAME('');
			this.shareService.setEMAIL('');
		//this.router.navigate(['/']);
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
