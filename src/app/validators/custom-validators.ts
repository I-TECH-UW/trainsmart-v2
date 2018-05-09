
import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidationErrors, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { PersonService } from '../shared';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

function isEmptyInputValue(value: any): boolean {
    // we do not check for string here so that it also works for arrays
    return value == null || value.length === 0;
}

@Injectable()
export class CustomValidators {
    constructor(private personService: PersonService) {}

    uniqueNationalID(): AsyncValidatorFn  {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            const initialID = control.root.get('initial_national_id').value;
            if (isEmptyInputValue(control.value)) {
                return of(null);
            } else if (control.value === initialID) {
                return of(null);
            } else {
                return this.personService.checkPersonExists(control.value).map(res => {
                    const message = {
                        'uniqueNationalID': {
                            'message': 'The national id is not unique'
                        }
                    };
                    return res ? message : null;
                });
            }
        };
    }
}

