import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionSubletPortalComponent } from './inspection-sublet-portal.component';

describe('InspectionSubletPortalComponent', () => {
  let component: InspectionSubletPortalComponent;
  let fixture: ComponentFixture<InspectionSubletPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionSubletPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionSubletPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
