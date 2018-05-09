import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrainingGeneralComponent } from './add-training-general.component';

describe('AddTrainingGeneralComponent', () => {
  let component: AddTrainingGeneralComponent;
  let fixture: ComponentFixture<AddTrainingGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTrainingGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrainingGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
