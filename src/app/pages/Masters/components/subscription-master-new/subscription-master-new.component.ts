import { Component, OnInit } from '@angular/core';
import { subscriptionmasternew } from '../../Models/subscriptionmasternew';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';
import { NgForm } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'app-subscription-master-new',
  templateUrl: './subscription-master-new.component.html',
  styleUrls: ['./subscription-master-new.component.css'],
})
export class SubscriptionMasterNewComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: subscriptionmasternew = new subscriptionmasternew();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Subscriptions Plans';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  tagValue = [];
  // public commonFunction = new CommomFunctionsService();
  columns: string[][] = [
    ['LABEL'],
    ['DESCRIPTION'],
    ['PRICE'],
    ['TYPE'],
    ['DAYS'],
    ['DISCOUNT'],
  ];
  drawerClose2!: Function;
  loadDimensions = false;
  dimensions: any = [];
  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getDimensions();
    this.getAllsubscriptions();
    this.getAgeGroup();
  }
  dataforFilter: any = [];
  isAlreadySelected = false;
  ageCategories: any = [];
  isAgeloading = false;
  getAgeGroup() {
    this.isAgeloading = true;
    this.api.getAgeCateogary(0, 0, 'id', 'desc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          // this.totalRecords = data['count'];
          // this.dataList = data['data'];
          this.ageCategories = data['data'];
          this.isAgeloading = false;
        } else {
          this.message.error('Something Went Wrong', '');
          this.ageCategories = [];
          this.isAgeloading = false;
        }
      },
      (err) => {
        this.ageCategories = [];
        this.isAgeloading = false;
      }
    );
  }
  disableOption(option: any): boolean {
    // console.log(option);

    if (this.dataforFilter && this.dataforFilter.length > 0) {
      return this.dataforFilter.some((dim) => dim.DIAMENTION_ID === option.ID);
    }
    return false;
  }
  getAllsubscriptions() {
    this.api.getSuscription(0, 0, 'id', 'desc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          // this.totalRecords = data['count'];
          // this.dataList = data['data'];
          this.dataforFilter = data['data'];
          // this.loadingRecords = false;
        } else {
          this.message.error('Something Went Wrong', '');
          // this.dataList = [];
          // this.loadingRecords = false;
        }
      },
      (err) => {}
    );
  }
  getDimensions() {
    this.loadDimensions = true;
    this.api
      .getAllDimensionMaster(0, 0, 'id', 'desc', ' AND STATUS=1')
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.dimensions = data['data'];
            this.loadDimensions = false;
          } else {
            this.dimensions = [];
            this.loadDimensions = false;
            console.log('failed to get dimensions');
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  keyup(event: any) {
    this.search();
  }
  // checkChange(e){
  //   console.log(e);
  // }
  editorConfig1: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '300px',
    minHeight: '0',
    maxHeight: '300px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Add Details here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'big-caslon', name: 'Big Caslon' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'bodoni-mt', name: 'Bodoni MT' },
      { class: 'book-antiqua', name: 'Book Antiqua' },
      { class: 'courier-new', name: 'Courier New' },
      { class: 'lucida-console', name: 'Lucida Console' },
      { class: 'trebuchet-ms', name: 'Trebuchet MS' },
      { class: 'candara', name: 'Candara' },
    ],
    customClasses: [],
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['strikeThrough', 'subscript', 'superscript'],
      ['customClasses', 'insertVideo', 'insertImage'],
    ],
  };
  type = 'active';
  filterQuery = ' AND STATUS=1';
  onChangeFilter(value) {
    // if(value){
    this.filterQuery = ' AND STATUS=' + value;
    this.search();
    value == 1 ? (this.type = 'active') : (this.type = 'inactive');
    // }
  }
  convertHtmlToPlainText(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
  onDescriptionChange(content: string) {
    const maxLength = 1000;
    if (content.length > maxLength) {
      this.drawerData.DESCRIPTION = content.substring(0, maxLength);
      this.message.error(
        `Description cannot exceed ${maxLength} characters.`,
        ''
      );
    }
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
      .getSuscription(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
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
    this.drawerTitle = ' Create New Subscription ';
    this.drawerData = new subscriptionmasternew();

    this.api.getSuscription(1, 1, 'SEQ_NO', 'desc', '').subscribe(
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
  edit(data: subscriptionmasternew): void {
    this.drawerTitle = ' Update Subscription';
    this.drawerData = Object.assign({}, data);
    if (this.drawerData.DESCRIPTION) {
      this.drawerData.DESCRIPTION = data.DESCRIPTION.trim();
    }
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
  save(addNew: boolean, subscriptionmaster: NgForm): void {
    this.isOk = true;
    if (
      (this.drawerData.LABEL == undefined ||
        this.drawerData.LABEL == null ||
        this.drawerData.LABEL.trim() == '') &&
      (this.drawerData.DAYS == undefined ||
        this.drawerData.DAYS == null ||
        this.drawerData.DAYS <= 0) &&
      (this.drawerData.PRICE == undefined ||
        this.drawerData.PRICE == null ||
        this.drawerData.PRICE <= 0) &&
      (this.drawerData.TYPE == undefined ||
        this.drawerData.TYPE == null ||
        this.drawerData.TYPE.trim() == '') &&
      (this.drawerData.DIAMENTION_ID == undefined ||
        this.drawerData.DIAMENTION_ID == null)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.LABEL == undefined ||
      this.drawerData.LABEL == null ||
      this.drawerData.LABEL.trim() == ''
    ) {
      this.message.error('Please Enter Plan Name', '');
      this.isOk = false;
    } else if (
      this.drawerData.DAYS == undefined ||
      this.drawerData.DAYS == null ||
      this.drawerData.DAYS <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Days', '');
    } else if (
      this.drawerData.PRICE == undefined ||
      this.drawerData.PRICE == null ||
      this.drawerData.PRICE <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Price', '');
    } else if (
      this.drawerData.TYPE == undefined ||
      this.drawerData.TYPE == null ||
      this.drawerData.TYPE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Type', '');
    } else if (
      this.drawerData.DIAMENTION_ID == undefined ||
      this.drawerData.DIAMENTION_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Dimension', '');
    }
    // else if (
    //   this.drawerData.MODE == undefined ||
    //   this.drawerData.MODE == null ||
    //   this.drawerData.MODE.trim()==''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select Mode', '');
    // }

    if (this.isOk) {
      if (this.drawerData.DESCRIPTION) {
        this.drawerData.DESCRIPTION = this.drawerData.DESCRIPTION.trim();
      } else {
        this.drawerData.DESCRIPTION = ' ';
      }
      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api
          .UpdateSubscription(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Subscription Details Information Updated Successfully...',
                ''
              );
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
              this.getAllsubscriptions();
            } else {
              this.message.error(
                ' Failed To Update Subscription Details Information...',
                ''
              );
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .CreateSubscription(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Subscription Details Information Save Successfully...',
                ''
              );
              this.getAllsubscriptions();

              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new subscriptionmasternew();
                this.api.getSuscription(1, 1, 'SEQ_NO', 'desc', '').subscribe(
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
                  (err) => {}
                );
                this.resetDrawer(subscriptionmaster);
              }
              this.isSpinning = false;
            } else {
              this.message.error(
                ' Failed To Save Subscription Details Information...',
                ''
              );
              this.isSpinning = false;
            }
          });
      }
    }
  }
  resetDrawer(subscriptionmaster: NgForm) {
    this.drawerData = new subscriptionmasternew();
    subscriptionmaster.form.markAsPristine();
    subscriptionmaster.form.markAsUntouched();
  }
}
