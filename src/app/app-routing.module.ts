import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { RefundpolicyComponent } from './refundpolicy/refundpolicy.component';
import { TermsandconditionsComponent } from './termsandconditions/termsandconditions.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { HoroscopeComponent } from './horoscope/horoscope.component';
import { KpAstroComponent } from './kp-astro/kp-astro.component';
import { TransitPredictionsComponent } from './transit-predictions/transit-predictions.component';
import { CareerComponent } from './career/career.component';
import { MoneyComponent } from './money/money.component';
import { LoveCompatibilityComponent } from './love-compatibility/love-compatibility.component';
import { DivchartsComponent } from './divcharts/divcharts.component';
import { ChartAnalysisComponent } from './chart-analysis/chart-analysis.component';
import { AstroCallComponent } from './astro-call/astro-call.component';
const routes: Routes = [
	{ path: 'home',  component: HomeComponent },
	{ path: 'privacy-policy',  component: PrivacyPolicyComponent },
	{ path: 'privacy-policy.html',  component: PrivacyPolicyComponent },
	{ path: 'refundpolicy',  component: RefundpolicyComponent },
	{ path: 'termsandconditions',  component: TermsandconditionsComponent },
	{ path: 'personal-details',  component: PersonalDetailsComponent },
	{ path: 'horoscope',  component: HoroscopeComponent },
	{ path: 'kp-astro',  component: KpAstroComponent },
	{ path: 'transit-predictions',  component: TransitPredictionsComponent },
	{ path: 'career',  component: CareerComponent },
	{ path: 'money',  component: MoneyComponent },
	{ path: 'love-compatibility',  component: LoveCompatibilityComponent },
	{ path: 'divcharts',  component: DivchartsComponent },
	{ path: 'chart-analysis',  component: ChartAnalysisComponent },
	{ path: 'astro-call',  component: AstroCallComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
