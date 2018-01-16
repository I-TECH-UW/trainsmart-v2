import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingTopicOptionComponent } from './training-topic-option.component';

describe('TrainingTopicOptionComponent', () => {
  let component: TrainingTopicOptionComponent;
  let fixture: ComponentFixture<TrainingTopicOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingTopicOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingTopicOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
