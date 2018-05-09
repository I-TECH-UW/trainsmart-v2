import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr';
import { TrainingService } from '../shared';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  moduleId: module.id,
  selector: 'app-score',
  templateUrl: 'score.component.html',
  styleUrls: ['score.component.css']
})
export class ScoreComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  id: number;
  scoreForm: FormGroup;
  training: any;
  list: any [];
  public onClose: Subject<any> = new Subject<any>();

  constructor(private _fb: FormBuilder, private modalService: BsModalService,
    private trainingService: TrainingService, private toastr: ToastsManager,
    private modalRef: BsModalRef) {

      this.createForm();
  }

  createForm() {
    this.scoreForm = this._fb.group({
      id: [null]
    });

    this.subscription.add(this.scoreForm.get('id').valueChanges.subscribe(
      id => {
        if (this.id !== id && +id > 0) {
          this.id = +id;
          this.populateForm(id);
        }
      }
    ));
  }

  ngOnInit() {
  }

  populateForm(id: number) {
    if (id > 0) {
      this.subscription.add(this.trainingService.getTrainingParticipantsTests(id).subscribe(
        result => {
          this.training = result.training;
          this.list = result.participants;
        }
      ));
    }
  }

  onRowClick(event, id) {
    //console.log(event.target.outerText, id);
  }

  onSubmit() {
    const tests = {
      training_id: this.training.training_id,
      participants: this.list
    };

    this.subscription.add(this.trainingService.saveUpdateTrainingParticipantsTests(tests).subscribe(
      result => {
        if (result) {
          this.toastr.info('Participant test scores successfully updated.', 'Test Scores');
          this.onClose.next(true);
          this.modalRef.hide();
        }else {
          this.toastr.error('There was an error in saving the test scores.' +
          ' Please try again, if ths persists please contact your administrator', 'Error!');
        }
      }
    ));
  }

  onCancel() {
    this.onClose.next(false);
    this.modalRef.hide();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
