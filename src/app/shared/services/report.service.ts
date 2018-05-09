import { Injectable } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import * as faker from 'faker';
import { ApiService } from './api.service';
import { take, map, tap } from 'rxjs/operators';
import { isArray } from 'util';
import { AlertService } from './alert.service';
declare var jsPDF: any;

export interface ActivityReportData {
  header:any;
  trainers:any;
  participants:any
}

export interface TrainingReportData{
  labels:any;
  data:any;
}

@Injectable()
export class ReportService {
  private innerHtml: SafeHtml;
  private activitydata: ActivityReportData;
  private trainingReportData: TrainingReportData;

  constructor(private _sanitizer: DomSanitizer, private api:ApiService, private alert:AlertService) { }

  private setInnerHtml(pdfurl: string) {
    return this.innerHtml = this._sanitizer.bypassSecurityTrustHtml(
      "<object width='100%' height='700px' data='" + pdfurl + "' type='application/pdf' class='embed-responsive-item'>" +
      "Object " + pdfurl + " failed" +
      "</object>"
    );
  }

  /* TRAINING REPORT */

  /**
   * To retrieve a list of trainings depending on ones search criteria
   * By default it displays all trainings
   * @param search 
   * @param HTMLorPDForCSV(0 - HTML, 1 - PDF, 2 - CSV)
   * @param displayoption (Only applies to PDF documents where Popup is the default: 0 - Popup, 1 - Embeded, 2 - Download)
   */
  public getTrainingReport(search: string, HTMLorPDForCSV:number = 0, displayoption: number = 0) {
    return this.api.get(`/reports/trainings${search}`)
      .pipe(
        take(1),
        map((res:TrainingReportData) => {

          this.trainingReportData = res;

          if(HTMLorPDForCSV == 1){
            // PDF
            return this.trainingReport(displayoption)
          }else if(HTMLorPDForCSV == 2){
            //EXCEL
            this.JSONToCSVConvertor(this.trainingReportData.data,this.trainingReportData.labels,'TRAINING REPORT','Training Report',true);
            return {
              labels: this.trainingReportData.labels,
              data: this.trainingReportData.data
            };
          }else{
            //HTML display
            return {
              labels: this.trainingReportData.labels,
              data: this.trainingReportData.data
            };
          }
        })
      )
    ;
  }

  private trainingReport(displayoption:number = 0) {
    let pdf = new jsPDF('l');

    pdf.setFillColor(192);
    pdf.rect(5,15,pdf.internal.pageSize.width-10,10,'DF')

    pdf.setFontSize(20);
    pdf.setTextColor(40);
    pdf.setFontStyle('normal');
    pdf.text("TRAINING REPORT", 7, 22);
    pdf.setFontSize(12);

    /* Trainer Info */
    pdf.autoTable(this.getTrainingColumns(), this.trainingReportData.data, {
      startY: 30,
      showHeader: 'everyPage',
      theme: 'grid',
      margin: {horizontal: 7},
      bodyStyles: {valign: 'top'},
      styles: {overflow: 'linebreak', columnWidth: 'wrap'},
      columnStyles: {
        training_title: {columnWidth: 'auto'},
        training_sub_title: {columnWidth: 'auto'},
        training_sub_level: {columnWidth: 'auto'},
        training_sponsor: {columnWidth: 'auto'},
        training_venue: {columnWidth: 'auto'},
      }
    });

    let returnVal:any = null;
    switch(displayoption){
      case 0:
        const tab = window.open();
        tab.location.href = pdf.output('bloburl');
        break;
      case 1:
        returnVal = this.setInnerHtml(pdf.output('bloburl'));
        break;
      case 2:
        pdf.save('Training Report.pdf');
        break;
    }
    return returnVal;
  }

  private getTrainingColumns() {
    return [
      {title: '#', dataKey: 'ordinal'},
      {title: 'Training\nTitle', dataKey: 'training_title'},
      {title: 'Training\nSub\nTitles', dataKey: 'training_sub_title'},
      {title: 'Training\nStart\nDate', dataKey: 'training_start_date'},
      {title: 'Training\nEnd\nDate', dataKey: 'training_end_date'},
      {title: 'Duration', dataKey: 'duration'},
      {title: 'Training\nLevel', dataKey: 'training_level'},
      {title: 'Training\nSponsor', dataKey: 'training_sponsor'},
      {title: 'Training\nLocation', dataKey: 'training_venue'},
      {title: 'County', dataKey: 'county'},
      {title: 'Status', dataKey: 'status'},
    ];
  }

  /* END - TRAINING REPORT */

  /* ACTIVITY REPORT */
  public getActivityReport(training_id:number, displayoption: number = 0) {
    /* 0 - Popup, 1 - Embeded, 2 - Download */
    return this.api.get(`/reports/activity/${training_id}`)
      .pipe(
        take(1),
        map((res:ActivityReportData) => {
          this.activitydata = res;
          return this.activityReport(displayoption);
        })
      )
    ;
  }

  private activityReport(displayoption:number = 0) {
    let pdf = new jsPDF('l');//('p','pt');
    
    // Document defaults
    pdf.autoTableSetDefaults({
      columnStyles: {id: {fontStyle: 'bold'}},
      headerStyles: { textColor: 255, fillColor: [41, 128, 185], fontStyle: 'bold' },
    });

    pdf.setFillColor(192);
    pdf.rect(5,15,pdf.internal.pageSize.width-10,10,'DF')

    pdf.setFontSize(20);
    pdf.setTextColor(40);
    pdf.setFontStyle('normal');
    pdf.text("NASCOP ACTIVITY REPORT FOR TRAININGS", 7, 22);
    pdf.setFontSize(12);
    
    let keys = [
      {title: "a", dataKey: "name_1"}, 
      {title: "b", dataKey: "text_1"},
      {title: "c", dataKey: "name_2"}, 
      {title: "d", dataKey: "text_2"}
    ];

    pdf.autoTable(keys, this.getActivityReportData(), {
        startY: 30, 
        showHeader: false,
        margin: {horizontal: 7},
        theme: 'plain', //grid, striped
        styles: {overflow: 'linebreak', columnWidth: 'wrap'},
        columnStyles: {
          name_1: {fontStyle: 'bold'},
          name_2: { fontStyle: 'bold'},
          text_1: {columnWidth: 'auto'},
          text_2: {columnWidth: 'auto'},
        }
    });

    var sentence = faker.lorem.words(155);

    /* Observations */
    const header = this.activitydata.header;
    var observations = [
      {title: 'Objectives of the training', value: [{text: header.training_objectives}]},
      {title: 'Brief Description of how the training was conducted', value: [{text: header.training_conduct}]},
      {title: 'Observations and recommendations', value: [{text: header.training_recommendations}]}
    ];
    for(var j = 0; j < observations.length; j++) // Observations
      pdf.autoTable([{title: observations[j].title, dataKey: 'text'}], observations[j].value, {
        startY: pdf.autoTable.previous.finalY + 15,
        showHeader: 'firstPage',
        margin: {horizontal: 7},
        bodyStyles: {valign: 'top'},
        styles: {overflow: 'linebreak', columnWidth: 'wrap'},
        columnStyles: {text: {columnWidth: 'auto'}}
      });

    /* Trainer Info */
    pdf.text("Trainers", 7, pdf.autoTable.previous.finalY  + 10);
    pdf.autoTable(this.getTrainerColumns(), this.activitydata.trainers, {
      startY: pdf.autoTable.previous.finalY + 15,
      showHeader: 'everyPage',
      theme: 'grid',
      margin: {horizontal: 7},
      bodyStyles: {valign: 'top'},
      styles: {overflow: 'linebreak', columnWidth: 'wrap'},
      columnStyles: {
        cadre: {columnWidth: 'auto'},
        station: {columnWidth: 'auto'},
      }
    });

    /* Participant Info */
    pdf.text("Participants", 7, pdf.autoTable.previous.finalY  + 10);
    pdf.autoTable(this.getParticipantColumns(), this.activitydata.participants, {
      startY: pdf.autoTable.previous.finalY + 15,
      showHeader: 'everyPage',
      theme: 'grid',
      margin: {horizontal: 7},
      bodyStyles: {valign: 'top'},
      styles: {overflow: 'linebreak', columnWidth: 'wrap'},
      columnStyles: {
        cadre: {columnWidth: 'auto'},
        station: {columnWidth: 'auto'},
      }
    });

    let y:number = pdf.autoTable.previous.finalY;
    let pageHeight= pdf.internal.pageSize.height;

    if ((y + 35) >= pageHeight){
      pdf.addPage();
      y = 22;
    }

    pdf.setDrawColor(0);
    pdf.setFillColor(192);
    pdf.rect(5,y + 8,pdf.internal.pageSize.width-10,10,'DF');

    pdf.setFontSize(20);
    pdf.setTextColor(40);
    pdf.setFontStyle('normal');
    pdf.text('For NASCOP USE ONLY', 7, y + 15);
    pdf.setFontSize(12);

    pdf.text('Received & Verified By:', 7, y + 25);
    pdf.text('Designation:', pdf.internal.pageSize.width/2, y + 25);
    pdf.text('Date:', 7, y + 35);
    pdf.text('Signature:', pdf.internal.pageSize.width/2, y + 35);

    let returnVal:any = null;
    switch(displayoption){
      case 0:
        const tab = window.open();
        tab.location.href = pdf.output('bloburl');
        break;
      case 1:
        returnVal = this.setInnerHtml(pdf.output('bloburl'));
        break;
      case 2:
        pdf.save('Training Activity Report.pdf');
        break;
    }
    return returnVal;
  }

  private getActivityReportData() {
    const data = this.activitydata.header;
    return [
      {name_1: 'HIV Program area:', text_1: data.training_category_phrase, name_2: 'Dates training was conducted:', text_2: ''},
      {name_1: 'Title of training:', text_1: data.training_title_phrase, name_2: 'Start date:', text_2: data.training_start_date},
      {name_1: '', text_1: '', name_2: 'Finish date:', text_2: data.training_end_date},
      {name_1: 'Report submitted by:', text_1: data.submitted_by, name_2: 'Telephone:', text_2: data.telephone},
      {name_1: 'Institution:', text_1: data.institution, name_2: 'Email address:', text_2: data.email},
      {name_1: 'Designation:', text_1: data.designation, name_2: '', text_2: ''},
      {name_1: 'Date Submitted:', text_1: data.date_submitted, name_2: '', text_2: ''},
      {name_1: 'Funding Source:', text_1: data.training_organizer_phrase, name_2: 'Supporting Partner:', text_2: data.supporting_partner},
      {name_1: 'Number trained:', text_1: data.number_trained, name_2: '', text_2: ''},
      {name_1: 'County:', text_1: data.county, name_2: 'Training Location/ venue : ', text_2: data.venue},
      {name_1: 'Town:', text_1: data.town, name_2: '', text_2: ''},
    ];
  }

  private getTrainerColumns() {
    return [
      {title: 'ID', dataKey: 'ordinal'},
      {title: 'NAME\nOF\nTRAINER', dataKey: 'name'},
      {title: 'CADRE', dataKey: 'cadre'},
      {title: 'STATION', dataKey: 'station'},
      {title: 'COUNTY', dataKey: 'county'},
      {title: 'TELEPHONE\nCONTACT', dataKey: 'telephone'},
      {title: 'EMAIL\nADDRESS', dataKey: 'email'},
      {title: 'ID\nNUMBER', dataKey: 'nationalid'},
    ];
  }

  private getParticipantColumns() {
    return [
      {title: 'ID', dataKey: 'ordinal'},
      {title: 'NAME\nOF\nPARTICIPANT', dataKey: 'name'},
      {title: 'CADRE', dataKey: 'cadre'},
      {title: 'STATION', dataKey: 'station'},
      {title: 'COUNTY', dataKey: 'county'},
      {title: 'TELEPHONE\nCONTACT', dataKey: 'telephone'},
      {title: 'EMAIL\nADDRESS', dataKey: 'email'},
      {title: 'ID\nNUMBER', dataKey: 'nationalid'},
      {title: 'PRE\nTEST', dataKey: 'pretest'},
      {title: 'POST\nTEST', dataKey: 'posttest'}
    ];
  }

  /* END - ACTIVITY REPORT */

  /* JSON to CSV Converter */

  JSONToCSVConvertor(JSONData:any, ReportFieldsArray:any, ReportTitle:string, FileName:string, ShowLabel:boolean = true) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    if(!isArray(JSONData)) {
      this.alert.error('Export To CSV Failed!!! The data passed is not an Array. Please contact your Administrator.');
      return;
    }
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        if(ReportFieldsArray){
          for(var index in ReportFieldsArray){
            row += ReportFieldsArray[index] + ',';
          }
        }else{
          //This loop will extract the label from 1st index of on array
          for (var index in arrData[0]) {
              
              //Now convert each value to string and comma-seprated
              row += index + ',';
          }
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    if(FileName){
      FileName = FileName.replace(/ /g,"_"); 
    }else{
      //Generate a file name
      FileName = "MyReport_";
      //this will remove the blank-spaces from the title and replace it with an underscore
      FileName += ReportTitle.replace(/ /g,"_");   
    }
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + encodeURI(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    //link.style = "visibility:hidden";
    link.style.setProperty('visibility','hidden');
    link.download = FileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* END - JSON to CSV Converter */

}
