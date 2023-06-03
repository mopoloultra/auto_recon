import {Component, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {FormControl, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {VehicleService} from '../../../../services/vehicle.service';
import {UsersService} from '../../../../services/users.service';
import {takeUntil} from 'rxjs/operators';
import {MatDialog, MatDialogRef, MatTabGroup} from '@angular/material';
import {PhaseUpdateComponent} from '../dialogs/phase-update/phase-update.component';
import {ActivatedRoute, Router} from '@angular/router';
import {GetDocument} from '../../../models/vehicles/GetDocument';
import {hostHeaderInfo} from '../../../models/hostHeaderInfo';
import {UploadDocumentDialogComponent} from '../dialogs/upload-document-dialog/upload-document-dialog.component';
import {PhasesPipe} from '../pipes/phases.pipe';
import {UpdateVehiclePhase} from '../../../models/vehicles/UpdateVehiclePhase';
import {VehicleViewDocumentsDialogComponent} from '../dialogs/vehicle-view-documents-dialog/vehicle-view-documents-dialog.component';
import {MatSelectChange} from '@angular/material';
import {CreateConfirmationComponent} from '../dialogs/create-confirmation/create-confirmation.component';
import {Inspections} from '../../../models/vehicles/Inspections';
import {MultipointUploadDialogComponent} from '../dialogs/multipoint-upload-dialog/multipoint-upload-dialog.component';
import {SaveInspectionMultipointAnswer} from '../../../models/vehicles/SaveInspectionMultipointAnswer';
import {ProcessingDialogComponent} from '../dialogs/processing-dialog/processing-dialog.component';
import {InspectionNotes} from '../../../models/vehicles/InspectionNotes';
import {NotesDialogComponent} from '../dialogs/notes-dialog/notes-dialog.component';
import {DocumentViewComponent} from '../dialogs/document-view/document-view.component';
import {InspectionNumbers} from '../../../models/vehicles/inspectionNumbers';
import {PdfService} from '../../../../services/pdf.service';
import {GetVehicle} from '../../../models/vehicles/GetVehicle';
import {VehicleTag} from '../../../models/vehicles/VehicleTag';
import {InspectionAction} from '../../../models/vehicles/InspectionAction';


// tslint:disable-next-line:class-name
export interface approvalsData {
    status: string;
    vendor: string;
    decsiption: string;
    operation: string;
    type: string;
    qty: number;
    part: number;
    parts: number;
    labor: number;
    rate: number;
    tax: number;
    total: number;
    id: number;

}

export interface repairData {
    operation: string;
    vendor: string;
    description: string;
    id: number;
    estimated: number;
    completion: number;

}

const tabelData: approvalsData[] = [
    {
        status: 'checked',
        vendor: 'Fergurson GMC',
        decsiption: 'Lube Oil Fil',
        operation: 'Mechanical',
        type: 'Flat Rate',
        qty: 1,
        part: 87889,
        parts: 1,
        labor: 3.0,
        rate: 75.0,
        tax: 0,
        total: 78.0,
        id: 1
    },
    {
        status: 'checked',
        vendor: 'Fergurson GMC',
        decsiption: 'Trans Cooler Line',
        operation: 'Mechanical',
        type: 'Flat Rate',
        qty: 1,
        part: 87889,
        parts: 1,
        labor: 3.0,
        rate: 75.0,
        tax: 0,
        total: 7,
        id: 2
    },

    {
        status: 'checked',
        vendor: 'Fergurson GMC',
        decsiption: 'Front Brake Pads',
        operation: 'Mechanical',
        type: 'Flat Rate',
        qty: 1,
        part: 87889,
        parts: 1,
        labor: 3.0,
        rate: 75.0,
        tax: 0,
        total: 7,
        id: 3
    }

];

const repairsData: repairData[] = [
    {
        operation: 'Mechanical',
        vendor: 'Fergurson GMC',
        description: 'Lube Oil Filter',
        id: 1,
        estimated: 4.7,
        completion: 0.3
    }
];


@Component({
    selector: 'app-view-vehicle',
    templateUrl: './view-vehicle.component.html',
    providers: [PhasesPipe],
    styleUrls: ['./view-vehicle.component.scss']
})
export class ViewVehicleComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('paginatorU', {static: true}) paginatorU: MatPaginator;
    @ViewChild('paginatorInspection', {static: true}) paginatorInspection: MatPaginator;
    @ViewChild('paginatorRepair', {static: true}) paginatorRepair: MatPaginator;
    @ViewChild(MatSort, {static: true}) inspectionSort: MatSort;
    @ViewChild(MatSort, {static: true}) repairSort: MatSort;

    vehicle: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    private _unsubscribeAllType: Subject<any>;
    private _unsubscribeAllInspectionType: Subject<any>;
    private _unsubscribeAllQuestionType: Subject<any>;
    private _unsubscribeAllPhases: Subject<any>;
    private _unsubscribeActiveInspection: Subject<any>;
    public GetDocument: GetDocument;
    public hostHeaderInfo: hostHeaderInfo;



    selected: any;
    selectedRecon: any;

    displayedColumns = ['status', 'id', 'decsiption', 'operation', 'type', 'qty', 'part', 'parts', 'labor', 'rate', 'tax', 'total', 'assign', 'actions', 'revision'];
    approvalDataSource = new MatTableDataSource(tabelData);

    inspectionDisplayedColumns: string[] = ['id', 'name', 'photo', 'note', 'action', 'status'];


    repairDisplayedColumns: string[] = ['remove', 'id', 'vendor', 'description', 'operation', 'estimated', 'comments', 'notes', 'timer', 'completion'];
    repairsDataSource = new MatTableDataSource(repairsData);

    approval = false;
    approvalTitle: any;
    approvalIcon: any;

    selectedPerson = false;
    timerReady = false;
    userName = new FormControl('');
    dateStarted: any;

    vehicleData: any;
    vehicleID: any;
    phases = [];
    DocumentTypes: Array<any>;
    countDoc: number;
    inspectionTypes: Array<any>;
    tempDocTypes: Array<any>;
    phaseID: any;

    phaseDialogRef: MatDialogRef<any>;
    newInspectionDialogRef: MatDialogRef<any>;
    public UpdateVehiclePhase: UpdateVehiclePhase;

    currentDocTypes = [];
    public Inspections: Inspections;
    inspectionDataSource: any;
    inspectionID: any;
    loader = false;
    inspectionMultipoint: Array<any>;
    inspectionNumbers: InspectionNumbers;
    public SaveInspectionMultipointAnswer: SaveInspectionMultipointAnswer;
    public InspectionNotes: InspectionNotes;
    notes = new FormControl('', Validators.required);
    questionType: Array<any>;

    questionTypeSectOne: Array<any>;
    questionTypeSectTwo: Array<any>;
    stepsIndex: number;
    multipointDataSource: Array<any>;

    activeInspections: Array<any>;
    currentCount: boolean;

    isImages = false;
    imagesLoader = false;
    imagesInspection: Array<string>;
    pdfData: Array<any>;
    data: any;
    vehicleTags: Array<any>;

    inspectionOptions = new FormControl('', Validators.required);
    public GetVehicle: GetVehicle;
    resp: any;
    public VehicleTag: VehicleTag;
    tagAddDialog: any;
    inspectionQuestionActionTypes: Array<any>;
    public InspectionAction: InspectionAction;

    selectedInspectionTab = 0;
    @ViewChild(MatTabGroup, {static: false}) tabGroup: MatTabGroup;
    selectedInspectionTabTwo = 0;

    constructor(public pdfService: PdfService, iconRegistry: MatIconRegistry, public sanitizer: DomSanitizer, public vehicleService: VehicleService, public dialog: MatDialog, private _activatedRoute: ActivatedRoute, public usersService: UsersService, private phasesPipe: PhasesPipe) {
        iconRegistry.addSvgIcon(
            'photo',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/camera.svg'));

        iconRegistry.addSvgIcon(
            'invoice',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/invoice.svg'));

        iconRegistry.addSvgIcon(
            'ro',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/ro.svg'));

        iconRegistry.addSvgIcon(
            'list',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/to-do-list.svg'));

        iconRegistry.addSvgIcon(
            'car-repair',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/car-repair.svg'));

        iconRegistry.addSvgIcon(
            'car',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/car.svg'));

        iconRegistry.addSvgIcon(
            'upload',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/upload.svg'));

        iconRegistry.addSvgIcon(
            'warning',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/warning.svg'));

        iconRegistry.addSvgIcon(
            'checkmark',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/checkmark.svg'));

        iconRegistry.addSvgIcon(
            'down-arrow',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/down-arrow.svg'));

        iconRegistry.addSvgIcon(
            'checked',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/checked.svg'));

        iconRegistry.addSvgIcon(
            'comment',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/comment.svg'));

        iconRegistry.addSvgIcon(
            'attached',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/attached.svg'));

        iconRegistry.addSvgIcon(
            'play-button',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/play-button.svg'));

        iconRegistry.addSvgIcon(
            'bin',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/bin.svg'));

        iconRegistry.addSvgIcon(
            'paper',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/paper.svg'));

        iconRegistry.addSvgIcon(
            'edit',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/edit.svg'));

        iconRegistry.addSvgIcon(
            'outline',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/outline.svg'));

        iconRegistry.addSvgIcon(
            'active',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/active.svg'));

        iconRegistry.addSvgIcon(
            'chat',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/custom-icons/chat.svg'));

        this._unsubscribeAll = new Subject();
        this._unsubscribeAllType = new Subject();
        this._unsubscribeAllInspectionType = new Subject();
        this._unsubscribeAllQuestionType = new Subject();
        this._unsubscribeAllPhases = new Subject();
        this._unsubscribeActiveInspection = new Subject();
        this.phases = [];
        this.DocumentTypes = [];
        this.GetDocument = new GetDocument();
        this.hostHeaderInfo = new hostHeaderInfo();
        this.GetDocument.hostHeaderInfo = this.hostHeaderInfo;
        this.countDoc = 0;
        this.inspectionTypes = [];
        this.tempDocTypes = [];
        this.UpdateVehiclePhase = new UpdateVehiclePhase();
        this.UpdateVehiclePhase.hostHeaderInfo = this.hostHeaderInfo;
        this.currentDocTypes = [];
        this.Inspections = new Inspections();
        this.Inspections.hostHeaderInfo = this.hostHeaderInfo;
        this.inspectionMultipoint = [];
        this.SaveInspectionMultipointAnswer = new SaveInspectionMultipointAnswer();
        this.SaveInspectionMultipointAnswer.hostHeaderInfo = this.hostHeaderInfo;
        this.InspectionNotes = new InspectionNotes();
        this.InspectionNotes.hostHeaderInfo = this.hostHeaderInfo;
        this.questionType = [];
        this.questionTypeSectOne = [];
        this.questionTypeSectTwo = [];
        this.multipointDataSource = [];
        this.activeInspections = [];
        this.inspectionNumbers = new InspectionNumbers();
        this.imagesInspection = [];
        this.pdfData = [];

        this.vehicleTags = [];

        this.GetVehicle = new GetVehicle();
        this.GetVehicle.hostHeaderInfo = this.hostHeaderInfo;

        this.VehicleTag = new VehicleTag();
        this.VehicleTag.hostHeaderInfo = this.hostHeaderInfo;
        this.inspectionQuestionActionTypes = [];
        this.InspectionAction = new InspectionAction();
        this.InspectionAction.hostHeaderInfo = this.hostHeaderInfo;




    }


    // tslint:disable-next-line:typedef
    ngOnInit() {


        this.getVehicleTags();
        this.getInspectionActions();

        this._activatedRoute.params.subscribe(params => {
            this.vehicleID = params['vehicleID'];
            this.getMultiPointQuestions(1);
            this.getInspectionImages(params['vehicleID']);


        });

        this.vehicleService.onVehicleChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(vehicle => {
                this.vehicle = vehicle;
                this.vehicleData = this.vehicle.vehicles[0];
                const currentPhase = this.vehicleData.vehicleSteps.filter(phase => phase['isCurrent'] === true);
                this.phaseID = currentPhase[0].stepID;


            });

        this.vehicleService.onDocTypeChange
            .pipe(takeUntil(this._unsubscribeAllType))
            .subscribe(types => {
                this.tempDocTypes = types.DocumentTypes;
                this.DocumentTypes = this.tempDocTypes.filter(type => type['name'].substr(0, 16) === 'Inspection Image');


            });

        this.vehicleService.onInspectionTypeChange
            .pipe(takeUntil(this._unsubscribeAllInspectionType))
            .subscribe(resp => {
                this.inspectionTypes = resp.inspectionTypes;

            });

        this.vehicleService.onActiveInspectionChange
            .pipe(takeUntil(this._unsubscribeActiveInspection))
            .subscribe(resp => {
                this.activeInspections = resp.currentInspections;
                console.log(this.activeInspections);
                // this.getActiveInspection();



            });

        this.vehicleService.onQuestionTypeChange
            .pipe(takeUntil(this._unsubscribeAllQuestionType))
            .subscribe(resp => {
                this.questionType = resp.inspectionMultipointQuestionTypes;
                const type = this.splitArray(this.questionType, 2);
                this.questionTypeSectOne = type[0];
                this.questionTypeSectTwo = type[1];




            });

        this.vehicleService.onPhasesChange
            .pipe(takeUntil(this._unsubscribeAllPhases))
            .subscribe(phases => {
                this.phases = phases.steps;


            });


        this.approvalTitle = 'RECON PLAN';
        this.approvalIcon = 'car';


        this.selected = 0;
        this.selectedRecon = 0;
        this.approvalDataSource.sort = this.sort;
        this.repairsDataSource.paginator = this.paginatorRepair;
        this.repairsDataSource.sort = this.repairSort;

        console.log(this.inspectionID);



    }

    selectedIndexChange(event): void {
        this.selectedInspectionTab = event;
        // this.tabGroup.selectedIndex = event;
    }

    selectedIndexChangeTwo(event): void {
        this.selectedInspectionTabTwo = event;
        // this.tabGroup.selectedIndex = event;
    }




    // tslint:disable-next-line:typedef
    selectedTab(option) {
        this.selected = option;
    }

    selectedTabRecon(option) {
        this.selectedRecon = option;
    }

    toggleApproval() {
        this.approval = true;
        this.approvalTitle = 'NEED APPROVAL';
        this.approvalIcon = 'checkmark';
    }

    toggleRecon() {
        this.approval = false;
        this.approvalTitle = 'RECON PLAN';
        this.approvalIcon = 'car';
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.inspectionDataSource.filter = filterValue.trim().toLowerCase();
    }

    // tslint:disable-next-line:typedef
    getPassIcon(status) {

        if (status === 1) {
            return 'active';
        } else {
            return 'outline';
        }
    }

    // tslint:disable-next-line:typedef
    getFailIcon(status) {
        if (status === 2) {
            return 'active';
        } else {
            return 'outline';
        }
    }

    // tslint:disable-next-line:typedef
    getNAIcon(status) {
        if (status === 3) {
            return 'active';
        } else {
            return 'outline';
        }
    }

    setUpTimer(event) {
        this.selectedPerson = true;
    }

    startTimer() {
        this.timerReady = true;
        this.dateStarted = new Date();
        this.startTimerCountUp();


    }

    startTimerCountUp() {
        this.stopTimer();

    }


    stopTimer() {

    }

    imageConvert(vehicleImg): any {
        if (vehicleImg != null) {
            return this.sanitizer.bypassSecurityTrustUrl('data:Image/*;base64,' + vehicleImg);
        } else {
            return '/assets/sample-car-imgs/placeholder.png';
        }
    }


    updatePhase(): void {
        const dialogRef = this.dialog.open(PhaseUpdateComponent, {
            width: '350px',
            data: {vehicleID: this.vehicleID, phases: this.phases}
        });
    }





    uploadDocument(): void {
        const dialogRef = this.dialog.open(UploadDocumentDialogComponent, {
            width: '550px',
            height: '650px',
            data: {vehicleID: this.vehicleID, docTypes: this.DocumentTypes}
        });

        dialogRef.componentInstance.onSave.subscribe(res => {
            if (res) {

            }


        });
    }



    getImage(key: any): any {
        return this.imageConvert(key);

    }



    viewAllImages(key: any): void {
        const dialogRef = this.dialog.open(VehicleViewDocumentsDialogComponent, {
            panelClass: 'document-view-dialog',
            width: '70vw',
            minHeight: '500px',
            data: {docID: key, vehicleID: this.vehicleID}
        });

        dialogRef.componentInstance.onDelete.subscribe(res => {
            if (res) {
                this.getInspectionImagesNoLoader(this.vehicleID);
            }
        });
    }

    createNewInspection(event: MatSelectChange): void {

        const selected = this.activeInspections.filter(type => type['inspectionTypeID'] === parseInt(event.value));
        if (selected.length > 0){
            this.inspectionID = selected[0].id;
            this.getMultiPointQuestions(this.stepsIndex);
        }else{
            this.Inspections.inspectionTypeID = event.value;
            this.Inspections.createdByUserID = this.usersService.getSession('userDetails').id;
            this.Inspections.companyID = this.usersService.getSession('companyInfo').id;
            this.Inspections.vehicleID = this.vehicleID;
            this.newInspectionDialogRef = this.dialog.open(CreateConfirmationComponent);


            this.newInspectionDialogRef.componentInstance.onCreate.subscribe(res => {
                if (res) {
                    this.createInspection();
                }
            });
        }



    }

    createInspection(): void {

        this.vehicleService.createInspection(this.Inspections).subscribe(response => {
            if (response.hostHeaderInfo.responseCode === '000') {
                this.inspectionID = response.inspectionID;
                this.getMultiPointQuestions(this.stepsIndex);
                this.newInspectionDialogRef.close();
                this.vehicleService.showToast('Inspection started successfully');

            } else {
                this.newInspectionDialogRef.componentInstance.loader = false;
                this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
            }

            // tslint:disable-next-line:no-shadowed-variable
        }, error => {
            this.newInspectionDialogRef.componentInstance.loader = false;
            this.vehicleService.showToast('Please try again later');
        });

    }

    getMultiPointQuestions(id: any): void {
        let dialogRef;
        if (this.selectedInspectionTab === 1){
             dialogRef = this.dialog.open(ProcessingDialogComponent, {
                width: '100px',
                height: '100px',
                disableClose: false
            });
        }


        this.loader = true;
        this.vehicleService.getMultiPointQuestions(this.vehicleID, this.inspectionID, this.inspectionOptions.value).subscribe(res => {

            if(this.selectedInspectionTab === 1){
                dialogRef.close();
            }

            if (res) {
                this.loader = false;
                this.inspectionMultipoint = res.inspectionMultipointQuestions;
                this.getSpecificTypeQuestions(id);
                this.getPDFData();

                console.log(this.inspectionMultipoint)


                this.getInspectionNumbers();

            } else {
                this.loader = false;
            }


        }, error => {
            this.loader = false;
        });
    }

    addMultipointPhoto(id): void {
        if (this.inspectionID) {
            const dialogRef = this.dialog.open(MultipointUploadDialogComponent, {
                width: '550px',
                height: '400px',
                data: {inspectionID: this.inspectionID, inspectionMultipointQuestionID: id}
            });

            dialogRef.componentInstance.onSave.subscribe(res => {
                if (res) {
                    this.getMultiPointQuestions(this.stepsIndex);
                }


            });
        } else {
            this.vehicleService.showToast('Start an inspection to upload images');
        }

    }

    getInspectionNumbers(): void {
        this.inspectionNumbers['completed'] = this.multipointDataSource.filter(type => type['selectedAnswerID'] !== 0).length;
        this.inspectionNumbers['passed'] = this.multipointDataSource.filter(type => type['selectedAnswerID'] === 1).length;
        this.inspectionNumbers['failed'] = this.multipointDataSource.filter(type => type['selectedAnswerID'] === 2).length;
        this.inspectionNumbers['na'] = this.multipointDataSource.filter(type => type['selectedAnswerID'] === 3).length;
        this.inspectionNumbers['unselcted'] = this.multipointDataSource.filter(type => type['selectedAnswerID'] === 0).length;

    }

    addInspectionAnswer(answerID: any, questionID: any, index:any): void {


        if (this.inspectionID) {
            const dialogRef = this.dialog.open(ProcessingDialogComponent, {
                width: '100px',
                height: '100px',
                disableClose: false
            });

            this.SaveInspectionMultipointAnswer.answerID = answerID;
            this.SaveInspectionMultipointAnswer.questionID = questionID;
            this.SaveInspectionMultipointAnswer.inspectionTypeID = this.inspectionOptions.value;
            this.SaveInspectionMultipointAnswer.inspectionID = this.inspectionID;
            this.SaveInspectionMultipointAnswer.vehicleID = parseInt(this.vehicleID);
            this.SaveInspectionMultipointAnswer.createdByUserID = this.usersService.getSession('userDetails').id;
            this.SaveInspectionMultipointAnswer.companyID = this.usersService.getSession('companyInfo').id;

            this.vehicleService.saveInspectionMultipointAnswer(this.SaveInspectionMultipointAnswer).subscribe(response => {
                if (response.hostHeaderInfo.responseCode === '000') {
                    this.vehicleService.showToast('Answer added successfully');
                    this.multipointDataSource[index].selectedAnswerID = answerID;
                    this.inspectionDataSource = new MatTableDataSource(this.multipointDataSource);
                    // this.getMultiPointQuestions(this.stepsIndex);
                    dialogRef.close();
                } else {
                    dialogRef.close();
                    this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
                }

            }, error => {
                dialogRef.close();
                this.vehicleService.showToast('Please try again later');
            });

        } else {
            this.vehicleService.showToast('Start an inspection to add an answer');
        }

    }

    viewAllNotes(id: any): void {

        const dialogRef = this.dialog.open(NotesDialogComponent, {
            panelClass: 'document-view-dialog',
            width: '50vw',
            minHeight: '500px',
            data: {id: id, vehicleID: parseInt(this.vehicleID)}
        });

    }

    saveNote(id): void {
        const dialogRef = this.dialog.open(ProcessingDialogComponent, {
            width: '100px',
            height: '100px',
            disableClose: false
        });

        this.InspectionNotes.inspectionMultipointQuestionID = id;
        this.InspectionNotes.note = this.notes.value;
        this.InspectionNotes.id = 0;
        this.InspectionNotes.isActiveFlag = true;
        this.InspectionNotes.vehicleID = parseInt(this.vehicleID);
        this.InspectionNotes.createdByUserID = this.usersService.getSession('userDetails').id;
        this.InspectionNotes.companyID = this.usersService.getSession('companyInfo').id;
        this.InspectionNotes.noteTypeID = 3;

        this.vehicleService.saveNote(this.InspectionNotes).subscribe(response => {
            if (response.hostHeaderInfo.responseCode === '000') {
                this.vehicleService.showToast('Note added successfully');
                this.getMultiPointQuestions(id);
                dialogRef.close();
                this.notes.setValue('');
            } else {
                dialogRef.close();
                this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
            }

        }, error => {
            dialogRef.close();
            this.vehicleService.showToast('Please try again later');
        });

    }

    splitArray(arr, n): Array<any> {
        const chunkLength = Math.max(arr.length / n, 1);
        const chunks = [];
        for (let i = 0; i < n; i++) {
            if (chunkLength * (i + 1) <= arr.length) {
                chunks.push(arr.slice(chunkLength * i, chunkLength * (i + 1)));
            }
        }
        console.log(chunks);
        return chunks;
    }

    getTotalQuestionsTypes(id): number {
        return this.inspectionMultipoint.filter(type => type['TypeID'] === id).length;
    }

    getTotalQuestionsTypesAnswered(id): number {
        return this.inspectionMultipoint.filter(type => type['TypeID'] === id && type['selectedAnswerID'] !== 0).length;
    }


    getSpecificTypeQuestions(id: any): void {
        this.multipointDataSource = [];
        this.stepsIndex = id;
        this.multipointDataSource = this.inspectionMultipoint.filter(type => type['TypeID'] === id);
        this.inspectionDataSource = new MatTableDataSource(this.multipointDataSource);
        this.inspectionDataSource.paginator = this.paginatorInspection;
        this.inspectionDataSource.sort = this.inspectionSort;
    }

    get answeredTotal(){
        return this.inspectionMultipoint.filter(type =>  type['selectedAnswerID'] !== 0).length;
    }

    roundNumbersToClosestWhole(num):any{
        return  Math.round(num);

    }



    getActiveInspection(): void{
        const count = this.activeInspections.length;
        for (let x = 0; x > count; x++){
            if(this.activeInspections[x].isDefault){
                this.inspectionID = this.activeInspections[x].id;
                console.log(this.inspectionID);
            }
        }
    }

    viewFullImage(data): void{
        this.dialog.open(DocumentViewComponent, {
            width: '500px',
            minHeight: '500px',
            data: {base64: data}
        });
    }

    getNewPhase(phaseID): void{
        this.phaseID = phaseID;
    }

    cancelInspection(): void{
        this.inspectionID = '';
    }

    getInspectionImages(vehicleID): void{
        this.imagesLoader = true;
        this.vehicleService.getInspectionImages(vehicleID).subscribe(resp => {
            if(resp.hostHeaderInfo.responseCode === '000'){
                this.imagesLoader = false;
                this.isImages = true;
                this.imagesInspection = resp.DocumentTypesListing;

            }else{
                this.imagesLoader = false;
                this.isImages = false;
            }

        },error => {
            this.imagesLoader = false;
            this.isImages = false;
        });
    }

    getInspectionImagesNoLoader(vehicleID): void{
        this.vehicleService.getInspectionImages(vehicleID).subscribe(resp => {
            if(resp.hostHeaderInfo.responseCode === '000') {
                this.imagesInspection = resp.DocumentTypesListing;

            }
        });
    }


    getVehicleTags(): void {
        this.vehicleService.getVehicleTags().subscribe(resp => {
            if (resp.hostHeaderInfo.responseCode === '000') {
                this.vehicleTags = resp.tags;
                console.log(this.vehicleTags);

            }
        });
    }

    addTag(tag: any): void{
        this.tagAddDialog = this.dialog.open(ProcessingDialogComponent, {
            width: '100px',
            height: '100px',
            disableClose: false
        });


        this.VehicleTag.tagID = tag.id;
        this.VehicleTag.vehicleID = this.vehicleID;
        this.VehicleTag.isActiveFlag  = true;
        this.VehicleTag.createdByUserID = this.usersService.getSession('userDetails').id;

        this.vehicleService.vehicleTag(this.VehicleTag).subscribe(response => {
            if (response.hostHeaderInfo.responseCode === '000') {
                this.getDataNoLoad();
            } else {
                this.tagAddDialog.close();
                this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
            }

        }, error => {
            this.tagAddDialog.close();
            this.vehicleService.showToast('Please try again later');
        });
    }

    deleteTag(tag: any): void{
        this.tagAddDialog = this.dialog.open(ProcessingDialogComponent, {
            width: '100px',
            height: '100px',
            disableClose: false
        });


        this.VehicleTag.tagID = tag.id;
        this.VehicleTag.vehicleID = this.vehicleID;
        this.VehicleTag.isActiveFlag  = false;
        this.VehicleTag.createdByUserID = this.usersService.getSession('userDetails').id;

        this.vehicleService.vehicleTag(this.VehicleTag).subscribe(response => {
            if (response.hostHeaderInfo.responseCode === '000') {
                this.getDataNoLoad();

            } else {
                this.tagAddDialog.close();
                this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
            }

        }, error => {
            this.tagAddDialog.close();
            this.vehicleService.showToast('Please try again later');
        });


    }

    getDataNoLoad(): void{
        this.GetVehicle.phaseID = 0;
        this.GetVehicle.companyID = this.usersService.getSession('companyInfo').id;
        this.GetVehicle.userID = this.usersService.getSession('userDetails').id;
        this.GetVehicle.vehicleID = this.vehicleID;

        this.vehicleService.getCompanyVehicles(this.GetVehicle).subscribe(res => {
            this.resp = res;

            if (this.resp.hostHeaderInfo.responseCode === '000') {
                this.vehicleData = this.resp.vehicles[0];
                this.tagAddDialog.close();
                this.vehicleService.showToast('Success');


            }
        });
        // console.log(this.GetVehicle);
    }

    getInspectionActions(): void{
        this.vehicleService.getInspectionActions().subscribe(resp => {
            this.inspectionQuestionActionTypes = resp.inspectionQuestionActionTypes;
            if (resp.hostHeaderInfo.responseCode === '000') {
                this.inspectionQuestionActionTypes = resp.inspectionQuestionActionTypes;
                console.log(this.inspectionQuestionActionTypes);

            }
        });
    }


    addInspectionAction(event: MatSelectChange, questionID: any, index: any): void{
        if (this.inspectionID) {
            const dialogRef = this.dialog.open(ProcessingDialogComponent, {
                width: '100px',
                height: '100px',
                disableClose: false
            });
            this.InspectionAction.actionID = event.value;
            this.InspectionAction.questionID = questionID;
            this.InspectionAction.inspectionID = this.inspectionID;
            this.InspectionAction.createdByUserID = this.usersService.getSession('userDetails').id;


            this.vehicleService.saveInspectionMultipointAction(this.InspectionAction).subscribe(response => {
                if (response.hostHeaderInfo.responseCode === '000') {
                    this.vehicleService.showToast('Action added successfully');
                    this.multipointDataSource[index].selectedAnswerID = 2;
                        this.inspectionDataSource = new MatTableDataSource(this.multipointDataSource);
                    this.inspectionDataSource.paginator = this.paginatorInspection;
                    this.inspectionDataSource.sort = this.inspectionSort;
                    // this.getMultiPointQuestions(this.stepsIndex);
                    dialogRef.close();
                } else {
                    dialogRef.close();
                    this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
                }

            }, error => {
                dialogRef.close();
                this.vehicleService.showToast('Please try again later');
            });
        }else {
            this.vehicleService.showToast('Start an inspection to add an answer');
        }



    }











    getPDFData(): void{
        let tempNamespace = {};
        const count = this.questionType.length;

        for(let i = 0; i < count; i++){
            tempNamespace[this.questionType[i].id] = this.inspectionMultipoint.filter(type => type['TypeID'] === this.questionType[i].id);

            this.data = tempNamespace;
            this.pdfData.push([tempNamespace[this.questionType[i].id].map(a => a.name), tempNamespace[this.questionType[i].id].map(a => a.selectedAnswerID)]);


        }

    }


    get type1(){
        const count1 = this.data[1].length;
        const data = [];
        let check = 0;
        for (let i = 0; i < count1; i++){
            check++;
            data.push(this.pdfService.getChecks(this.data[1][i].selectedAnswerID , this.data[1][i].name));

        }
        if(check === count1){
            return data;
        }
    }

    get type2(){
        const count1 = this.data[2].length;
        const data = [];
        let check = 0;
        for (let i = 0; i < count1; i++){
            check++;
            data.push(this.pdfService.getChecks(this.data[2][i].selectedAnswerID , this.data[2][i].name));
        }
        if(check === count1){
            return data;
        }
    }

    get type3(){
        const count1 = this.data[3].length;
        const data = [];
        let check = 0;
        for (let i = 0; i < count1; i++){
            check++;
            data.push(this.pdfService.getChecks(this.data[3][i].selectedAnswerID , this.data[3][i].name));
        }
        if(check === count1){
            return data;
        }
    }

    get type4(){
        const count1 = this.data[4].length;
        const data = [];
        let check = 0;
        for (let i = 0; i < count1; i++){
            check++;
            data.push(this.pdfService.getChecks(this.data[4][i].selectedAnswerID , this.data[4][i].name));
        }
        if(check === count1){
            return data;
        }
    }

    get type5(){
        const count1 = this.data[5].length;
        const data = [];
        let check = 0;
        for (let i = 0; i < count1; i++){
            check++;
            data.push(this.pdfService.getChecks(this.data[5][i].selectedAnswerID , this.data[5][i].name));
        }
        if(check === count1){
            return data;
        }
    }

    get type6(){
        const count1 = this.data[6].length;
        const data = [];
        let check = 0;
        for (let i = 0; i < count1; i++){
            check++;
            data.push(this.pdfService.getChecks(this.data[6][i].selectedAnswerID , this.data[6][i].name));
        }
        if(check === count1){
            return data;
        }
    }

    get type7(){
        const count1 = this.data[7].length;
        const data = [];
        let check = 0;
        for (let i = 0; i < count1; i++){
            check++;
            data.push(this.pdfService.getChecks(this.data[7][i].selectedAnswerID , this.data[7][i].name));
        }
        if(check === count1){
            return data;
        }
    }

    get type8(){
        const count1 = this.data[8].length;
        const data = [];
        let check = 0;
        for (let i = 0; i < count1; i++){
            check++;
            data.push(this.pdfService.getChecks(this.data[8][i].selectedAnswerID , this.data[8][i].name));
        }
        if(check === count1){
            return data;
        }
    }

    get type9(){
        const count1 = this.data[9].length;
        const data = [];
        let check = 0;
        for (let i = 0; i < count1; i++){
            check++;
            data.push(this.pdfService.getChecks(this.data[9][i].selectedAnswerID , this.data[9][i].name));
        }
        if(check === count1){
            return data;
        }
    }

    get type10(){
        const count1 = this.data[10].length;
        const data = [];
        let check = 0;
        for (let i = 0; i < count1; i++){
            check++;
            data.push(this.pdfService.getChecks(this.data[10][i].selectedAnswerID , this.data[10][i].name));
        }
        if(check === count1){
            return data;
        }
    }

    download(){
        const data = this.vehicleData.year + ' / ' + this.vehicleData.make + ' / ' + this.vehicleData.model;
        this.pdfService.gen(this.type1, this.type2, this.type3, this.type4, this.type5, this.type6, this.type7, this.type8, this.type9, this.type10, this.vehicleData.colorName, data, this.vehicleData.mileage, this.vehicleData.VIN, this.vehicleData.stockNumber);
    }

    view(){
        const data = this.vehicleData.year + ' / ' + this.vehicleData.make + ' / ' + this.vehicleData.model;
        this.pdfService.view(this.type1, this.type2, this.type3, this.type4, this.type5, this.type6, this.type7, this.type8, this.type9, this.type10, this.vehicleData.colorName, data, this.vehicleData.mileage, this.vehicleData.VIN, this.vehicleData.stockNumber);
    }







}
