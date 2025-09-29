import { Component, OnInit } from '@angular/core';
import { SocialTaskMaster } from '../../Models/SocialTaskMaster';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-social-task-master',
  templateUrl: './social-task-master.component.html',
  styleUrls: ['./social-task-master.component.css']
})
export class SocialTaskMasterComponent implements OnInit {

  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: SocialTaskMaster = new SocialTaskMaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Social Task  ';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  studentload: boolean = false;
  students: [] = [];


  columns: string[][] = [
    ['DESC', ' DESC '],
    ['SEQ_NO', 'SEQ_NO'],

  ];
  drawerClose2!: Function;

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
  ) { }

  ngOnInit(): void {

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
      .getSocialTask(
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
    this.drawerTitle = ' Add New Social Task ';
    this.drawerData = new SocialTaskMaster();
    this.api.getSocialTask(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQ_NO = 1;
        } else {
          this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
        }
      },
      (err) => {

      }
    );
    this.drawerVisible = true;
  }
  edit(data: SocialTaskMaster): void {
    this.drawerTitle = ' Update Social Task Information';
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
  save(addNew: boolean, socialtaskpage: NgForm): void {

    this.isOk = true;


    if (
      (this.drawerData.SEQ_NO == undefined ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO <= 0) &&
      (this.drawerData.DESC == undefined ||
        this.drawerData.DESC == null ||
        this.drawerData.DESC == '') 
   
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    }
    // else if (
    //   this.drawerData.NAME == null ||
    //   this.drawerData.NAME == undefined ||
    //   this.drawerData.NAME.trim() == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Name', '');
    // }

    else if (
      this.drawerData.DESC == null ||
      this.drawerData.DESC == undefined ||
      this.drawerData.DESC.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Description', '');
    } else if (
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0 ||
      this.drawerData.SEQ_NO == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    }

    if (this.isOk) {
     

      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api.UpdateSocialTask(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Social Task Information Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Social Task Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api
          .CreateSocialTask(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Social Task Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new SocialTaskMaster();
                this.resetDrawer(socialtaskpage);
                this.api.getSocialTask(1, 1, '', 'desc', '').subscribe(
                  (data) => {
                    if (data['count'] == 0) {
                      this.drawerData.SEQ_NO = 1;
                    } else {
                      this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                    }
                  },
                  (err) => {

                  }
                );
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Save Social Task Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
  resetDrawer(socialtaskpage: NgForm) {
    this.drawerData = new SocialTaskMaster();
    socialtaskpage.form.markAsPristine();
    socialtaskpage.form.markAsUntouched();
  }


}
