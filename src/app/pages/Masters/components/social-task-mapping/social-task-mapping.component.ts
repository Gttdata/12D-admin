import { Component, OnInit } from '@angular/core';
import { SocialTaskMapping } from '../../Models/SocialTaskMapping';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { ApiService } from 'src/app/Services/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-social-task-mapping',
  templateUrl: './social-task-mapping.component.html',
  styleUrls: ['./social-task-mapping.component.css']
})
export class SocialTaskMappingComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: SocialTaskMapping = new SocialTaskMapping();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Social Task Mapping  ';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  agedata: [] = [];
  agedataload: boolean = false;
  socialdata: [] = [];
  socialdataload: boolean = false;
  drawerClose2!: Function;

  columns: string[][] = [
    ['AGE_GROUP_NAME', ' AGE_GROUP_NAME '],
    ['SOCIAL_TASK_NAME', ' SOCIAL_TASK_NAME '],
    ['SEQ_NO', 'Sequence No'],
  ];

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.getAgeGroupData()
  }

  getAgeGroupData() {
    this.agedataload = true;
    this.api.getAgeCateogary(0, 0, '', '', ' AND STATUS!=false').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.agedata = data['data'];
          this.agedataload = false;
        } else {
          this.agedata = [];
          this.agedataload = false;
        }
      },
      (err) => {

        this.agedataload = false;
      }
    );
  }

  getSocialTaskData() {
    this.socialdataload = true;
    this.api.getALLCountry(0, 0, '', '', ' AND STATUS!=false').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.socialdata = data['data'];
          this.socialdataload = false;
        } else {
          this.socialdata = [];
          this.socialdataload = false;
        }
      },
      (err) => {

        this.socialdataload = false;
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
    // this.loadingRecords = true;
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
      .getSocialTaskMapping(
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
    this.drawerTitle = ' Add New Task Mapping ';
    this.drawerData = new SocialTaskMapping();
    this.api.getSocialTaskMapping(1, 1, 'SEQ_NO', 'desc', '').subscribe(
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
  edit(data: SocialTaskMapping): void {
    this.drawerTitle = ' Update Social Task Mapping Information';
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
  save(addNew: boolean, statepage: NgForm): void {

    this.isOk = true;

    if ((this.drawerData.AGE_GROUP_ID <= 0 || this.drawerData.AGE_GROUP_ID == null || this.drawerData.AGE_GROUP_ID == undefined)
      && (this.drawerData.SOCIAL_TASK_ID <= 0 || this.drawerData.SOCIAL_TASK_ID == null || this.drawerData.SOCIAL_TASK_ID == undefined)
      && (this.drawerData.SEQ_NO <= 0 || this.drawerData.SEQ_NO == null || this.drawerData.SEQ_NO == undefined)) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    }
    else if (
      this.drawerData.AGE_GROUP_ID == undefined ||
      this.drawerData.AGE_GROUP_ID == null ||
      this.drawerData.AGE_GROUP_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Age Cateogary ', '');
    }
    else if (
      this.drawerData.SOCIAL_TASK_ID == undefined ||
      this.drawerData.SOCIAL_TASK_ID == null ||
      this.drawerData.SOCIAL_TASK_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Task Name ', '');
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
        this.api.UpdateSocialTaskMapping(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api
          .CreateSocialTaskMapping(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new SocialTaskMapping();
                this.resetDrawer(statepage);
                this.api.getSocialTaskMapping(1, 1, '', 'desc', '').subscribe(
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
              this.message.error(' Failed To Save Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
  resetDrawer(statepage: NgForm) {
    this.drawerData = new SocialTaskMapping();
    statepage.form.markAsPristine();
    statepage.form.markAsUntouched();
  }
}