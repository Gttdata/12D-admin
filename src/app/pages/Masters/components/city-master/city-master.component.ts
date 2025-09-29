import { Component, OnInit } from '@angular/core';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { CityMaster } from '../../Models/CityMaster';
import { DistrictMaster } from '../../Models/DistrictMaster';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-city-master',
  templateUrl: './city-master.component.html',
  styleUrls: ['./city-master.component.css'],
})
export class CityMasterComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: CityMaster = new CityMaster();
  public commonFunction = new CommomFunctionsService();
  districtsload: boolean = false;
  formTitle = 'Manage Cities';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  districts: [] = [];
  columns: string[][] = [
    ['NAME', ' Name '],
    ['DISTRICT_NAME', ' DISTRICT_NAME'],
    ['SEQ_NO', 'Sequence No'],
  ];
  drawerClose2!: Function;

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.getallDistricts();
  }


  getallDistricts() {
    this.districtsload = true;
    this.api.getAllDistrict(0, 0, '', '', ' AND STATUS!=false').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.districts = data['data'];
          this.districtsload = false;
        } else {
          this.districts = [];
          this.districtsload = false;
        }
      },
      (err) => {

        this.districtsload = false;
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
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    this.api
      .getAllCityMaster(
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
        (err) => {

        }
      );
  }

  add(): void {
    this.drawerTitle = ' Create New City ';
    this.drawerData = new CityMaster();
    this.api.getAllCityMaster(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
        }
      },
      (err) => {

      }
    );
    this.drawerVisible = true;
  }
  edit(data: CityMaster): void {
    this.drawerTitle = ' Update City Information';
    this.drawerData = Object.assign({}, data);
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
      (this.drawerData.DISTRICT_ID == undefined || this.drawerData.DISTRICT_ID == null || this.drawerData.DISTRICT_ID <= 0) &&
      (this.drawerData.SEQ_NO == undefined || this.drawerData.SEQ_NO == null || this.drawerData.SEQ_NO <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.DISTRICT_ID == undefined ||
      this.drawerData.DISTRICT_ID == null ||
      this.drawerData.DISTRICT_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select District', '');
    }
    else if (
      this.drawerData.NAME == null ||
      this.drawerData.NAME.trim() == '' ||
      this.drawerData.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter City Name', '');
    }
    else if (
      this.drawerData.SEQ_NO == undefined ||
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number ', '');
    }

    if (this.isOk) {
      // this.isSpinning=false;

      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api.UpdateCity(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' City Information Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update City Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api
          .CreateCity(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' City Information Saved Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new CityMaster();
                this.resetDrawer(websitebannerPage);
                this.api.getAllCityMaster(1, 1, '', 'desc', '').subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['count'] == 0) {
                        this.drawerData.SEQ_NO = 1;
                      } else {
                        this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                      }
                    } else {

                    }
                  },
                  (err) => {

                  }
                );
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Save City Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.drawerData = new CityMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
}
