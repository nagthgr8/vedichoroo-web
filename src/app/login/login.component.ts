import { Component, OnInit,ViewChild, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HoroscopeService } from '../horoscope.service';
import { ShareService } from '../share.service';
import { User } from '../user';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 @ViewChild('loginMdl', { static: true }) loginMdl: TemplateRef<any>;
@Output() loginMdlLoaded = new EventEmitter<TemplateRef<any>>();
@Output() onSubmitEvent = new EventEmitter<void>();
  loginForm: FormGroup;
  registerForm: FormGroup;
  showReg: boolean = false;
  regMsg: string = "Don't have an account?";
  regBtn: string = 'Register now';
  constructor(private fb: FormBuilder, private shareService: ShareService, private horoService: HoroscopeService) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
	this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')]],
      rePassword: ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator,
    });
  }
  ngAfterViewInit() {
    this.loginMdlLoaded.emit(this.loginMdl);
   }
	passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const rePassword = formGroup.get('rePassword');

    if (password.value !== rePassword.value) {
      rePassword.setErrors({ passwordMismatch: true });
    } else {
      rePassword.setErrors(null);
    }
  }
  toggle(evt) {
    console.log('toggle');
    evt.preventDefault();
    this.showReg = !this.showReg;
	this.regMsg = (!this.showReg) ? "Don't have an account?" : "Already have account?";
	this.regBtn = (!this.showReg) ? 'Register Now': 'Login';
	console.log(this.regMsg, this.regBtn);
  }
  onLoginGPLUS(evt) {
	evt.stopPropagation();
	this.shareService.setGEVT('login-gpls');
  }
  onLoginFB(evt) {
	evt.stopPropagation();
	this.shareService.setGEVT('login-fb');
  }
  onLogin(evt) {
    evt.stopProopagation();
    if(this.loginForm.valid){ 
		const formData = this.loginForm.value;
		console.log('formData', formData.email);
		console.log('formData', formData.password);
		this.horoService.loginUser(formData.email, formData.password)
				.subscribe((res) => {
				  if(res['status'] == 200) {
					  this.horoService.getBalance(formData.email).subscribe((bal) => {
						let user: User = {
							name: formData.email,
							email: formData.email,
							imageUrl: null,
							balance: bal['balance'],
							ccy: (bal['currency_code'].length > 3) ? '' : bal['currency_code'],
							peerid: '',
							dob: '',
							isprivate: true
						};
						this.shareService.setItem('user', JSON.stringify(user));
						this.shareService.emitSignIn(user);
					});
				  }
				}, (error) => {
					console.log('Error while logging in: ', error);
				});
			
		 this.onSubmitEvent.emit();
    }
  }
  onRegister(evt) {
    evt.stopProopagation();
    if(this.registerForm.valid){
		const formData = this.loginForm.value;
		console.log('formData', formData.email);
		console.log('formData', formData.password);
		this.horoService.createUser(formData.name, formData.email, formData.password)
				.subscribe((res) => {
				  if(res['status'] == 200) {
					let user: User = {
						name: formData.name,
						email: formData.email,
						imageUrl: null,
						balance: 0,
						ccy: '',
						peerid: '',
						dob: '',
						isprivate: true
					};
					this.shareService.setItem('user', JSON.stringify(user));
					this.shareService.emitSignIn(user);
				  }
				}, (error) => {
					console.log('Error while logging in: ', error);
				});
		this.onSubmitEvent.emit();
	}
  }	
  
 
}
