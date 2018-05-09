import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MasterItem } from '../../../shared';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-person-general',
  templateUrl: './add-person-general.component.html',
  styleUrls: ['./add-person-general.component.css']
})
export class AddPersonGeneralComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() activeList: MasterItem[];
  @Input() titleList: MasterItem[];
  @Input() suffixList: MasterItem[];
  @Input() genderList: MasterItem[];
  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.ref.detectChanges();
  }

}
