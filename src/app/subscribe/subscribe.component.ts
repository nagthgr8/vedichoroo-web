import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionService } from '../services/subscription.service';
import { ShareService } from '../share.service';
@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html'
})
export class SubscribeComponent {
  subscribeForm: FormGroup;
  submitted = false;
  planPrices: { [key: string]: number } = {
    monthly: 100,
    yearly: 999
  };
  countryCode: string = '';
  constructor(private fb: FormBuilder, private subscriptionService: SubscriptionService, private shareService: ShareService) {
    this.subscribeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: [''],
      plan: ['', Validators.required]
    });
  }
  ngOnInit() {
    const cachedCountry = localStorage.getItem('countryCode');

    if (cachedCountry) {
      this.countryCode = cachedCountry;
      console.log('Using cached country code:', cachedCountry);
    } else {
      this.subscriptionService.getCountryCode().subscribe(data => {
        this.countryCode = data.country;
        localStorage.setItem('countryCode', data.country);
        console.log('Fetched and cached country code:', data.country);
      });
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.subscribeForm.valid) {
      const formData = this.subscribeForm.value;

      this.subscriptionService.sendVerificationEmail(formData).subscribe({
        next: () => {
          alert('Please verify your email. A verification link has been sent.');
        },
        error: (err) => {
          alert(err.message);
        }
      });
    }
  }
  onSubscribe() {
    this.submitted = true;

    if (this.subscribeForm.valid) {
      const formValue = this.subscribeForm.value;
      const selectedPlan = formValue.plan;
      const amount = this.planPrices[selectedPlan]; // e.g., 100 or 999

      // Get country code from localStorage or use fallback
    }
  }

  getSelectedPlanPrice(): number | null {
    const selectedPlan = this.subscribeForm.get('plan')?.value;
    return this.planPrices[selectedPlan] ?? null;
  }
}
