import { Component, OnInit } from '@angular/core';
import { DistrictMaster } from '../../Models/DistrictMaster';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { StateMaster } from '../../Models/StateMaster';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-district-master',
  templateUrl: './district-master.component.html',
  styleUrls: ['./district-master.component.css'],
})
export class DistrictMasterComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: DistrictMaster = new DistrictMaster();
  public commonFunction = new CommomFunctionsService();
  States: StateMaster[] = [];
  stateload: boolean = false;
  formTitle = 'Manage Districts  ';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  countrys: DistrictMaster[] = [];
  countryload: boolean = false;
  columns: string[][] = [
    ['NAME', ' Name '],
    ['STATE_NAME', ' STATE_NAME'],
    ['SEQ_NO', 'Sequence No'],
  ];
  drawerClose2!: Function;

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getallCountry();
  }

  getallStates(id) {
    this.stateload = true;
    this.api
      .getAllStateMaster(
        0,
        0,
        '',
        '',
        ' AND STATUS!=false AND IS_DISTRICT_AVALIBLE = 1 AND COUNTRY_ID=' + id
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.States = data['data'];
            this.stateload = false;
          } else {
            this.States = [];
            this.stateload = false;
          }
        },
        (err) => {
          this.stateload = false;
        }
      );
  }
  getallCountry() {
    this.countryload = true;
    this.api
      .getALLCountry(0, 0, '', '', ' AND STATUS!=false AND IS_STATE_AVALIBLE=1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.countrys = data['data'];
            this.countryload = false;
          } else {
            this.countrys = [];
            this.countryload = false;
          }
        },
        (err) => {
          this.countryload = false;
        }
      );
  }
  keyup(event: any) {
    this.search();
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
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    this.api
      .getAllDistrict(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.loadingRecords = false;
          } else {
            this.message.error('Something Went Wrong', '');
            this.dataList = [];
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }

  add(): void {
    this.drawerTitle = ' Create New District ';
    this.drawerData = new DistrictMaster();
    this.api.getAllDistrict(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
          this.drawerVisible = true;
        }
      },
      (err) => {}
    );
  }
  edit(data: DistrictMaster): void {
    this.drawerTitle = ' Update District';
    this.drawerData = Object.assign({}, data);
    this.getallStates(data.COUNTRY_ID);
    this.drawerVisible = true;
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
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
  close(): void {
    this.drawerClose();
  }

  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      (this.drawerData.NAME == undefined || this.drawerData.NAME == null) &&
      (this.drawerData.COUNTRY_ID == undefined ||
        this.drawerData.COUNTRY_ID == null ||
        this.drawerData.COUNTRY_ID <= 0) &&
      (this.drawerData.STATE_ID == undefined ||
        this.drawerData.STATE_ID == null ||
        this.drawerData.STATE_ID <= 0) &&
      (this.drawerData.SEQ_NO == undefined ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.COUNTRY_ID == undefined ||
      this.drawerData.COUNTRY_ID == null ||
      this.drawerData.COUNTRY_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Country', '');
    } else if (
      this.drawerData.STATE_ID == undefined ||
      this.drawerData.STATE_ID == null ||
      this.drawerData.STATE_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select State ', '');
    } else {
      if (
        this.drawerData.NAME == null ||
        this.drawerData.NAME.trim() == '' ||
        this.drawerData.NAME == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Enter District Name', '');
      } else if (
        this.drawerData.SEQ_NO == undefined ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO <= 0
      ) {
        this.isOk = false;
        this.message.error(' Please Enter Sequence Number ', '');
      }
    }
    if (this.isOk) {
      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api.UpdateDistrict(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' District Updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update District...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.CreateDistrict(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' District  Saved Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            else {
              this.drawerData = new DistrictMaster();
              this.resetDrawer(websitebannerPage);
              this.api.getAllDistrict(1, 1, '', 'desc', '').subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['count'] == 0) {
                      this.drawerData.SEQ_NO = 1;
                    } else {
                      this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                    }
                  }
                },
                (err) => {}
              );
            }
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Save District ...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.drawerData = new DistrictMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
}
