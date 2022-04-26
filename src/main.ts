/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

function bootstrap() {
  function bootstrap() {
    platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));
  };


if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}

};


if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}


