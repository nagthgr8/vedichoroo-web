import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent {
  @Input() name: string;
  @Input() imageUrl: string;
  

  //onImageClick() {
    //this.imageClick.emit();
  //}
  get initials(): string {
    if (!this.name) return '';

    const parts = this.name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
  }
}
