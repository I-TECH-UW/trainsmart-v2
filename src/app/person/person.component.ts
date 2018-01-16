import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PersonService } from '../services/person.service';
import { PersonList } from '../models/person-list';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ToastsManager } from 'ng2-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AddPersonComponent } from '../add-person/add-person.component';
import { FormControl } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-person',
  templateUrl: 'person.component.html',
  styleUrls: ['person.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PersonComponent implements OnInit {
  bsModalRef: BsModalRef;
  people: PersonList[] = [];
  subscription: Subscription = new Subscription();
  // For pagination
  maxSize: number;
  totalItems: number;
  currentPage: number;
  numPages: number;
  itemsPerPage: number;
  // searchForm: FormGroup;

  constructor(private personService: PersonService, private toastr: ToastsManager,
              private modalService: BsModalService) {
    this.maxSize = 10;
    this.totalItems = 175;
    this.currentPage = 1;
    this.numPages = 0;
    this.itemsPerPage = 10;
  }

  ngOnInit() {
    this.loadData();
  }

  pageChanged(event: any): void {
    if (event.page !== this.currentPage) {
      this.currentPage = event.page;
      this.loadData();
    }
  }

  private loadData() {
    this.personService.getPersonList(this.currentPage, this.itemsPerPage).subscribe(
      result => {
        this.people = <PersonList[]>result.items;
        this.totalItems = result.total;
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
        this.loadData();
      }
    }) ;
  }

  refresh() {
    this.loadData();
    this.toastr.info('Records list has been refreshed.', 'List Refreshed');
  }

  edit(item: PersonList) {

  }

  delete(obj: any) {
    const item = new PersonList(obj);
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, { class: 'modal-md' });
    this.bsModalRef.content.type = 'DELETE'; // Must be in uppercase
    this.bsModalRef.content.appendinfo = item.displayName();
    this.subscription.add(
      (<ConfirmModalComponent>this.bsModalRef.content).onClose.subscribe(result => {
        if (result) {
          this.personService.deletePerson(item.id).subscribe(() => this.loadData());
          this.toastr.info('The selected record was successfully deleted.', 'Record Deleted');
        }
      })
    );
  }

}
