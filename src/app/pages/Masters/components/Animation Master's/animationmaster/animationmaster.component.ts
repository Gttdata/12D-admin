import { Component, OnInit } from '@angular/core';
import { AnimationMaster } from '../../../Models/AnimationMaster';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { ApiService } from 'src/app/Services/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { appkeys } from 'src/app/app.constant';
import { NgForm } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-animationmaster',
  templateUrl: './animationmaster.component.html',
  styleUrls: ['./animationmaster.component.css'],
})
export class AnimationmasterComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: AnimationMaster = new AnimationMaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Animations  ';
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
      .getALLAnimation(
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

  add(): void {
    this.drawerTitle = ' Create New Animation ';
    this.drawerData = new AnimationMaster();
    this.api.getALLAnimation(1, 1, 'SEQ_NO', 'desc', '').subscribe(
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
  edit(data: AnimationMaster): void {
    // console.log(data);

    this.drawerTitle = ' Update Animation';
    this.drawerData = Object.assign({}, data);
    if (
      data.VIDEO_URL != null &&
      data.VIDEO_URL != undefined &&
      data.VIDEO_URL != ''
    ) {
      this.taskurl = appkeys.retriveimgUrl + 'animationVideo/' + data.VIDEO_URL;
    } else {
      this.taskurl = '';
    }
    if (data.TEMPLATE_IMAGE) {
      this.taskUrl2 =
      appkeys.retriveimgUrl + 'templateImage/' + data.TEMPLATE_IMAGE;
    }
    this.drawerVisible = true;
  }
  //Drawer Methods
  get closeCallback() {
    return this.AnimdrawerClose.bind(this);
  }

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
      (this.drawerData.SEQ_NO == undefined ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO <= 0) &&
      (this.drawerData.TITLE == undefined ||
        this.drawerData.TITLE == null ||
        this.drawerData.TITLE == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.TITLE == null ||
      this.drawerData.TITLE == undefined ||
      this.drawerData.TITLE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Title', '');
    } else if (
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0 ||
      this.drawerData.SEQ_NO == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    } else if (
      this.drawerData.VIDEO_URL == null ||
      this.drawerData.VIDEO_URL == ''
    ) {
      this.isOk = false;
      this.message.error('Please Upload Video', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api.updateAnimation(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Animation Information Updated Successfully...',
              ''
            );
            if (!addNew) this.AnimdrawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(
              ' Failed To Update Animation Information...',
              ''
            );
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createAnimation(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Animation Information Saved Successfully...',
              ''
            );
            if (!addNew) this.AnimdrawerClose();
            else {
              this.drawerData = new AnimationMaster();
              this.resetDrawer(AnimationPage);
              this.api.getALLAnimation(1, 1, '', 'desc', '').subscribe(
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
            this.message.error(' Failed To Save Animation Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
  resetDrawer(AnimationPage: NgForm) {
    this.drawerData = new AnimationMaster();
    AnimationPage.form.markAsPristine();
    AnimationPage.form.markAsUntouched();
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
  taskUrl2:any = '';
  isSpinning2 = false;
  onFileSelected(event: any) {
    this.fileList2 = <File>event.target.files[0];

    if (
      (event.target.files[0].type.includes('video/') &&
        (event.target.files[0].type == 'video/mp4' ||
          event.target.files[0].type == 'video/webm' ||
          event.target.files[0].type == 'video/quicktime')) ||
      event.target.files[0].type == 'video/avi'
    ) {
      const isLt10MB = event.target.files[0].size < 10240000;

      if (isLt10MB) {
        const videoElement = document.createElement('video');
        videoElement.src = URL.createObjectURL(this.fileList2);

        videoElement.onloadedmetadata = () => {
          const duration = videoElement.duration;
          // this.VideoLength = duration
          // console.log('Video duration:', duration, 'seconds');

          const number = Math.floor(100000 + Math.random() * 900000);
          const fileExt = this.fileList2.name.split('.').pop();
          const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          let url = '';
          url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();
          if (
            this.drawerData.VIDEO_URL != undefined &&
            this.drawerData.VIDEO_URL.trim() != ''
          ) {
            const arr = this.drawerData.VIDEO_URL.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }

          this.isSpinning = true;
          this.progressBarProfilePhoto = true;
          this.timerThree = this.api
            .onUpload('animationVideo', this.fileList2, url)
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
                this.message.error('Failed to Upload Video.', '');
                this.isSpinning = false;
                this.progressBarProfilePhoto = false;
                this.percentProfilePhoto = 0;
                this.drawerData.VIDEO_URL = null;
                this.taskurl = '';
              } else if (res.type == 4 && res.status == 200) {
                if (res.body['code'] == 200) {
                  this.message.success('Video uploaded successfully.', '');
                  this.isSpinning = false;
                  this.drawerData.VIDEO_URL = url;
                  this.taskurl =
                    this.imgUrl + 'animationVideo/' + this.drawerData.VIDEO_URL;
                } else {
                  this.isSpinning = false;
                }
              }
            });
        };

        videoElement.onerror = () => {
          this.message.error('Failed to load video metadata.', '');
          this.fileList2 = null;
          this.drawerData.VIDEO_URL = null;
        };

        // Append video element to the DOM to trigger metadata load (necessary in some browsers)
        document.body.appendChild(videoElement);
      } else {
        this.message.error('File size exceeds 10MB.', '');
        this.fileList2 = null;
        this.drawerData.VIDEO_URL = null;
      }
    } else {
      this.message.error('Please select only video files.', '');
      this.fileList2 = null;
    }
  }
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
          if (img.width <= 524 && img.height <= 524) {
            // Continue with uploading process
            const number = Math.floor(100000 + Math.random() * 900000);
            const fileExt = this.fileList3.name.split('.').pop();
            const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            let url = '';
            url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();
            if (
              this.drawerData.TEMPLATE_IMAGE != undefined &&
              this.drawerData.TEMPLATE_IMAGE.trim() != ''
            ) {
              const arr = this.drawerData.TEMPLATE_IMAGE.split('/');
              if (arr.length > 1) {
                url = arr[5];
              }
            }

            this.isSpinning2 = true;
            this.progressBarProfilePhoto2 = true;
            this.timerFour = this.api
              .onUpload('templateImage', this.fileList3, url)
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
                  }
                } else if (res.type == 2 && res.status != 200) {
                  this.message.error('Failed to upload image.', '');
                  this.isSpinning2 = false;
                  this.progressBarProfilePhoto2 = false;
                  this.percentProfilePhoto2 = 0;
                  this.drawerData.TEMPLATE_IMAGE = null;
                  this.taskUrl2 = '';
                } else if (res.type == 4 && res.status == 200) {
                  if (res.body['code'] == 200) {
                    this.message.success('Image uploaded successfully.', '');
                    this.isSpinning2 = false;
                    this.drawerData.TEMPLATE_IMAGE = url;
                    // console.log(this.drawerData.TEMPLATE_IMAGE);

                    this.taskUrl2 =
                      this.imgUrl +
                      'templateImage/' +
                      this.drawerData.TEMPLATE_IMAGE;
                    // console.log(this.taskUrl2);
                  } else {
                    this.isSpinning2 = false;
                  }
                }
              });
          } else {
            this.message.error(
              'Image dimensions must be between 524 x 524 pixels.',
              ''
            );
            this.fileList3 = null;
            this.isSpinning2 = false;

            this.drawerData.TEMPLATE_IMAGE = null;
          }
        };
      } else {
        this.message.error('File size exceeds 10MB.', '');
        this.fileList3 = null;
        this.isSpinning2 = false;
        this.drawerData.TEMPLATE_IMAGE = null;
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
      this.api
        .deletePdf('templateImage/' + data.TEMPLATE_IMAGE)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.drawerData.TEMPLATE_IMAGE = '';
            this.api
              .updateAnimation(this.drawerData)
              .subscribe((updateCode) => {
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
      this.drawerData.TEMPLATE_IMAGE = '';
      data.TEMPLATE_IMAGE = '';
      this.isSpinning2 = false;
    }
  }
  deleteCancel2(): void {}

  deleteConfirm(data) {
    this.isSpinning = true;
    if (this.drawerData.ID) {
      this.api
        .deletePdf('animationVideo/' + data.VIDEO_URL)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.drawerData.VIDEO_URL = '';
            this.api
              .updateAnimation(this.drawerData)
              .subscribe((updateCode) => {
                if (updateCode.code == '200') {
                  this.isSpinning = false;
                } else {
                  this.message.error(' Video Has Not Saved...', '');
                  this.isSpinning = false;
                }
              });
            this.message.success(' Video deleted...', '');
          } else {
            this.message.error(' Video Has Not Deleted...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.drawerData.VIDEO_URL = '';
      data.VIDEO_URL = '';
      this.isSpinning = false;
    }
  }

  deleteCancel(): void {}

  // MapAnimationDetails

  AnimationDetailsdrawerTitle!: string;
  AnimationDetailsdrawerVisible!: boolean;
  AnimationDetailsmapisSpinning: boolean = false;
  AnimationDetailsDatalist: any[] = [];
  AnimationID: any;
  VideoLength: any;

  MapAnimationDetails(data: any): void {
    this.AnimationDetailsdrawerTitle = `Map Details To ${data.TITLE}`;

    if (data.VIDEO_URL) {
      const videolink =
        appkeys.retriveimgUrl + 'animationVideo/' + data.VIDEO_URL;
      // console.log(videolink);

      const videoElement = document.createElement('video');
      videoElement.src = videolink;

      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration;
        // console.log('Video duration:', duration, 'seconds');
        // Optionally, you can convert seconds to minutes and seconds
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        // console.log(
        //   `Video duration: ${minutes} minutes and ${seconds} seconds`
        // );
      };

      videoElement.onerror = () => {
        console.error('Failed to load video metadata.');
      };

      // Append the video element to the DOM to ensure the metadata load event is triggered
      document.body.appendChild(videoElement);

      // Optionally, remove the video element after loading the metadata
      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration;
        // console.log('Video duration:', duration, 'seconds');
        this.VideoLength = duration;
        document.body.removeChild(videoElement); // Clean up
      };
    }

    if (data != undefined && data != null) {
      this.AnimationID = data.ID;
      this.api
        .getALLAnimationDetails(
          1,
          1,
          'SEQ_NO',
          'desc',
          'AND ANIMATION_ID =' + data.ID
        )
        .subscribe(
          (data) => {
            // console.log(data);

            if (data['code'] == 200) {
              this.AnimationDetailsDatalist = data['data'];
              this.AnimationDetailsdrawerVisible = true;
            } else {
              this.AnimationDetailsDatalist = [];
              this.AnimationDetailsdrawerVisible = true;
            }
          },
          (err) => {}
        );
    }
  }

  AnimationMapdrawerClose(): void {
    this.search();
    this.AnimationDetailsdrawerVisible = false;
  }
  get AnimationcloseCallback() {
    return this.AnimationMapdrawerClose.bind(this);
  }
}
