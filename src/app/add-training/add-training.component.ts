import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';
import { TrainingTitleComponent } from '../training-title/training-title.component';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import * as _ from 'lodash';
import { TSSYSTEMDATA } from '../systemdata';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';
import { SharedService, TrainingService, MasterService, AlertService,
         TSLocation, TrainingCategoryTitleOptions, TrainingOrganizerOptions, 
         TrainingLevelOptions,MasterItem, Training
       } from '../shared';
import { AddPersonComponent } from '../add-person/add-person.component';
import { Subscription } from 'rxjs/Subscription';

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
export class AddTrainingComponent implements OnInit, OnDestroy, AfterViewInit {
  id: number;
  public trainingForm: FormGroup;
  subscription: Subscription = new Subscription();
  idcollection: string;
  training: any;
  bsModalRef: BsModalRef;
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
  locationtype: any[] = [
    {id: 1, name: 'Health Facility'},
    {id: 2, name: 'Other'}
  ];
  cpdreadonly = false;

  // Determines the variables to be displayed - Varies from one country to the next
  display: any;

  public onClose: Subject<any> = new Subject<any>();

  constructor(private _fb: FormBuilder, private modalService: BsModalService,
    private trainingService: TrainingService, private masterService: MasterService,
    private alertService: AlertService, private toastr: ToastsManager,
    private activatedRoute: ActivatedRoute, private modalRef: BsModalRef,
    private sharedService: SharedService) {
    this.idcollection = '0';
    this.loadLookupData();
    this.createForm();
  }

  getTrainers(): number {
    return (<FormArray>(this.trainingForm.get('trainers'))).length;
  }

  getParticipants(): number {
    return (<FormArray>this.trainingForm.get('participants')).length;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.onValueChanges();
  }

  createForm() {
    this.display = TSSYSTEMDATA;

    this.trainingForm = this._fb.group({
      id: [0],
      training_category_option_id: [null], // required
      training_sub_category_option_id: [null],
      training_title_option_id: [null],
      cpd: [null],
      training_start_date: [null],
      training_end_date: [null],
      bsrangevalue: [null], // required
      training_length_value: [null, [Validators.minLength(1)]], // required
      training_length_interval: [null], // required
      training_organizer_option_id: [null],
      training_location_id: [null],
      training_level_option_id: [null],
      has_known_participants: [null],
      participants: this._fb.array([]),
      trainers: this._fb.array([]),
      training_location_type: [null],
      mfl_name: [null],
      other_location_region: [null],
      other_location: [null],
      // pepfar: this._fb.array([]),
      /* topics: [null],
      tot: [null], // NI
      refreshercourse: [null], // NI
      funding: this._fb.array([]), // NI
      fundercomment: ['']
      */
    });

    //this.onValueChanges();
  }

  getFormValidationErrors() {
    const errors = [];
    Object.keys(this.trainingForm.controls).forEach(key => {
      errors.push({key: key, error: this.trainingForm.get(key).errors});
    });
    return errors;
  }

  onValueChanges() {
    // DO NOT DELETE,  WORKS WELL WITH RANGE VALUE
    /* this.trainingForm.get('bsrangevalue').valueChanges.subscribe(
      change => {
      const start_date = <FormControl>this.trainingForm.controls['training_start_date'];
      const end_date = <FormControl>this.trainingForm.controls['training_end_date'];
        if (change) {
          start_date.setValue(this.sharedService.prepareDate(change[0]));
          end_date.setValue(this.sharedService.prepareDate(change[1]));
        } else {
          start_date.setValue(null);
          end_date.setValue(null);
      }
      }
    ); */

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
        this.onCategoryChanged(value);
      }
    );

    this.trainingForm.get('training_sub_category_option_id').valueChanges.subscribe(
      value => {
        this.onSubCategoryChanged(value);
      }
    );

    this.trainingForm.get('training_title_option_id').valueChanges.subscribe(
      value => {
        this.onTitleChanged(value);
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

  get training_location_type() {
    return this.trainingForm.get('training_location_type') as FormControl;
  }

  get mfl_name() {
    return this.trainingForm.get('mfl_name') as FormControl;
  }

  get training_location_id() {
    return this.trainingForm.get('training_location_id') as FormControl;
  }

  get other_location_region() {
    return this.trainingForm.get('other_location_region') as FormControl;
  }

  get other_location() {
    return this.trainingForm.get('other_location') as FormControl;
  }

  loadLookupData() {
    this.combined = this.trainingService.getCachedData();

    this.subscription.add(this.combined.subscribe(values => {
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
    }));
  }

  get participants() {
    return this.trainingForm.get('participants') as FormArray;
  }

  get trainers() {
    return this.trainingForm.get('trainers') as FormArray;
  }

  populateForm(id: number) {
    if (id > 0) {
      this.subscription.add(this.trainingService.getTraining(id).subscribe(
        item => {
          this.training = item;

          const newitem = new Training(item);
          this.trainingForm.patchValue(newitem);

          if (newitem.trainers) {
            for (const trainer of newitem.trainers) {
              this.trainers.push(new FormControl(trainer));
            }
          }

          if (newitem.participants) {
            for (const participant of newitem.participants) {
              this.participants.push(new FormControl(participant));
            }
          }
        }
      ));
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
    this.subscription.add(this.trainingService.addTraining(training).subscribe(
      item => {
        if (item && item.id) {
          this.toastr.success('Successfully added trainining', 'Success!');
          this.onClose.next(true);
          this.modalRef.hide();
        }else {
          this.toastr.error('An error occured while saving record. Please try again.', 'Error!');
        }
      }
    ));
  }

  onCancel() {
    this.onClose.next(false);
    this.modalRef.hide();
  }

  openAddTrainingTitleModal() {
    // By default the training title is linked to the program area
    const programareaid = 1 || 0;
    this.bsModalRef = this.modalService.show(TrainingTitleComponent, { class: 'modal-md' });
    this.subscription.add((<TrainingTitleComponent>this.bsModalRef.content).onClose.subscribe(result => {
      if (result) {
        const item = new MasterItem(result);
        this.masterService.addTrainingTitle(item).subscribe(
          obj => {
            obj.is_selected = true;
            this.titleoptions.push(obj);
            this.toastr.success('Training title has successfully been added.', 'Training Title');
          }
        );
      }
    }));
  }

  openAddTrainingSubTitleModal() {}

  // onProgramAreaChange(event) {}

  onCategoryChanged(id: number) {
     // id = +this.trainingForm.get('training_category_option_id').value;
    const fulllist = Object.assign({}, this.subcategoryoptions);
    if (+id === 0) {
      this.filteredsubcategoryoptions = this.subcategoryoptions;
    }else {
      this.filteredsubcategoryoptions = _.filter(fulllist, {'parent_id': +id});
    }
    // set training_title_option_id to null as the options have changed
    const control = <FormControl>(this.trainingForm.controls['training_sub_category_option_id']);
    control.setValue(null);
  }

  onSubCategoryChanged(id: number) {
    // id = +this.trainingForm.get('training_category_option_id').value;
   const fulllist = Object.assign({}, this.titleoptions);
   if (+id === 0) {
     this.filteredtitleoptions = this.titleoptions;
   }else {
     this.filteredtitleoptions = _.filter(fulllist, {'parent_id': +id});
   }
   // set training_title_option_id to null as the options have changed
   const control = <FormControl>(this.trainingForm.controls['training_title_option_id']);
   control.setValue(null);
  }

  onTitleChanged(id: number) {
    const fulllist = Object.assign({}, this.titleoptions);
    const item: MasterItem = <MasterItem>_.find(fulllist, {'id': +id});
    
    const control = <FormControl>(this.trainingForm.controls['cpd']);
    if (item && item.cpd) {
      this.cpdreadonly = true;
      control.setValue(item.cpd);
    }else {
      this.cpdreadonly = false;
      control.setValue(null);
    }
  }

  updateIDCollection(data) {
    this.idcollection = data ? data : 0;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
