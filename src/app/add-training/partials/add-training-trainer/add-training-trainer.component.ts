import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { TrainingService } from '../../../shared';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMatch, BsModalRef, BsModalService } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { AddPersonComponent } from '../../../add-person/add-person.component';

@Component({
  selector: 'app-add-training-trainer',
  templateUrl: './add-training-trainer.component.html',
  styleUrls: ['./add-training-trainer.component.css']
})
export class AddTrainingTrainerComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() idcollection: string;
  @Output() event: EventEmitter<string> = new EventEmitter();
  searchForm: FormGroup;
  dataSource: Observable<any>;
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  selectedTrainer: any;
  bsModalRef: BsModalRef;

  constructor(private fb: FormBuilder, private trainingService: TrainingService, private modalService: BsModalService) {
    this.searchForm = this.fb.group({
      fullname: ['']
    });
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.searchForm.controls['fullname'].value);
    }).mergeMap((token: string) => this.trainingService.getPerson(token, this.idcollection));
  }

  ngOnInit() {}

  getTrainers() {
    return (<FormArray>this.form.get('trainers')).length
  }

  initTrainer(item) {
    return this.fb.group({
      id: [0],
      trainer_id: [item.trainer_id],
      first_name: [item.first_name],
      middle_name: [item.middle_name],
      last_name: [item.last_name],
      qualification_phrase: [item.qualification_phrase],
      approved: [1]
    });
  }

  get trainers() {
    return this.form.get('trainers') as FormArray;
  }

  insertTrainer(id: number = 0) {
    if (this.selectedTrainer) {
      if(id > 0) { // Newlly added person/participant
        // Replace existing values
        Object.keys(this.trainers.controls).forEach(key => {
          if(this.trainers.get(key).value.trainer_id === id) {
            this.trainers.get(key).patchValue(this.selectedTrainer);

          }
        });
      }else{
        this.trainers.push(this.initTrainer(this.selectedTrainer));
        this.updateCollectionIDs();
      }      

      this.selectedTrainer = null;
      this.searchForm.controls['fullname'].setValue('');
    }
  }

  removeTrainer(id: number) {
    this.trainers.removeAt(id);
    this.updateCollectionIDs();
  }

  clearTrainers() {
    while (this.trainers.controls.length > 0) {
      this.trainers.removeAt(0);
    }
    this.updateCollectionIDs();
  }

  updateCollectionIDs() {
    const participants = this.form.controls.participants.value;
    const trainers = this.form.controls.trainers.value;
    const ids: string[] = [];
    // In participants
    _.forEach(participants, (value, key) => {
      ids.push(value.person_id);
    });
    // In trainers
    _.forEach(trainers, (value, key) => {
      ids.push(value.trainer_id);
    });
    this.idcollection = ids.join(',');
    this.event.emit(this.idcollection);
  }

  addPerson(id: number = 0, refid: number = 0) {
    this.bsModalRef = this.modalService.show(AddPersonComponent, { class: 'modal-md', backdrop: 'static' });
    const control = <FormControl>this.bsModalRef.content.personForm.controls['id'];
    control.setValue(id);
    (<AddPersonComponent>this.bsModalRef.content).onClose.subscribe(result => {
      if (result) {
        // Reload data
        const obj = {
          id: refid,
          trainer_id: result.id,
          first_name: result.first_name,
          middle_name: result.middle_name,
          last_name: result.last_name,
          qualification_phrase: result.qualification_phrase,
          approved: 1,
        };

        this.selectedTrainer = obj;
        this.insertTrainer(id);
      }
    }) ;
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    if (e.item && e.item.id) {
      this.selectedTrainer = e.item;//Set trainer_id to id and id as 0 as id is used for a different reference when selected
      e.item.trainer_id = e.item.id;
      e.item.id = 0;
    }else {
      this.selectedTrainer = null;
    }
  }

}
