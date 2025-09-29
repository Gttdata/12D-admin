import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Services/api.service';
import { LoginserviceService } from 'src/app/Services/loginservice.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexFill,
  ApexNonAxisChartSeries,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
  colors: any;
};
export type ChartOptions1 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
  colors: any;
};
export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  legend: ApexLegend;
  labels: any;
};
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  @ViewChild('chart1') chart1: ChartComponent;
  @ViewChild('chart2') chart2: ChartComponent;
  @ViewChild('chart3') chart3: ChartComponent;
  YEAR: number;
  yearid = Number(sessionStorage.getItem('yearId'));
  divisionid1;
  divisionid2;
  divisionid3;
  classid1;
  classid2;
  classid3;
  divisionlist = [];
  classlist = [];
  isFilterApplied: any = 'default';
  filterClass: any = 'filter-invisible';
  filterQuery2: string = '';
  isFilterApplied2: any = 'default';
  filterClass2: any = 'filter-invisible';
  filterQuery3: string = '';
  isFilterApplied3: any = 'default';
  filterClass3: any = 'filter-invisible';
  filterQuery4: string = '';
  isFilterApplied4: any = 'default';
  filterClass4: any = 'filter-invisible';
  public chartOptions: Partial<ChartOptions>;
  public chartOptions1: Partial<ChartOptions1>;
  public chartOptions2: Partial<ChartOptions2>;
  public chartOptions3: Partial<ChartOptions>;
  isChartSpinning = true;
  isChartSpinning1 = true;
  isChartSpinning2 = true;
  isChartSpinning3 = true;
  screenWidth: number;
  loadingRecords: boolean;
  constructor(
    private api: ApiService,
    private cookie: CookieService,
    private router: Router,
    private datePipe: DatePipe,
    private api2: LoginserviceService,
    private message: NzNotificationService
  ) {
    // this.chartOptions = {
    //   series: [
    //     {
    //       name: 'Present Count',
    //       data: [],
    //     },
    //     {
    //       name: 'Absent Count',
    //       data: [],
    //     },
    //   ],
    //   chart: {
    //     type: 'bar',
    //     height: 350,
    //     stacked: true,
    //     stackType: '100%',
    //   },
    //   responsive: [
    //     {
    //       breakpoint: 480,
    //       options: {
    //         legend: {
    //           position: 'bottom',
    //           offsetX: -10,
    //           offsetY: 0,
    //         },
    //       },
    //     },
    //   ],
    //   xaxis: {
    //     categories: [],
    //   },
    //   fill: {
    //     opacity: 1,
    //   },
    //   legend: {
    //     position: 'right',
    //     offsetX: 0,
    //     offsetY: 50,
    //   },
    // };
  }
  eraseSession() {
    sessionStorage.removeItem('Count Type');
    sessionStorage.removeItem('Classid');
    sessionStorage.removeItem('YearFilter');
    sessionStorage.removeItem('divisionFilter');
    sessionStorage.removeItem('Task Count');
    sessionStorage.removeItem('Task Class');
    sessionStorage.removeItem('taskdivisionFilter');
    sessionStorage.removeItem('taskYearFilter');
    sessionStorage.removeItem('PendingFilter');
    sessionStorage.removeItem('pieYearFilter');
    sessionStorage.removeItem('piedivisionFilterid');
    sessionStorage.removeItem('pieClassFilter');
  }
  totalStudents = 0;
  totalTeachers = 0;
  totalClasses = 0;
  totalDivisions = 0;
  totalMediums = 0;
  totalSubjects = 0;
  totalFeeHeads = 0;
  ReportsLength = 0;
  loadingForms = true;
  isFormListVisible = false;
  formslist = [];
  seperateMasters = [];
  drawerTitle = 'Masters List';
  roleId = Number(sessionStorage.getItem('roleId'));
  schoolid = Number(sessionStorage.getItem('schoolid'));
  classes: any[] = [];
  yearlist = [];
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else {
      this.filterClass = 'filter-visible';
      this.filterClass2 = 'filter-invisible';
      this.filterClass3 = 'filter-invisible';
      this.filterClass4 = 'filter-invisible';
    }
    // console.log('dfghjk');
  }

  applyFilter() {
    this.loadingRecords = true;
    if (this.YEAR) {
      this.isFilterApplied = 'primary';
      this.onYearChange(this.YEAR);
    } else {
      this.getDahboardCounts();
      this.getGraphicaldata();
    }
  }
  clearFilter() {
    this.YEAR = null;
    this.commonFilterQuery = '';
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.applyFilter();
  }
  showFilter2() {
    if (this.filterClass2 === 'filter-visible')
      this.filterClass2 = 'filter-invisible';
    else {
      this.filterClass2 = 'filter-visible';
      this.filterClass = 'filter-invisible';
      this.filterClass3 = 'filter-invisible';
      this.filterClass4 = 'filter-invisible';
    }
    // console.log('dfghjk');
  }
  applyFilter2() {
    // this.loadingRecords = true;
    var ok = true;
    this.filterQuery2 = ''; // Reset filterQuery before applying new filters

    if (
      this.classid1 !== undefined &&
      this.classid1 !== null &&
      this.classid1 !== ''
    ) {
      this.filterQuery2 += ' AND CLASS_ID = ' + this.classid1;
      this.isFilterApplied2 = 'primary';
    }

    if (
      this.divisionid1 !== undefined &&
      this.divisionid1 !== null &&
      this.divisionid1 !== ''
    ) {
      this.filterQuery2 += ' AND DIVISION_ID =' + this.divisionid1;
      this.isFilterApplied2 = 'primary';
    }

    if (
      (this.classid1 == undefined ||
        this.classid1 == null ||
        this.classid1 == '') &&
      (this.divisionid1 == undefined ||
        this.divisionid1 == null ||
        this.divisionid1 == '') &&
      !this.clearfilter
    ) {
      ok = false;
      this.isFilterApplied2 = 'default';
      this.message.error('Please Select Filters', '');
    }

    if (ok) {
      this.api
        .getClassWiseAttendanceReport(
          0,
          0,
          '',
          '',
          ' AND SCHOOL_ID= ' +
            Number(sessionStorage.getItem('schoolid')) +
            ' AND CLASS_STATUS = 1' +
            this.filterQuery2 +
            this.commonFilterQuery
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            // console.log(data);
            // this.isFilterApplied2 = 'primary';
            this.filterClass2 = 'filter-invisible';
            var series = [
              {
                name: 'Present Count',
                data: [],
              },
              {
                name: 'Absent Count',
                data: [],
              },
            ];
            var categories = [];
            data['data'].forEach((chartdata) => {
              if (series[0].name == 'Present Count') {
                series[0].data.push(chartdata.PRESENT_COUNT);
              }
              if (series[1].name == 'Absent Count') {
                series[1].data.push(chartdata.ABSENT_COUNT);
              }
              categories.push(chartdata.CLASS_NAME.trim());
            });
            // var addedemptycategories=[]
            // if (categories) {
            //   this.api
            //     .getAllClasses(
            //       0,
            //       0,
            //       '',
            //       '',
            //       ' AND STATUS=1 AND SCHOOL_ID= ' +
            //         Number(sessionStorage.getItem('schoolid'))
            //     )
            //     .subscribe((data1) => {
            //       if (data1['code'] == 200) {
            //         this.classes = data1['data'];
            //         // console.log(this.classes, categories);
            //         for(let r=0;r<this.classes.length;r++){
            //           for(let k=0;k<data['data'].length;k++){
            //             if(data['data'][k]['CLASS_NAME'].trim()!=this.classes[r]['NAME'].trim()){
            //               addedemptycategories.push(data['data'][k]['CLASS_NAME'])
            //             }
            //           }
            //         }
            //         console.log(addedemptycategories);

            //       } else {
            //         // this.classes = [];
            //       }
            //     });
            // }
            this.chartOptions = {
              series: series,
              colors: ['#90EE90', '#FF0000'],
              chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                stackType: 'normal',
                events: {
                  click: (event, chartContext, config) => {
                    // console.log(event)
                    if (
                      config &&
                      config.seriesIndex !== undefined &&
                      config.dataPointIndex !== undefined
                    ) {
                      const seriesIndex = config.seriesIndex;
                      const dataPointIndex = config.dataPointIndex;
                      // console.log(seriesIndex,dataPointIndex);

                      // Assuming you have URLs associated with each data point
                      // const url = this.getDataPointURL(
                      //   seriesIndex,
                      //   dataPointIndex
                      // );
                      // Navigate to the URL  const dataLabel = this.chartData[seriesIndex].data[dataPointIndex].x;
                      const dataLabel = this.chartOptions.series[seriesIndex];
                      const classname =
                        this.chartOptions.xaxis.categories[dataPointIndex];
                      const classid = data['data'][dataPointIndex]['CLASS_ID'];
                      if (dataLabel && classname && classid) {
                        // console.log('Selected Data Class Id:', data['data'][dataPointIndex]);

                        var type = '';
                        if (dataLabel.name.toLowerCase().startsWith('a')) {
                          // console.log('A', 'Absent');
                          type = 'A';
                        } else {
                          // console.log('P', 'Present');
                          type = 'P';
                        }
                        // if (classname) {
                        //   classes = classname;
                        // }
                        // console.log(type);
                        sessionStorage.setItem('Count Type', type);
                        sessionStorage.setItem('Classid', classid);
                        if (this.divisionid1) {
                          sessionStorage.setItem(
                            'divisionFilter',
                            this.divisionid1
                          );
                        }

                        if (this.YEAR) {
                          sessionStorage.setItem(
                            'YearFilter',
                            this.YEAR.toString()
                          );
                        }
                      }
                      // Log or use the data label as needed

                      // console.log(config.config)
                      if (seriesIndex >= 0 && dataPointIndex >= 0) {
                        // this.router.navigate([
                        //   '/reports/classwise-attendance-report',
                        // ]);
                        window.location.href =
                          '/reports/attendancedetailedreport';
                      }
                    }
                  },
                },
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    legend: {
                      position: 'top',
                      offsetX: -10,
                      offsetY: 0,
                    },
                  },
                },
              ],
              xaxis: {
                categories: categories,
                title: {
                  text: 'Classes',
                },
              },
              yaxis: {
                title: {
                  text: 'Counts',
                },
              },

              fill: {
                opacity: 1,
              },
              legend: {
                position: 'top',
                offsetX: 0,
                offsetY: 0,
              },
            };
            this.isChartSpinning = false;
          } else {
          }
        });
      this.clearfilter = false;
    }
    // else{
    //   this.message.error('Please Select Filter','')
    //   this.isFilterApplied2 = 'default';
    // }
    // this.loadingRecords = false;
    // if (this.YEAR) {
    //   this.isFilterApplied2='primary'
    //   // this.onYearChange(this.YEAR);
    // }
    // else{
    //   this.getDahboardCounts()
    //   this.getGraphicaldata()
    // }
  }
  clearfilter = false;
  clearfilter2 = false;
  clearfilter3 = false;

  clearFilter2() {
    // this.YEAR = null;
    this.divisionid1 = null;
    this.classid1 = null;
    this.filterQuery2 = '';
    this.filterClass2 = 'filter-invisible';
    this.isFilterApplied2 = 'default';
    this.clearfilter = true;
    this.applyFilter2();
  }
  showFilter3() {
    if (this.filterClass3 === 'filter-visible')
      this.filterClass3 = 'filter-invisible';
    else {
      this.filterClass3 = 'filter-visible';
      this.filterClass2 = 'filter-invisible';
      this.filterClass = 'filter-invisible';
      this.filterClass4 = 'filter-invisible';
    }

    // console.log('dfghjk');
  }
  showFilter4() {
    if (this.filterClass4 === 'filter-visible')
      this.filterClass4 = 'filter-invisible';
    else {
      this.filterClass4 = 'filter-visible';
      this.filterClass3 = 'filter-invisible';
      this.filterClass2 = 'filter-invisible';
      this.filterClass = 'filter-invisible';
    }
    // console.log('dfghjk');
  }
  applyFilter3() {
    this.loadingRecords = true;
    var ok = true;
    this.filterQuery3 = ''; // Reset filterQuery before applying new filters

    if (
      this.classid2 !== undefined &&
      this.classid2 !== null &&
      this.classid2 !== ''
    ) {
      this.filterQuery3 += ' AND CLASS_ID = ' + this.classid2;
      this.isFilterApplied3 = 'primary';
    }

    if (
      this.divisionid2 !== undefined &&
      this.divisionid2 !== null &&
      this.divisionid2 !== ''
    ) {
      this.filterQuery3 += ' AND DIVISION_ID =' + this.divisionid2;
      this.isFilterApplied3 = 'primary';
    }

    if (
      (this.classid2 == undefined ||
        this.classid2 == null ||
        this.classid2 == '') &&
      (this.divisionid2 == undefined ||
        this.divisionid2 == null ||
        this.divisionid2 == '') &&
      !this.clearfilter2
    ) {
      ok = false;
      this.isFilterApplied3 = 'default';
      this.message.error('Please Select Filters', '');
    }

    if (ok) {
      this.api
        .getClassWisetaskReport(
          0,
          0,
          '',
          '',
          ' AND SCHOOL_ID= ' +
            Number(sessionStorage.getItem('schoolid')) +
            ' AND CLASS_STATUS = 1' +
            this.filterQuery3 +
            this.commonFilterQuery
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            // console.log(data['data']);
            // this.isFilterApplied3 = 'primary';
            this.filterClass3 = 'filter-invisible';
            var series = [
              {
                name: 'Completed',
                data: [],
              },
              {
                name: 'Pending',
                data: [],
              },
            ];
            var categories = [];
            data['data'].forEach((chartdata) => {
              if (series[0].name == 'Completed') {
                series[0].data.push(chartdata.COMPLETED);
              }
              if (series[1].name == 'Pending') {
                series[1].data.push(chartdata.PENDING);
              }
              categories.push(chartdata.CLASS_NAME.trim());
            });
            // console.log(series)
            this.chartOptions1 = {
              series: series,
              colors: ['#90EE90', '#FF0000'],
              chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                stackType: 'normal',
                events: {
                  click: (event, chartContext, config) => {
                    // console.log(event)
                    if (
                      config &&
                      config.seriesIndex !== undefined &&
                      config.dataPointIndex !== undefined
                    ) {
                      const seriesIndex = config.seriesIndex;
                      const dataPointIndex = config.dataPointIndex;

                      // console.log(seriesIndex,dataPointIndex);

                      // Assuming you have URLs associated with each data point
                      // const url = this.getDataPointURL(
                      //   seriesIndex,
                      //   dataPointIndex
                      // );
                      // Navigate to the URL  const dataLabel = this.chartData[seriesIndex].data[dataPointIndex].x;
                      const dataLabel = this.chartOptions1.series[seriesIndex];
                      const classname =
                        this.chartOptions1.xaxis.categories[dataPointIndex];
                      const classid = data['data'][dataPointIndex]['CLASS_ID'];

                      if (dataLabel && classname && classid) {
                        // console.log('Selected Data Label:', dataLabel);
                        var type = '';
                        var classes = '';
                        if (dataLabel.name.toLowerCase().startsWith('c')) {
                          // console.log('A', 'Absent');
                          type = 'C';
                        } else {
                          // console.log('P', 'Present');
                          type = 'P';
                        }
                        // if (classname) {
                        //   classes = classname;
                        // }
                        // console.log(type);
                        sessionStorage.setItem('Task Count', type);
                        sessionStorage.setItem('Task Class', classid);
                        if (this.divisionid2) {
                          sessionStorage.setItem(
                            'taskdivisionFilter',
                            this.divisionid2
                          );
                        }

                        if (this.YEAR) {
                          sessionStorage.setItem(
                            'taskYearFilter',
                            this.YEAR.toString()
                          );
                        }
                      }
                      // Log or use the data label as needed

                      // console.log(config.config)
                      if (seriesIndex >= 0 && dataPointIndex >= 0) {
                        // this.router.navigate([
                        //   '/reports/classwise-attendance-report',
                        // ]);
                        window.location.href = '/schoolerp/studenttask';
                      }
                    }
                  },
                },
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    legend: {
                      position: 'top',
                      offsetX: -10,
                      offsetY: 0,
                    },
                  },
                },
              ],

              xaxis: {
                categories: categories,
                title: {
                  text: 'Classes',
                },
              },
              yaxis: {
                title: {
                  text: 'Task Counts',
                },
              },

              fill: {
                opacity: 1,
              },
              legend: {
                position: 'top',
                offsetX: 0,
                offsetY: 0,
              },
            };
            this.isChartSpinning1 = false;
          } else {
          }
        });
      this.clearfilter2 = false;
    }

    this.loadingRecords = false;
  }
  clearFilter3() {
    // this.YEAR = null;
    this.classid2 = null;
    this.divisionid2 = null;
    this.filterClass3 = 'filter-invisible';
    this.isFilterApplied3 = 'default';
    this.clearfilter2 = true;
    this.applyFilter3();
  }
  applyFilter4() {
    this.loadingRecords = true;
    var ok = true;
    this.filterQuery4 = ''; // Reset filterQuery before applying new filters

    if (
      this.classid3 !== undefined &&
      this.classid3 !== null &&
      this.classid3 !== ''
    ) {
      this.filterQuery4 += ' AND CLASS_ID = ' + this.classid3;
      this.isFilterApplied4 = 'primary';
    }

    if (
      this.divisionid3 !== undefined &&
      this.divisionid3 !== null &&
      this.divisionid3 !== ''
    ) {
      this.filterQuery4 += ' AND DIVISION_ID =' + this.divisionid3;
      this.isFilterApplied4 = 'primary';
    }

    if (
      (this.classid3 == undefined ||
        this.classid3 == null ||
        this.classid3 == '') &&
      (this.divisionid3 == undefined ||
        this.divisionid3 == null ||
        this.divisionid3 == '') &&
      !this.clearfilter3
    ) {
      ok = false;
      this.message.error('Please Select Filters', '');
    }

    if (ok) {
      this.api
        .getClassWiseFeeSummary(
          0,
          0,
          '',
          '',
          ' AND SCHOOL_ID= ' +
            Number(sessionStorage.getItem('schoolid')) +
            ' AND CLASS_STATUS = 1' +
            this.filterQuery4 +
            this.commonFilterQuery
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.isChartSpinning2 = true;
            var totalclasses = 0;
            var totalcollected = 0;
            var totalpending = 0;
            // this.isFilterApplied4 = 'primary';
            this.filterClass4 = 'filter-invisible';
            data['data'].forEach((data) => {
              totalclasses += data.TOTAL_CLASSES;
              totalcollected += data.TOTAL_COLLECTED;
              totalpending += data.TOTAL_PENDING;
            });
            if (this.divisionid3) {
              sessionStorage.setItem('piedivisionFilterid', this.divisionid3);
            }
            if (this.YEAR) {
              sessionStorage.setItem('pieYearFilter', this.YEAR.toString());
            }
            if (this.classid3) {
              sessionStorage.setItem('pieClassFilter', this.classid3);
            }
            this.chartOptions2 = {
              series: [totalclasses, totalcollected, totalpending],

              chart: {
                width: 380,
                type: 'pie',
                events: {
                  dataPointSelection: function (event, chartContext, config) {
                    // ...
                    const dataPointIndex = config.dataPointIndex;
                    const selectedLabel = config.w.config.labels;

                    // console.log(selectedLabel[dataPointIndex].toString().toLowerCase().includes('pending'));
                    if (
                      selectedLabel[dataPointIndex]
                        .toString()
                        .toLowerCase()
                        .includes('pending')
                    ) {
                      sessionStorage.setItem('PendingFilter', 'P');
                    } else {
                      sessionStorage.setItem('PendingFilter', 'C');
                    }
                    if (dataPointIndex >= 0) {
                      window.location.href =
                        '/reports/studentfeesdetailsreport';
                    }
                  },
                },
              },

              dataLabels: {
                enabled: true,
                formatter: function (val, opts) {
                  return opts.w.config.series[opts.seriesIndex];
                },
              },
              labels: [
                'Total Classes',
                'Total Collected Amount',
                'Total Pending Amount',
              ],
              legend: {
                position: 'bottom', // Position the legend at the bottom
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200,
                    },
                    legend: {
                      position: 'bottom',
                    },
                  },
                },
              ],
            };
            // console.log(this.chartOptions2.dataLabels.formatter)
            this.isChartSpinning2 = false;
          } else {
          }
        });
      this.clearfilter3 = false;
    }

    this.loadingRecords = false;
    // if (this.YEAR) {
    //   this.isFilterApplied2='primary'
    //   // this.onYearChange(this.YEAR);
    // }
    // else{
    //   this.getDahboardCounts()
    //   this.getGraphicaldata()
    // }
  }
  clearFilter4() {
    // this.YEAR = null;
    this.classid3 = null;
    this.divisionid3 = null;
    this.isFilterApplied = 'default';
    this.clearfilter3 = true;
    this.applyFilter4();
  }
  ngOnInit(): void {
    this.getDahboardCounts();
    this.getAllAssignedForms();
    this.getGraphicaldata();
    this.getYear();
    this.getclassList();
    this.eraseSession();
    this.screenWidth = window.innerWidth;
    this.YEAR = this.yearid;
    this.onYearChange(this.yearid);
    // this.getAllClassesForShowing()
    // var screenwidth=window.innerWidth
    // console.log(screenwidth)
  }
  getclassList() {
    this.api
      .getAllClassMaster(
        0,
        0,
        'ID',
        'asc',
        ' AND STATUS = 1 AND SCHOOL_ID= ' + this.schoolid
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.classlist = data['data'];
          } else {
            this.classlist = [];
          }
        },
        (err) => {
          console.log(err);
        }
      );
    this.api
      .getAllDivisions(
        0,
        0,
        'ID',
        'asc',
        ' AND STATUS = 1 AND SCHOOL_ID= ' + this.schoolid
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.divisionlist = data['data'];
          } else {
            this.divisionlist = [];
          }
        },
        (err) => {
          console.log(err);
        }
      );
    // this.api.getAllMediumMaster(0, 0, 'ID', 'asc', ' AND STATUS = 1 AND SCHOOL_ID= '+this.schoolid).subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       this.mediumlist = data['data'];
    //     }
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
    // this.api.getAllYearMaster(0, 0, 'ID', 'asc', ' AND STATUS = 1 AND SCHOOL_ID= '+this.schoolid).subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       this.yearlist = data['data'];
    //     }
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }
  commonFilterQuery = '';
  onYearChange(year) {
    this.clearFilter2();
    this.clearFilter3();
    this.clearFilter4();
    // var filterquery1=''
    // var filterquery2=''
    // var filterquery3=''
    // if (
    //   this.classid1 !== undefined &&
    //   this.classid1 !== null &&
    //   this.classid1 !== ''
    // ) {
    //   filterquery1 += ' AND CLASS_ID = ' + this.classid1;
    //   // this.isFilterApplied2 = 'primary';
    // }

    // if (
    //   this.divisionid1 !== undefined &&
    //   this.divisionid1 !== null &&
    //   this.divisionid1 !== ''
    // ) {
    //   filterquery1 += ' AND DIVISION_ID =' + this.divisionid1;
    //   // this.isFilterApplied2 = 'primary';
    // }
    // if (
    //   this.classid2 !== undefined &&
    //   this.classid2 !== null &&
    //   this.classid2 !== ''
    // ) {
    //   filterquery2 += ' AND CLASS_ID = ' + this.classid2;
    //   // this.isFilterApplied3 = 'primary';
    // }

    // if (
    //   this.divisionid2 !== undefined &&
    //   this.divisionid2 !== null &&
    //   this.divisionid2 !== ''
    // ) {
    //   filterquery2 += ' AND DIVISION_ID =' + this.divisionid2;
    //   // this.isFilterApplied3 = 'primary';
    // }
    // if (
    //   this.classid3 !== undefined &&
    //   this.classid3 !== null &&
    //   this.classid3 !== ''
    // ) {
    //   filterquery3 += ' AND CLASS_ID = ' + this.classid3;
    //   // this.isFilterApplied4 = 'primary';
    // }

    // if (
    //   this.divisionid3 !== undefined &&
    //   this.divisionid3 !== null &&
    //   this.divisionid3 !== ''
    // ) {
    //   filterquery3 += ' AND DIVISION_ID =' + this.divisionid3;
    //   // this.isFilterApplied4 = 'primary';
    // }
    if (year) {
      this.commonFilterQuery = ' AND YEAR_ID= ' + year;
      this.api
        .getDashboardCounts(Number(sessionStorage.getItem('schoolid')), year)
        .subscribe((data) => {
          if (data['code'] == 200) {
            // console.log(data)
            this.loadingRecords = false;
            this.filterClass = 'filter-invisible';
            this.isFilterApplied = 'primary';
            this.totalStudents = data['data']['STUDENT_COUNT'];
            this.totalDivisions = data['data']['DIVISION_COUNT'];
            this.totalTeachers = data['data']['TEACHER_COUNT'];
            this.totalClasses = data['data']['CLASS_COUNT'];
            this.totalMediums = data['data']['MEDIUM_COUNT'];
            this.totalSubjects = data['data']['SUBJECT_COUNT'];
            this.totalFeeHeads = data['data']['FEE_HEAD_COUNT'];
          } else {
            this.loadingRecords = false;
            this.totalStudents = 0;
            this.totalDivisions = 0;
            this.totalTeachers = 0;
            this.totalClasses = 0;
            this.totalMediums = 0;
            this.totalFeeHeads = 0;
            this.totalSubjects = 0;
          }
        });
      this.api
        .getClassWiseAttendanceReport(
          0,
          0,
          '',
          '',
          ' AND SCHOOL_ID= ' +
            this.schoolid +
            ' AND CLASS_STATUS = 1' +
            ' AND YEAR_ID= ' +
            year
        )

        .subscribe((data) => {
          if (data['code'] == 200) {
            // console.log(data);

            var series = [
              {
                name: 'Present Count',
                data: [],
              },
              {
                name: 'Absent Count',
                data: [],
              },
            ];
            var categories = [];
            data['data'].forEach((chartdata) => {
              if (series[0].name == 'Present Count') {
                series[0].data.push(chartdata.PRESENT_COUNT);
              }
              if (series[1].name == 'Absent Count') {
                series[1].data.push(chartdata.ABSENT_COUNT);
              }
              categories.push(chartdata.CLASS_NAME.trim());
            });
            // var addedemptycategories=[]
            // if (categories) {
            //   this.api
            //     .getAllClasses(
            //       0,
            //       0,
            //       '',
            //       '',
            //       ' AND STATUS=1 AND SCHOOL_ID= ' +
            //         Number(sessionStorage.getItem('schoolid'))
            //     )
            //     .subscribe((data1) => {
            //       if (data1['code'] == 200) {
            //         this.classes = data1['data'];
            //         // console.log(this.classes, categories);
            //         for(let r=0;r<this.classes.length;r++){
            //           for(let k=0;k<data['data'].length;k++){
            //             if(data['data'][k]['CLASS_NAME'].trim()!=this.classes[r]['NAME'].trim()){
            //               addedemptycategories.push(data['data'][k]['CLASS_NAME'])
            //             }
            //           }
            //         }
            //         console.log(addedemptycategories);

            //       } else {
            //         // this.classes = [];
            //       }
            //     });
            // }
            this.chartOptions = {
              series: series,
              colors: ['#90EE90', '#FF0000'],
              chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                stackType: 'normal',
                events: {
                  click: (event, chartContext, config) => {
                    // console.log(event)
                    if (
                      config &&
                      config.seriesIndex !== undefined &&
                      config.dataPointIndex !== undefined
                    ) {
                      const seriesIndex = config.seriesIndex;
                      const dataPointIndex = config.dataPointIndex;
                      // console.log(seriesIndex,dataPointIndex);

                      // Assuming you have URLs associated with each data point
                      // const url = this.getDataPointURL(
                      //   seriesIndex,
                      //   dataPointIndex
                      // );
                      // Navigate to the URL  const dataLabel = this.chartData[seriesIndex].data[dataPointIndex].x;
                      const dataLabel = this.chartOptions.series[seriesIndex];
                      const classname =
                        this.chartOptions.xaxis.categories[dataPointIndex];
                      const classid = data['data'][dataPointIndex]['CLASS_ID'];
                      if (dataLabel && classname && classid) {
                        // console.log('Selected Data Class Id:', data['data'][dataPointIndex]);

                        var type = '';
                        if (dataLabel.name.toLowerCase().startsWith('a')) {
                          // console.log('A', 'Absent');
                          type = 'A';
                        } else {
                          // console.log('P', 'Present');
                          type = 'P';
                        }
                        // if (classname) {
                        //   classes = classname;
                        // }
                        // console.log(type);
                        sessionStorage.setItem('Count Type', type);
                        sessionStorage.setItem('Classid', classid);
                        if (this.divisionid1) {
                          sessionStorage.setItem(
                            'divisionFilter',
                            this.divisionid1
                          );
                        }

                        if (this.YEAR) {
                          sessionStorage.setItem(
                            'YearFilter',
                            this.YEAR.toString()
                          );
                        }
                      }
                      // Log or use the data label as needed

                      // console.log(config.config)
                      if (seriesIndex >= 0 && dataPointIndex >= 0) {
                        // this.router.navigate([
                        //   '/reports/classwise-attendance-report',
                        // ]);
                        window.location.href =
                          '/reports/attendancedetailedreport';
                      }
                    }
                  },
                },
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    legend: {
                      position: 'top',
                      offsetX: -10,
                      offsetY: 0,
                    },
                  },
                },
              ],
              xaxis: {
                categories: categories,
                title: {
                  text: 'Classes',
                },
              },
              yaxis: {
                title: {
                  text: 'Counts',
                },
              },

              fill: {
                opacity: 1,
              },
              legend: {
                position: 'top',
                offsetX: 0,
                offsetY: 0,
              },
            };
            this.isChartSpinning = false;
          } else {
          }
        });
      this.api
        .getClassWisetaskReport(
          0,
          0,
          '',
          '',
          ' AND SCHOOL_ID= ' +
            this.schoolid +
            ' AND CLASS_STATUS = 1' +
            ' AND YEAR_ID= ' +
            year
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            // console.log(data['data']);

            var series = [
              {
                name: 'Completed',
                data: [],
              },
              {
                name: 'Pending',
                data: [],
              },
            ];
            var categories = [];
            data['data'].forEach((chartdata) => {
              if (series[0].name == 'Completed') {
                series[0].data.push(chartdata.COMPLETED);
              }
              if (series[1].name == 'Pending') {
                series[1].data.push(chartdata.PENDING);
              }
              categories.push(chartdata.CLASS_NAME.trim());
            });
            // console.log(series)
            this.chartOptions1 = {
              series: series,
              colors: ['#90EE90', '#FF0000'],
              chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                stackType: 'normal',
                events: {
                  click: (event, chartContext, config) => {
                    // console.log(event)
                    if (
                      config &&
                      config.seriesIndex !== undefined &&
                      config.dataPointIndex !== undefined
                    ) {
                      const seriesIndex = config.seriesIndex;
                      const dataPointIndex = config.dataPointIndex;

                      // console.log(seriesIndex,dataPointIndex);

                      // Assuming you have URLs associated with each data point
                      // const url = this.getDataPointURL(
                      //   seriesIndex,
                      //   dataPointIndex
                      // );
                      // Navigate to the URL  const dataLabel = this.chartData[seriesIndex].data[dataPointIndex].x;
                      const dataLabel = this.chartOptions1.series[seriesIndex];
                      const classname =
                        this.chartOptions1.xaxis.categories[dataPointIndex];
                      const classid = data['data'][dataPointIndex]['CLASS_ID'];

                      if (dataLabel && classname && classid) {
                        // console.log('Selected Data Label:', dataLabel);
                        var type = '';
                        var classes = '';
                        if (dataLabel.name.toLowerCase().startsWith('c')) {
                          // console.log('A', 'Absent');
                          type = 'C';
                        } else {
                          // console.log('P', 'Present');
                          type = 'P';
                        }
                        // if (classname) {
                        //   classes = classname;
                        // }
                        // console.log(type);
                        sessionStorage.setItem('Task Count', type);
                        sessionStorage.setItem('Task Class', classid);
                        if (this.divisionid2) {
                          sessionStorage.setItem(
                            'taskdivisionFilter',
                            this.divisionid2
                          );
                        }

                        if (this.YEAR) {
                          sessionStorage.setItem(
                            'taskYearFilter',
                            this.YEAR.toString()
                          );
                        }
                      }
                      // Log or use the data label as needed

                      // console.log(config.config)
                      if (seriesIndex >= 0 && dataPointIndex >= 0) {
                        // this.router.navigate([
                        //   '/reports/classwise-attendance-report',
                        // ]);
                        window.location.href = '/schoolerp/studenttask';
                      }
                    }
                  },
                },
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    legend: {
                      position: 'top',
                      offsetX: -10,
                      offsetY: 0,
                    },
                  },
                },
              ],

              xaxis: {
                categories: categories,
                title: {
                  text: 'Classes',
                },
              },
              yaxis: {
                title: {
                  text: 'Task Counts',
                },
              },

              fill: {
                opacity: 1,
              },
              legend: {
                position: 'top',
                offsetX: 0,
                offsetY: 0,
              },
            };
            this.isChartSpinning1 = false;
          } else {
          }
        });
      this.api
        .getClassWiseFeeSummary(
          0,
          0,
          '',
          '',
          ' AND SCHOOL_ID= ' +
            this.schoolid +
            ' AND CLASS_STATUS = 1' +
            ' AND YEAR_ID= ' +
            year
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.isChartSpinning2 = true;
            var totalclasses = 0;
            var totalcollected = 0;
            var totalpending = 0;
            data['data'].forEach((data) => {
              totalclasses += data.TOTAL_CLASSES;
              totalcollected += data.TOTAL_COLLECTED;
              totalpending += data.TOTAL_PENDING;
            });
            if (this.divisionid3) {
              sessionStorage.setItem('piedivisionFilterid', this.divisionid3);
            }
            if (this.YEAR) {
              sessionStorage.setItem('pieYearFilter', this.YEAR.toString());
            }
            if (this.classid3) {
              sessionStorage.setItem('pieClassFilter', this.classid3);
            }
            this.chartOptions2 = {
              series: [totalclasses, totalcollected, totalpending],

              chart: {
                width: 380,
                type: 'pie',
                events: {
                  dataPointSelection: function (event, chartContext, config) {
                    // ...
                    const dataPointIndex = config.dataPointIndex;
                    const selectedLabel = config.w.config.labels;

                    // console.log(selectedLabel[dataPointIndex].toString().toLowerCase().includes('pending'));
                    if (
                      selectedLabel[dataPointIndex]
                        .toString()
                        .toLowerCase()
                        .includes('pending')
                    ) {
                      sessionStorage.setItem('PendingFilter', 'P');
                    } else {
                      sessionStorage.setItem('PendingFilter', 'C');
                    }
                    if (dataPointIndex >= 0) {
                      window.location.href =
                        '/reports/studentfeesdetailsreport';
                    }
                  },
                },
              },

              dataLabels: {
                enabled: true,
                formatter: function (val, opts) {
                  return opts.w.config.series[opts.seriesIndex];
                },
              },
              labels: [
                'Total Classes',
                'Total Collected Amount',
                'Total Pending Amount',
              ],
              legend: {
                position: 'bottom', // Position the legend at the bottom
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200,
                    },
                    legend: {
                      position: 'bottom',
                    },
                  },
                },
              ],
            };
            // console.log(this.chartOptions2.dataLabels.formatter)
            this.isChartSpinning2 = false;
          } else {
          }
        });
    } else {
      this.getDahboardCounts();
      this.getGraphicaldata();
    }
  }
  getYear() {
    this.api
      .getAllYearMaster(0, 0, 'YEAR', 'asc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.yearlist = data['data'];
          } else {
            this.yearlist = [];
          }
        } else {
        }
      });
  }
  showFormList() {
    this.isFormListVisible = true;
  }

  getDahboardCounts() {
    if (this.YEAR)
      this.api
        .getDashboardCounts(
          Number(sessionStorage.getItem('schoolid')),
          this.YEAR
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            // console.log(data)
            this.totalStudents = data['data']['STUDENT_COUNT'];
            this.totalDivisions = data['data']['DIVISION_COUNT'];
            this.totalTeachers = data['data']['TEACHER_COUNT'];
            this.totalClasses = data['data']['CLASS_COUNT'];
            this.totalMediums = data['data']['MEDIUM_COUNT'];
            this.totalSubjects = data['data']['SUBJECT_COUNT'];
            this.totalFeeHeads = data['data']['FEE_HEAD_COUNT'];
          } else {
            this.totalStudents = 0;
            this.totalDivisions = 0;
            this.totalTeachers = 0;
            this.totalClasses = 0;
            this.totalMediums = 0;
            this.totalFeeHeads = 0;
            this.totalSubjects = 0;
          }
        });
  }
  getAllAssignedForms() {
    this.api2.getForms(this.roleId).subscribe((forms) => {
      if (forms['code'] == 200) {
        for (let i = 0; i < forms['data'].length; i++) {
          const title = forms['data'][i]['title'].toLowerCase();
          const children = forms['data'][i]['children'];

          if (title === 'masters' && children.length > 0) {
            for (let j = 0; j < children.length; j++) {
              const childTitle = children[j]['title'].toLowerCase();
              const childLink = children[j]['link'];

              if (
                childTitle === 'holiday master' ||
                childTitle === 'student fee details'
              ) {
                this.seperateMasters.push(children[j]);
              } else {
                this.formslist.push(children[j]);
              }
            }
          }
        }

        this.seperateMasters.sort((a, b) => {
          return a.SEQ_NO - b.SEQ_NO;
        });
        this.formslist.sort((a, b) => {
          return a.SEQ_NO - b.SEQ_NO;
        });
        // console.log(this.formslist, "formslist", this.seperateMasters);

        let reportsList = [];

        for (let i = 0; i < forms['data'].length; i++) {
          if (
            forms['data'][i]['title'].toLowerCase() === 'reports' &&
            forms['data'][i]['children'].length > 0
          ) {
            reportsList.push(...forms['data'][i]['children']);
          }
        }

        this.ReportsLength = reportsList.length;

        this.loadingForms = false;
      } else {
        this.formslist = [];
        this.loadingForms = false;
        this.message.error(
          'Failed To Get Form Records',
          `Error Code: ${forms.code}`
        );
      }
    });
  }

  value1 = null;
  value2 = null;
  backgroundarrays = [
    '#9f9ee2',
    '#e595cd',
    '#b1cfa7',
    '#f49d9d',
    '#cbf188c4',
    '#71c8d5',
    '#e9de0d85',
    '#6857575c',
  ];
  changeDate(value) {
    this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd');
    this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd');
  }

  isSpinning = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  columns: string[][] = [
    ['USER_NAME', 'User Name'],
    ['TOTAL', 'Total'],
    ['CREATED', 'Created'],
    ['CLOSED', 'Closed'],
  ];
  pageSize2 = 10;
  sortKey: string = 'id';
  sortValue: string = 'asc';

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    if (this.pageSize2 != pageSize) {
      this.pageIndex = 1;
      this.pageSize2 = pageSize;
    }
    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }
    this.sortKey = sortField;
    this.sortValue = sortOrder;
    // this.getQuotationSummaryData();
  }

  // Getquotation(NO: number) {
  //   sessionStorage.setItem("STEP_NO", NO.toString());
  // }
  drawerClose() {
    this.isFormListVisible = false;
  }

  // Graphs
  getGraphicaldata() {
    this.isChartSpinning = true;
    this.isChartSpinning1 = true;
    //1) ClassWise Weekly Attendance Report
    this.api
      .getClassWiseAttendanceReport(
        0,
        0,
        '',
        '',
        ' AND SCHOOL_ID= ' +
          Number(sessionStorage.getItem('schoolid')) +
          ' AND CLASS_STATUS = 1' +
          this.commonFilterQuery
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          // console.log(data);
          this.filterClass = 'filter-invisible';

          var series = [
            {
              name: 'Present Count',
              data: [],
            },
            {
              name: 'Absent Count',
              data: [],
            },
          ];
          var categories = [];
          data['data'].forEach((chartdata) => {
            if (series[0].name == 'Present Count') {
              series[0].data.push(chartdata.PRESENT_COUNT);
            }
            if (series[1].name == 'Absent Count') {
              series[1].data.push(chartdata.ABSENT_COUNT);
            }
            categories.push(chartdata.CLASS_NAME.trim());
          });
          // var addedemptycategories=[]
          // if (categories) {
          //   this.api
          //     .getAllClasses(
          //       0,
          //       0,
          //       '',
          //       '',
          //       ' AND STATUS=1 AND SCHOOL_ID= ' +
          //         Number(sessionStorage.getItem('schoolid'))
          //     )
          //     .subscribe((data1) => {
          //       if (data1['code'] == 200) {
          //         this.classes = data1['data'];
          //         // console.log(this.classes, categories);
          //         for(let r=0;r<this.classes.length;r++){
          //           for(let k=0;k<data['data'].length;k++){
          //             if(data['data'][k]['CLASS_NAME'].trim()!=this.classes[r]['NAME'].trim()){
          //               addedemptycategories.push(data['data'][k]['CLASS_NAME'])
          //             }
          //           }
          //         }
          //         console.log(addedemptycategories);

          //       } else {
          //         // this.classes = [];
          //       }
          //     });
          // }
          this.chartOptions = {
            series: series,
            colors: ['#90EE90', '#FF0000'],
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              stackType: 'normal',
              events: {
                click: (event, chartContext, config) => {
                  // console.log(event)
                  if (
                    config &&
                    config.seriesIndex !== undefined &&
                    config.dataPointIndex !== undefined
                  ) {
                    const seriesIndex = config.seriesIndex;
                    const dataPointIndex = config.dataPointIndex;
                    // console.log(seriesIndex,dataPointIndex);

                    // Assuming you have URLs associated with each data point
                    // const url = this.getDataPointURL(
                    //   seriesIndex,
                    //   dataPointIndex
                    // );
                    // Navigate to the URL  const dataLabel = this.chartData[seriesIndex].data[dataPointIndex].x;
                    const dataLabel = this.chartOptions.series[seriesIndex];
                    const classname =
                      this.chartOptions.xaxis.categories[dataPointIndex];
                    const classid = data['data'][dataPointIndex]['CLASS_ID'];
                    if (dataLabel && classname && classid) {
                      // console.log('Selected Data Class Id:', data['data'][dataPointIndex]);

                      var type = '';
                      if (dataLabel.name.toLowerCase().startsWith('a')) {
                        // console.log('A', 'Absent');
                        type = 'A';
                      } else {
                        // console.log('P', 'Present');
                        type = 'P';
                      }
                      // if (classname) {
                      //   classes = classname;
                      // }
                      // console.log(type);
                      sessionStorage.setItem('Count Type', type);
                      sessionStorage.setItem('Classid', classid);
                      if (this.divisionid1) {
                        sessionStorage.setItem(
                          'divisionFilter',
                          this.divisionid1
                        );
                      }

                      if (this.YEAR) {
                        sessionStorage.setItem(
                          'YearFilter',
                          this.YEAR.toString()
                        );
                      }
                    }
                    // Log or use the data label as needed

                    // console.log(config.config)
                    if (seriesIndex >= 0 && dataPointIndex >= 0) {
                      // this.router.navigate([
                      //   '/reports/classwise-attendance-report',
                      // ]);
                      window.location.href =
                        '/reports/attendancedetailedreport';
                    }
                  }
                },
              },
            },

            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: 'top',
                    offsetX: -10,
                    offsetY: 0,
                  },
                },
              },
            ],
            xaxis: {
              categories: categories,
              title: {
                text: 'Classes',
              },
            },
            yaxis: {
              title: {
                text: 'Counts',
              },
            },

            fill: {
              opacity: 1,
            },
            legend: {
              position: 'top',
              offsetX: 0,
              offsetY: 0,
            },
          };
          this.isChartSpinning = false;
        } else {
        }
      });
    this.api
      .getClassWisetaskReport(
        0,
        0,
        '',
        '',
        ' AND SCHOOL_ID= ' +
          Number(sessionStorage.getItem('schoolid')) +
          ' AND CLASS_STATUS = 1' +
          this.commonFilterQuery
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          // console.log(data['data']);

          var series = [
            {
              name: 'Completed',
              data: [],
            },
            {
              name: 'Pending',
              data: [],
            },
          ];
          var categories = [];
          data['data'].forEach((chartdata) => {
            if (series[0].name == 'Completed') {
              series[0].data.push(chartdata.COMPLETED);
            }
            if (series[1].name == 'Pending') {
              series[1].data.push(chartdata.PENDING);
            }
            categories.push(chartdata.CLASS_NAME.trim());
          });
          // console.log(series)
          this.chartOptions1 = {
            series: series,
            colors: ['#90EE90', '#FF0000'],
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              stackType: 'normal',
              events: {
                click: (event, chartContext, config) => {
                  // console.log(event)
                  if (
                    config &&
                    config.seriesIndex !== undefined &&
                    config.dataPointIndex !== undefined
                  ) {
                    const seriesIndex = config.seriesIndex;
                    const dataPointIndex = config.dataPointIndex;

                    // console.log(seriesIndex,dataPointIndex);

                    // Assuming you have URLs associated with each data point
                    // const url = this.getDataPointURL(
                    //   seriesIndex,
                    //   dataPointIndex
                    // );
                    // Navigate to the URL  const dataLabel = this.chartData[seriesIndex].data[dataPointIndex].x;
                    const dataLabel = this.chartOptions1.series[seriesIndex];
                    const classname =
                      this.chartOptions1.xaxis.categories[dataPointIndex];
                    const classid = data['data'][dataPointIndex]['CLASS_ID'];

                    if (dataLabel && classname && classid) {
                      // console.log('Selected Data Label:', dataLabel);
                      var type = '';
                      var classes = '';
                      if (dataLabel.name.toLowerCase().startsWith('c')) {
                        // console.log('A', 'Absent');
                        type = 'C';
                      } else {
                        // console.log('P', 'Present');
                        type = 'P';
                      }
                      // if (classname) {
                      //   classes = classname;
                      // }
                      // console.log(type);
                      sessionStorage.setItem('Task Count', type);
                      sessionStorage.setItem('Task Class', classid);
                      if (this.divisionid2) {
                        sessionStorage.setItem(
                          'taskdivisionFilter',
                          this.divisionid2
                        );
                      }

                      if (this.YEAR) {
                        sessionStorage.setItem(
                          'taskYearFilter',
                          this.YEAR.toString()
                        );
                      }
                    }
                    // Log or use the data label as needed

                    // console.log(config.config)
                    if (seriesIndex >= 0 && dataPointIndex >= 0) {
                      // this.router.navigate([
                      //   '/reports/classwise-attendance-report',
                      // ]);
                      window.location.href = '/schoolerp/studenttasks';
                    }
                  }
                },
              },
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: 'top',
                    offsetX: -10,
                    offsetY: 0,
                  },
                },
              },
            ],

            xaxis: {
              categories: categories,
              title: {
                text: 'Classes',
              },
            },
            yaxis: {
              title: {
                text: 'Task Counts',
              },
            },

            fill: {
              opacity: 1,
            },
            legend: {
              position: 'top',
              offsetX: 0,
              offsetY: 0,
            },
          };
          this.isChartSpinning1 = false;
        } else {
        }
      });
    this.api
      .getClassWiseFeeSummary(
        0,
        0,
        '',
        '',
        ' AND SCHOOL_ID= ' +
          Number(sessionStorage.getItem('schoolid')) +
          ' AND CLASS_STATUS = 1' +
          this.commonFilterQuery
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.isChartSpinning2 = true;
          var totalclasses = 0;
          var totalcollected = 0;
          var totalpending = 0;
          data['data'].forEach((data) => {
            totalclasses += data.TOTAL_CLASSES;
            totalcollected += data.TOTAL_COLLECTED;
            totalpending += data.TOTAL_PENDING;
          });
          if (this.divisionid3) {
            sessionStorage.setItem('piedivisionFilterid', this.divisionid3);
          }
          if (this.YEAR) {
            sessionStorage.setItem('pieYearFilter', this.YEAR.toString());
          }
          if (this.classid3) {
            sessionStorage.setItem('pieClassFilter', this.classid3);
          }
          this.chartOptions2 = {
            series: [totalclasses, totalcollected, totalpending],

            chart: {
              width: 380,
              type: 'pie',
              events: {
                dataPointSelection: function (event, chartContext, config) {
                  // ...
                  const dataPointIndex = config.dataPointIndex;
                  const selectedLabel = config.w.config.labels;

                  // console.log(selectedLabel[dataPointIndex].toString().toLowerCase().includes('pending'));
                  if (
                    selectedLabel[dataPointIndex]
                      .toString()
                      .toLowerCase()
                      .includes('pending')
                  ) {
                    sessionStorage.setItem('PendingFilter', 'P');
                  } else {
                    sessionStorage.setItem('PendingFilter', 'C');
                  }
                  if (dataPointIndex >= 0) {
                    window.location.href = '/reports/studentfeesdetailsreport';
                  }
                },
              },
            },

            dataLabels: {
              enabled: true,
              formatter: function (val, opts) {
                return opts.w.config.series[opts.seriesIndex];
              },
            },
            labels: [
              'Total Classes',
              'Total Collected Amount',
              'Total Pending Amount',
            ],
            legend: {
              position: 'bottom', // Position the legend at the bottom
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: 'bottom',
                  },
                },
              },
            ],
          };
          // console.log(this.chartOptions2.dataLabels.formatter)
          this.isChartSpinning2 = false;
        } else {
        }
      });
  }
  getDataPointURL(seriesIndex: number, dataPointIndex: number): string {
    // Logic to determine URL based on seriesIndex and dataPointIndex
    // For example:
    return '/details/' + seriesIndex + '/' + dataPointIndex;
  }
}
