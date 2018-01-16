import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {
  public onClose: Subject<any>;
  public type: string;
  public appendinfo: string;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

  yesClicked() {
    this.onClose.next(true);
    this.bsModalRef.hide();
  }

  noClicked() {
    this.onClose.next(null);
    this.bsModalRef.hide();
  }

}
