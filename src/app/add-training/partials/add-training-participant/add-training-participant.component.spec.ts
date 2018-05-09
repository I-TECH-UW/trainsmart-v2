import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrainingParticipantComponent } from './add-training-participant.component';

describe('AddTrainingParticipantComponent', () => {
  let component: AddTrainingParticipantComponent;
  let fixture: ComponentFixture<AddTrainingParticipantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTrainingParticipantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrainingParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
