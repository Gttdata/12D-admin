import { Component, OnInit } from '@angular/core';
import { SchoolMaster } from '../../../Models/SchoolMaster';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-listschoolmaster',
  templateUrl: './listschoolmaster.component.html',
  styleUrls: ['./listschoolmaster.component.css'],
})
export class ListschoolmasterComponent implements OnInit {
  formTitle = 'Manage Schools'
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  loadingRecords: boolean = false;
  sortValue = 'desc';
  sortKey = 'id';
  searchText = '';
  isShowBlocked=false

  columns: [string, string][] = [
    ['SCHOOL_NAME', 'SCHOOL_NAME'],
    ['PRINCIPLE_NAME', 'PRINCIPLE_NAME'],
    ['EMAIL_ID', 'EMAIL_ID'],
    ['PHONE_NUMBER', 'PHONE_NUMBER'],
    ['ADDRESS', 'ADDRESS'],
    ['ACC_HOLDER_NAME', 'ACC_HOLDER_NAME'],
    ['ACC_NO', 'ACC_NO'],

    ['PINCODE', 'PINCODE'],
    ['BANK_NAME', 'BANK_NAME'],
    ['UPI_ID', 'UPI_ID'],
    ['IFSC_CODE', 'IFSC_CODE'],
    ['BOARD_NAME', 'BOARD_NAME'],
    ['BOARD_MEDIUM_NAME', 'BOARD_MEDIUM_NAME'],
    ['SEQ_NO', 'SEQ_NO'],
  ];

  pendingscounts: any;
  registercounts: any;
  approvedcounts: any;
  rejectscounts: any;
  blockedcounts: any;
  APPROVAL_STATUS: any = 'ALL';
  showcolor0 = 1;
  showcolor1 = 0;
  showcolor2 = 0;
  showcolor3 = 0;
  showcolor4 = 0;
  drawerVisible: boolean = false;
  drawerTitle = '';
  drawerData: SchoolMaster = new SchoolMaster();
  dataList: SchoolMaster[] = [];

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {}

  // Basic Methods

  keyup(event: any) {
    this.search();
  }

  clickevent(data: any) {
    this.APPROVAL_STATUS = data;
    this.pageIndex = 1;
    this.pageSize = 10;
    if (this.APPROVAL_STATUS == 'ALL') {
      this.showcolor0 = 1;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'A') {
      this.showcolor0 = 0;
      this.showcolor1 = 1;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'R') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 1;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'P') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 1;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'B') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 1;
    }
    this.applyFilter();
  }
  applyFilter() {
    this.search(true);
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var statusFilter = '';
    if (this.APPROVAL_STATUS != undefined && this.APPROVAL_STATUS != 'ALL') {
      statusFilter = ' AND SCHOOL_STATUS=' + "'" + this.APPROVAL_STATUS + "'";
    }
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    this.api
      .getAllSchool(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + statusFilter
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];

            this.api.getCount(0, 0, '', '', '').subscribe(
              (data) => {
                // this.data = data['data']
                this.pendingscounts = data['data'][0]['PENDING'];
                this.rejectscounts = data['data'][0]['REJECTED'];
                this.registercounts = data['data'][0]['ALL_COUNT'];
                this.approvedcounts = data['data'][0]['APPROVED'];
                this.blockedcounts = data['data'][0]['BLOCKED'];

                // this.isSpinning=false
              },
              (err) => {
                // this.isSpinning=false
              }
            );
          } else {
            this.message.error('Something Went Wrong', '');
            this.dataList = [];
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  showDistrictByState: any = 0;

  add(): void {
    this.isShowBlocked = false
    this.drawerTitle = 'Create New School';
    this.drawerData = new SchoolMaster();
    this.api.getAllSchool(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
          this.drawerVisible = true;
          this.showDistrictByState = 1;
        }
      },
      (err) => {}
    );
  }

  districts: [] = [];
  States: [] = [];
  countries: any = [];
  countryWithStatesAvailable: any;
  showState: any = 0;

  stateload: boolean = false;
  edit(data: SchoolMaster): void {
    this.isShowBlocked=true

    this.drawerData = Object.assign({}, data);
    this.stateload = true;
    this.drawerTitle = 'Update School';
    if (
      data.COUNTRY_ID != null &&
      data.COUNTRY_ID != undefined &&
      data.COUNTRY_ID != 0
    ) {
      this.countries = [];
      this.showState = 0;
      this.api
        .getALLCountry(0, 0, '', '', ' AND ID =' + this.drawerData.COUNTRY_ID)
        .subscribe(
          (responseCountryData) => {
            if (responseCountryData['code'] == 200) {
              if (responseCountryData['data'].length == 0) {
                this.countries = [];
              } else {
                this.countries = responseCountryData['data'];
                if (this.countries[0]?.['IS_STATE_AVALIBLE'] == 0) {
                  this.showState = 0;
                  this.showDistrictByState = 0;
                  this.drawerVisible = true;
                } else if (this.countries[0]?.['IS_STATE_AVALIBLE'] == 1) {
                  this.showState = 1;
                  this.showDistrictByState = 1;

                  this.api
                    .getAllStateMaster(
                      0,
                      0,
                      '',
                      '',
                      ' AND STATUS!=false AND COUNTRY_ID = ' +
                        this.drawerData.COUNTRY_ID
                    )
                    .subscribe(
                      (responseStateData) => {
                        if (responseStateData['code'] == 200) {
                          if (responseStateData['data'].length != 0) {
                            this.States = responseStateData['data'];
                            var stateWithDistrictsAvailable = '';
                            stateWithDistrictsAvailable = this.States.find(
                              (state) => state['ID'] === data.STATE_ID
                            );

                            if (
                              stateWithDistrictsAvailable?.[
                                'IS_DISTRICT_AVALIBLE'
                              ] == 0
                            ) {
                              this.showDistrictByState = 0;
                              this.drawerVisible = true;
                            } else if (
                              stateWithDistrictsAvailable?.[
                                'IS_DISTRICT_AVALIBLE'
                              ] == 1
                            ) {
                              this.showDistrictByState = 1;

                              this.api
                                .getAllDistrict(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND STATUS!=false AND STATE_ID = ' +
                                    this.drawerData.STATE_ID
                                )
                                .subscribe(
                                  (responseData) => {
                                    if (responseData['code'] == 200) {
                                      this.districts = responseData['data'];
                                      this.drawerVisible = true;
                                    } else {
                                      this.districts = [];
                                    }
                                  },
                                  (err) => {}
                                );
                            }
                          } else {
                            this.drawerVisible = true;
                            this.States = [];
                          }
                        } else {
                          this.States = [];
                        }
                        this.stateload = false;
                      },
                      (err) => {
                        this.stateload = false;
                      }
                    );
                }
              }
            } else {
              this.countries = [];
            }
          },
          (err) => {
            // Handle error if necessary
          }
        );
    } else {
    }

    // if (this.showState == 1) {
    //   if (this.drawerData.DISTRICT_ID != 0) {

    //     this.showState = 1;
    //   } else {
    //     this.showDistrictByState = 0;
    //     this.showState = 0;
    //   }
    // } else {
    // }

    // if (this.drawerData.DISTRICT_ID !== 0) {
    //   this.api
    //     .getAllDistrict(
    //       0,
    //       0,
    //       '',
    //       '',
    //       ' AND STATUS!=false AND STATE_ID = ' + this.drawerData.STATE_ID
    //     )
    //     .subscribe(
    //       (responseData) => {
    //         if (responseData['code'] == 200) {
    //           this.districts = responseData['data'];
    //         } else {
    //           this.districts = [];
    //         }
    //       },
    //       (err) => {}
    //     );

    //   // this.showDistrictByState = 1;
    // } else {
    //   // this.showDistrictByState = 0;
    // }
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }

  isVisible = false;
  SCHOOL_DATALIST: any;
  SCHOOL_STATUS: any = 'A';
  submitstatusisSpinning: boolean = false;
  StatusButton:any
  Preview(data1: SchoolMaster) {
    this.StatusButton = data1.SCHOOL_STATUS
    this.SCHOOL_DATALIST = Object.assign({}, data1);
    // 
    
    this.isVisible = true;
  }

  SubmitStatus() {
    let isOk = true;

    if (
      this.SCHOOL_DATALIST.SCHOOL_STATUS == undefined ||
      this.SCHOOL_DATALIST.SCHOOL_STATUS == null ||
      this.SCHOOL_DATALIST.SCHOOL_STATUS == 'P'
    ) {
      isOk = false;
      this.message.error('Please Select School Status', '');
    } else if (
      this.SCHOOL_DATALIST.SCHOOL_STATUS == 'R' &&
      (this.SCHOOL_DATALIST.REJECT_BLOCKED_REMARK == undefined ||
        this.SCHOOL_DATALIST.REJECT_BLOCKED_REMARK == '' ||
        this.SCHOOL_DATALIST.REJECT_BLOCKED_REMARK.trim() == '')
    ) {
      isOk = false;
      this.message.error('Please Enter Reject Remark', '');
    }

    if (isOk) {
      this.api.schoolAprroveReject(this.SCHOOL_DATALIST).subscribe((data) => {
        if (data['code'] == 200) {
          this.message.success(' School Status Submitted successfully...', '');
          this.search();
          this.submitstatusisSpinning = false;
          this.isVisible = false;
        } else {
          this.message.error('School Status  Submission Failed...', '');
          this.submitstatusisSpinning = false;
        }
      });
    } else {
      this.submitstatusisSpinning = false;
    }
  }

  handleCancel() {
    this.isVisible = false;
  }
}
