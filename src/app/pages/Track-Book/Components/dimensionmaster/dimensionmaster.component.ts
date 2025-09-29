import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { appkeys } from 'src/app/app.constant';
import { dimensionmaster } from '../../Models/dimensionmaster';

@Component({
  selector: 'app-dimensionmaster',
  templateUrl: './dimensionmaster.component.html',
  styleUrls: ['./dimensionmaster.component.css'],
})
export class DimensionmasterComponent implements OnInit {
  isSpinning = false;
  isOk = true;
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: dimensionmaster = new dimensionmaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Dimensions';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  screenwidth: any;

  columns: string[][] = [
    ['NAME', 'NAME'],
    ['STATUS', 'STATUS'],
  ];

  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {}
  close() {
    this.drawerVisible = false;
    this.drawerData = new dimensionmaster();
    this.search();
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
      .getAllDimensionMaster(
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
            this.loadingRecords = false;
            this.dataList = data['data'];
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
            this.dataList = [];
          }
        },
        (err) => {}
      );
  }

  add(): void {
    this.drawerTitle = 'Create New Dimension';
    this.drawerData = new dimensionmaster();
    this.api.getAllDimensionMaster(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQ_NO = 1;
        } else {
          this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
        }
      },
      (err) => {}
    );
    this.drawerVisible = true;
  }

  edit(data: dimensionmaster): void {
    this.drawerTitle = 'Update Dimension';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.taskurl = this.imgUrl + 'diamentionImage/' + this.drawerData.IMAGE_URL;

    console.log(this.taskurl);
    
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  fileList2: any;
  progressBarProfilePhoto: boolean = false;
  percentProfilePhoto = 0;
  timerThree: any;
  taskurl: any = '';
  imgUrl = appkeys.retriveimgUrl;

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
              .onUpload('diamentionImage', this.fileList2, url)
              .subscribe((res) => {
                if (res.type === HttpEventType.Response) {
                }
                if (res.type === HttpEventType.UploadProgress) {
                  const percentDone = Math.round(
                    (100 * res.loaded) / res.total
                  );
                  // console.log(percentDone);

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
                      this.imgUrl +
                      'diamentionImage/' +
                      this.drawerData.IMAGE_URL;
                  } else {
                    this.isSpinning = false;
                  }
                }
              });
          } else {
            this.message.error(
              'Image dimensions must be between 832 x 596 pixels.',
              ''
            );
            this.fileList2 = null;
            this.drawerData.IMAGE_URL = null;
          }
        };
      } else {
        this.message.error('File size exceeds 10MB.', '');
        this.fileList2 = null;
        this.drawerData.IMAGE_URL = null;
      }
    } else {
      this.message.error('Please select only JPEG/JPG/PNG extensions.', '');
      this.fileList2 = null;
    }
  }

  deleteConfirm(data) {
    this.isSpinning = true;
    if (this.drawerData.ID) {
      // this.api
      //   .deletePdf('diamentionImage/' + data.IMAGE_URL)
      //   .subscribe((successCode) => {
      //     if (successCode['code'] == '200') {
      this.drawerData.IMAGE_URL = null;
      //   this.api
      //     .updateActivityHeadMaster(this.drawerData)
      //     .subscribe((updateCode) => {
      //       if (updateCode.code == '200') {
      //         this.isSpinning = false;
      //       } else {
      //         this.message.error(' Image Has Not Saved...', '');
      //         this.isSpinning = false;
      //       }
      //     });
      //   this.message.success(' Image deleted...', '');
      // } else {
      //   this.message.error(' Image Has Not Deleted...', '');
      this.isSpinning = false;
      // }
      // });
    } else {
      this.drawerData.IMAGE_URL = null;
      data.IMAGE_URL = null;
      this.isSpinning = false;
    }
  }
  deleteCancel(): void {}
  // Sort

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
  resetDrawer(activityform: NgForm) {
    // console.log(activityform);
    activityform.form.markAsPristine();
    activityform.form.markAsUntouched();
    this.drawerData = new dimensionmaster();
  }

  save(addNew: boolean, activityform: NgForm): void {
    this.isOk = true;
    this.isSpinning = false;
    if (
      (this.drawerData.NAME == undefined ||
        this.drawerData.NAME == null ||
        this.drawerData.NAME.trim() == '') &&
      (this.drawerData.IMAGE_URL == undefined ||
        this.drawerData.IMAGE_URL == null ||
        this.drawerData.IMAGE_URL.trim() == '') &&
      (this.drawerData.SEQ_NO == undefined ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.NAME == null ||
      this.drawerData.NAME.trim() == '' ||
      this.drawerData.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Name .', '');
    } else if (
      this.drawerData.SEQ_NO == undefined ||
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number ', '');
    } else if (
      this.drawerData.IMAGE_URL == null ||
      this.drawerData.IMAGE_URL.trim() == '' ||
      this.drawerData.IMAGE_URL == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Upload Banner Image .', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api.updateDimension(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Dimension Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Dimension Updation Failed...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createDimension(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Dimension Created Successfully...', '');
            try {
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new dimensionmaster();
                this.resetDrawer(activityform);
              }
            } catch (error) {}
            // if (!addNew) this.drawerClose();
            // else {
            //   this.drawerData = new dimensionmaster();
            //   this.resetDrawer(activityform);
            // }
            this.isSpinning = false;
          } else {
            this.message.error('Dimension Creation Failed...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
}
