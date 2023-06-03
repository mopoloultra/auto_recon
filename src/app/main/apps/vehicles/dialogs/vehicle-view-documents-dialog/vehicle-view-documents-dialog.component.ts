import {Component, OnInit, Inject, ɵConsole, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {VehicleService} from '../../../../../services/vehicle.service';
import {GetDocument} from '../../../../models/vehicles/GetDocument';
import {UsersService} from '../../../../../services/users.service';


export interface DocumentData {
  docID: any;
  vehicleID: any;

}

@Component({
  selector: 'app-vehicle-view-documents-dialog',
  templateUrl: './vehicle-view-documents-dialog.component.html',
  styleUrls: ['./vehicle-view-documents-dialog.component.scss']
})
export class VehicleViewDocumentsDialogComponent implements OnInit {
  enableDelete = false;
  public hostHeaderInfo: hostHeaderInfo;
  public GetDocument: GetDocument;
  doc: any;
  @Output() onDelete = new EventEmitter();

  imagesLoader = false;
  isImages = true;
  imagesInspection: Array<any>;
  selectedImg: any;
  documentID: any;
  selectedIndex = 0;

  constructor(public dialogRef: MatDialogRef<VehicleViewDocumentsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DocumentData, public sanitizer: DomSanitizer, public vehicleService: VehicleService, public usersService: UsersService) {
    this.hostHeaderInfo = new hostHeaderInfo();
    this.GetDocument = new GetDocument();
    this.GetDocument.hostHeaderInfo = this.hostHeaderInfo;
    // this.doc.hostHeaderInfo = this.hostHeaderInfo;
    this.doc = {id: '', isActiveFlag: '', hostHeaderInfo: this.hostHeaderInfo};
    this.imagesInspection = [];
  }

  ngOnInit(): void {
    this.getDocuments();
  }

  onNoClick(){
    this.dialogRef.close();
  }

  showDelete(): void{
    this.enableDelete = true;
  }

  removeDelete(): void{
    this.enableDelete = false;
  }
  imageConvert(vehicleImg): any {
    if (vehicleImg != null) {
      return  this.sanitizer.bypassSecurityTrustUrl('data:Image/*;base64,' + vehicleImg);
    }else {
      return '/assets/sample-car-imgs/placeholder.png';
    }
  }

  deleteDocument(): void {
      this.doc.id = this.documentID;
      this.doc.isActiveFlag = false;
      this.vehicleService.showToast('Deleting document');

      this.vehicleService.addNewDocument(this.doc).subscribe( response => {
      if (response.hostHeaderInfo.responseCode === '000') {
        this.vehicleService.showToast('Document deleted successfully');
        this.imagesInspection.splice(this.selectedIndex, 1);
        this.onDelete.emit('000');

        if(this.imagesInspection.length > 0){
          this.selectedImg = this.imagesInspection[0].documentBase64;
        }else if(this.imagesInspection.length === 0){
          this.isImages = false;
        }



      } else {

        this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
      }

    }, error => {

      this.vehicleService.showToast('Please try again later');
    });


      console.log(this.doc);
  }

  getDocuments(): void{
    this.GetDocument.vehicleID = this.data.vehicleID;
    this.GetDocument.documentTypeID =  this.data.docID;
    this.GetDocument.companyID = this.usersService.getSession('companyInfo').id;
    this.imagesLoader = true;
    this.vehicleService.getDocuments(this.GetDocument).subscribe(resp => {
      console.log(resp);
      if(resp.hostHeaderInfo.responseCode === '000'){
        this.imagesLoader = false;
        this.isImages = true;
        this.imagesInspection = resp.Documents;
        this.selectedImg = this.imagesInspection[0].documentBase64;
        this.documentID = this.imagesInspection[0].id;

      }else{
        this.imagesLoader = false;
        this.isImages = false;
      }

    },error => {
      this.imagesLoader = false;
      this.isImages = false;
    });
  }

  scrollLeft(): void{
    document.getElementById('image-grids').scrollLeft += 800;
  }

  scrollRight(): void{
    document.getElementById('image-grids').scrollLeft -= 800;
  }

  changeImage(doc, index): void{
    this.selectedImg = doc.documentBase64;
    this.documentID = doc.id;
    this.selectedIndex = index;
  }
}
