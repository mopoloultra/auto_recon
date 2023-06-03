import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { UsersService } from 'app/services/users.service';
import { editUserProfile } from 'app/main/models/admin/users/edit/editUser';
import { Router } from '@angular/router';
import { hostHeaderInfo } from 'app/main/models/hostHeaderInfo';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
userData: any;

editProfileForm: FormGroup;
secondFormGroup: FormGroup;
thirdFormGroup: FormGroup;
isLinear = true;
profileImg: any = '';
userUpdateData: editUserProfile;
hostHeaderInfo: hostHeaderInfo;
showSpinner = false;
updatedImage: any = '';
  constructor(@Inject(MAT_DIALOG_DATA) data: any, 
              public dialogRef: MatDialogRef<ProfileEditComponent>, 
              private _formBuilder: FormBuilder,
              public userService: UsersService,
              public dialog: MatDialog, public router: Router) {

    this.userData = data.userData;
    this.hostHeaderInfo = new hostHeaderInfo();
    this.userUpdateData = new editUserProfile();
    this.userUpdateData.hostHeaderInfo = new hostHeaderInfo();
    console.log('this.userData');
    console.log(this.userData);
    
  }  

  ngOnInit() {
    this.showSpinner = false;
    
    this.profileImg = this.userData.userDetails.profilePic;
    this.editProfileForm = this._formBuilder.group({
       firstname: [this.userData.userDetails.fname, Validators.required],
       othername: [this.userData.userDetails.oname],
       lastname: [this.userData.userDetails.sname, Validators.required],
       contact: [this.userData.userDetails.contact, Validators.required],
       email: [this.userData.userDetails.email, Validators.required]
      
    });

    this.secondFormGroup = this._formBuilder.group({
      address: [this.userData.userDetails.address, Validators.required],
      addy2: [this.userData.userDetails.address2],
      state: [this.userData.userDetails.state, Validators.required],
      city: [this.userData.userDetails.city, Validators.required],
      zip: [this.userData.userDetails.zip]
    });

    this.updatedImage = this.userData.userDetails.profilePic;
  }

  close(): void{
    this.dialogRef.close();
  }

  skipUpdate(): void{
    this.dialogRef.close();
   }
 
  
 


  userBioData(form): void{
    console.log(form.value);

    this.userUpdateData.fname = form.value.firstname;
    this.userUpdateData.oname = form.value.othername;
    this.userUpdateData.sname = form.value.lastname;
    this.userUpdateData.email = form.value.email;
    this.userUpdateData.contact = form.value.contact;
    
         
    }

    userResidenceData(form): void{
      this.showSpinner = true;
      console.log(form.value);
      this.userUpdateData.hostHeaderInfo = this.hostHeaderInfo;
      this.userUpdateData.hostHeaderInfo.token = this.userService.getSession('userToken');
      this.userUpdateData.address = form.value.address;
      this.userUpdateData.address2 = form.value.addy2;
      this.userUpdateData.state = form.value.state;
      this.userUpdateData.city = form.value.city;
      this.userUpdateData.zip = form.value.zip;
      this.userUpdateData.id = this.userService.getSession('userDetails').id;
     
      console.log(this.userUpdateData);
      this.userService.editProfileInfo(this.userUpdateData).subscribe((data: any) => {
        console.log(data);
       
        
        if (data.responseCode === '000') {
     
          this.showSpinner = false;
          this.refreshDataOnSuccess();
          this.userService.showToast(data.responseMessage);

          setTimeout(() => {
          this.router.navigate(['apps/profile']).then(() => {
            this.skipUpdate();
          });
         }, 2000);
        } else {
          this.userService.showToast(data.responseMessage);
          
        } 

        setTimeout(() => {
          this.showSpinner = false;
        }, 3000);
      }, error => {
        console.log('update profile error', error);
        
      }); 
  
      this.dialogRef.close();
    }

  refreshDataOnSuccess(): void{
   const userdetails = {
    hostHeaderInfo: {
     channel: this.hostHeaderInfo.channel,
      sourceCode: this.hostHeaderInfo.sourceCode,
      token: this.userService.getSession('userToken')
     },
    id: this.userService.getSession('userDetails').id,
    userId: this.userService.getSession('userDetails').id,
    type: 1,
    compId: this.userService.getSession('companyInfo').id
   };

   this.userService.getCompanyUserInfo(userdetails).subscribe((data) => {
          sessionStorage.setItem('userDetails', JSON.stringify(data));

      }, err => {
        console.log('get company user error:', err);
      });
  }
  
  onFileSelected(event): void{
    const updatePicDetails = {
      hostHeaderInfo: {
       channel: this.hostHeaderInfo.channel,
        sourceCode: this.hostHeaderInfo.sourceCode,
        token: this.userService.getSession('userToken')
       },
      id: this.userService.getSession('userDetails').id,
      profilePic: ''
     };
    const selectedFile =  event.target.files[0] as File;
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.updatedImage = myReader.result;

      console.log('this.updatedImage');
      console.log(this.updatedImage);
    };

    myReader.readAsDataURL(selectedFile);
    

    console.log('this.selectedFile');
    console.log(selectedFile);

    updatePicDetails.profilePic = this.updatedImage;
    this.userService.getSession('userDetails').profilePic = this.updatedImage;
    console.log('updatePicDetails');
    console.log(updatePicDetails);
      
   /*  this.userService.editProfilePic(updatePicDetails).subscribe((data:any)=>{
        console.log(data);
        if (data.responseCode === '000') {
          
          this.refreshDataOnSuccess();
          this.userService.showToast(data.responseMessage);
          this.close();

        } else {
          this.userService.showToast(data.responseMessage);
          
        }
    },err=>{
      console.log(err);

    })  */

  }


}
