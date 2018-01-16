import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MasterItem } from '../models/master-item';

@Component({
  moduleId: module.id,
  selector: 'pepfar-option',
  templateUrl: 'pepfar-option.component.html',
  styleUrls: ['pepfar-option.component.css']
})
export class PepfarOptionComponent {
  @Input('group')
  public pepfarForm: FormGroup;
  @Input('options')
  public options:  MasterItem[];
  @Input('groupid')
  public groupid: number;
  @Output('onremove')
  public notify: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  onRemoveClicked() {
    this.notify.emit(this.groupid);
  }

}
