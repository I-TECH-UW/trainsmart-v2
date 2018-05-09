import { Component, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ReportService } from '../../shared';

@Component({
  selector: 'app-activity-report',
  templateUrl: './activity-report.component.html',
  styleUrls: ['./activity-report.component.css']
})
export class ActivityReportComponent implements OnInit {
  public innerHtml: SafeHtml;
  
  constructor(private reportService:ReportService) { }

  ngOnInit() {
  }

  activityReport(option:number){
    this.reportService.getActivityReport(938,option).subscribe(
      (result: any) => {
        this.innerHtml = result;
      }
    );
  }



}
