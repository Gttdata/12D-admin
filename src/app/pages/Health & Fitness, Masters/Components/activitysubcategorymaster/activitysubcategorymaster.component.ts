import { Component, Input, OnInit } from '@angular/core';
import { activitysubcategory } from '../../Models/activitysubcategorymaster';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-activitysubcategorymaster',
  templateUrl: './activitysubcategorymaster.component.html',
  styleUrls: ['./activitysubcategorymaster.component.css'],
})
export class ActivitysubcategorymasterComponent implements OnInit {
  @Input()
  drawerVisible!: boolean;
  @Input()
  drawerTitle!: string;
  @Input()
  CATEGORY_ID
  isSpinning = false;
  isOk = true;
  @Input()
  drawerData: activitysubcategory = new activitysubcategory();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Sub Categories';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';

  drawerClose2!: Function;

  columns: string[][] = [
    ['CATEGORY_NAME', 'CATEGORY_NAME'],
    ['SUB_CATEGORY_NAME', ' SUB_CATEGORY_NAME '],
    ['STATUS ', ' STATUS  '],
    ['SEQ_NO', 'Sequence No'],
  ];

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
      .getAllactivitysubcateogary(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery +' AND CATEGORY_ID= '+ this.CATEGORY_ID
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
    this.drawerTitle = ' Create New Sub Category ';
    this.drawerData = new activitysubcategory();
    this.api.getAllactivitysubcateogary(1, 1, 'SEQ_NO', 'desc', '').subscribe(
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
  edit(data: activitysubcategory): void {
    this.drawerTitle = ' Update Sub Category';
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
    //
    this.isSpinning = false;
    this.isOk = true;

    if (
      (this.drawerData.SUB_CATEGORY_NAME == undefined ||
        this.drawerData.SUB_CATEGORY_NAME == null ||
        this.drawerData.SUB_CATEGORY_NAME.trim() == '') &&
      (this.drawerData.SEQ_NO <= 0 ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO == undefined)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.SUB_CATEGORY_NAME == null ||
      this.drawerData.SUB_CATEGORY_NAME.trim() == '' ||
      this.drawerData.SUB_CATEGORY_NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sub Cateogary Name', '');
    } else if (
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
      this.drawerData.CATEGORY_ID = this.CATEGORY_ID;
      if (this.drawerData.ID) {
        this.api
          .updateActivitySubCateogary(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Sub Category Information Updated Successfully...',
                ''
              );
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error(
                ' Failed To Update Sub Category Information...',
                ''
              );
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .createActivitySubCateogary(this.drawerData)
          // this.type=.TYPE_ID
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Sub Category Information Saved Successfully...',
                ''
              );
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new activitysubcategory();
                this.resetDrawer(statepage);
                this.api
                  .getAllactivitysubcateogary(1, 1, '', 'desc', '')
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        if (data['count'] == 0) {
                          this.drawerData.SEQ_NO = 1;
                        } else {
                          this.drawerData.SEQ_NO =
                            data['data'][0]['SEQ_NO'] + 1;
                        }
                      } else {
                      }
                    },
                    (err) => {}
                  );
              }
              this.isSpinning = false;
            } else {
              this.message.error(
                ' Failed To Save Sub Category Information...',
                ''
              );
              this.isSpinning = false;
            }
          });
      }
    }
  }
  resetDrawer(statepage: NgForm) {
    this.drawerData = new activitysubcategory();
    statepage.form.markAsPristine();
    statepage.form.markAsUntouched();
  }
}
