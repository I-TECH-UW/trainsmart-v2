import { Component, OnInit, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PersonService, MasterItem } from '../../../shared';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-add-person-contact',
  templateUrl: './add-person-contact.component.html',
  styleUrls: ['./add-person-contact.component.css']
})
export class AddPersonContactComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() display: any;
  @Input() regionoptions: MasterItem[];
  @Input() mfloptions: MasterItem[];
  dataSource: Observable<any>;
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;

  constructor(private personService: PersonService) {
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.form.controls['mfl_name'].value);
    }).mergeMap((token: string) => this.personService.getMFL(token));
  }

  ngOnInit() {}

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    if (e.item && e.item.id) {
      this.form.controls['mfl_code'].setValue(e.item.id);
    }else {
      this.form.controls['mfl_code'].setValue(null);
    }
  }

}
