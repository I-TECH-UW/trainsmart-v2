import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DataTable } from 'angular5-data-table';
import { UserService } from '../../shared';
import { BASEURL } from '../../constants';
import { AddPersonComponent } from '../../add-person/add-person.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AddUserComponent } from './add-user/add-user.component';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { Subscription } from 'rxjs/Subscription';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  subscription: Subscription = new Subscription();
  bsModalRef: BsModalRef;
  searchForm: FormGroup;
  searchField: FormControl;
  advancedSearch: string;
  items = [];
  itemCount = 0;
  baseUrl: string;
  @ViewChild(DataTable) userTable: DataTable;
  
  constructor(
    private fb:FormBuilder, private userService:UserService,
    private modalService: BsModalService, private toastr: ToastsManager
  ) {
    this.searchField = this.fb.control(null);
    this.searchForm = this.fb.group({searchText: this.searchField});
    this.baseUrl = BASEURL;

    this.searchField.valueChanges
    .debounceTime(400)
    .switchMap(term => {
      this.advancedSearch = '';
      this.userTable.page = 1;
      return [];
    })
    .subscribe(
      result => {}
    );
  }

  ngOnInit() {
  }

  reloadItems(params) {
    const search = this.advancedSearch || this.searchField.value;
    const refinedSearch = this.advancedSearch !== '' ? 1 : 0;
    this.userService.getUserList(params, search, refinedSearch).subscribe(
      res => {
        this.items = res.items;
        this.itemCount = res.itemCount;
      }
    );
  }

  addUser(id: number = 0) {
    this.bsModalRef = this.modalService.show(AddUserComponent, { class: 'modal-lg', backdrop: 'static' });
    const control = <FormControl>this.bsModalRef.content.userForm.controls['id'];
    control.setValue(id);
    (<AddUserComponent>this.bsModalRef.content).onClose.subscribe(result => {
      if (result) {
        // Reload data
        this.reloadItems(this.userTable.displayParams);
      }
    }) ;
  }

  blockUser(userid:number, stateid:number) {
    const options = ['Allow','Block'];

    this.bsModalRef = this.modalService.show(ConfirmModalComponent, { class: 'modal-md' });
    this.bsModalRef.content.type = options[stateid].toUpperCase(); // Must be in uppercase
    this.bsModalRef.content.appendinfo = '';
    this.bsModalRef.content.to_comment = false;
    this.subscription.add(
      (<ConfirmModalComponent>this.bsModalRef.content).onClose.subscribe(result => {
        if (result && result.resp) {
          const detail = {
            id: userid,
            is_blocked: stateid
          };
          this.userService.blockUser(detail).subscribe(response => {
            if(response) {
              this.toastr.info(`The user's account status has been successfully updated.`, 'User ' + options[stateid] + 'ed');
              this.reloadItems(this.userTable.displayParams);
            }
          });
        }
      })
    );
  }

  refresh() {
    // reset the searchtext to '' - will trigger a reload
    this.searchField.setValue('');
    this.advancedSearch = '';
  }

  rowTooltip(item) { return `ID: ${item.id}`; }

  editPersonAccount(id: number) {
    this.bsModalRef = this.modalService.show(AddPersonComponent, { class: 'modal-lg', backdrop: 'static' });
    const control = <FormControl>this.bsModalRef.content.personForm.controls['id'];
    control.setValue(id);
  }

}
