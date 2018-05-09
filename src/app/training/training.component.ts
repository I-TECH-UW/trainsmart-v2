import { Component, ViewEncapsulation, OnInit , OnDestroy, TemplateRef, AfterViewInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import { TrainingService, TrainingList, MasterItem, TrainingOrganizerOptions, 
  TrainingLevelOptions, TSLocation, AuthUser, AuthenticationService, 
  ReportService, SharedService
} from '../shared';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { AddTrainingComponent } from '../add-training/add-training.component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { TSSYSTEMDATA } from '../systemdata';
import { ScoreComponent } from '../score/score.component';
import { CompleteTrainingComponent } from '../complete-training/complete-training.component';
import { DataTable } from 'angular5-data-table';
import { ActivatedRoute } from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'app-training',
  templateUrl: 'training.component.html',
  styleUrls: ['training.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TrainingComponent implements OnInit, OnDestroy, AfterViewInit {
  authUser:AuthUser;
  options: string [];
  bsModalRef: BsModalRef;
  trainings: TrainingList[] = [];
  subscription: Subscription = new Subscription();

  searchForm: FormGroup;
  searchField: FormControl;
  advancedForm: FormGroup;
  display: any;
  //
  locations: TSLocation[];
  categoryoptions: MasterItem[];
  subcategoryoptions: MasterItem[];
  filteredsubcategoryoptions: MasterItem[];
  titleoptions: MasterItem[];
  filteredtitleoptions: MasterItem[];
  trainingorganizeroptions: TrainingOrganizerOptions[];
  trainingleveloptions: TrainingLevelOptions[];
  pepfaroptions: MasterItem[];
  combined: any;
  advancedSearch: string;

  items = [];
  itemCount = 0;
  @ViewChild(DataTable) trainingTable: DataTable;

  constructor(private trainingService: TrainingService, private toastr: ToastsManager,
              private modalService: BsModalService, private translate: TranslateService,
              private fb: FormBuilder, public auth: AuthenticationService,
              private reportService: ReportService, private sharedService:SharedService,
              private route:ActivatedRoute) {
    this.options = ['Pending', 'Approve', 'Reject'];
                
    this.searchField = new FormControl('');
    this.searchForm = this.fb.group({searchText: this.searchField});

    this.searchField.valueChanges
    .debounceTime(400)
    .switchMap(term => {
      this.advancedSearch = '';
      this.trainingTable.page = 1;
      return []
    })
    .subscribe(
      result => {}
    );

    this.createAdvancedForm();
  }

  reloadItems(params) {
    const search = this.advancedSearch || this.searchField.value; //this.searchForm.get('searchText').value;
    const refinedSearch = this.advancedSearch !== '' ? 1 : 0;
    this.trainingService.getTrainingList(params, search, refinedSearch).subscribe(
      res => {
        this.items = res.items;
        this.itemCount = res.itemCount;
      }
    );
  }

  rowTooltip(item) { return `ID: ${item.id}`; }
  
  ngAfterViewInit(): void {
  }

  createAdvancedForm() {
    this.display = TSSYSTEMDATA;

    this.advancedForm = this.fb.group({
      training_category_option_id: [null],
      training_sub_category_option_id: [null],
      training_title_option_id: [null],
      training_organizer_option_id: [null],
      training_level_option_id: [null],
      training_start_date: [null],
    });
  }

  loadLookupData() {
    this.combined = this.trainingService.getCachedData();

    this.combined.subscribe(values => {
      const [locations, categoryoptions, subcategoryoptions, titleoptions, trainingorganizeroptions,
        trainingleveloptions, pepfaroptions] = values;
      this.locations = <TSLocation[]>locations;
      this.categoryoptions = <MasterItem[]>categoryoptions;
      this.subcategoryoptions = <MasterItem[]>subcategoryoptions;
      this.filteredsubcategoryoptions = <MasterItem[]>subcategoryoptions;
      this.titleoptions = <MasterItem[]>titleoptions;
      this.filteredtitleoptions = <MasterItem[]>titleoptions;
      this.trainingorganizeroptions = <TrainingOrganizerOptions[]>trainingorganizeroptions;
      this.trainingleveloptions = <TrainingLevelOptions[]>trainingleveloptions;
      this.pepfaroptions = <MasterItem[]>pepfaroptions;
    });
  }
  
  ngOnInit() {
    this.auth.currentUser.subscribe(
      authuser => {
        this.authUser = authuser;
      }
    );

    this.refresh();
    this.loadLookupData();

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if(params['review'] == 'true') {
        //Search for the training to review for display
        this.searchField.setValue(id);
      }
    });
  }

  openAdvancedSearch(template: TemplateRef<any>) {
    const config = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.bsModalRef = this.modalService.show(template, Object.assign({}, config));
  }

  addTraining(id: number = 0) {
    this.bsModalRef = this.modalService.show(AddTrainingComponent, { class: 'modal-lg', backdrop: 'static' });
    const control = <FormControl>this.bsModalRef.content.trainingForm.controls['id'];
    control.setValue(id);
    (<AddTrainingComponent>this.bsModalRef.content).onClose.subscribe(result => {
      if (result) {
        // Reload data
        this.reloadItems(this.trainingTable.displayParams);
      }
    }) ;
  }

  refresh() {
    // reset the searchtext to '' - will trigger a reload
    this.searchField.setValue('');
    this.advancedSearch = '';
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
          this.trainingService.deleteTraining(item.id).subscribe(() => this.reloadItems(this.trainingTable.displayParams));
          this.toastr.info('The selected record was successfully deleted.', 'Record Deleted');
        }
      })
    );
  }

  view(training_id:number) {
    this.reportService.getActivityReport(training_id).subscribe(
      (result: any) => {
        //this.innerHtml = result;
      }
    );
  }

  downloadPDF(trainingid: number, preview: number = 0, previewid = 0) {
    
    this.trainingService.downloadPDF(trainingid, preview, previewid).subscribe(
      data => {
        if (data && preview) {
          const tab = window.open();
          const fileUrl = URL.createObjectURL(data);
          tab.location.href = fileUrl;
        }else {
          this.toastr.warning('No preview is available.', 'Preview PDF File');
        }
      }
    );
  }

  printTraining(id: number) {
    const tab = window.open();
    this.trainingService.printTraining(id).subscribe(
      data => {
        if (data) {
          const fileUrl = URL.createObjectURL(data);
          tab.location.href = fileUrl;
        }else {
          this.toastr.warning('No preview is available.', 'Print Training PDF File');
        }
      }
    );
  }

  /* Handle Approve and Reject Buttons */
  process(choice: number, training: TrainingList) {
    // Pending - 0, Approve - 1, Reject - 2
    const x = {
      isapproved: +choice,
      type: this.options[+choice],
      item: training
    };

    this.approve(x);
  }

  approve(obj: any) {
    const item = <TrainingList>obj.item;
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, { class: 'modal-md' });
    this.bsModalRef.content.type = obj.type.toUpperCase(); // Must be in uppercase
    this.bsModalRef.content.appendinfo = item.trainingtitle.toUpperCase();
    this.bsModalRef.content.to_comment = true;
    this.subscription.add(
      (<ConfirmModalComponent>this.bsModalRef.content).onClose.subscribe(result => {
        if (result && result.resp) {
          const detail = {
            training_id: item.id,
            is_approved: (obj.type.toLowerCase() === 'approve' ? 1 : 2),
            comment: (result.comment ? result.comment : '')
          };
          this.trainingService.approveTraining(detail).subscribe(response => {
            if(response) {
              this.toastr.info(`The Training Record ID: ${item.id} status has been successfully updated.`, 'Training ' + (obj.isapproved == 1 ? obj.type + 'd' : obj.type + 'ed'));
              this.reloadItems(this.trainingTable.displayParams);
            }
          });
        }
      })
    );
  }
  /* End Handle Aprrove and Reject Buttons */

  score(training: TrainingList) {
    const total = training.mentees + training.mentors;

    if(total === 0 || training.mentees === 0 || training.mentors === 0) {
      this.toastr.warning('Please enter participant and trainer information to proceed','Missing Participants/Trainers');
      return;
    }

    this.bsModalRef = this.modalService.show(ScoreComponent, { class: 'modal-lg', backdrop: 'static' });
    const control = <FormControl>this.bsModalRef.content.scoreForm.controls['id'];
    control.setValue(training.id);
    (<ScoreComponent>this.bsModalRef.content).onClose.subscribe(result => {
      if (result) {
        // Reload data
        this.reloadItems(this.trainingTable.displayParams);
      }
    }) ;
  }

  complete(training: TrainingList) {
    const total = training.mentees + training.mentors;
    if(total === 0 || training.mentees === 0 || training.mentors === 0) {
      this.toastr.warning('Please enter participant and trainer information to proceed','Missing Participants/Trainers');
      return;
    }

    this.bsModalRef = this.modalService.show(CompleteTrainingComponent, { class: 'modal-lg', backdrop: 'static' });
    const control = <FormControl>this.bsModalRef.content.completeForm.controls['id'];
    control.setValue(training.id);
    (<CompleteTrainingComponent>this.bsModalRef.content).onClose.subscribe(result => {
      if (result) {
        // Reload data
        this.reloadItems(this.trainingTable.displayParams);
      }
    }) ;
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

  /**
   * Advanced Search Functions
   */
  search() {
    // Prepare search
    const form = this.advancedForm.value;
   
    let startdate = form.training_start_date ? this.sharedService.prepareDate(form.training_start_date) : null;
    let searchText = `&training_category_option_id=${form.training_category_option_id}`;
    searchText += `&training_sub_category_option_id=${form.training_sub_category_option_id}`;
    searchText += `&training_title_option_id=${form.training_title_option_id}`;
    searchText += `&training_organizer_option_id=${form.training_organizer_option_id}`;
    searchText += `&training_level_option_id=${form.training_level_option_id}`;
    searchText += `&training_start_date=${startdate}`;

    this.advancedSearch = searchText;
    this.advancedForm.reset();
    //this.loadData(searchText);
    this.reloadItems(this.trainingTable.displayParams);
    this.bsModalRef.hide();
  }

  cancelSearch() {
    this.bsModalRef.hide();
  }
   /**
    * End Advanced Search Functions
    */
}
