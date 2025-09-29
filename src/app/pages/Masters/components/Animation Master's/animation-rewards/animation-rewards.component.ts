import { Component, Input, OnInit } from '@angular/core';
import { AnimationRewardMaster } from '../../../Models/AnimationRewards';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { appkeys } from 'src/app/app.constant';
import { ApiService } from 'src/app/Services/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-animation-rewards',
  templateUrl: './animation-rewards.component.html',
  styleUrls: ['./animation-rewards.component.css']
})
export class AnimationRewardsComponent implements OnInit {

  @Input()drawerClose: any = Function;
  @Input()ANIMATION_REWARDSID;
  @Input()drawerVisible: boolean = false;
  @Input()AnimationRewardDatalist: any[] = [];

  isOk = true;
  drawerTitle!: string;
  rewarddrawerVisible: boolean = false;
  isSpinning: boolean = false;

  drawerData: AnimationRewardMaster = new AnimationRewardMaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Rewards  ';
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  drawerClose2!: Function;
  imgUrl = appkeys.retriveimgUrl;

  columns: string[][] = [
    ['NAME', ' NAME '],
    ['SEQ_NO', 'SEQ_NO'],
    ['STATUS', 'STATUS'],
    // ['DESCRIPTION', 'DESCRIPTION'],
  ];

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
  
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
      likeQuery = likeQuery.substring(0, likeQuery.length - 2)+ ")";
    }
    this.api
      .getALLAnimationRewards(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery +  'AND ANIMATION_DETAILS_ID =' + this.ANIMATION_REWARDSID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
           this.AnimationRewardDatalist = data['data'];
            this.loadingRecords = false;
          } else {
            this.message.error('Something Went Wrong', '');
           this.AnimationRewardDatalist = [];
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }
  taskurl: any = '';

  add(): void {
    this.drawerTitle = ' Create New Reward ';
    this.drawerData = new AnimationRewardMaster();
    this.api.getALLAnimationRewards(1, 1, 'SEQ_NO', 'desc', 'AND ANIMATION_DETAILS_ID =' + this.ANIMATION_REWARDSID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
          this.rewarddrawerVisible = true;
          this.taskurl = '';
        } else {
        }
      },
      (err) => {}
    );
  }
  edit(data: AnimationRewardMaster): void {
    // console.log(data);
    this.drawerTitle = ' Update Reward';
    this.drawerData = Object.assign({}, data);
    if (
      data.IMAGE_URL != null &&
      data.IMAGE_URL != undefined &&
      data.IMAGE_URL != ' '
    ) {
      this.taskurl = appkeys.retriveimgUrl + 'rewardImage/' + data.IMAGE_URL;
    } else {
      this.taskurl = '';
    }
    this.rewarddrawerVisible = true;
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  Close2()
  {
    this.drawerClose()
  }

  rewarddrawerClose(): void {
    this.search();
    this.rewarddrawerVisible = false;
  }

  close(): void {
    this.rewarddrawerClose();
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
  save(addNew: boolean, RewardmasterPage: NgForm): void {
    this.isOk = true;

    if (
      (this.drawerData.SEQ_NO == undefined ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO <= 0) &&
      (this.drawerData.NAME == undefined ||
        this.drawerData.NAME == null ||
        this.drawerData.NAME == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.NAME == null ||
      this.drawerData.NAME == undefined ||
      this.drawerData.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Name', '');
    } else if (
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0 ||
      this.drawerData.SEQ_NO == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    } else if (
      this.drawerData.IMAGE_URL == null ||
      this.drawerData.IMAGE_URL == ''
    ) {
      this.isOk = false;
      this.message.error('Please Upload Image', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      this.drawerData.ANIMATION_DETAILS_ID = this.ANIMATION_REWARDSID
      if (this.drawerData.ID) {
        
        this.api.updateAnimationRewards(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Reward Information Updated Successfully...',
              ''
            );
            if (!addNew) this.rewarddrawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(
              ' Failed To Update Reward Information...',
              ''
            );
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createAnimationRewards(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Reward Information Saved Successfully...',
              ''
            );
            if (!addNew) this.rewarddrawerClose();
            else {
              this.drawerData = new AnimationRewardMaster();
              this.resetDrawer(RewardmasterPage);
              this.api.getALLAnimationRewards(1, 1, '', 'desc', 'AND ANIMATION_DETAILS_ID =' + this.ANIMATION_REWARDSID).subscribe(
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
            this.message.error(' Failed To Save Reward Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
  resetDrawer(RewardmasterPage: NgForm) {
    this.drawerData = new AnimationRewardMaster();
    RewardmasterPage.form.markAsPristine();
    RewardmasterPage.form.markAsUntouched();
  }

  // VideoCode
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
      event.target.files[0].type == 'image/png'||
      event.target.files[0].type == 'image/gif'
    ) {
      const isLt2M = event.target.files[0].size < 10240000;
      if (isLt2M) {
        const img = new Image();
        img.src = window.URL.createObjectURL(event.target.files[0]);
        img.onload = () => {
          if (img.width <= 832 && img.height <= 596) {
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
              .onUpload('rewardImage', this.fileList2, url)
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
                    this.imgUrl + 'rewardImage/' + this.drawerData.IMAGE_URL;
        
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
      this.message.error('Please select only JPEG/JPG/PNG/GIF extensions.', '');
      this.fileList2 = null;
    }
  }

  deleteConfirm(data) {
    this.isSpinning = true;
    if (this.drawerData.ID) {
      this.api
        .deletePdf('rewardImage/' + data.IMAGE_URL)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.drawerData.IMAGE_URL = " ";
            this.api
              .updateAnimationRewards(this.drawerData)
              .subscribe((updateCode) => {
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

  deleteCancel(): void {}

  // MapAnimationDetails
}
