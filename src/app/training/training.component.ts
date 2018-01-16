import { Component, ViewEncapsulation, OnInit , OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';
import { TrainingList } from '../models/training-list';
import { Subject } from 'rxjs/Subject';
import { TrainingService } from '../services/training.service';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { AddTrainingComponent } from '../add-training/add-training.component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';


@Component({
  moduleId: module.id,
  selector: 'app-training',
  templateUrl: 'training.component.html',
  styleUrls: ['training.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TrainingComponent implements OnInit, OnDestroy {
  bsModalRef: BsModalRef;
  trainings: TrainingList[] = [];
  subscription: Subscription = new Subscription();
  // For pagination
  maxSize: number;
  totalItems: number;
  currentPage: number;
  numPages: number;
  itemsPerPage: number;
  searchForm: FormGroup;

  constructor(private trainingService: TrainingService, private toastr: ToastsManager,
              private modalService: BsModalService, private translate: TranslateService,
              private fb: FormBuilder) {
                this.maxSize = 25;
                this.totalItems = 175;
                this.currentPage = 1;
                this.numPages = 20;
                this.itemsPerPage = 10;

                this.searchForm = this.fb.group({
                  size: [null]
                });
  }

  ngOnInit() {
    this.loadData();
  }

  pageChanged(event: any): void {
    if (event.page !== this.currentPage) {
      this.currentPage = event.page;
      this.loadData();
    }
  }

  private loadData() {
    this.subscription.add(this.trainingService.getTrainingList(this.currentPage, this.itemsPerPage).subscribe(
      result => {
        this.trainings = result.items;
        this.totalItems = result.total;
      }
    ));
  }

  addTraining(id: number = 0) {
    this.bsModalRef = this.modalService.show(AddTrainingComponent, { class: 'modal-lg', backdrop: 'static' });
    const control = <FormControl>this.bsModalRef.content.trainingForm.controls['id'];
    control.setValue(id);
    (<AddTrainingComponent>this.bsModalRef.content).onClose.subscribe(result => {
      if (result) {
        // Reload data
        this.loadData();
      }
    }) ;
  }

  refresh() {
    this.loadData();
  }

  edit(item: TrainingList) {
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, { class: 'modal-md' });
    this.bsModalRef.content.type = 'EDIT'; // Must be in uppercase
    this.bsModalRef.content.appendinfo = item.trainingtitle.toUpperCase();
    this.subscription.add(
      (<ConfirmModalComponent>this.bsModalRef.content).onClose.subscribe(result => {
        if (result) {
          this.toastr.info('Edit Item ID: ' + item.id, 'Implement Edit');
        }
      })
    );
  }

  delete(item: TrainingList) {
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, { class: 'modal-md' });
    this.bsModalRef.content.type = 'DELETE'; // Must be in uppercase
    this.bsModalRef.content.appendinfo = item.trainingtitle.toUpperCase();
    this.subscription.add(
      (<ConfirmModalComponent>this.bsModalRef.content).onClose.subscribe(result => {
        if (result) {
          this.trainingService.deleteTraining(item.id).subscribe(() => this.loadData());
          this.toastr.info('The selected record was successfully deleted.', 'Record Deleted');
        }
      })
    );
  }

  approve(obj: any) {
    const item = <TrainingList>obj.item;
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, { class: 'modal-md' });
    this.bsModalRef.content.type = obj.type.toUpperCase(); // Must be in uppercase
    this.bsModalRef.content.appendinfo = item.trainingtitle.toUpperCase();
    this.subscription.add(
      (<ConfirmModalComponent>this.bsModalRef.content).onClose.subscribe(result => {
        if (result) {
          this.toastr.info(obj.type + ' Record ID: ' + item.id, 'Implement Approve Training');
          item.statusid = +obj.isapproved;
        }
      })
    );
  }

  getColorCode(statusid) {
    switch (statusid) {
      case 0:
        return 'blue'; // Pending
      case 1:
        return 'green'; // Approved
      case 2:
        return 'red'; // Rejected
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }
}
