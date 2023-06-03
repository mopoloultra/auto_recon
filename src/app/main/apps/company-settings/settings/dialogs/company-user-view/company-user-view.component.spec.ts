import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyUserViewComponent } from './company-user-view.component';

describe('CompanyUserViewComponent', () => {
  let component: CompanyUserViewComponent;
  let fixture: ComponentFixture<CompanyUserViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyUserViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
