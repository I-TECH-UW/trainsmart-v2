import { Component, OnInit } from '@angular/core';
import { PersonService } from '../services/person.service';
import { MasterItem } from '../models/master-item';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Person } from '../models/person';
import { ToastsManager } from 'ng2-toastr';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';

@Component({
  moduleId: module.id,
  selector: 'app-add-person',
  templateUrl: 'add-person.component.html',
  styleUrls: ['add-person.component.css']
})
export class AddPersonComponent implements OnInit {
  personForm: FormGroup;
  combined: any;
  activeList: MasterItem;
  titleList: MasterItem;
  suffixList: MasterItem;
  genderList: MasterItem;

  public onClose: Subject<any> = new Subject<any>();

  constructor(private personService: PersonService, private fb: FormBuilder,
              private toastr: ToastsManager, private modalRef: BsModalRef) { }

  ngOnInit() {
    this.loadLookupData();
    this.createForm();
  }

  createForm() {
    this.personForm = this.fb.group({
      id: [0],
      title_option_id: [null],
      first_name: [null],
      middle_name: [null],
      last_name: [null],
      suffix_option_id: [null],
      national_id: [null],
      file_number: [null],
      birthdate: [null],
      gender_id: [null]
    });
  }

  loadLookupData() {
    this.combined = this.personService.getCachedData();

    this.combined.subscribe(values => {
      const [titleList, suffixList, genderList] =  values;
      this.titleList = titleList;
      this.suffixList = suffixList;
      this.genderList = genderList;
    });
  }

  prepareSavePerson(): Person {
    return new Person(this.personForm.value);
  }

  onSubmit() {
    const person = this.prepareSavePerson();

    // this.alertService.success('Implement successful submission');
    /* this.personService.addPerson(person).subscribe(
      item => {
        this.toastr.success('Successfully added person', 'Success!');
        this.onClose.next(true);
        this.modalRef.hide();
      }
    ); */
  }

  onCancel() {
    this.onClose.next(false);
    this.modalRef.hide();
  }
}
