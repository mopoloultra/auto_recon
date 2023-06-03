import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyRoleComponent } from './edit-company-role.component';

describe('EditCompanyRoleComponent', () => {
  let component: EditCompanyRoleComponent;
  let fixture: ComponentFixture<EditCompanyRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCompanyRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
