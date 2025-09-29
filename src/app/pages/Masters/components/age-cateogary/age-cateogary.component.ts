import { Component, OnInit } from '@angular/core';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { AgeCateogaryMaster } from '../../Models/AgeCateogaryMaster';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-age-cateogary',
  templateUrl: './age-cateogary.component.html',
  styleUrls: ['./age-cateogary.component.css'],
})
export class AgeCateogaryComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: AgeCateogaryMaster = new AgeCateogaryMaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Age Groups';
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
    ['FROM_AGE', 'FROM_AGE'],
    ['LABEL', 'LABEL'],
    ['TO_AGE', 'TO_AGE'],
    ['SEQ_NO', 'SEQ_NO'],
  ];
  drawerClose2!: Function;

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {}

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
      .getAgeCateogary(
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
    this.drawerTitle = ' Create New Age Group ';
    this.drawerData = new AgeCateogaryMaster();
    this.api.getAgeCateogary(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {

        if(data['code'] == 200)
        {
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
  edit(data: AgeCateogaryMaster): void {
    this.drawerTitle = ' Update Age Group ';
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
  save(addNew: boolean, AgeCateogarypage: NgForm): void {
    this.isOk = true;

    if (
      (this.drawerData.LABEL == undefined ||
        this.drawerData.LABEL == null ||
        this.drawerData.LABEL.trim()=='') &&
      (this.drawerData.SEQ_NO == undefined ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO <= 0) &&
        (this.drawerData.FROM_AGE == undefined ||
          this.drawerData.FROM_AGE == null ||
          this.drawerData.FROM_AGE =='') &&
        (this.drawerData.TO_AGE == undefined ||
          this.drawerData.TO_AGE == null ||
          this.drawerData.TO_AGE =='')
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.LABEL == null ||
      this.drawerData.LABEL == undefined ||
      this.drawerData.LABEL.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Age Group Name', '');
    } else if (
      this.drawerData.FROM_AGE == undefined ||
      this.drawerData.FROM_AGE == null ||
      this.drawerData.FROM_AGE < 0
    ) {
      this.message.error('Please Enter Min Age', '');
      this.isOk = false;
    } else if (
      this.drawerData.TO_AGE == undefined ||
      this.drawerData.TO_AGE == null ||
      this.drawerData.TO_AGE == ''||
      this.drawerData.TO_AGE < 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Max Age', '');
    } else if (
      parseInt(this.drawerData.FROM_AGE) >= parseInt(this.drawerData.TO_AGE)
  ) {
      this.isOk = false;
      this.message.error('Min Age should be less than Max Age', '');
  }else if (
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0 ||
      this.drawerData.TO_AGE  == ''||
      this.drawerData.SEQ_NO == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api.UpdateAge(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Age Group Details Information Updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(
              ' Failed To Update Age Group Details Information...',
              ''
            );
            this.isSpinning = false;
          }
        });
      } else {
        this.api.CreateAge(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Age Group Details Information Saved Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            else {
              this.drawerData = new AgeCateogaryMaster();
              this.resetDrawer(AgeCateogarypage);
              this.api.getAgeCateogary(1, 1, '', 'desc', '').subscribe(
                (data) => {

                  if(data['code'] == 200)
                  {
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
            this.message.error(
              ' Failed To Save Age Group Details Information...',
              ''
            );
            this.isSpinning = false;
          }
        });
      }
    }
  }
  resetDrawer(AgeCateogarypage: NgForm) {
    this.drawerData = new AgeCateogaryMaster();
    AgeCateogarypage.form.markAsPristine();
    AgeCateogarypage.form.markAsUntouched();
  }
}
