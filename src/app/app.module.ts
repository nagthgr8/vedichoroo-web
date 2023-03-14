import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgwWowModule } from 'ngx-wow';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { HomeComponent } from './home/home.component';
import { HoroscopeComponent } from './horoscope/horoscope.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { KpAstroComponent } from './kp-astro/kp-astro.component';
import { TransitPredictionsComponent } from './transit-predictions/transit-predictions.component';
import { CareerComponent } from './career/career.component';
import { MoneyComponent } from './money/money.component';
import { LoveCompatibilityComponent } from './love-compatibility/love-compatibility.component';
import { DivchartsComponent } from './divcharts/divcharts.component';
import { ChartAnalysisComponent } from './chart-analysis/chart-analysis.component';
import { TermsandconditionsComponent } from './termsandconditions/termsandconditions.component';
import { RefundpolicyComponent } from './refundpolicy/refundpolicy.component';
import { environment } from '../environments/environment';
import { CallService } from './call.service';
import { GoogleMapsService } from './google-maps.service';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ModalComponent } from './modal/modal.component';
@NgModule({
  declarations: [
		AppComponent,
		NavMenuComponent,
  PrivacyPolicyComponent,
  HomeComponent,
  HoroscopeComponent,
  PersonalDetailsComponent,
  KpAstroComponent,
  TransitPredictionsComponent,
  CareerComponent,
  MoneyComponent,
  LoveCompatibilityComponent,
  DivchartsComponent,
  ChartAnalysisComponent,
  TermsandconditionsComponent,
  RefundpolicyComponent,
  UserAvatarComponent,
  ModalComponent
  ],
  imports: [
	  AppRoutingModule,
      FontAwesomeModule,
	  BrowserAnimationsModule,
	  NgwWowModule,
	  NgbModule,
    HttpClientModule,
	  FormsModule,
	  TranslateModule.forRoot({
		  loader: {
			  provide: TranslateLoader,
			  useFactory: HttpLoaderFactory,
			  deps: [HttpClient]
		  }
	  }),
   ServiceWorkerModule.register('ngsw-worker.js', {
     enabled: !isDevMode(),
     // Register the ServiceWorker as soon as the application is stable
     // or after 30 seconds (whichever comes first).
     registrationStrategy: 'registerWhenStable:30000'
   })	  
	],
	providers: [
		CallService,
		GoogleMapsService
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}
