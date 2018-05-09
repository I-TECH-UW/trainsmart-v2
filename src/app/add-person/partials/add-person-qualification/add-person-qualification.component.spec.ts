import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonQualificationComponent } from './add-person-qualification.component';

describe('AddPersonQualificationComponent', () => {
  let component: AddPersonQualificationComponent;
  let fixture: ComponentFixture<AddPersonQualificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPersonQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPersonQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
