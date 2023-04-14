import { Injectable } from '@angular/core';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private mapScriptLoaded = false;
 // private autocompleteService: any;

  loadMapScript(apiKey: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.mapScriptLoaded) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.onload = () => {
          this.mapScriptLoaded = true;
         // this.autocompleteService = new google.maps.places.AutocompleteService();
          resolve();
        };
        script.onerror = () => {
          reject(new Error('Google Maps API script failed to load'));
        };
        document.head.appendChild(script);
      }
    });
  }

  isMapScriptLoaded(): boolean {
    return this.mapScriptLoaded;
  }

  // getAutocompleteService(): any {
    // if (this.isMapScriptLoaded()) {
      // return this.autocompleteService;
    // } else {
      // throw new Error('Google Maps API script has not been loaded yet');
    // }
  // }
}
