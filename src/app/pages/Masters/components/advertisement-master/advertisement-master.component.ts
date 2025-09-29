import { Component, OnInit } from '@angular/core';
import { AdvertiseMaster } from '../../Models/AdvertiseMaster';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/Services/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-advertisement-master',
  templateUrl: './advertisement-master.component.html',
  styleUrls: ['./advertisement-master.component.css']
})
export class AdvertisementMasterComponent implements OnInit {

  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: AdvertiseMaster = new AdvertiseMaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Advertisements  ';
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

  imgUrl = appkeys.retriveimgUrl;

  columns: string[][] = [
    ['NAME', ' NAME '],
    ['ENABLE_TIME', 'ENABLE_TIME'],
    ['DISABLE_TIME', 'DISABLE_TIME'],
    ['DESCRIPTION', 'DESCRIPTION'],

    ['SEQ_NO', 'SEQ_NO'],

  ];
  drawerClose2!: Function;

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
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
      .getALLAdvertisement(
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
  taskurl: any = '';

  add(): void {
    this.drawerTitle = ' Create New Advertisement ';
    this.drawerData = new AdvertiseMaster();
    this.api.getALLAdvertisement(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
          this.drawerVisible = true;
          this.taskurl = '';

        }
        else { }
      },
      (err) => {
      }
    );


  }
  edit(data: AdvertiseMaster): void {
    this.drawerTitle = ' Update Advertisement';
    this.drawerData = Object.assign({}, data);
    var enableTime=new Date(this.drawerData.ENABLE_TIME)
    var disableTime=new Date(this.drawerData.DISABLE_TIME)
    // console.log(enableTime,disableTime);
    this.drawerData.ENABLE_TIME=enableTime
    this.drawerData.DISABLE_TIME=disableTime
    if (
      data.IMAGE_URL != null &&
      data.IMAGE_URL != undefined &&
      data.IMAGE_URL != ''
    ) {
      this.taskurl =
        appkeys.retriveimgUrl + 'advertisementImage/' + data.IMAGE_URL;
    } else {
      this.taskurl = '';
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
  // startValue: Date | null = null;
  // endValue: Date | null = null;
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.drawerData.DISABLE_TIME) {
      return false;
    }
    return startValue.getTime() > this.drawerData.DISABLE_TIME.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.drawerData.ENABLE_TIME) {
      return false;
    }
    return endValue.getTime() <= this.drawerData.ENABLE_TIME.getTime();
  };
  //save
  save(addNew: boolean, advertisementPage: NgForm): void {

    this.isOk = true;


    if (
      (this.drawerData.SEQ_NO == undefined ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO <= 0) &&
      (this.drawerData.NAME == undefined ||
        this.drawerData.NAME == null ||
        this.drawerData.NAME == '') &&
      (this.drawerData.ENABLE_TIME == undefined ||
        this.drawerData.ENABLE_TIME == null ||
        this.drawerData.ENABLE_TIME == '') &&
      (this.drawerData.DISABLE_TIME == undefined ||
        this.drawerData.DISABLE_TIME == null ||
        this.drawerData.DISABLE_TIME == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    }

    else if (
      this.drawerData.NAME == null ||
      this.drawerData.NAME == undefined ||
      this.drawerData.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Title', '');
    } else if (
      this.drawerData.ENABLE_TIME == undefined ||
      this.drawerData.ENABLE_TIME == null ||
      this.drawerData.ENABLE_TIME == ''
    ) {
      this.message.error('Please Select Enable Date Time', '');
      this.isOk = false;
    } else if (this.drawerData.DISABLE_TIME == undefined || this.drawerData.DISABLE_TIME == null || this.drawerData.DISABLE_TIME == '') {
      this.isOk = false;
      this.message.error('Please Select Disable Date Time', '');
    } else if (
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0 ||
      this.drawerData.SEQ_NO == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    }
    else if (this.drawerData.IMAGE_URL == null || this.drawerData.IMAGE_URL == '') {
      this.isOk = false;
      this.message.error('Please Upload Image', '');
    }

    if (this.isOk) {


      this.drawerData.ENABLE_TIME = this.datePipe.transform(
        new Date(this.drawerData.ENABLE_TIME),
        ' yyyy-MM-dd HH:mm:ss'
      );
      this.drawerData.DISABLE_TIME = this.datePipe.transform(
        new Date(this.drawerData.DISABLE_TIME),
        ' yyyy-MM-dd HH:mm:ss'
      );

      this.isSpinning = true;
      if (this.drawerData.ID) {
        
        this.api.updateAdvertise(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Advertisement Information Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Advertisement Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api
          .createAdvertise(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Advertisement Information Saved Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new AdvertiseMaster();
                this.resetDrawer(advertisementPage);
                this.api.getALLAdvertisement(1, 1, '', 'desc', '').subscribe(
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
                  (err) => {

                  }
                );
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Save Advertisement Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
  resetDrawer(advertisementPage: NgForm) {
    this.drawerData = new AdvertiseMaster();
    advertisementPage.form.markAsPristine();
    advertisementPage.form.markAsUntouched();
  }

  // ImageCode
  //Choose Image

  fileList2: any;
  progressBarProfilePhoto: boolean = false;
  percentProfilePhoto = 0;
  timerThree: any;

 

  onFileSelected(event: any) {
    let isLtSize = false;
    this.fileList2 = <File>event.target.files[0];

    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      const isLt2M = event.target.files[0].size < 10240000;
      if (isLt2M) {
        const img = new Image();
        img.src = window.URL.createObjectURL(event.target.files[0]);
        img.onload = () => {
          if (img.width < 832 && img.height < 596) {
            // Continue with uploading process
            const number = Math.floor(100000 + Math.random() * 900000);
            const fileExt = this.fileList2.name.split('.').pop();
            const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            let url = '';
            url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();
            if (
              this.drawerData.IMAGE_URL != undefined &&
              this.drawerData.IMAGE_URL.trim() != ''
            ) {
              const arr = this.drawerData.IMAGE_URL.split('/');
              if (arr.length > 1) {
                url = arr[5];
              }
            }

            this.isSpinning = true;
            this.progressBarProfilePhoto = true;
            this.timerThree = this.api
              .onUpload('advertisementImage', this.fileList2, url)
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
                  this.message.error('Failed to upload image.', '');
                  this.isSpinning = false;
                  this.progressBarProfilePhoto = false;
                  this.percentProfilePhoto = 0;
                  this.drawerData.IMAGE_URL = null;
                  this.taskurl = '';

                } else if (res.type == 4 && res.status == 200) {
                  if (res.body['code'] == 200) {
                    this.message.success('Image uploaded successfully.', '');
                    this.isSpinning = false;
                    this.drawerData.IMAGE_URL = url;
                    this.taskurl =
                    this.imgUrl + 'advertisementImage/' + this.drawerData.IMAGE_URL;
        
                  } else {
                    this.isSpinning = false;
                  }
                }
              });
          } else {
            this.message.error('Image dimensions must be between 832 x 596 pixels.', '');
            this.fileList2 = null;
            this.drawerData.IMAGE_URL = null
          }
        };
      } else {
        this.message.error('File size exceeds 10MB.', '');
        this.fileList2 = null;
        this.drawerData.IMAGE_URL = null

      }
    } else {
      this.message.error('Please select only JPEG/JPG/PNG extensions.', '');
      this.fileList2 = null;
    }
  }


  deleteConfirm(data) {
    this.isSpinning = true;
    if (this.drawerData.ID) {
      this.api
        .deletePdf('advertisementImage/' + data.IMAGE_URL)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.drawerData.IMAGE_URL = null;
            this.api.updateAdvertise(this.drawerData).subscribe((updateCode) => {
              if (updateCode.code == '200') {
                this.isSpinning = false;
              } else {
                this.message.error(' Image Has Not Saved...', '');
                this.isSpinning = false;
              }
            });
            this.message.success(' Image deleted...', '');
          } else {
            this.message.error(' Image Has Not Deleted...', '');
            this.isSpinning = false;
          }
        });
    } else {


      this.drawerData.IMAGE_URL = null;
      data.IMAGE_URL = null;
      this.isSpinning = false;
    }
  }

  
  deleteCancel(): void { }



}
