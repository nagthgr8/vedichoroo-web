import { Component, OnInit } from '@angular/core';
import { HoroscopeService } from '../horoscope.service';
import { ShareService } from '../share.service';
import { Location } from '../location';
import { Panchang } from '../panchang';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	showHM = false;
  showLD = true;
  bal: number;
  panchang: Panchang = null;
  vedicStories: any[] = [];
  constructor(private horoService: HoroscopeService, private shareService: ShareService) {
  }
  ngOnDestroy() {
  }
  ngOnInit(): void {
    this.showLD = false;
    this.loadVedicStories();
    this.shareService.getItem('vho:loc').then((loc: Location) => {
      if (!loc) throw new Error('no cached location');
      this.loadPanchang(loc);
    }).catch(() => {
      this.horoService.getIP().subscribe(res => {
        let loc: Location = {
          latitude: res['latitude'],
          longitude: res['longitude'],
          country_code: res['country_code_iso3'],
          place: res['city'] + ',' + res['region'] + ',' + res['country_name']
        };
        this.shareService.setItem('vho:loc', JSON.stringify(loc));
        this.loadPanchang(loc);
      }, (err) => {
        console.log('getIP error', err);
      });
    });
  }
  loadPanchang(loc: Location) {
    let ayn = this.shareService.getAYNM();
    let ayanid: number = ayn ? Number(ayn) : 4;
    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let latlng = loc.latitude + '|' + loc.longitude;
    this.horoService.getPanchang(latlng, timezone, ayanid).subscribe(res => {
      this.panchang = res;
    }, (err) => {
      console.log('getPanchang error', err);
    });
  }
  loadVedicStories() {
    this.horoService.getVedicStories().subscribe((res: any) => {
      this.vedicStories = res?.articles || [];
    }, (err) => {
      console.log('getVedicStories error', err);
      this.vedicStories = [];
    });
  }
}
