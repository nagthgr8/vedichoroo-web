import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GoogleMapsService } from './google-maps.service';
declare var google; 

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsAutocompleteService {
  private autocompleteService: any;

  constructor(private googleMapsService: GoogleMapsService) {
    this.googleMapsService.loadMapScript(environment.apiKey).then(() => {
      if (google.maps && google.maps.places) {
        this.autocompleteService = new google.maps.places.AutocompleteService();
      } else {
        console.error('Google Maps API not loaded or places library not available');
      }
    }).catch(error => {
      console.error(error);
    });
  }

  getAutocompleteService(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (this.autocompleteService) {
      resolve(this.autocompleteService);
    } else {
      this.googleMapsService.loadMapScript(environment.apiKey).then(() => {
        this.autocompleteService = new google.maps.places.AutocompleteService();
        resolve(this.autocompleteService);
      }).catch(error => {
        reject(error);
      });
    }
  });
}

}
