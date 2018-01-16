import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingTitleComponent } from './training-title.component';

describe('TrainingTitleComponent', () => {
  let component: TrainingTitleComponent;
  let fixture: ComponentFixture<TrainingTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
