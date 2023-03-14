import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {	
  @Input() position: { top: string, left: string };
  @Input() metadata: { user: { name: string, imageUrl: string } };

  constructor(public activeModal: NgbActiveModal) { }
  
  signOut() {
  }
}