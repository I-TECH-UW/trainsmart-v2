import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { BsModalRef } from 'ngx-bootstrap';
import { TrainingService } from '../shared';
import { ToastsManager } from 'ng2-toastr';
import * as _ from 'lodash';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-certify',
  templateUrl: './certify.component.html',
  styleUrls: ['./certify.component.css']
})
export class CertifyComponent implements OnInit {
  id: number;
  certifyForm: FormGroup;
  listAll: any[] = [];
  selectedAll: any;
  public onClose: Subject<any> = new Subject<any>();
  public innerHtml: SafeHtml;

  get typeValue() {
    return this.certifyForm.get('type').value;
  }

  constructor(private fb: FormBuilder, private modalRef: BsModalRef,
    private trainingService: TrainingService, private toastr: ToastsManager,
    private _sanitizer: DomSanitizer, private spinner: NgxSpinnerService) {
    this.createForm();
  }

  createForm() {
    this.certifyForm = this.fb.group({
      id: [0],
      type: [null],
    });
    
    this.certifyForm.get('id').valueChanges.subscribe(
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
      this.trainingService.getCertApprovalList(id).subscribe(
        result => {
          this.listAll = result;
        }
      );
    }
  }

  ngOnInit() {
  }

  selectAll() {
    for (var i = 0; i < this.listAll.length; i++) {
      if(this.listAll[i].disabled !==1) {
        this.listAll[i].certapproved = this.selectedAll;
      }
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.listAll.every(function(item:any) {
      if(item.disabled !==1) {
        return item.certapproved == true;
      } else {
        return item.certapproved == false;
      }
    })
  }

  preview(previewid:number = 0, display: number = 0) {
    let preview = 1;
    let training_id = this.certifyForm.get('id').value;
    this.downloadPDF(training_id, preview , previewid, display);
  }

  sign() {
    let training_id = this.certifyForm.get('id').value;
    this.downloadPDF(training_id, 0 , 0);
  }

  clearInnerHtml() {
    this.innerHtml = null;
  }

  setInnerHtml(pdfurl: string) {
    this.innerHtml = this._sanitizer.bypassSecurityTrustHtml(
      "<object width='100%' height='500px' data='" + pdfurl + "' type='application/pdf' class='embed-responsive-item'>" +
      "Object " + pdfurl + " failed" +
      "</object>"
    );
  }

  downloadPDF(trainingid:number, preview:number, previewid:number, display:number = 0) {
    /* display 0 - Popup, 1 -Embeded */
    this.spinner.show();
    this.trainingService.downloadPDF(trainingid, preview, previewid).subscribe(
      data => {
        if (data && preview) {
          const fileUrl = URL.createObjectURL(data);
          if(display){
            this.setInnerHtml(fileUrl);
          }else{
            const tab = window.open();
            tab.location.href = fileUrl;
          }
        }else {
          this.toastr.info('Approved certificates have been successfully signed, generated and saved.', 'Approved Certificates Signed');
          this.onClose.next(true);
          this.modalRef.hide();
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

  onSubmit() {
    const newList = _.forEach(this.listAll, (item) => {
      item.certapproved = item.certapproved ? 1 : 0;
    });

    this.trainingService.approveCertificates(this.certifyForm.get('id').value, newList).subscribe(
      result => {
        if(result) {
          this.toastr.info('Certificate approvals were successfully updated.', 'Certificate Approval');
          this.onClose.next(true);
          this.modalRef.hide();
        }
      }
    )
  }

  onCancel() {
    this.onClose.next(null);
    this.modalRef.hide();
  }

}
