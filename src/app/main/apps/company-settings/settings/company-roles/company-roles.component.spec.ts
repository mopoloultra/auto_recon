import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRolesComponent } from './company-roles.component';

describe('CompanyRolesComponent', () => {
  let component: CompanyRolesComponent;
  let fixture: ComponentFixture<CompanyRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
