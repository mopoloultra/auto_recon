import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import {UsersService} from '../../../../services/users.service';
import {VehicleService} from '../../../../services/vehicle.service';
import {hostHeaderInfo} from '../../../models/hostHeaderInfo';

@Component({
  selector: 'app-inspection-sublet-portal',
  templateUrl: './inspection-sublet-portal.component.html',
  styleUrls: ['./inspection-sublet-portal.component.scss']
})
export class InspectionSubletPortalComponent implements OnInit, AfterViewInit {

  @Input() vehicleID:any;
  public hostHeaderInfo: hostHeaderInfo;
  body: any;
  subletPortalItems: any[];
  companyVendors: any[];
  isLoading: boolean = false;
  isLoadingSublet: boolean = true;
  vendorUsers: any[] = [];
  userfromVendorObject: any;
  isVendorSelected:boolean = false;

  constructor(public vehicleService: VehicleService, public usersService: UsersService) 
  { 
    
    this.hostHeaderInfo = new hostHeaderInfo();
    
  }

  ngOnInit() 
  {
    if (!this.body){
      this.body = {
        hostHeaderInfo : {
          channel : 'web',
          sourceCode : 'xxx',
          token : 'xxxxx'
        },
        companyID : this.usersService.getSession('companyInfo').id,
        vehicleID : this.vehicleID
      };
    }
    
  }
  ngAfterViewInit(): void {

    this.vehicleService.getInspectionSubletPortal(this.body).then(response =>{
      if (response.hostHeaderInfo.responseCode === '000') {
        this.subletPortalItems = response.inspectionSubletPortalLineItems;
        this.isLoadingSublet = false;
      }
    });
  }

  getCompanyVendor(vendorTypeId : any) : void 
  {
    this.userfromVendorObject = {};
    this.isLoading = true;
    const data = {
        hostHeaderInfo : {
          channel : 'web',
          sourceCode : 'xxx',
          token : 'xxxxx'
        },
        companyID : this.usersService.getSession('companyInfo').id,
        companyVendorType : vendorTypeId
      };
      console.log(data);
    this.vehicleService.getCompanyVendors(data).then(response =>{
      this.isLoading = false;
      if (response.hostHeaderInfo.responseCode === '000') {
        this.companyVendors = response.vendorList;
      }
    })
  }

  getVendorUsers(vendorUsers : any) : void 
  {
    this.vendorUsers = vendorUsers;
    this.isVendorSelected = true;
  }

  getVendorUser(collectedUser : any) : void 
  {
    this.userfromVendorObject = collectedUser;
    console.log(this.userfromVendorObject);
  }

}
