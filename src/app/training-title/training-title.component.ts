import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-training-title',
  templateUrl: './training-title.component.html',
  styleUrls: ['./training-title.component.css']
})
export class TrainingTitleComponent implements OnInit {
  editableForm: FormGroup;

  public onClose: Subject<any>;

  constructor(public bsModalRef: BsModalRef, private fb: FormBuilder) {
    this.editableForm = this.fb.group({
      id: [0],
      name: [null, Validators.required],
      categoryid: [null]
    });
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  onCancel() {
    this.onClose.next(null);
    this.bsModalRef.hide();
  }

  onSubmit() {
    this.onClose.next(this.editableForm.value);
    this.bsModalRef.hide();
  }

}
