import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrainingTrainerComponent } from './add-training-trainer.component';

describe('AddTrainingTrainerComponent', () => {
  let component: AddTrainingTrainerComponent;
  let fixture: ComponentFixture<AddTrainingTrainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTrainingTrainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrainingTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
