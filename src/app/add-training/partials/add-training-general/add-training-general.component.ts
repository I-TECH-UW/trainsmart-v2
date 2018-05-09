import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TrainingInterval } from '../../add-training.component';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { PersonService, MasterItem, TrainingOrganizerOptions, TrainingLevelOptions,
         TSLocation} from '../../../shared';

@Component({
  selector: 'app-add-training-general',
  templateUrl: './add-training-general.component.html',
  styleUrls: ['./add-training-general.component.css']
})
export class AddTrainingGeneralComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() display: any;
  @Input() categoryoptions: MasterItem[];
  @Input() filteredsubcategoryoptions: MasterItem[];
  @Input() filteredtitleoptions: MasterItem[];
  @Input() trainingorganizeroptions: TrainingOrganizerOptions[];
  @Input() trainingleveloptions: TrainingLevelOptions[];
  @Input() pepfaroptions: MasterItem[];
  @Input() locations: TSLocation[];
  @Input() trainingintervaloptions: TrainingInterval[];
  @Input() locationtype: any[];
  dataSource: Observable<any>;
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  @Input() cpdreadonly: boolean;

  constructor(private personService: PersonService, private ref: ChangeDetectorRef) {
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.form.controls['mfl_name'].value);
    }).mergeMap((token: string) => this.personService.getMFL(token));
   }

  ngOnInit() {
    this.onValueChanges();
  }

  onValueChanges() {
    this.form.controls['training_location_type'].valueChanges.subscribe(
      value => {
        if (+value === 1) {
          this.form.controls['other_location_region'].setValue(null);
          this.form.controls['other_location'].setValue(null);
          this.updateLocationValidity(true);
        }else {
          this.form.controls['mfl_name'].setValue(null);
          this.form.controls['training_location_id'].setValue(null);
          this.updateLocationValidity(false);
        }
      }
    );
  }

  updateLocationValidity(is_facility: boolean) {
    let flag_1: any;
    let flag_2: any;
    if (is_facility) {
      flag_1 = null;
      flag_2 = [Validators.required];
    } else {
      flag_1 = [Validators.required];
      flag_2 = null;
    }
    this.form.get('other_location_region').setValidators(flag_1);
    this.form.get('other_location').setValidators(flag_1);
    this.form.get('mfl_name').setValidators(flag_2);
    // this.form.get('training_location_id').setValidators(flag_2);

    this.form.get('other_location_region').updateValueAndValidity();
    this.form.get('other_location').updateValueAndValidity();
    this.form.get('mfl_name').updateValueAndValidity();
    // this.form.get('training_location_id').updateValueAndValidity();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.ref.detectChanges();
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    if (e.item && e.item.id) {
      this.form.controls['training_location_id'].setValue(e.item.id);
    }else {
      this.form.controls['training_location_id'].setValue(null);
    }
  }

}
