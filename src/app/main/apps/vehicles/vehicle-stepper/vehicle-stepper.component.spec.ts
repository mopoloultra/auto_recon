import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleStepperComponent } from './vehicle-stepper.component';

describe('VehicleStepperComponent', () => {
  let component: VehicleStepperComponent;
  let fixture: ComponentFixture<VehicleStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
