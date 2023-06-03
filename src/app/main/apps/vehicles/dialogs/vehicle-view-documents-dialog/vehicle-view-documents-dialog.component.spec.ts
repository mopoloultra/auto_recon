import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleViewDocumentsDialogComponent } from './vehicle-view-documents-dialog.component';

describe('VehicleViewDocumentsDialogComponent', () => {
  let component: VehicleViewDocumentsDialogComponent;
  let fixture: ComponentFixture<VehicleViewDocumentsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleViewDocumentsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleViewDocumentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
