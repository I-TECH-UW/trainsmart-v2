import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PersonService, MasterItem, Person} from '../shared';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import { TSSYSTEMDATA } from '../systemdata';
import { CustomValidators } from '../validators/custom-validators';

@Component({
  moduleId: module.id,
  selector: 'app-add-person',
  templateUrl: 'add-person.component.html',
  styleUrls: ['add-person.component.css']
})
export class AddPersonComponent implements OnInit, AfterViewInit {
  id: number;
  personForm: FormGroup;
  display: any;
  combined: any;
  activeList: MasterItem[];
  titleList: MasterItem[];
  suffixList: MasterItem[];
  genderList: MasterItem[];
  qualificationList: MasterItem[];
  primaryResponsibilityList: MasterItem[];
  secondaryResponsibilityList: MasterItem[];
  reasonAttendingList: MasterItem[];

  public onClose: Subject<any> = new Subject<any>();

  constructor(private personService: PersonService, private fb: FormBuilder,
              private toastr: ToastsManager, private modalRef: BsModalRef,
            private customValidators: CustomValidators) { }

  ngOnInit() {
    this.loadLookupData();
    this.createForm();
  }

  ngAfterViewInit() {
    this.onValueChanges();
  }

  createForm() {
    this.display = TSSYSTEMDATA;

    this.personForm = this.fb.group({
      id: [0],
      title_option_id: [null],
      first_name: [null],
      middle_name: [null],
      last_name: [null],
      suffix_option_id: [null],
      initial_national_id: [null],
      national_id: [null, [Validators.required], this.customValidators.uniqueNationalID()],
      registration_board: [null],
      registration_number: [null],
      file_number: [null],
      dob: [null],
      birthdate: [null],
      gender_id: [null],
      active_id: [null],
      region_id: [null],
      mfl_code: [null],
      mfl_name: [null],
      phone_home: [null],
      phone_work: [null],
      phone_mobile: [null],
      email: [null],
      fax: [null],
      primary_qualification_option_id: [null],
      primary_responsibility_option_id: [null],
      secondary_responsibility_option_id: [null],
      attend_reason_option_id: [null],
      attend_reason_other: [null],
      person_custom_1_option_id: [null], // number
      person_custom_2_option_id: [null], // number
      custom_5: [null],
      is_active_trainer: [null]
    });

    //this.onValueChanges();
  }

  isEmptyInputValue(value: any): boolean {
      // we do not check for string here so that it also works for arrays
      return value == null || value.length === 0;
  }

  onValueChanges() {
    this.personForm.get('dob').valueChanges.subscribe(
      value => {
        const dy = new Date(value);
        this.personForm.get('birthdate').setValue(dy.getFullYear() + '-' + (dy.getMonth() + 1) + '-' + dy.getDate());
      }
    );

    this.personForm.get('id').valueChanges.subscribe(
      id => {
        if (this.id !== id && +id > 0) {
          this.id = +id;
          this.populateForm(id);
        }
      }
    );
  }

  loadLookupData() {
    this.combined = this.personService.getCachedData();

    this.combined.subscribe(values => {
      const [titleList, suffixList, genderList, qualificationList, primaryResponsibilityList,
        secondaryResponsibilityList, reasonAttendingList] =  values;

      this.titleList = titleList;
      this.suffixList = suffixList;
      this.genderList = genderList;
      this.qualificationList = qualificationList;
      this.primaryResponsibilityList = primaryResponsibilityList;
      this.secondaryResponsibilityList = secondaryResponsibilityList;
      this.reasonAttendingList = reasonAttendingList;
    });

    this.activeList = [
      new MasterItem({ id: 1, name: 'Active'}),
      new MasterItem({ id: 0, name: 'In-active'})
    ];

  }

  populateForm(id: number) {
    if (id > 0) {
      this.personService.getPerson(id).subscribe(
        item => {
          this.personForm.patchValue(new Person(item));
        }
      );
    }
  }

  prepareSavePerson(): Person {
    return new Person(this.personForm.value);
  }

  onViewTrainingsParticipatedClicked() {
    this.toastr.warning('Implement View of persons previous trainings participated', 'Trainings Participated');
  }

  onViewTrainingsFacilitatedClicked() {
    this.toastr.warning('Implement View of persons previous trainings facilitated', 'Trainings Facilitated');
  }

  onViewCertificatesReceived() {
    this.toastr.warning('Implement View of persons certificates received', 'Certificates Received');
  }

  onSubmit() {
    const person = this.prepareSavePerson();

    this.personService.addPerson(person).subscribe(
      item => {
        if (item && item.id) {
          if (this.id > 0) {
            this.toastr.info('Successfully updated person record', 'Success!');
          } else {
            this.toastr.success('Successfully added person record', 'Success!');
          }
          this.onClose.next(item);
          this.modalRef.hide();
        }else {
          this.toastr.error('An error occured while saving record. Please try again.', 'Error!');
        }
      }
    );
  }

  onCancel() {
    this.onClose.next(false);
    this.modalRef.hide();
  }
}
