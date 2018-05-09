import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonGeneralComponent } from './add-person-general.component';

describe('AddPersonGeneralComponent', () => {
  let component: AddPersonGeneralComponent;
  let fixture: ComponentFixture<AddPersonGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPersonGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPersonGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
