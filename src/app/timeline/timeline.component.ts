import { Component, OnInit } from '@angular/core';
import { PersonService } from '../shared';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  trainings: any[] = [];
  constructor(private personService: PersonService) { }

  ngOnInit() {
    this.personService.getPersonTrainings(12036).subscribe(
      list => {
        this.trainings = list;
        console.log(list);
      }
    );
  }

}
