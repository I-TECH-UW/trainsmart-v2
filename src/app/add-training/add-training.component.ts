import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';
import { TrainingTitleComponent } from '../training-title/training-title.component';
import { Location } from '../models/location';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { TrainingService } from '../services/training.service';
import { TrainingCategoryTitleOptions } from '../models/trainingcategorytitleoptions';
import * as _ from 'lodash';
import { TrainingOrganizerOptions } from '../models/trainingorganizeroptions';
import { TrainingLevelOptions } from '../models/trainingleveloptions';
import { MasterItem } from '../models/master-item';
import { TSSYSTEMDATA } from '../systemdata';
import { AlertService } from '../services/alert.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

// import { Location as Loc } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { Training } from '../models/training.interface';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from '../services/master.service';

export interface Topic {
  id: number;
  name: string;
  selected: boolean;
}

export interface TrainingInterval {
  id: number;
  name: string;
  value: string;
}

@Component({
  moduleId: module.id,
  selector: 'app-add-training',
  templateUrl: 'add-training.component.html',
  styleUrls: ['add-training.component.css']
})
export class AddTrainingComponent implements OnInit, OnDestroy {
  id: number;
  public trainingForm: FormGroup;
  training: any;
  bsModalRef: BsModalRef;
  locations: Location[];
  categoryoptions: MasterItem[];
  categorytitleoptions: MasterItem[]; // TrainingCategoryTitleOptions[];
  filteredcategorytitleoptions: MasterItem[]; // TrainingCategoryTitleOptions[];
  trainingorganizeroptions: TrainingOrganizerOptions[];
  trainingleveloptions: TrainingLevelOptions[];
  pepfaroptions: MasterItem[];
  combined: any;
  topicoptions: Topic[] = [
    {id: 1, name: 'Indicator 1', selected: true},
    {id: 1, name: 'Indicator 2', selected: false},
    {id: 1, name: 'Indicator 3', selected: false}
  ];
  trainingintervaloptions: TrainingInterval [] = [
    {id: 1, name: 'Hours', value: 'hour'},
    {id: 2, name: 'Days', value: 'day'},
    {id: 3, name: 'Weeks', value: 'week'}
  ];
  // Determines the variables to be displayed - Varies from one country to the next
  display: any;

  public onClose: Subject<any> = new Subject<any>();

  constructor(private _fb: FormBuilder, private modalService: BsModalService,
    private trainingService: TrainingService, private masterService: MasterService,
    private alertService: AlertService, private toastr: ToastsManager,
    private activatedRoute: ActivatedRoute, private modalRef: BsModalRef) {
    this.loadLookupData();
    this.createForm();
  }

  ngOnInit() {
  }

  /* onSelectionChange(item: TrainingInterval) {
    const control = this.trainingForm.controls['training_length_interval'];
    control.setValue(item.value);
  } */

  createForm() {
    this.display = TSSYSTEMDATA;

    this.trainingForm = this._fb.group({
      id: [0],
      training_category_option_id: [null], // required
      training_title_option_id: [null],
      training_start_date: [null],
      training_end_date: [null],
      bsrangevalue: [null], // required
      training_length_value: [null, [Validators.minLength(1)]], // required
      training_length_interval: [null], // required
      training_organizer_option_id: [null],
      training_location_id: [null],
      training_level_option_id: [null],
      has_known_participants: [null],
      // pepfar: this._fb.array([]),
      /* topics: [null],
      tot: [null], // NI
      refreshercourse: [null], // NI
      funding: this._fb.array([]), // NI
      fundercomment: [''] */
    });

    this.trainingForm.get('bsrangevalue').valueChanges.subscribe(
      change => {
      const start_date = <FormControl>this.trainingForm.controls['training_start_date'];
      const end_date = <FormControl>this.trainingForm.controls['training_end_date'];
        if (change) {
          start_date.setValue(this.createDate(change[0]));
          end_date.setValue(this.createDate(change[1]));
        } else {
          start_date.setValue(null);
          end_date.setValue(null);
      }
      }
    );

    this.trainingForm.get('id').valueChanges.subscribe(
      id => {
        if (this.id !== id && +id > 0) {
          this.id = +id;
          this.populateForm(id);
        }
      }
    );

    this.trainingForm.get('training_category_option_id').valueChanges.subscribe(
      value => {
        this.onProgramAreaChanged(value);
      }
    );
    /*
    this.rForm.get('validate').valueChanges.subscribe(

      (validate) => {

          if (validate == '1') {
              this.rForm.get('name').setValidators([Validators.required, Validators.minLength(3)]);
              this.titleAlert = 'You need to specify at least 3 characters';
          } else {
              this.rForm.get('name').setValidators(Validators.required);
          }
          this.rForm.get('name').updateValueAndValidity();

      });
      */
  }

  createDate(val: string) {
    const dt = new Date(val);
    return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
  }

  loadLookupData() {
    this.combined = this.trainingService.getCachedData();

    this.combined.subscribe(values => {
      const [locations, categoryoptions, categorytitleoptions, trainingorganizeroptions, trainingleveloptions, pepfaroptions] = values;
      this.locations = <Location[]>locations;
      this.categoryoptions = <MasterItem[]>categoryoptions;
      this.categorytitleoptions = <MasterItem[]>categorytitleoptions;
      this.filteredcategorytitleoptions = <MasterItem[]>categorytitleoptions;
      this.trainingorganizeroptions = <TrainingOrganizerOptions[]>trainingorganizeroptions;
      this.trainingleveloptions = <TrainingLevelOptions[]>trainingleveloptions;
      this.pepfaroptions = <MasterItem[]>pepfaroptions;
    });
  }

  populateForm(id: number) {
    if (id > 0) {
      this.trainingService.getTraining(id).subscribe(
        item => {
          this.trainingForm.patchValue(new Training(item));
        }
      );
    }
  }

  initPepfarIndicator() {
    return this._fb.group({
      pepfarid: [null],
      pepfardays: [null]
    });
  }

  addPepfarIndicator() {
    const control = <FormArray>this.trainingForm.controls['pepfar'];
    control.push(this.initPepfarIndicator());
  }

  removePepfarIndicator(id: number) {
    const control = <FormArray>this.trainingForm.controls['pepfar'];
    control.removeAt(id);
  }

  prepareSaveTraining() {
    return new Training(this.trainingForm.value);
  }

  onSubmit() {
    // comments, got_comments, objectives, is_approved, is_tot, is_refresher, is_deleted, timestamp_updated, timestamp_created,
    const training = this.prepareSaveTraining();

    // this.alertService.success('Implement successful submission');
    this.trainingService.addTraining(training).subscribe(
      item => {
        this.toastr.success('Successfully added trainining', 'Success!');
        this.onClose.next(true);
        this.modalRef.hide();
      }
    );
  }

  onCancel() {
    this.onClose.next(false);
    this.modalRef.hide();
  }

  openAddTrainingTitleModal() {
    // By default the training title is linked to the program area
    const programareaid = 1 || 0;
    this.bsModalRef = this.modalService.show(TrainingTitleComponent, { class: 'modal-md' });
    (<TrainingTitleComponent>this.bsModalRef.content).onClose.subscribe(result => {
      console.log(result);
      if (result) {
        const item = new MasterItem(result);
        console.log(item);
        this.masterService.addTrainingTitle(item).subscribe(
          obj => {
            obj.is_selected = true;
            this.categorytitleoptions.push(obj);
            this.toastr.success('Training title has successfully been added.', 'Training Title');
            console.log('Added ', obj);
          }
        );
      }
    }) ;

  }
  onProgramAreaChange(event) {}

  onProgramAreaChanged(id: number) {
     // id = +this.trainingForm.get('training_category_option_id').value;
    const fulllist = Object.assign({}, this.categorytitleoptions);
    if (+id === 0) {
      this.filteredcategorytitleoptions = this.categorytitleoptions;
    }else {
      this.filteredcategorytitleoptions = _.filter(fulllist, {'parent_id': +id});
    }
    // set training_title_option_id to null as the options have changed
    const control = <FormControl>(this.trainingForm.controls['training_title_option_id']);
    control.setValue(null);
  }

  ngOnDestroy() {
  }

}
