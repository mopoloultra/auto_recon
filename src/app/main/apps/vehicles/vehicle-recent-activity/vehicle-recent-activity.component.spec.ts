import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRecentActivityComponent } from './vehicle-recent-activity.component';

describe('VehicleRecentActivityComponent', () => {
  let component: VehicleRecentActivityComponent;
  let fixture: ComponentFixture<VehicleRecentActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleRecentActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleRecentActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
