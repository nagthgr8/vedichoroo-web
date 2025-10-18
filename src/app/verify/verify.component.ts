import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  key: string = '';
  subscriptionDetails: any = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.key = this.route.snapshot.queryParamMap.get('key') || '';
    if (this.key) {
      this.subscriptionService.getSubscriptionByKey(this.key).subscribe({
        next: (data) => {
          this.subscriptionDetails = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error.detail || 'Invalid or expired link.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Missing verification key.';
      this.loading = false;
    }
  }

  proceedToPayment() {
    const { plan_type, email, name } = this.subscriptionDetails;
    const amount = plan_type === 'monthly' ? 100 : 999;
    const countryCode = localStorage.getItem('countryCode') || 'IN';

    // Load currency data JSON
    this.subscriptionService.getJson('assets/data/currency_data.json').subscribe(cur => {
      const currency = cur[countryCode] || 'INR'; // fallback to INR if unknown

      // Step 1: Create Razorpay order from backend
      this.subscriptionService.createRazorpayOrder(amount, currency).subscribe({
        next: (order: any) => {
          // Step 2: Launch Razorpay
          this.subscriptionService.launchRazorpay(amount, currency, order.id, {
          name,
          email,
          key: this.key,
          plan_type
        }, () => {
            // Step 3: After successful payment
            this.subscriptionService.subscribeUser({
            name,
            email,
            plan: plan_type
          }).subscribe({
              next: (response) => {
                alert('Subscription successful! Your license is valid until ' + response.expiry_date);
              },
              error: (err) => {
                alert(err.message);
              }
            });
          });
        },
        error: (err) => {
          alert('Failed to create payment order. ' + err.message);
        }
      });
    });
  }
}
