import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { BsModalRef, TypeaheadMatch } from 'ngx-bootstrap';
import { UserService, Training, TrainingService } from '../../../shared';
import { Subscription } from 'rxjs/Subscription';
import { ToastsManager } from 'ng2-toastr';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  id: number;
  user:any;
  userForm: FormGroup;
  roles: any = [];
  combined: any;
  subscription: Subscription = new Subscription();
  public onClose: Subject<any> = new Subject<any>();
  searchForm: FormGroup;
  dataSource: Observable<any>;
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private userService: UserService,
    private toastr: ToastsManager,
    private trainingService:TrainingService
  ) { 
    this.loadLookupData();
    this.createForm();
  }

  createForm() { 

    this.userForm = this.fb.group({
      id: [0],
      first_name: [null, [Validators.required]],
      middle_name: [null],
      last_name: [null, [Validators.required]],
      person_id: [null],
      mobile: [null],
      email: [null],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      roleid: [null, [Validators.required]],
      is_blocked: [0],
      fullname: ['']
    });

    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.userForm.controls['fullname'].value);
    }).mergeMap((token: string) => this.trainingService.getPerson(token, '0'));
  }

  loadLookupData() {
    this.combined = this.userService.getCachedData();

    this.subscription.add(this.combined.subscribe(values => {
      this.roles = values[0]
    }));
  }

  populateForm(id: number) {
    if (id > 0) {
      this.subscription.add(this.userService.getUser(id).subscribe(
        item => {
          this.user = item;

          this.userForm.patchValue(item);
        }
      ));
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.onValueChanges();
  }

  onValueChanges() {
    this.userForm.get('id').valueChanges.subscribe(
      id => {
        if (this.id !== id && +id > 0) {
          this.id = +id;
          this.populateForm(id);
        }
      }
    );

  }

  prepareSaveUser() {
    return this.userForm.value;
  }

  onSubmit() {
    const training = this.prepareSaveUser();
    this.subscription.add(this.userService.addUser(training).subscribe(
      item => {
        if (item && item.id) {
          this.toastr.success('Successfully updated user', 'Success!');
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
/**Type Ahead */

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    if (e.item && e.item.id) {
      this.userForm.get('person_id').setValue(e.item.id);
    }
  }

  clearAssociated() {
    this.userForm.get('fullname').setValue(null);
    this.userForm.get('person_id').setValue(null);
  }
/**End Type Ahead */

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
