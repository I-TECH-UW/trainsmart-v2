import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonContactComponent } from './add-person-contact.component';

describe('AddPersonContactComponent', () => {
  let component: AddPersonContactComponent;
  let fixture: ComponentFixture<AddPersonContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPersonContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPersonContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
