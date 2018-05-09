import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {
  public onClose: Subject<any> = new Subject<any>();
  public type: string;
  public appendinfo: string;
  public to_comment: boolean = false;
  comment: string = null;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {}

  yesClicked() {
    if(this.to_comment){
      this.onClose.next({resp: true, comment: this.comment});
    }else{
      this.onClose.next(true);
    }
    this.bsModalRef.hide();
  }

  noClicked() {
    this.onClose.next(null);
    this.bsModalRef.hide();
  }

}
