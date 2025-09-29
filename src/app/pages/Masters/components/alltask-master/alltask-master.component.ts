import { Component, OnInit } from '@angular/core';
import { ALLTaskMaster } from '../../Models/ALLTaskMaster';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';
import { DatePipe } from '@angular/common';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-alltask-master',
  templateUrl: './alltask-master.component.html',
  styleUrls: ['./alltask-master.component.css'],
})
export class ALLTaskMasterComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: ALLTaskMaster = new ALLTaskMaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Task  ';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  tasks: any[] = [];
  tasksload: boolean = false;
  ages: any[] = [];
  ageloads: boolean = false;

  columns: string[][] = [
    ['TASK_NAME', ' TASK_NAME '],
    ['AGE_GROUP_NAME', 'AGE_GROUP_NAME'],
    ['DUE_TIME', 'DUE_TIME'],
    ['DESCRIPTION', 'DESCRIPTION'],
  ];
  drawerClose2!: Function;

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getALLTypes();
  }

  getALLTypes() {
    this.tasksload = true;
    this.api.getAllClasses(0, 0, '', '', ' AND STATUS!=false ').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.tasks = data['data'];
          this.tasksload = false;
        } else {
          this.tasks = [];
          this.tasksload = false;
        }
      },
      (err) => {
        this.tasksload = false;
      }
    );
  }

  getALLAges() {
    this.ageloads = true;
    this.api.getAgeCateogary(0, 0, '', '', ' AND STATUS!=false ').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ages = data['data'];
          this.ageloads = false;
        } else {
          this.ages = [];
          this.ageloads = false;
        }
      },
      (err) => {
        this.ageloads = false;
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
      .getALLTaskMaster(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
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
    this.drawerTitle = ' Add New Task ';
    this.drawerData = new ALLTaskMaster();
    this.drawerVisible = true;
  }
  edit(data: ALLTaskMaster): void {
    this.drawerTitle = ' Update Task Information';
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
    this.isOk = true;
    

    if (
      (this.drawerData.TYPE_ID == undefined ||
        this.drawerData.TYPE_ID == null ||
        this.drawerData.TYPE_ID <= 0) &&
      (this.drawerData.DUE_TIME == undefined ||
        this.drawerData.DUE_TIME == null ||
        this.drawerData.DUE_TIME == '') &&
      (this.drawerData.AGE_ID == undefined ||
        this.drawerData.AGE_ID == null ||
        this.drawerData.AGE_ID  <= 0) &&
      (this.drawerData.DESCRIPTION == undefined ||
        this.drawerData.DESCRIPTION == null ||
        this.drawerData.DESCRIPTION == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    }

    else if (
      this.drawerData.TYPE_ID == null ||
      this.drawerData.TYPE_ID <= 0 ||
      this.drawerData.TYPE_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Task Type', '');
    } else if (
      this.drawerData.AGE_ID == null ||
      this.drawerData.AGE_ID == undefined ||
      this.drawerData.AGE_ID <= 0 
    ) {
      this.isOk = false;
      this.message.error('Please Select Age Group', '');
    } else if (
      this.drawerData.DUE_TIME == undefined ||
      this.drawerData.DUE_TIME == null ||
      this.drawerData.DUE_TIME == ''
    ) {
      this.message.error('Please Select Due Time', '');
      this.isOk = false;
    }
    
    else if (this.drawerData.IS_FOR_AGE_RESTRICTION == true && (this.drawerData.ATTACMENT == undefined || this.drawerData.ATTACMENT == null || this.drawerData.ATTACMENT.trim() == '')) {
      this.isOk = false;
      this.message.error('Please Select Attachment', '');
    }

    if (this.isOk) {
      if (
        this.drawerData.DUE_TIME != undefined &&
        this.drawerData.DUE_TIME != null &&
        this.drawerData.DUE_TIME != ''
      ) {
        this.drawerData.DUE_TIME = this.datePipe.transform(
          new Date(),
          'yyyy-MM-dd' + 'T' + this.drawerData.DUE_TIME
        );
      } else {
        this.drawerData.DUE_TIME = this.drawerData.DUE_TIME;
      }
        this.isSpinning = true;
        if (this.drawerData.ID) {
          this.api.UpdateAllTask(this.drawerData).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Task Information Updated Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Update Task Information...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api
            .CreateAllTask(this.drawerData)
            // this.type=.TYPE_ID
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success(' Task Information Save Successfully...', '');
                if (!addNew) this.drawerClose();
                else {
                  this.drawerData = new ALLTaskMaster();
                  this.resetDrawer(websitebannerPage);
                }
                this.isSpinning = false;
              } else {
                this.message.error(' Failed To Save Task Information...', '');
                this.isSpinning = false;
              }
            });
        }
    }
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.drawerData = new ALLTaskMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  // ImageCode
  //Choose Image

  fileList2: any;
  progressBarProfilePhoto: boolean = false;
  percentProfilePhoto = 0;
  timerThree: any;

  onFileSelected(event: any) {
    this.fileList2 = <File>event.target.files[0];
    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png' ||
      event.target.files[0].type == 'application/pdf'
    ) {
      // this.fileList2[0] = <File>event.target.files[0];
      const isLt2M = event.target.files[0].size < 10240000;
      if (isLt2M) {
        if (this.fileList2 != null) {
          var number = Math.floor(100000 + Math.random() * 900000);
          var fileExt = this.fileList2.name.split('.').pop();
          var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          var url: any = '';
          url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();
          if (
            this.drawerData.ATTACMENT != undefined &&
            this.drawerData.ATTACMENT.trim() != ''
          ) {
            var arr = this.drawerData.ATTACMENT.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }
        }
        this.isSpinning = true;

        this.progressBarProfilePhoto = true;
        this.timerThree = this.api
          .onUpload('path', this.fileList2, url)
          .subscribe((res) => {
            if (res.type === HttpEventType.Response) {
            }
            if (res.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round((100 * res.loaded) / res.total);
              this.percentProfilePhoto = percentDone;
              if (this.percentProfilePhoto == 100) {
                this.isSpinning = false;
              }
            } else if (res.type == 2 && res.status != 200) {
              this.message.error('Failed To Upload Image...', '');
              this.isSpinning = false;
              this.progressBarProfilePhoto = false;
              this.percentProfilePhoto = 0;
              this.drawerData.ATTACMENT = null;
            } else if (res.type == 4 && res.status == 200) {
              if (res.body['code'] == 200) {
                this.message.success('Image Uploaded Successfully...', '');
                this.isSpinning = false;
                this.drawerData.ATTACMENT = url;
              } else {
                this.isSpinning = false;
              }
            }
          });
      }
    } else {
      this.message.error(
        ' Please Select Only JPEG/ JPG/ PNG/ PDF Extention.',
        ''
      );
      this.fileList2 = null;
    }
  }

  imageshow: any;
  printOrderModalVisible = false;
  view = 0;
  sanitizedLink: any = '';
  getS(link: string) {
    this.imageshow = '';
    if (this.view == 1) {
      var a: any = this.api.retriveimgUrl + 'employeeProfile/' + link;
    }

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    this.imageshow = this.sanitizedLink;
  }

  ViewModalCancel() {
    this.printOrderModalVisible = false;
    // this.checkClaimData();
  }

  ViewAdvertise(pdfURL: string): void {
    this.view = 1;
    this.printOrderModalVisible = true;
    this.getS(pdfURL);
    // window.open(this.api.retriveimgUrl + 'invoiceUrl/' + pdfURL);
  }

  deleteConfirm(data) {
    this.isSpinning = true;
    if (this.drawerData.ID) {
      this.api
        .deletePdf('employeeProfile/' + data.ATTACMENT)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.drawerData.ATTACMENT = null;
            this.api
              .updateAdvertise(this.drawerData)
              .subscribe((updateCode) => {
                if (updateCode.code == '200') {
                  this.isSpinning = false;
                } else {
                  this.message.error(' Image Has Not Saved...', '');
                  this.isSpinning = false;
                }
              });
            this.message.success(' Image eleted...', '');
          } else {
            this.message.error(' Image Has Not Deleted...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.drawerData.ATTACMENT = null;
      data.ATTACMENT = null;
      this.isSpinning = false;
    }
  }
  deleteCancel(): void {}
}
