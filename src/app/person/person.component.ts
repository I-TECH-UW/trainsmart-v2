import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { PersonService, PersonList, AuthenticationService, AuthUser } from '../shared';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ToastsManager } from 'ng2-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AddPersonComponent } from '../add-person/add-person.component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTable } from 'angular5-data-table';


@Component({
  moduleId: module.id,
  selector: 'app-person',
  templateUrl: 'person.component.html',
  styleUrls: ['person.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PersonComponent implements OnInit {
  authUser:AuthUser;
  bsModalRef: BsModalRef;
  people: PersonList[] = [];
  subscription: Subscription = new Subscription();
  listForm: FormGroup;
  searchForm: FormGroup;
  searchField: FormControl;
  // For pagination
  combined: any;
  advancedSearch: string;

  items = [];
  itemCount = 0;
  @ViewChild(DataTable) peopleTable: DataTable;


  constructor(private personService: PersonService, private toastr: ToastsManager,
              private modalService: BsModalService, private fb: FormBuilder,
              public auth:AuthenticationService, private router:Router) {

    this.searchField = new FormControl('');
    this.searchForm = this.fb.group({searchText: this.searchField});

    this.searchField.valueChanges
    .debounceTime(400)
    .switchMap(term => {
      this.advancedSearch = '';
      this.peopleTable.page = 1; //This will ensure a reload call to reloadItems
      return [];
    })
    .subscribe(
      result => {}
    );
  }

  reloadItems(params) {
    const search = this.searchForm.get('searchText').value;
    this.personService.queryList(params, search).subscribe(
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
  }

  addPerson(id: number = 0) {
    this.bsModalRef = this.modalService.show(AddPersonComponent, { class: 'modal-lg', backdrop: 'static' });
    const control = <FormControl>this.bsModalRef.content.personForm.controls['id'];
    control.setValue(id);
    (<AddPersonComponent>this.bsModalRef.content).onClose.subscribe(result => {
      if (result) {
        // Reload data
        this.reloadItems(this.peopleTable.displayParams);
      }
    }) ;
  }

  refresh() {
    this.searchForm.get('searchText').setValue('');
    this.reloadItems(this.peopleTable.displayParams);
  }

  view(personid:number) {
    this.router.navigate([`/viewperson/${personid}`]);
  }

  delete(obj: any) {
    const item = new PersonList(obj);
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, { class: 'modal-md' });
    this.bsModalRef.content.type = 'DELETE'; // Must be in uppercase
    this.bsModalRef.content.appendinfo = item.displayName();
    this.subscription.add(
      (<ConfirmModalComponent>this.bsModalRef.content).onClose.subscribe(result => {
        if (result) {
          this.personService.deletePerson(item.id).subscribe(() => this.reloadItems(this.peopleTable.displayParams));
          this.toastr.info('The selected record was successfully deleted.', 'Record Deleted');
        }
      })
    );
  }

}
