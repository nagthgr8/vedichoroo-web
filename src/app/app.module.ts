import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgwWowModule } from 'ngx-wow';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
	FacebookLoginProvider,
	GoogleLoginProvider
} from 'angularx-social-login';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { provideFirebaseApp, initializeApp } 
from '@angular/fire/app';
import { getFirestore, provideFirestore } 
from '@angular/fire/firestore';import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
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
  RefundpolicyComponent
  ],
  imports: [
	  AppRoutingModule,
      FontAwesomeModule,
	  BrowserAnimationsModule,
	  NgwWowModule,
	  NgbModule,
    HttpClientModule,
	  FormsModule,
	  GooglePlaceModule,
	  SocialLoginModule,
	  ShareButtonsModule,
	  ShareIconsModule,
	  TranslateModule.forRoot({
		  loader: {
			  provide: TranslateLoader,
			  useFactory: HttpLoaderFactory,
			  deps: [HttpClient]
		  }
	  })
	],
	providers: [
   provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),		TranslateService,
    {
			provide: 'SocialAuthServiceConfig',
			useValue: {
				autoLogin: false,
				providers: [
					{
						id: FacebookLoginProvider.PROVIDER_ID,
						provider: new FacebookLoginProvider('1281447048875236')
					},
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider: new GoogleLoginProvider(
							'487888334201-mjr32c1p6tg1umjauk8d80ecfb5d70gu.apps.googleusercontent.com'
						)
					}
				]
			} as SocialAuthServiceConfig,
		},
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}
