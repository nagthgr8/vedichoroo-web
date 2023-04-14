import { TestBed } from '@angular/core/testing';

import { GoogleMapsAutocompleteService } from './google-maps-autocomplete.service';

describe('GoogleMapsAutocompleteService', () => {
  let service: GoogleMapsAutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleMapsAutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
