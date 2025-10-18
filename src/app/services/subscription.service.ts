import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';
declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private baseUrl = 'https://vedic-subscription-api-4fac8089d848.herokuapp.com';

  constructor(private http: HttpClient) {}

  subscribeUser(data: {
    name: string,
    email: string,
    plan: 'monthly' | 'yearly'
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/subscribe`, data);
  }
  getSubscriptionByKey(key: string) {
    return this.http.get(`${this.baseUrl}/subscription/${key}`);
  }
  verifyEmail(key: string) {
    return this.http.get(`${this.baseUrl}/verify-email/${key}`);
  }
  activateKey(key: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/activate`, { key });
  }

  renewKey(key: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/renew`, { key });
  }
  getJson(url: string): Observable<{}> {
    return this.http.get(url).pipe(
      catchError(this.handleGenericError)
     );
  }
  sendVerificationEmail(data: {
    name: string;
    email: string;
  }): Observable<any> {
      const payload = {
    name: data.name,
    email: data.email
  };
    return this.http.post(`${this.baseUrl}/send-verification-email`, payload);

  }
  getCountryCode() {
    return this.http.get<any>('https://ipapi.co/json/');  // returns full location info
  }
  createRazorpayOrder(amount: number, currency: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-razorpay-order`, { amount, currency });
  }

  private handlePaymentError(error: HttpErrorResponse) {
   let errorMsg = 'An unknown error occurred.';

   if (error.error && error.error.detail) {
    // Specific backend error from FastAPI
    errorMsg = error.error.detail;
   }

  // Compose a user-friendly fallback message
  const fallbackMsg = `Your payment was successful, but we couldn't activate your subscription due to a technical issue. 
  Please contact our support team at info@vedichoroo.com with your license key.`;

  // Return the fallback message along with any specific detail
  const finalMessage = `${fallbackMsg}\n\nError Details: ${errorMsg}`;
   return throwError(() => new Error(finalMessage));
  }
  private handleGenericError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    const errorMsg = error.error?.message || 'Something went wrong. Please try again later.';
    return throwError(() => new Error(errorMsg));
  }
  launchRazorpay(amount: number, currency: string, orderId: string, formData: any, onSuccess: () => void) {
    this.getJson('assets/data/currency_data.json')
      .subscribe((cur: any) => {
        const subunits = Math.pow(10, cur[currency]);
        const amtInSubunits = amount * subunits;

        const options: any = {
          description: 'VEDICHOROO ASTRO SERVICE',
          image: 'https://i.imgur.com/YBQF1iV.png',
          currency: currency,
          key: 'rzp_live_H9aUztvl3jiG01', // Use test key for development
          order_id: orderId,
          amount: amtInSubunits,
          name: 'VEDICHOROO',
          prefill: {
            email: formData.email,
            contact: formData.mobile || '',
            name: formData.name
          },
          theme: {
            color: '#ff9900'
          },
          modal: {
            escape: false,
            ondismiss: function () {
              alert('Payment window closed.');
            }
          },
          handler: (response: any) => {
            console.log('Razorpay success response:', response);
            // ✅ Call your success callback to proceed
            onSuccess();
          }
        };

        Razorpay.open(options,
          (payment_id) => console.log('Razorpay success:', payment_id),
          (error) => alert(error.description + ' (Error ' + error.code + ')')
        );
      });
  }
}
