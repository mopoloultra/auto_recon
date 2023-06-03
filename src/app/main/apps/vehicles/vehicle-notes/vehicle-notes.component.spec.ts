import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleNotesComponent } from './vehicle-notes.component';

describe('VehicleNotesComponent', () => {
  let component: VehicleNotesComponent;
  let fixture: ComponentFixture<VehicleNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
