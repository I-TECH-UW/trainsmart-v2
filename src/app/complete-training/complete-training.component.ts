import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { TrainingService } from '../shared';
import { ToastsManager } from 'ng2-toastr';
import { Subject } from 'rxjs/Subject';
import { Element } from '@angular/compiler';
import { Subscription } from 'rxjs/Subscription';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  moduleId: module.id,
  selector: 'app-complete-training',
  templateUrl: 'complete-training.component.html',
  styleUrls: ['complete-training.component.css']
})
export class CompleteTrainingComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  id: number;
  completeForm: FormGroup;
  loading: boolean;
  training: any;
  public onClose: Subject<any> = new Subject<any>();
  reader: FileReader;
  file: File;
  slice_size: number = 1000 * 1024;
  dynamic: number;
  chunk_total: number;
  chunk_count: number;
  payload: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('uploadProgress') uploadProgress: ElementRef;

  constructor(private _fb: FormBuilder, private modalService: BsModalService,
    private trainingService: TrainingService, private toastr: ToastsManager,
    private modalRef: BsModalRef, private spinner: NgxSpinnerService) {
    this.loading = false;
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.completeForm = this._fb.group({
      id: [null],
      name: ['', Validators.required],
      avatar: null,
      objectives: [null, Validators.required],
      conduct: [null, Validators.required],
      recommendations: [null, Validators.required],
    });

    this.completeForm.get('id').valueChanges.subscribe(
      id => {
        if (this.id !== id && +id > 0) {
          this.id = +id;
          this.populateForm(id);
        }
      }
    );
  }

  populateForm(id: number) {
    if (id > 0) {
      this.subscription.add(this.trainingService.getTrainingParticipantsTests(id).subscribe(
        result => {
          this.training = result.training;
        }
      ));
      this.subscription.add(this.trainingService.getFileUploadData(id).subscribe(
        (result:any) => {
          const data = result;
          this.completeForm.patchValue(data);
        }
      ));
    }
  }

  fileChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.completeForm.get('name').setValue(file.name);
    }
  }

  clearFile() {
    this.completeForm.get('name').setValue(null);
    this.completeForm.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

  onUpload() {
    this.reader = new FileReader();
    this.file = this.fileInput.nativeElement.files[0];
    this.chunk_total = Math.ceil(this.file.size/ this.slice_size);
    this.chunk_count = 0;
    this.payload = null;
    this.spinner.show();
    this.uploadFile(0);
  }

  private uploadFile(start) {
    var next_slice = start + this.slice_size + 1
    var blob = this.file.slice(start, next_slice);

    this.reader.onloadend = (evt: Event) => {
      /* if(evt.target.readyState !== FileReader.DONE) {
        return;
      } */
      if(this.reader.readyState !== this.reader.DONE) {
        return;
      }
      this.chunk_count++;
      this.payload = {
        id: 0,
        parent_id: this.completeForm.get('id').value,
        parent_table: 'Training',
        file_data: this.reader.result,//event.target.result,
        file: this.file.name,
        file_type: this.file.type,
        file_size: this.file.size,
        nonce: 'my-secret-hash-code',
        chunk_total: this.chunk_total,
        chunk_count: this.chunk_count,
        objectives: this.completeForm.get('objectives').value,
        conduct: this.completeForm.get('conduct').value,
        recommendations: this.completeForm.get('recommendations').value
      }; // token

      this.trainingService.uploadFile(this.payload).subscribe( 
        (result) => {
          if (result.success === true) {
            var size_done = start + this.slice_size;
            var percent_done = Math.floor( ( size_done/ this.file.size ) * 100 );
            if (next_slice < this.file.size ) {
              this.dynamic = percent_done;
              this.uploadProgress.nativeElement.innerHTML = 'Uploading File - ' + percent_done + '%';
              // More to upload, call function recursively
              this.uploadFile( next_slice );
            }else {
              this.dynamic = 100;
              this.uploadProgress.nativeElement.innerHTML = 'Upload Complete';
              if(this.chunk_total = this.chunk_count) {
                this.clearFile();
                this.toastr.success('File was successfully uploaded.', 'File Upload Successful!');
                this.onClose.next(true);
                this.modalRef.hide();
              }
            }
          }
        },
        error => {
          setTimeout(() => {
            this.spinner.hide();
            this.toastr.error('A server error has occured. Please try again.', 'Server Error');
          }, 1000);
        },
        () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      );
    }

    // tell the FileReader API to read a portion of the file
    this.reader.readAsDataURL( blob );
  }

  onCancel() {
    this.onClose.next(false);
    this.modalRef.hide();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
