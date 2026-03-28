import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface ReportTab {
  id:    string;
  label: string;
  badge: string;
  color: string;
  url:   SafeResourceUrl;
}

@Component({
  selector: 'app-model-validation',
  templateUrl: './model-validation.component.html',
  styleUrls: ['./model-validation.component.scss']
})
export class ModelValidationComponent {
  tabs: ReportTab[];
  activeTab: string = 'comparison';

  constructor(sanitizer: DomSanitizer) {
    const trust = (p: string) => sanitizer.bypassSecurityTrustResourceUrl(p);
    this.tabs = [
      { id: 'comparison', label: 'Comparison',  badge: 'VS',        color: '#343a40', url: trust('assets/reports/adb-validation-comparison.html')  },
      { id: 'raman',      label: 'Raman',        badge: 'ayanId=1',  color: '#e67e22', url: trust('assets/reports/adb-validation.html')             },
      { id: 'kp',         label: 'KP New',       badge: 'ayanId=2',  color: '#6f42c1', url: trust('assets/reports/adb-validation-kp.html')          },
      { id: 'lahiri',     label: 'Lahiri',       badge: 'ayanId=4',  color: '#17a2b8', url: trust('assets/reports/adb-validation-lahiri.html')      },
      { id: 'yukteshwar', label: 'Yukteshwar',   badge: 'ayanId=7',  color: '#20c997', url: trust('assets/reports/adb-validation-yukteshwar.html')  },
      { id: 'truecitra',  label: 'True Citra',   badge: 'ayanId=27', color: '#e83e8c', url: trust('assets/reports/adb-validation-truecitra.html')   },
      { id: 'truepushya', label: 'True Pushya',  badge: 'ayanId=29', color: '#fd7e14', url: trust('assets/reports/adb-validation-truepushya.html')  },
    ];
  }

  get activeUrl(): SafeResourceUrl {
    return this.tabs.find(t => t.id === this.activeTab)!.url;
  }

  select(id: string) {
    this.activeTab = id;
  }
}
