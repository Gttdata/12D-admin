import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Banner } from '../../Models/BannerMaster';
import { HttpEventType } from '@angular/common/http';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { appkeys } from 'src/app/app.constant';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-banner-master',
  templateUrl: './banner-master.component.html',
  styleUrls: ['./banner-master.component.css'],
})
export class BannerMasterComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: Banner = new Banner();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Banner';
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
  today=new Date(new Date().getFullYear(),new Date().getMonth(),1)
  current=new Date()
  imgUrl = appkeys.retriveimgUrl;

  columns: string[][] = [
    ['TITLE', ' TITLE '],
    ['SEQ_NO', 'SEQ_NO'],
    ['STATUS', 'STATUS'],
    ['DESCRIPTION', 'DESCRIPTION'],
  ];
  drawerClose2!: Function;

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

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
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    this.api
      .getAllBanners(
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
  taskurl: any = '';
  // disabledStartDate = (startValue: Date): boolean => {
  //   if (!startValue || !this.drawerData.FROM_DATE) {
  //     return false;
  //   }
  //   return startValue.getSeconds() > this.drawerData.FROM_DATE.getSeconds();
  // };
  add(): void {
    this.drawerTitle = ' Create New Banner ';
    this.drawerData = new Banner();
    // this.drawerData.FROM_DATE=this.today    
    // this.drawerData.TO_DATE=this.current
    // console.log(this.drawerData);
    this.drawerVisible = true;
    this.api.getAllBanners(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
          this.drawerVisible = true;
          this.taskurl = '';
        } else {
        }
      },
      (err) => {}
    );
  }
  edit(data: Banner): void {
    // console.log(data);

    this.drawerTitle = 'Update Banner';
    this.drawerData = Object.assign({}, data);
    // if (
    //   data.URL != null &&
    //   data.URL != undefined &&
    //   data.URL != ''
    // ) {
    //   this.taskurl = appkeys.retriveimgUrl + 'bannerImage/' + data.URL;
    // } else {
    //   this.taskurl = '';
    // }
    if (data.URL) {
      this.taskUrl2 = appkeys.retriveimgUrl + 'bannerImage/' + data.URL;
    }
    this.drawerVisible = true;
  }
  //Drawer Methods
  // get closeCallback() {
  //   return this.AnimdrawerClose.bind(this);
  // }

  AnimdrawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  close(): void {
    this.AnimdrawerClose();
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

  //save
  save(addNew: boolean, AnimationPage: NgForm): void {
    this.isOk = true;

    if (
      (this.drawerData.URL == null || this.drawerData.URL == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Upload Banner Image', '');
    } 
    // else if (
    //   this.drawerData.TITLE == null ||
    //   this.drawerData.TITLE == undefined ||
    //   this.drawerData.TITLE?.trim() == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Title', '');
    // } 
    // else if (this.drawerData.URL == null || this.drawerData.URL == '') {
    //   this.isOk = false;
    //   this.message.error('Please Upload Image', '');
    // }

    if (this.isOk) {
      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api.updateBanner(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Banner Updated Successfully...', '');
            if (!addNew) this.AnimdrawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Banner...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createBanner(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Banner Saved Successfully...', '');
            if (!addNew) this.AnimdrawerClose();
            else {
              this.drawerData = new Banner();
              this.resetDrawer(AnimationPage);
              this.api.getAllBanners(1, 1, '', 'desc', '').subscribe(
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
            this.message.error(' Failed To Save Banner...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
  resetDrawer(BannerPage: NgForm) {
    this.drawerData = new Banner();
    BannerPage.form.markAsPristine();
    BannerPage.form.markAsUntouched();
  }

  // VideoCode
  //Choose Video

  fileList2: any;
  progressBarProfilePhoto: boolean = false;
  percentProfilePhoto = 0;
  timerThree: any;
  fileList3: any;
  progressBarProfilePhoto2: boolean = false;
  percentProfilePhoto2 = 0;
  timerFour: any;
  taskUrl2: any = '';
  isSpinning2 = false;

  onFileSelected2(event: any) {
    let isLtSize = false;
    this.fileList3 = <File>event.target.files[0];

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
          if (img.width == 4700 && img.height == 2800) {
            // Continue with uploading process
            const number = Math.floor(100000 + Math.random() * 900000);
            const fileExt = this.fileList3.name.split('.').pop();
            const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            let url = '';
            url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();
            if (
              this.drawerData.URL != undefined &&
              this.drawerData.URL.trim() != ''
            ) {
              const arr = this.drawerData.URL.split('/');
              if (arr.length > 1) {
                url = arr[5];
              }
            }

            this.isSpinning2 = true;
            this.isSpinning = true;
            this.progressBarProfilePhoto2 = true;
            this.timerFour = this.api
              .onUpload('bannerImage', this.fileList3, url)
              .subscribe((res) => {
                if (res.type === HttpEventType.Response) {
                }
                if (res.type === HttpEventType.UploadProgress) {
                  const percentDone = Math.round(
                    (100 * res.loaded) / res.total
                  );
                  // console.log(percentDone);

                  this.percentProfilePhoto2 = percentDone;
                  if (this.percentProfilePhoto2 == 100) {
                    this.isSpinning2 = false;
                    this.isSpinning = false;
                  }
                } else if (res.type == 2 && res.status != 200) {
                  this.message.error('Failed to upload image.', '');
                  this.isSpinning2 = false;
                  this.isSpinning = false;

                  this.progressBarProfilePhoto2 = false;
                  this.percentProfilePhoto2 = 0;
                  this.drawerData.URL = null;
                  this.taskUrl2 = '';
                  event.target.value = null;
                } else if (res.type == 4 && res.status == 200) {
                  if (res.body['code'] == 200) {
                    this.message.success('Image uploaded successfully.', '');
                    this.isSpinning2 = false;
                    this.drawerData.URL = url;
                    this.isSpinning = false;
                    event.target.value = null;
                    // console.log(this.drawerData.URL);

                    this.taskUrl2 =
                      this.imgUrl + 'bannerImage/' + this.drawerData.URL;
                    // console.log(this.taskUrl2);
                  } else {
                    this.isSpinning2 = false;
                  }
                }
              });
          } else {
            this.message.error(
              'Image dimensions must be between 4700 x 2800 pixels.',
              ''
            );
            this.fileList3 = null;
            this.isSpinning2 = false;

            this.drawerData.URL = null;
          }
        };
      } else {
        this.message.error('File size exceeds 10MB.', '');
        this.fileList3 = null;
        this.isSpinning2 = false;
        this.drawerData.URL = null;
      }
    } else {
      this.message.error('Please select only JPEG/JPG/PNG extensions.', '');
      this.fileList3 = null;
      this.isSpinning2 = false;
    }
  }
  deleteConfirm2(data) {
    this.isSpinning2 = true;
    if (this.drawerData.ID) {
      this.api.deletePdf('bannerImage/' + data.URL).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.drawerData.URL = ' ';
          this.api.updateBanner(this.drawerData).subscribe((updateCode) => {
            if (updateCode.code == '200') {
              this.isSpinning2 = false;
            } else {
              this.message.error(' Image Has Not Saved...', '');
              this.isSpinning2 = false;
            }
          });
          this.message.success(' Image deleted...', '');
        } else {
          this.message.error(' Image Has Not Deleted...', '');
          this.isSpinning2 = false;
        }
      });
    } else {
      this.drawerData.URL = '';
      data.URL = '';
      this.isSpinning2 = false;
    }
  }
  deleteCancel2(): void {}

  // deleteConfirm(data) {
  //   this.isSpinning = true;
  //   if (this.drawerData.ID) {
  //     this.api
  //       .deletePdf('animationVideo/' + data.VIDEO_URL)
  //       .subscribe((successCode) => {
  //         if (successCode['code'] == '200') {
  //           this.drawerData.VIDEO_URL = '';
  //           this.api
  //             .updateAnimation(this.drawerData)
  //             .subscribe((updateCode) => {
  //               if (updateCode.code == '200') {
  //                 this.isSpinning = false;
  //               } else {
  //                 this.message.error(' Video Has Not Saved...', '');
  //                 this.isSpinning = false;
  //               }
  //             });
  //           this.message.success(' Video deleted...', '');
  //         } else {
  //           this.message.error(' Video Has Not Deleted...', '');
  //           this.isSpinning = false;
  //         }
  //       });
  //   } else {
  //     this.drawerData.VIDEO_URL = '';
  //     data.VIDEO_URL = '';
  //     this.isSpinning = false;
  //   }
  // }

  deleteCancel(): void {}
}
