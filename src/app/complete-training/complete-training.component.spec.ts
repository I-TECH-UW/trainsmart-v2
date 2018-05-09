import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteTrainingComponent } from './complete-training.component';

describe('CompleteTrainingComponent', () => {
  let component: CompleteTrainingComponent;
  let fixture: ComponentFixture<CompleteTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
