import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';
import { isArray } from 'util';
import { ReportService } from '../../../shared';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.css']
})
export class PersonDetailsComponent implements OnInit {

  person: any;

  constructor(private route:ActivatedRoute, private reportService:ReportService) { }

  ngOnInit() {
    this.route.data.subscribe(
      person => this.person = person
    )

    
  }

  convert() {
    // Create Object
    var items = [
      { name: "Item 1", color: "Green", size: "X-Large" },
      { name: "Item 2", color: "Green", size: "X-Large" },
      { name: "Item 3", color: "Green", size: "X-Large" }];


      const fields = ['Name','Colour','Size'];
      this.reportService.JSONToCSVConvertor(this.person, fields,'Training Report','Training Report',true);
  }



}
