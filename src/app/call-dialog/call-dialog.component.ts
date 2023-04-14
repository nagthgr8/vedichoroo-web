import { Component } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-call-dialog',
  templateUrl: './call-dialog.component.html',
  styleUrls: ['./call-dialog.component.scss']
})
export class CallDialogComponent {
  constructor(private activeModal: NgbActiveModal) {}

  onClose(response: string): void {
    this.activeModal.close(response);
  }
}