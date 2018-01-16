import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TrainingList } from '../models/training-list';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {
  @Input() training: TrainingList;
  @Output() approval: EventEmitter<any> = new EventEmitter<any>();
  options: string [];

  constructor() { }

  ngOnInit() {
    this.options = ['Pending', 'Approve', 'Reject'];
  }

  process(choice: number) {
    // Pending - 0, Approve - 1, Reject - 2
    const x = {
      isapproved: choice,
      type: this.options[choice],
      item: this.training
    };

    this.approval.emit(x);
  }

}
