import { Component, OnInit, ViewChild, Input, Output, EventEmitter, TemplateRef, NgZone } from '@angular/core';
import { GoogleMapsAutocompleteService } from '../google-maps-autocomplete.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { HoroscopeService } from '../horoscope.service';
import { ShareService } from '../share.service';
import { User } from '../user';

declare var google; 

@Component({
  selector: 'app-dob',
  templateUrl: './dob.component.html',
  styleUrls: ['./dob.component.scss']
})
export class DobComponent implements OnInit {
//@Input() public user;
@ViewChild('dobMdl', { static: true }) dobMdl: TemplateRef<any>;
@Output() dobMdlLoaded = new EventEmitter<TemplateRef<any>>();
@Output() onSubmitEvent = new EventEmitter<void>();
@Input() userEvent: Observable<User>;
private eventsSubscription: Subscription;
 tob: NgbTimeStruct = {hour: 0, minute: 0, second: 0};
private service: any;
 	day: number;
  mon: number;
  year: number;
  hou: number;
  min: number;
  sec: number;
  autocomplete;
  autocompleteItems;
     //dob: string = '';
   //tob: string = '';
   place: string = '';
   gen: string = '';
   lat: number;
   lng: number;
   dstofset: number;
   timezone: string;
   info: string;
   dob: any;
   //tob: any;
   user: User;
   constructor(private modalService: NgbModal, private googleMapsAutocompleteService: GoogleMapsAutocompleteService, private zone: NgZone, public shareService: ShareService, public horoService: HoroscopeService) {
      this.googleMapsAutocompleteService.getAutocompleteService().then((autoCompleteService) => {
	    this.service = autoCompleteService;
	  })
	  .catch(error => {
        console.error(error);
      });  
	   this.autocompleteItems = [];
		this.autocomplete = {
		  query: ''
		};   
	}
	 ngOnInit() {
		//this.dobMdlLoaded.emit(this.dobMdl);
		this.eventsSubscription = this.userEvent.subscribe((usr) => {
			console.log('user in DobComponent', usr);
			this.user = usr;
		});
	}
	ngAfterViewInit() {
    this.dobMdlLoaded.emit(this.dobMdl);
	console.log('user-ngAfterViewInit', this.user);
  }
  ngOnDestroy() {
		this.eventsSubscription.unsubscribe();
	}
  beforeModalOpen(usr: User) {
    this.user = usr;
  }
	// public openModal() {
	   // this.modalService.open(this.dobMdl).result.then((result) => {
      // console.log('Closed with: ${result}');
    // }, (reason) => {
      // console.log('Dismissed ${this.getDismissReason(reason)}');
    // });
	// }
	 // showDatePicker() {
	// var dt = new Date();
	// if(this.dob != '') {
		// dt.setFullYear(Number(this.dob.split('-')[0]));
		// dt.setMonth(Number(this.dob.split('-')[1])-1);
		// dt.setDate(Number(this.dob.split('-')[2]));
	// }
  // }
   // showTimePicker() {
	// var dt = new Date();
	// if(this.tob != '') {
		// dt.setHours(Number(this.tob.split(':')[0]));
		// dt.setMinutes(Number(this.tob.split(':')[1]));
	 // }
	// }
   async save(evt) {
	evt.stopPropagation();
     this.info = 'please wait...';
	 
	if(this.place.length == 0) {
	    alert('Please enter place of birth');
		return;
		}
	 if(this.gen.length == 0) {
			alert('Please enter gender');
			return;
		}
	if(!this.dob) {
		alert('Please enter date of birth');
		return;
	} 
	if(!this.tob) {
		alert('Please enter time of birth');
		return;
	} 
	// if(this.day == null || this.mon == null || this.year == null) {
		// this.info = 'Please enter date of birth';
		// return;
	// } else {
        // this.dob = this.year.toString()+'-'+ this.mon.toString()+'-'+this.day.toString();
	// }
	
	// if(!this.isValidDate(this.day, this.mon, this.year, this.hou, this.min, (this.sec == null) ? 0 : this.sec)) {
		// this.info = 'Please enter valid date & time';
		// return;
	// }
	this.user.dob = this.dob.year.toString() + '-' + this.dob.month.toString() + '-' + this.dob.day.toString() + 'T' + this.tob.hour.toString() + ':' + this.tob.minute.toString() + ':'  + this.tob.second.toString() + 'L' + this.lat.toString() + ',' + this.lng.toString() + '@' + this.place + '$' + this.timezone + '%' + this.dstofset.toString() + '#' + this.user.name + '&' + this.gen;
	console.log('user.dob', this.user.dob);
	this.shareService.setItem('user', JSON.stringify(this.user));
	this.onSubmitEvent.emit();
   }
    isValidDate(d, m, y, hou, min, sec) {
	  var dt = new Date(y,m,d,hou,min,sec);
	  if (Object.prototype.toString.call(dt) === "[object Date]") {
	  // it is a date
	   if (isNaN(dt.getTime())) {  // dt.valueOf() could also work
		// date is not valid
		return false;
	   } else {
		return true;
	   }
  } 
  return false;
  }
  chooseItem(item: any) {
	this.place = item;
	this.autocomplete.query = item;
    this.geoCode(item);
	this.autocompleteItems = [];
  }
  geoCode(address:any) {
    this.info = 'geocoding..';
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
    this.lat = results[0].geometry.location.lat();
    this.lng = results[0].geometry.location.lng();
    this.horoService.getTimezone(results[0].geometry.location.lat(), results[0].geometry.location.lng(), (Math.round((new Date().getTime())/1000)).toString())
		.subscribe(res2 => {
		   this.timezone = res2['timeZoneId'];
		   this.dstofset = res2['dstOffset'];
		   console.log(res2['timeZoneId']);
		   this.info = '';
		}, (err) => {
		  console.log(err);
		  this.info = err;
		}) ;

   });
  }
	public AddressChange(address: any) {
		//setting address from API to local variable
		if (this.autocomplete.query == '' || this.autocomplete.query.length < 3 || this.autocomplete.query == this.place) {
			this.autocompleteItems = [];
			return;
		}
		console.log('getPlacePredictions');
		let me = this;
		this.service.getPlacePredictions({
			input: this.autocomplete.query,

		}, (predictions, status) => {
		    if (this.autocomplete.query.length >= 3) {
				console.log('getPlacePredictions', predictions);
				me.autocompleteItems = [];

				me.zone.run(() => {
					console.log('zone.run', predictions);
					if (predictions != null) {
						predictions.forEach((prediction) => {
							me.autocompleteItems.push(prediction.description);
						});
					}
				});
			}
		});
	} 	
}
