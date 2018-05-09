import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { TrainingService } from '../../../shared';
import * as _ from 'lodash';
import { BsModalRef } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap';
import { AddPersonComponent } from '../../../add-person/add-person.component';
import { timeout } from 'q';

@Component({
  selector: 'app-add-training-participant',
  templateUrl: './add-training-participant.component.html',
  styleUrls: ['./add-training-participant.component.css']
})
export class AddTrainingParticipantComponent implements OnInit, AfterViewInit {
  @Input() form: FormGroup;
  @Input() idcollection: string;
  @Output() event: EventEmitter<string> = new EventEmitter();
  searchForm: FormGroup;
  dataSource: Observable<any>;
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  selectedParticipant: any;
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

  ngOnInit() {
    /* const params = new URLSearchParams();
    params.set('search', 'strtosearch');
    params.set('page', String(1));
    params.set('limit', String(25));
    */
  }

  getParticipants() {
    return (<FormArray>this.form.get('participants')).length
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateCollectionIDs();
    }, 1000);
  }

  initParticipant(item: any) {
    return this.fb.group({
      id: [0],
      person_id: [item.person_id],
      first_name: [item.first_name],
      middle_name: [item.middle_name],
      last_name: [item.last_name],
      national_id: [item.national_id],
      mfl_name: [item.mfl_name],
      qualification_phrase: [item.qualification_phrase],
      approved: [1]
    });
  }

  get participants() {
    return this.form.get('participants') as FormArray;
  }

  insertParticipant(id: number = 0) {
    if (this.selectedParticipant) {
      if(id > 0) { // Newlly added person/participant
        // Replace existing values
        Object.keys(this.participants.controls).forEach(key => {
          if(this.participants.get(key).value.person_id === id) {
            this.participants.get(key).patchValue(this.selectedParticipant);
          }
        });
      }else{
        this.participants.push(this.initParticipant(this.selectedParticipant));
        this.updateCollectionIDs();
      }

      this.selectedParticipant = null;
      this.searchForm.controls['fullname'].setValue('');
    }
  }

  removeParticipant(id: number) {
    this.participants.removeAt(id);
    this.updateCollectionIDs();
  }

  clearParticipants() {
    while (this.participants.controls.length > 0) {
      this.participants.removeAt(0);
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

        const obj = {
          id: refid,
          person_id: result.id,
          first_name: result.first_name,
          middle_name: result.middle_name,
          last_name: result.last_name,
          national_id: result.national_id,
          mfl_name: result.mfl_name,
          qualification_phrase: result.qualification_phrase,
          approved: 1,
        };
        
        this.selectedParticipant = obj;
        this.insertParticipant(id);
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
      this.selectedParticipant = e.item;
      //Set person_id to id and id as 0 as id is used for a different reference when selected
      e.item.person_id = e.item.id;
      e.item.id = 0;
    }else {
      this.selectedParticipant = null;
    }
  }

}
