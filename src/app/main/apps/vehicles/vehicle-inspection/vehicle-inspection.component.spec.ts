import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleInspectionComponent } from './vehicle-inspection.component';

describe('VehicleInspectionComponent', () => {
  let component: VehicleInspectionComponent;
  let fixture: ComponentFixture<VehicleInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
