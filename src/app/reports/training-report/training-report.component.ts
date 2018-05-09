import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ReportService, TrainingService, TSLocation, MasterItem, TrainingOrganizerOptions, TrainingLevelOptions, TSShared, AlertService, PersonService } from '../../shared';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import { DataTableResource } from 'angular5-data-table';

@Component({
  selector: 'app-training-report',
  templateUrl: './training-report.component.html',
  styleUrls: ['./training-report.component.css']
})
export class TrainingReportComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription:Subscription = new Subscription();
  searchForm:FormGroup;
  innerHtml:SafeHtml;
  displayTable: any;
  combined:any;
  locations: TSLocation[];
  categoryoptions: MasterItem[];
  subcategoryoptions: MasterItem[];
  filteredsubcategoryoptions: MasterItem[];
  titleoptions: MasterItem[];
  filteredtitleoptions: MasterItem[];
  trainingorganizeroptions: TrainingOrganizerOptions[];
  trainingleveloptions: TrainingLevelOptions[];

  constructor(private reportService:ReportService, private fb:FormBuilder, 
    private trainingService:TrainingService, private alertService: AlertService,
    private personService:PersonService) {

    this.loadLookupData();
    this.createForm();
  }

  addPerson(id:number){
    alert(id);
  }

  delete(item){
    console.log(item);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.alertService.info('Training Classification and Training Title are only used to filter the Training Sub Title for now');
    this.onValueChanges();
  }

  createForm() {
    this.searchForm = this.fb.group({
      training_category_option_id: [null],
      training_sub_category_option_id: [null],
      training_title_option_id: [null],
      training_organizer_option_id: [null],
      training_location_id: [null],
      training_start_date: [null],
    });
  }

  onValueChanges() {
    this.searchForm.get('training_category_option_id').valueChanges.subscribe(
      value => {
        this.onCategoryChanged(value);
      }
    );

    this.searchForm.get('training_sub_category_option_id').valueChanges.subscribe(
      value => {
        this.onSubCategoryChanged(value);
      }
    );

  }

  onCategoryChanged(id: number) {
    // id = +this.trainingForm.get('training_category_option_id').value;
    const fulllist = Object.assign({}, this.subcategoryoptions);
    if (+id === 0) {
      this.filteredsubcategoryoptions = this.subcategoryoptions;
    }else {
      this.filteredsubcategoryoptions = _.filter(fulllist, {'parent_id': +id});
    }
    // set training_title_option_id to null as the options have changed
    const control = <FormControl>(this.searchForm.controls['training_sub_category_option_id']);
    control.setValue(null);
  }
  
  onSubCategoryChanged(id: number) {
    // id = +this.trainingForm.get('training_category_option_id').value;
    const fulllist = Object.assign({}, this.titleoptions);
    if (+id === 0) {
      this.filteredtitleoptions = this.titleoptions;
    }else {
      this.filteredtitleoptions = _.filter(fulllist, {'parent_id': +id});
    }
    // set training_title_option_id to null as the options have changed
    const control = <FormControl>(this.searchForm.controls['training_title_option_id']);
    control.setValue(null);
  }

  loadLookupData() {
    this.combined = this.trainingService.getCachedData();

    this.subscription.add(this.combined.subscribe(values => {
      const [locations, categoryoptions, subcategoryoptions, titleoptions, trainingorganizeroptions,
        trainingleveloptions, pepfaroptions] = values;
      this.locations = <TSLocation[]>locations;
      this.categoryoptions = <MasterItem[]>categoryoptions;
      this.subcategoryoptions = <MasterItem[]>subcategoryoptions;
      this.filteredsubcategoryoptions = <MasterItem[]>subcategoryoptions;
      this.titleoptions = <MasterItem[]>titleoptions;
      this.filteredtitleoptions = <MasterItem[]>titleoptions;
      this.trainingorganizeroptions = <TrainingOrganizerOptions[]>trainingorganizeroptions;      
      this.trainingleveloptions = <TrainingLevelOptions[]>trainingleveloptions;
    }));
  }

  prepareSearchText() {
    const form = this.searchForm.value;
    let searchText = `?training_category_option_id=${form.training_category_option_id}`;
    searchText += `&training_sub_category_option_id=${form.training_sub_category_option_id}`;
    searchText += `&training_title_option_id=${form.training_title_option_id}`;
    searchText += `&training_organizer_option_id=${form.training_organizer_option_id}`;
    searchText += `&training_location_id=${form.training_location_id}`;
    const shared = new TSShared();
    const start_date = form.training_start_date;
    searchText += '&training_start_date=' + (start_date ? shared.prepareDate(start_date) : null);
    return searchText;
  }

  trainingReport(HTMLorPDForCSV:number,option:number,) {
    // PDF -1 CSV - 2
    const searchText = this.prepareSearchText();
    this.subscription.add(this.reportService.getTrainingReport(searchText,HTMLorPDForCSV,option).subscribe(
      (result: any) => {
        if(HTMLorPDForCSV == 1){
          this.innerHtml = result;
        }else{
          this.innerHtml = null;
          this.displayTable = result;
        }
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
