import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MasterItem } from '../../../shared';

@Component({
  selector: 'app-add-person-qualification',
  templateUrl: './add-person-qualification.component.html',
  styleUrls: ['./add-person-qualification.component.css']
})
export class AddPersonQualificationComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() qualificationList: MasterItem[];
  @Input() primaryResponsibilityList: MasterItem[];
  @Input() secondaryResponsibilityList: MasterItem[];
  @Input() reasonAttendingList: MasterItem[];
  constructor() { }

  ngOnInit() {
  }

}
