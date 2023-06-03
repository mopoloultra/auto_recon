import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { DataSource } from '@angular/cdk/collections';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import * as shape from 'd3-shape';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { fuseAnimations } from '@fuse/animations';

import { ProjectDashboardService } from 'app/main/apps/dashboards/project/project.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { UsersService } from 'app/services/users.service';
import { hostHeaderInfo } from 'app/main/models/hostHeaderInfo';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export interface UserData {
    id: string;
    stock: string;
    vehicle: string;
    vin: string;
    days: string;
    date: string;
    step: string;
    status: string;
  }




export interface PeriodicElement {
    vehicles: number;
    phase: string;
    timeInRecon: any;
    symbol: string;
    time: string;
    id: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {phase: 'Incoming', vehicles: 17, timeInRecon: {oneToThree: 50, fourToSix: 25, sevenPlus: 25}, symbol: 'H', time: '3.2', id: '0419'},
    {phase: 'Inspection', vehicles: 20, timeInRecon: {oneToThree: 10, fourToSix: 30, sevenPlus: 60}, symbol: 'He', time: '9.2', id: '419'},
    {phase: 'Approval', vehicles: 7, timeInRecon: {oneToThree: 40, fourToSix: 10, sevenPlus: 50}, symbol: 'Li', time: '0.2', id: '0419'},
    {phase: 'Production', vehicles: 15, timeInRecon: {oneToThree: 20, fourToSix: 30, sevenPlus: 50}, symbol: 'Be', time: '2.2', id: '0419'},
    {phase: 'Detail', vehicles: 30, timeInRecon: {oneToThree: 40, fourToSix: 10, sevenPlus: 50}, symbol: 'B', time: '7.2', id: '0419'},
    {phase: 'Pictures', vehicles: 7, timeInRecon: {oneToThree: 40, fourToSix: 10, sevenPlus: 50}, symbol: 'C', time: '5.2', id: '0419'},
    {phase: 'Incoming', vehicles: 8, timeInRecon: {oneToThree: 40, fourToSix: 10, sevenPlus: 50}, symbol: 'N', time: '5.2', id: '0419'},
    {phase: 'Inspection', vehicles: 7, timeInRecon: {oneToThree: 40, fourToSix: 10, sevenPlus: 50}, symbol: 'O', time: '3.2', id: '0419'},
    {phase: 'Approval', vehicles: 10, timeInRecon: {oneToThree: 45, fourToSix: 20, sevenPlus: 35}, symbol: 'F', time: '3.2', id: '0419'},
    {phase: 'Production', vehicles: 122, timeInRecon: {oneToThree: 10, fourToSix: 17, sevenPlus: 73}, symbol: 'Ne', time: '1.2', id: '0419'},
];





  
  const STOCK: string[] = [
    'P23452', 'P3463', 'G3462', 'G34623', 'C34623', 'L43462', 'H2345', 'B436463', 'H34624', 'K32542',
    'P23525', 'M34523', 'V34523', 'K53252', 'H34336'
  ];

  const VEHICLE: string[] = [
    '2011 Honda Accord', '2013 Honda Civic', '2017 GMC Acaida', '1991 Ford Fiesta', '2017 Chrysler 300'
  ];

  const VIN: string[] = [
    '32FEWSDF345GD', '34TFSDG3RY4GS', 'VG43XTZ4T32T', '324TWETG34T3', '2352352WFDFGT43', '2342TGEYWEWYE'
  ];

  const DAYS: string[] = [
    '10','53','23','34','21','45','34','13'
  ];

  const DATE: string[] = [
    '14/11/2020','18/09/2020','17/04/2020','21/05/2020','25/05/2020','11/04/2020','01/04/2020','15/06/2020','12/07/2020'
  ];

  const STEP: string[] = [
    'Body Shop', 'Detail', 'Photo', 'Sublet'
  ];

  const STATUS: string[] = [
    'Overdue', 'Overdue', 'Overdue', 'Completed'
  ];







@Component({
    selector     : 'project-dashboard',
    templateUrl  : './project.component.html',
    styleUrls    : ['./project.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class ProjectDashboardComponent implements OnInit
{

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


    reconsDisplayedColumns: string[] = ['phase', 'vehicles', 'timeInRecon', 'symbol', 'time', 'id'];
    reconsDataSource = ELEMENT_DATA;



  isLoading:boolean = true;
  showTable: boolean = false;
  tableMessage: any ='';
  showTableMessage: boolean = false;
  showLink: boolean = false;


  teamMembers:any
  membersCount: number = 0;
    tasks: string[] = [
        'Technical Management Meeting', 
        'Kick-off Company CRM Mobile App Development', 
        'Hold an Interview for Marketing Manager Position',
        'AirAsia Intranet Systems Project Meeting',
        
        'Technical Management Meeting',

        'Kick-off Company CRM Mobile App Development', 
        'Hold an Interview for Marketing Manager Position',
        'AirAsia Intranet Systems Project Meeting',
        'Technical Management Meeting', 
        'Kick-off Company CRM Mobile App Development', 
        'Hold an Interview for Marketing Manager Position',
        'AirAsia Intranet Systems Project Meeting',
        'Technical Management Meeting', 
        'Kick-off Company CRM Mobile App Development', 
        'Hold an Interview for Marketing Manager Position',
        'AirAsia Intranet Systems Project Meeting',
    ];
    
    displayedColumns: string[] = ['id', 'stockNumber', 'vehicle', 'VIN', 'daysInRecon', 'dueDate', 'step', 'status'];
    dataSource: any;

    hotlistDataSource: any;


    
    projects: any[];
    selectedProject: any;

    widgets: any;
    widget5: any = {};
    widget6: any = {};
    widget7: any = {};
    widget8: any = {};
    widget9: any = {};
    widget11: any = {};
    myDetails: any = {};

    activeCompletedWidgetSelectedDay = 'today';

    dateNow = Date.now();
    myCompanyDetails: any = {};
    hostHeaderInfo: hostHeaderInfo;



    form: FormGroup;
    stackValueFirst = 50;
    stackValueSecond = 27;
    stackValueThird = 23;
    stepsStats: any;
    allStats = {};

    private dashboardState: Subject<any>;
    private vehicleHotList: Subject<any>;
    private quotesLists: Subject<any>;
    hotLists: any;
    quotes: any;
    id: any;

    displayedIndex = 0;
    weatherLocation: any;
    weatherTemp = 0;
    weatherHumidity = 0;
    weatherSpeed = 0;
    weatherCountry = '';
    weatherIcon = '';

    /**
     * Constructor
     *
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {ProjectDashboardService} _projectDashboardService
     * @param usersService
     * @param fb
     */
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _projectDashboardService: ProjectDashboardService,
        public usersService: UsersService,
        fb: FormBuilder,
        public router: Router,
        public httpClient: HttpClient
    )
    {

        this.dashboardState = new Subject();
        this.vehicleHotList = new Subject();
        this.quotesLists = new Subject();
        this.hotLists = [];
        this.form = fb.group({
            date: [{begin: new Date(2018, 7, 5), end: new Date(2018, 7, 25)}]
        });

        this._registerCustomChartJSPlugin();

        this.hostHeaderInfo = new hostHeaderInfo();
        // Assign the data to the data source for the table to render
        this.weatherLocation = '';


        /**
         * Widget 5
         */
        this.widget5 = {
            currentRange  : 'TW',
            xAxis         : true,
            yAxis         : true,
            gradient      : false,
            legend        : false,
            showXAxisLabel: false,
            xAxisLabel    : 'Days',
            showYAxisLabel: false,
            yAxisLabel    : 'Isues',
            scheme        : {
                domain: ['#42BFF7', '#C6ECFD', '#C7B42C', '#AAAAAA']
            },
            onSelect      : (ev) => {
                console.log(ev);
            },
            supporting    : {
                currentRange  : '',
                xAxis         : false,
                yAxis         : false,
                gradient      : false,
                legend        : false,
                showXAxisLabel: false,
                xAxisLabel    : 'Days',
                showYAxisLabel: false,
                yAxisLabel    : 'Isues',
                scheme        : {
                    domain: ['#42BFF7', '#C6ECFD', '#C7B42C', '#AAAAAA']
                },
                curve         : shape.curveBasis
            }
        };

        /**
         * Widget 6
         */
        this.widget6 = {
            currentRange : 'TW',
            legend       : false,
            explodeSlices: false,
            labels       : true,
            doughnut     : true,
            gradient     : false,
            scheme       : {
                domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63']
            },
            onSelect     : (ev) => {
                console.log(ev);
            }
        };

        /**
         * Widget 7
         */
        this.widget7 = {
            currentRange: 'T'
        };

        /**
         * Widget 8
         */
        this.widget8 = {
            legend       : false,
            explodeSlices: false,
            labels       : true,
            doughnut     : false,
            gradient     : false,
            scheme       : {
                domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63', '#ffc107']
            },
            onSelect     : (ev) => {
                console.log(ev);
            }
        };

        /**
         * Widget 9
         */
        this.widget9 = {
            currentRange  : 'TW',
            xAxis         : false,
            yAxis         : false,
            gradient      : false,
            legend        : false,
            showXAxisLabel: false,
            xAxisLabel    : 'Days',
            showYAxisLabel: false,
            yAxisLabel    : 'Isues',
            scheme        : {
                domain: ['#42BFF7', '#C6ECFD', '#C7B42C', '#AAAAAA']
            },
            curve         : shape.curveBasis
        };

        setInterval(() => {
            this.dateNow = Date.now();
        }, 1000);

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        this.setCurrentLocation();



        this._projectDashboardService.onStatsChange
            .pipe(takeUntil(this.dashboardState))
            .subscribe(resp => {
                this.stepsStats = resp.stepsStats[0];


            });

        this._projectDashboardService.onAnnouncements
            .pipe(takeUntil(this.vehicleHotList))
            .subscribe(resp => {
                this.hotLists = resp.Announcements;
                this.id = setInterval(() => {
                   this.displayedIndex = Math.floor(Math.random() * this.hotLists.length);
                }, 5000);




            });

        this._projectDashboardService.onQuotes
            .pipe(takeUntil(this.quotesLists))
            .subscribe(resp => {
                this.quotes = resp.Announcements;



            });

        console.log(this.quotes);





        this.isLoading = true;
        this.showTable = false;
        this.showTableMessage = false;
        this.showLink = false;
        this.getUserInfo();
        this.getCompanyList();
        this.getTeamMembers();

        this.projects = this._projectDashboardService.projects;
        this.selectedProject = this.myCompanyDetails[0];
        this.widgets = this._projectDashboardService.widgets;

        /**
         * Widget 11
         */
        this.widget11.onContactsChanged = new BehaviorSubject({});
        this.widget11.onContactsChanged.next(this.widgets.widget11.table.rows);
        this.widget11.dataSource = new FilesDataSource(this.widget11);
     


    }



    view(vehicleID): void  {
        const route = '/apps/vehicle-view/' + vehicleID;
        console.log(vehicleID);
        this.router.navigate([route]);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

      }

    getIconStr(icon) {
        var result;
        switch (icon) {
            case "01d":
                result = "clear-day";
                break;
            case "01n":
                result = "clear-night";
                break;
            case "02d":
                result = "icon-cloudy";
                break;
            case "02n":
                result = "icon-cloudy";
                break;
            case "03d":
            case "03n":
            case "04d":
            case "04n":
                result = "icon-cloudy";
                break;
            case "09d":
            case "09n":
            case "10d":
            case "10n":
                result = "icon-rainy2";
                break;
            case "11d":
            case "11n":
                result = "icon-rainy";
                break;
            case "13d":
            case "13n":
                result = "icon-rainy";
                break;
            case "50d":
            case "50n":
                result = "icon-cloudy";
                break;
        }
        return result;
    }

    private setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this._projectDashboardService.getLocation(position.coords.longitude, position.coords.latitude).subscribe(res => {
                    if(res.name){
                        this.weatherLocation = res.name;
                        this.weatherHumidity = res.main.humidity;
                        this.weatherSpeed = res.wind.speed;
                        this.weatherCountry = res.sys.country;
                        this.weatherTemp = res.main.temp;
                        this.weatherIcon = res.weather[0].icon;
                    }
                    console.log(res);
                });
            });
        }
    }

      private _registerCustomChartJSPlugin(): void
      {
          (window as any).Chart.plugins.register({
              afterDatasetsDraw: function(chart, easing): any {
                  // Only activate the plugin if it's made available
                  // in the options
                  if (
                      !chart.options.plugins.xLabelsOnTop ||
                      (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
                  )
                  {
                      return;
                  }
  
                  // To only draw at the end of animation, check for easing === 1
                  const ctx = chart.ctx;
  
                  chart.data.datasets.forEach(function(dataset, i): any {
                      const meta = chart.getDatasetMeta(i);
                      if ( !meta.hidden )
                      {
                          meta.data.forEach(function(element, index): any {
  
                              // Draw the text in black, with the specified font
                              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                              const fontSize = 13;
                              const fontStyle = 'normal';
                              const fontFamily = 'Roboto, Helvetica Neue, Arial';
                              ctx.font = (window as any).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
  
                              // Just naively convert to string for now
                              const dataString = dataset.data[index].toString() + 'k';
  
                              // Make sure alignment settings are correct
                              ctx.textAlign = 'center';
                              ctx.textBaseline = 'middle';
                              const padding = 15;
                              const startY = 24;
                              const position = element.tooltipPosition();
                              ctx.fillText(dataString, position.x, startY);
  
                              ctx.save();
  
                              ctx.beginPath();
                              ctx.setLineDash([5, 3]);
                              ctx.moveTo(position.x, startY + padding);
                              ctx.lineTo(position.x, position.y - padding);
                              ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                              ctx.stroke();
  
                              ctx.restore();
                          });
                      }
                  });
              }
          });
      }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

      getUserInfo(): void{
        this.myDetails = this.usersService.getSession('userDetails');
     }

     getCompanyList(){
      this.myCompanyDetails =  this.usersService.getSession('userCompanies');
     }

     getTeamMembers(){
         const teamGet = {
            hostHeaderInfo: {
                channel:this.hostHeaderInfo.channel,
                sourceCode: this.hostHeaderInfo.sourceCode,
                token: this.usersService.getSession('userToken')
            },
            id: this.usersService.getSession('userDetails').id,
            searchType:0
        }
         this.usersService.getAllCompanyUsers(teamGet).subscribe((data: any) => {
               
                
                if (data){
                    this.showTable = true;
                    this.isLoading = false;
                    this.teamMembers = data;
                    this.membersCount = data.length;
                    console.log('this.teamMembers');
                    console.log(this.teamMembers);
                  }else{
                    this.isLoading = false;
                    this.showTable = false;
                    this.showTableMessage = true;
                    this.tableMessage = 'No Entries Added to Table.';
                    this.showLink = false;
                    //this.usersService.showToast('Get Company List Error');
                  }             
                  
                }, (err: HttpErrorResponse) => {
                  this.isLoading = false;
                  this.showTable = false;
                  this.showTableMessage = true;
                  this.showLink = true;
                  this.tableMessage = '' ;
                  console.log('get team members error', err);
                  //this.usersService.showToast(err.message);
                  
                });
     }

     gotovehicle(){
        this.router.navigate(['/apps/vehicles']);
     }
    // tslint:disable-next-line:use-lifecycle-interface
     ngOnDestroy(): void{
        clearInterval(this.id);
     }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param _widget11
     */
    constructor(private _widget11)
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._widget11.onContactsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}


