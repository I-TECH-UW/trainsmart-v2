import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PepfarOptionComponent } from './pepfar-option.component';

describe('PepfarOptionComponent', () => {
  let component: PepfarOptionComponent;
  let fixture: ComponentFixture<PepfarOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PepfarOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PepfarOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
