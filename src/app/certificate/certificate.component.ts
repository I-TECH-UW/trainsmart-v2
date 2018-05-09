import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { TrainingService, TrainingList, AuthUser, AuthenticationService, ReportService } from '../shared';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ToastsManager } from 'ng2-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CertifyComponent } from '../certify/certify.component';
import { DataTable } from 'angular5-data-table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit, OnDestroy  {
  authUser:AuthUser;
  bsModalRef: BsModalRef;
  trainings: TrainingList[] = [];
  subscription: Subscription = new Subscription();
  searchForm: FormGroup;
  searchField: FormControl;

  advancedSearch: string;

  items = [];
  itemCount = 0;
  @ViewChild(DataTable) certificateTable: DataTable;

  data: any;

  constructor(private trainingService: TrainingService, private toastr: ToastsManager,
    private modalService: BsModalService, private translate: TranslateService,
    private fb: FormBuilder, public auth: AuthenticationService,
    private reportService: ReportService, private route:ActivatedRoute) { 
      this.data = this.route.snapshot.data;

    this.searchField = new FormControl('');
    this.searchForm = this.fb.group({searchText: this.searchField});

    this.searchField.valueChanges
    .debounceTime(400)
    .switchMap(term => {
      this.advancedSearch = '';
      this.certificateTable.page = 1;
      return [];
    })
    .subscribe(
      result => {}
    );
  }

  reloadItems(params) {
    const search = this.advancedSearch || this.searchField.value;
    const refinedSearch = this.advancedSearch !== '' ? 1 : 0;
    this.trainingService.getCompletedTrainingList(params, search, refinedSearch).subscribe(
      res => {
        this.items = res.items;
        this.itemCount = res.itemCount;
      }
    );
  }

  rowTooltip(item) {
    return `ID: ${item.id}`;
  }

  ngOnInit() {
    this.auth.currentUser.subscribe(
      authuser => {
        this.authUser = authuser;
      }
    );
    
    this.refresh();
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      this.searchField.setValue(id);
      if(params['certify'] == 'true') {
        //Launch Modal Here
        this.certify(+id);
      }else if(params['sign'] == 'true') {
        //Launch Modal Here
        this.signCertificates(+id);
      }
    });
  }

  refresh() {
    // reset the searchtext to '' - will trigger a reload
    this.searchField.setValue('');
    this.advancedSearch = '';
  }

  view(training_id:number) {
    this.reportService.getActivityReport(training_id).subscribe(
      (result: any) => {
        //this.innerHtml = result;
      }
    );
  }

  review(item: TrainingList) {
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, { class: 'modal-md' });
    this.bsModalRef.content.type = 'REVIEW'; // Must be in uppercase
    this.bsModalRef.content.appendinfo = item.trainingtitle.toUpperCase();
    this.subscription.add(
      (<ConfirmModalComponent>this.bsModalRef.content).onClose.subscribe(result => {
        if (result) {
          this.trainingService.reviewTraining(item.id).subscribe(response => {
            if(response) {
              this.toastr.info('The record has been successfully returned for review.','Record Returned for Review');
              this.reloadItems(this.certificateTable.displayParams);
            }
          });
        }
      })
    );
  }

  signCertificates(id:number, type:number = 2) {
    this.certify(id, type);
  }

  certify(id: number, type: number = 1) {
    this.bsModalRef = this.modalService.show(CertifyComponent, { class: 'modal-lg', backdrop: 'static' });
    const control = <FormControl>this.bsModalRef.content.certifyForm.controls['id'];
    const ctl = <FormControl>this.bsModalRef.content.certifyForm.controls['type'];
    control.setValue(id);
    ctl.setValue(type);
    (<CertifyComponent>this.bsModalRef.content).onClose.subscribe(result => {
      if (result) {
        // Reload data
        this.reloadItems(this.certificateTable.displayParams);
      }
    }) ;
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }

}
