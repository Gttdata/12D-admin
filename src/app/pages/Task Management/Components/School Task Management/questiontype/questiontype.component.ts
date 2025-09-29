import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { questiontype } from '../../../Models/qusetiontype';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { questionmaster } from 'src/app/pages/School Management/Models/questionmaster';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-questiontype',
  templateUrl: './questiontype.component.html',
  styleUrls: ['./questiontype.component.css']
})
export class QuestiontypeComponent implements OnInit {
  isLoading: boolean = false;
  formTitle: string = 'Manage Question Types';
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: questiontype = new questiontype();
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['LABEL', 'LABEL'],
    ['KEY_WORD', 'KEY_WORD'],
    ['SEQ_NO', 'SEQ_NO'],
    ['STATUS', 'STATUS'],
  ];
  isSpinning: boolean = false
  public commonFunction = new CommomFunctionsService();
  isOk: boolean = true;
  constructor(private message: NzNotificationService, private api: ApiService) { }
  // data:any=new questionmaster()
  ngOnInit(): void {
  }
  close(): void {
    this.drawerClose();
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
    this.api.getAllQuestionType(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.dataList = data['data'];
      }
      else {
        this.message.error('Something Went Wrong', '')

      }

    }, err => {

    });
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Create Question Type';
    this.drawerData = new questiontype();
    this.api.getAllQuestionType(1, 1, 'SEQ_NO', 'desc', '').subscribe(data => {
      if (data['code'] == 200) {
        if (data['count'] == 0) {
          this.drawerData.SEQ_NO = 1;
        } else {
          this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
        }
        this.drawerVisible = true;

      }
      else {
        this.message.error('Something Went Wrong', '')

      }
    }, err => {

    })
    // this.drawerData.IS_ACTIVE=true;
  }
  edit(data: any): void {
    this.drawerTitle = 'Update Question Type';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
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
  resetDrawer(websitebannerPage: NgForm) {
    this.drawerData = new questiontype();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.drawerData.LABEL == '' &&
      this.drawerData.KEY_WORD == '' &&
      (this.drawerData.SEQ_NO == undefined || this.drawerData.SEQ_NO == null
        || this.drawerData.SEQ_NO <= 0)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    } else if (
      this.drawerData.LABEL == '' ||
      this.drawerData.LABEL.trim() == '' ||
      this.drawerData.LABEL == undefined ||
      this.drawerData.LABEL == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Question Type', '');
    }
    else if (
      this.drawerData.KEY_WORD == '' ||
      this.drawerData.KEY_WORD.trim() == '' ||
      this.drawerData.KEY_WORD == undefined ||
      this.drawerData.KEY_WORD == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Key', '');
    }
    else if (
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO == undefined ||
      this.drawerData.SEQ_NO <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No', '');
    }

    if (this.isOk) {
      // this.isSpinning=false; 

      this.isSpinning = true;

      if (this.drawerData.ID) {
        this.api.updateQuestionType(this.drawerData)
          .subscribe(successCode => {
            if (successCode.code == "200") {
              this.message.success("Question Type Updated Successfully...", "");
              if (!addNew)
                this.drawerClose();
              this.isSpinning = false;
            }
            else {
              this.message.error("Failed To Update Question Type", "");
              this.isSpinning = false;
            }
          });
      }
      else {

        this.api.createQuestionType(this.drawerData)
          .subscribe(successCode => {
            if (successCode.code == "200") {
              this.message.success("Question Type Added Successfully", "");
              if (!addNew)
                this.drawerClose();
              else {
                this.resetDrawer(websitebannerPage);
                this.api.getAllQuestionType(1, 1, 'SEQ_NO', 'desc', '').subscribe(data => {
                  if (data['code'] == 200) {
                    if (data['count'] == 0) {
                      this.drawerData.SEQ_NO = 1;
                    } else {
                      this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                    }
                  }


                }, err => {

                })
              }
              this.isSpinning = false;
            }
            else {
              this.message.error("Failed TO Add Question Type", "");
              this.isSpinning = false;
            }
          });
      }
    }


  }

}
