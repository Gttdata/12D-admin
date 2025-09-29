import { Component, OnInit } from '@angular/core';
import { activityhead, activitymaster } from '../../Models/activityheadmaster';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-activity-master',
  templateUrl: './activity-master.component.html',
  styleUrls: ['./activity-master.component.css'],
})
export class ActivityMasterComponent implements OnInit {
  isSpinning = false;
  TIMING_TYPE: any = 'Sec';
  DISTANCE_TYPE: any = 'mtr';

  isOk = true;
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: activitymaster = new activitymaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Activities';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  screenwidth: any;
  activitycategorylist: any[] = [];
  activitysubcategorylist: any[] = [];
  activitycategoryload = false;
  activitysubcategoryload = false;
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  filterClass: string = 'filter-invisible';
  columns: string[][] = [
    ['CATEGORY_NAME', 'CATEGORY_NAME'],
    ['CATEGORY', 'CATEGORY'],
    ['ACTIVITY_NAME', 'ACTIVITY_NAME'],
    ['ACTIVITY_GIF', 'ACTIVITY_GIF'],
    // ['ACTIVITY_TYPE', 'ACTIVITY_TYPE'],
    // ['ACTIVITY_VALUE', 'ACTIVITY_VALUE'],
    // ['ACTIVITY_VALUE', 'ACTIVITY_VALUE'],
    ['DESCRIPTION', 'DESCRIPTION'],
  ];
  resizedImageFile2: File;
  resizedImageUrl2: string;
  // resizedImageFile: File;

  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getActivityCategory();
    this.getActivitySubCategoryForFilter();
  }
  activitysubcategoryload2 = false;
  activitysubcategorylist2 = [];
  getActivitySubCategoryForFilter() {
    this.activitysubcategoryload2 = true;
    this.api
      .getAllactivitysubcateogary(0, 0, 'id', 'asc', ' AND STATUS=1 ')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.activitysubcategorylist2 = data['data'];
          this.activitysubcategoryload2 = false;
        } else {
          this.activitysubcategoryload2 = false;
          this.activitysubcategorylist2 = [];
        }
      });
  }
  getActivitySubCategory(event: any) {
    if (!event) {
      this.drawerData.ACTIVITY_SUB_CATEGORY_ID = null;
    }
    if (event) {
      this.activitysubcategoryload = true;
      this.api
        .getAllactivitysubcateogary(
          0,
          0,
          'id',
          'asc',
          ' AND STATUS=1 AND CATEGORY_ID= ' + event
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.activitysubcategorylist = data['data'];
            this.activitysubcategoryload = false;
          } else {
            this.activitysubcategoryload = false;
            this.activitysubcategorylist = [];
          }
        });
    }
  }
  getActivityCategory() {
    this.activitycategoryload = true;
    this.api
      .getActivityCategoryMaster(0, 0, 'id', 'asc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.activitycategorylist = data['data'];
          this.activitycategoryload = false;
        } else {
          this.activitycategoryload = false;
          this.activitycategorylist = [];
        }
      });
  }

  close() {
    this.drawerVisible = false;
    this.drawerData = new activitymaster();
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
      .getActivityMaster(
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
    this.drawerTitle = 'Create New Activity';
    this.drawerData = new activitymaster();
    this.TIMING_TYPE = 'Sec';
    this.DISTANCE_TYPE = 'mtr';

    this.drawerVisible = true;
  }
  subcategoryload = false;
  ACTIVITY_CATEGORY_ID: any;
  ACTIVITY_SUB_CATEGORY_ID: any;
  CATEGORY: any;
  ChangeSeqByHeadName(data: any) {
    // console.log(data);

    if (data != undefined && data != null) {
      this.api
        .getActivityMaster(
          1,
          1,
          'SEQ_NO',
          'desc',
          'AND ACTIVITY_CATEGORY_ID =' + data
        )
        // .getActivityMaster(1, 1, 'SEQ_NO', 'desc', 'AND ID =' + data)

        .subscribe(
          (data) => {
            // console.log(data, 'data');

            if (data['count'] == 0) {
              this.drawerData.SEQ_NO = 1;
            } else {
              this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
            }
          },
          (err) => {}
        );
    }
  }
  // activitylist;
  showFilter(): void {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  applyFilter() {
    this.isSpinning = true;
    this.loadingRecords = true;
    this.filterQuery = '';

    if (this.ACTIVITY_CATEGORY_ID) {
      this.filterQuery =
        ' AND ACTIVITY_CATEGORY_ID = ' + this.ACTIVITY_CATEGORY_ID;
    }
    if (this.ACTIVITY_SUB_CATEGORY_ID) {
      this.filterQuery +=
        ' AND ACTIVITY_SUB_CATEGORY_ID = ' + this.ACTIVITY_SUB_CATEGORY_ID;
    }
    if (this.CATEGORY) {
      this.filterQuery += " AND CATEGORY = '" + this.CATEGORY + "'";
    }
    // console.log(this.ACTIVITY_CATEGORY_ID,this.ACTIVITY_SUB_CATEGORY_ID)
    // if(this.ACTIVITY_SUB_CATEGORY_ID){
    //   this.filterQuery+=' AND ACTIVITY_CATEGORY_ID = '+ this.ACTIVITY_CATEGORY_ID
    // }
    if (
      this.filterQuery == '' ||
      this.filterQuery == null ||
      this.filterQuery == undefined
    ) {
      this.message.error('', 'Please Select Any Filter Value');
      this.loadingRecords = false;
      this.isSpinning = false;
      this.isFilterApplied = 'default';
      this.filterClass = 'filter-visible';
    } else {
      this.isFilterApplied = 'primary';
      this.filterClass = 'filter-invisible';
      this.search();
    }
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.ACTIVITY_CATEGORY_ID = null;
    this.ACTIVITY_SUB_CATEGORY_ID = null;
    // this.filterdata.CLASS_ID = null;
    // this.filterdata.QUESTION_TYPE = null;
    // this.filterdata.CHAPTER_ID = null;
    // this.filterdata.SUBJECT_ID = null;
    this.search();
  }
  edit(data: activitymaster): void {
    this.drawerTitle = 'Update Activity';
    this.drawerData = Object.assign({}, data);
    this.TIMING_TYPE = 'Sec';
    this.DISTANCE_TYPE = 'mtr';
    if (data.ACTIVITY_CATEGORY_ID) {
      this.getActivitySubCategory(data.ACTIVITY_CATEGORY_ID);
    }
    // console.log(data);

    // if (data.ACTIVITY_TYPE = 'T') {
    //   this.DISTANCE_TYPE = '';
    // } else if (data.ACTIVITY_TYPE = 'D') {
    //   this.TIMING_TYPE = '';
    // } else if(data.ACTIVITY_TYPE = 'S'){
    //   this.TIMING_TYPE = '';
    //   this.DISTANCE_TYPE = '';
    //   data['ACTIVITY_TYPE'] = 'S'

    // }

    this.drawerVisible = true;
    this.taskurl = this.imgUrl + 'activityGIF/' + this.drawerData.ACTIVITY_GIF;
    this.taskurl1 = this.imgUrl + 'activityTumbnailGIF/' + this.drawerData.ACTIVITY_THUMBNAIL_GIF;
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
  progressBarProfilePhoto1: boolean = false;
  percentProfilePhoto1 = 0;
  timerThree1: any;
  taskurl: any = '';
  taskurl1: any = '';
  // imgUrl1:
  imgUrl = appkeys.retriveimgUrl;
  fileList3: any;
  // progressBarProfilePhoto1: boolean = false;
 
  taskurl2: any = '';
  imgUrl1 = appkeys.retriveimgUrl;
  resizedImageFile: File | null = null;
  resizedImageUrl: string | ArrayBuffer | null = null;
  onFileSelected(event: any) {
    let isLtSize = false;
    this.fileList2 = <File>event.target.files[0];
    this.fileList3 = <File>event.target.files[0];
    if (event.target.files[0].type == 'image/gif') {
      const isLt2M = event.target.files[0].size < 10240000;
      if (isLt2M) {
        const img = new Image();
        img.src = window.URL.createObjectURL(event.target.files[0]);
        img.onload = () => {
          if (img.width <= 524 && img.height <= 524) {
            // Continue with uploading process
            const number = Math.floor(100000 + Math.random() * 900000);
            const fileExt = this.fileList2.name.split('.').pop();
            const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            let url = '';
            url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();

            if (
              this.drawerData.ACTIVITY_GIF != undefined &&
              this.drawerData.ACTIVITY_GIF.trim() != ''
            ) {
              // console.log(this.drawerData.ACTIVITY_GIF);

              const arr = this.drawerData.ACTIVITY_GIF.split('/');
              if (arr.length > 1) {
                url = arr[5];
              }
            }

            this.isSpinning = true;
            this.progressBarProfilePhoto = true;
            const input2=event.target as HTMLInputElement
            if (input2.files && input2.files[0]) {
              const file = input2.files[0];
              // this.resizeImage2(file, 524, 524).then((resizedFile) => {
              //   this.resizedImageFile2 = resizedFile;

              //   this.resizedImageUrl2 = URL.createObjectURL(resizedFile);
                // const img = new Image();
                // img.src = window.URL.createObjectURL(resizedFile);
                
                // console.log(img.height,img.width,'Activity GIf');
                this.timerThree = this.api
                .onUpload('activityGIF',this.fileList2, url)
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
                    this.drawerData.ACTIVITY_GIF = null;
                    this.taskurl = '';
                  } else if (res.type == 4 && res.status == 200) {
                    if (res.body['code'] == 200) {
                      this.message.success('Image uploaded successfully.', '');
                      this.isSpinning = false;
                      this.drawerData.ACTIVITY_GIF = url;
                      this.taskurl =
                        this.imgUrl +
                        'activityGIF/' +
                        this.drawerData.ACTIVITY_GIF;
                    } else {
                      this.isSpinning = false;
                    }
                  }
                });
              // });
           
            }
           
          // } 
          else {
            this.message.error(
              'Gif dimensions must be between 524 x 524 pixels.',
              ''
            );
          }
            //   this.fileList2 = null;
            //   this.drawerData.ACTIVITY_GIF = null;
          }
          else {
            this.message.error(
              'Gif dimensions must be between 524 x 524 pixels.',
              ''
            );
          }
        }
      
      }
    }
  }
  onFileSelected2(event: any) {
    // this.fileList2 = <File>event.target.files[0];
    this.fileList3 = <File>event.target.files[0];
    if (event.target.files[0].type == 'image/gif') {
      const isLt2M = event.target.files[0].size < 10240000;
      if (isLt2M) {
        const img = new Image();
        img.src = window.URL.createObjectURL(event.target.files[0]);
        img.onload = () => {
          if (img.width <= 128 && img.height <= 128) {
            // Continue with uploading process
            const number = Math.floor(100000 + Math.random() * 900000);
            const fileExt = this.fileList3.name.split('.').pop();
            const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            let url = '';
            url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();

            if (
              this.drawerData.ACTIVITY_THUMBNAIL_GIF != undefined &&
              this.drawerData.ACTIVITY_THUMBNAIL_GIF.trim() != ''
            ) {
              // console.log(this.drawerData.ACTIVITY_THUMBNAIL_GIF);

              const arr = this.drawerData.ACTIVITY_THUMBNAIL_GIF.split('/');
              if (arr.length > 1) {
                url = arr[5];
              }
            }

            this.isSpinning = true;
            this.progressBarProfilePhoto1 = true;
            const input2=event.target as HTMLInputElement
            if (input2.files && input2.files[0]) {
              const file = input2.files[0];
              // this.resizeImage2(file, 524, 524).then((resizedFile) => {
              //   this.resizedImageFile2 = resizedFile;

              //   this.resizedImageUrl2 = URL.createObjectURL(resizedFile);
                // const img = new Image();
                // img.src = window.URL.createObjectURL(resizedFile);
                
                // console.log(img.height,img.width,'Activity GIf');
                this.timerThree1 = this.api
                .onUpload('activityTumbnailGIF',this.fileList3, url)
                .subscribe((res) => {
                  if (res.type === HttpEventType.Response) {
                  }
                  if (res.type === HttpEventType.UploadProgress) {
                    const percentDone = Math.round(
                      (100 * res.loaded) / res.total
                    );
                    // console.log(percentDone);
  
                    this.percentProfilePhoto1 = percentDone;
                    if (this.percentProfilePhoto1 == 100) {
                      this.isSpinning = false;
                    }
                  } else if (res.type == 2 && res.status != 200) {
                    this.message.error('Failed to upload image.', '');
                    this.isSpinning = false;
                    this.progressBarProfilePhoto1 = false;
                    this.percentProfilePhoto1 = 0;
                    this.drawerData.ACTIVITY_THUMBNAIL_GIF = null;
                    this.taskurl = '';
                  } else if (res.type == 4 && res.status == 200) {
                    if (res.body['code'] == 200) {
                      this.message.success('Image uploaded successfully.', '');
                      this.isSpinning = false;
                      this.drawerData.ACTIVITY_THUMBNAIL_GIF = url;
                      this.taskurl1 =
                        this.imgUrl +
                        'activityTumbnailGIF/' +
                        this.drawerData.ACTIVITY_THUMBNAIL_GIF;
                    } else {
                      this.isSpinning = false;
                    }
                  }
                });
              // });
           
            }
           
          // } 
          else {
            this.message.error(
              'Gif dimensions must be between 128 x 128 pixels.',
              ''
            );
          }
            //   this.fileList2 = null;
            //   this.drawerData.ACTIVITY_GIF = null;
          }
          else {
            this.message.error(
              'Gif dimensions must be between 128 x 128 pixels.',
              ''
            );
          }
        }
      }
    }
  }
  // resizeImage(file: File, width: number, height: number): Promise<File> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (event: any) => {
  //       const img = new Image();
  //       img.onload = () => {
  //         // Calculate aspect ratios
  //         const aspectRatio = img.width / img.height;
  //         const targetAspectRatio = width / height;
  
  //         let srcX = 0, srcY = 0, srcWidth = img.width, srcHeight = img.height;
  
  //         if (aspectRatio > targetAspectRatio) {
  //           // Image is wider than the target aspect ratio
  //           srcWidth = img.height * targetAspectRatio;
  //           srcX = (img.width - srcWidth) / 2;
  //         } else if (aspectRatio < targetAspectRatio) {
  //           // Image is taller than the target aspect ratio
  //           srcHeight = img.width / targetAspectRatio;
  //           srcY = (img.height - srcHeight) / 2;
  //         }
  
  //         const canvas = document.createElement('canvas');
  //         canvas.width = width;
  //         canvas.height = height;
  //         const ctx = canvas.getContext('2d');
  //         ctx?.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, width, height);
  
  //         // Function to create a blob with specified quality
  //         const createBlob = (quality: number, callback: (blob: Blob | null) => void) => {
  //           canvas.toBlob(callback, file.type, quality);
  //         };
  
  //         // Initial blob creation without quality parameter to get the size
  //         createBlob(1.0, (initialBlob) => {
  //           if (!initialBlob) {
  //             reject(new Error('Canvas is empty'));
  //             return;
  //           }
  
  //           // Check if the initial blob size is greater than 1 MB
  //           if (initialBlob.size > 1 * 1024 * 1024) {
  //             // Reduce quality to compress the image
  //             let quality = 0.8;
  //             const reduceQuality = () => {
  //               createBlob(quality, (compressedBlob) => {
  //                 if (!compressedBlob) {
  //                   reject(new Error('Canvas is empty'));
  //                   return;
  //                 }
  
  //                 if (compressedBlob.size <= 1 * 1024 * 1024 || quality <= 0.1) {
  //                   // Create a new File object from the compressed blob
  //                   const resizedFile = new File([compressedBlob], file.name, {
  //                     type: file.type,
  //                     lastModified: Date.now(),
  //                   });
  //                   resolve(resizedFile);
  //                 } else {
  //                   quality -= 0.1;
  //                   reduceQuality();
  //                 }
  //               });
  //             };
  //             reduceQuality();
  //           } else {
  //             // Create a new File object from the initial blob
  //             const resizedFile = new File([initialBlob], file.name, {
  //               type: file.type,
  //               lastModified: Date.now(),
  //             });
  //             resolve(resizedFile);
  //           }
  //         });
  //       };
  //       img.src = event.target.result;
  //     console.log(img.height,img.width);

  //     };
  //     reader.readAsDataURL(file);
      
  //   });
  // }
  // resizeImage2(file: File, width: number, height: number): Promise<File> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (event: any) => {
  //       const img = new Image();
  //       img.onload = () => {
  //         // Calculate aspect ratios
  //         const aspectRatio = img.width / img.height;
  //         const targetAspectRatio = width / height;
  
  //         let srcX = 0, srcY = 0, srcWidth = img.width, srcHeight = img.height;
  
  //         if (aspectRatio > targetAspectRatio) {
  //           // Image is wider than the target aspect ratio
  //           srcWidth = img.height * targetAspectRatio;
  //           srcX = (img.width - srcWidth) / 2;
  //         } else if (aspectRatio < targetAspectRatio) {
  //           // Image is taller than the target aspect ratio
  //           srcHeight = img.width / targetAspectRatio;
  //           srcY = (img.height - srcHeight) / 2;
  //         }
  
  //         const canvas = document.createElement('canvas');
  //         canvas.width = width;
  //         canvas.height = height;
  //         const ctx = canvas.getContext('2d');
  //         ctx?.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, width, height);
  
  //         // Function to create a blob with specified quality
  //         const createBlob = (quality: number, callback: (blob: Blob | null) => void) => {
  //           canvas.toBlob(callback, file.type, quality);
  //         };
  
  //         // Initial blob creation without quality parameter to get the size
  //         createBlob(1.0, (initialBlob) => {
  //           if (!initialBlob) {
  //             reject(new Error('Canvas is empty'));
  //             return;
  //           }
  
  //           // Check if the initial blob size is greater than 1 MB
  //           if (initialBlob.size > 1 * 1024 * 1024) {
  //             // Reduce quality to compress the image
  //             let quality = 0.8;
  //             const reduceQuality = () => {
  //               createBlob(quality, (compressedBlob) => {
  //                 if (!compressedBlob) {
  //                   reject(new Error('Canvas is empty'));
  //                   return;
  //                 }
  
  //                 if (compressedBlob.size <= 1 * 1024 * 1024 || quality <= 0.1) {
  //                   // Create a new File object from the compressed blob
  //                   const resizedFile = new File([compressedBlob], file.name, {
  //                     type: file.type,
  //                     lastModified: Date.now(),
  //                   });
  //                   resolve(resizedFile);
  //                 } else {
  //                   quality -= 0.1;
  //                   reduceQuality();
  //                 }
  //               });
  //             };
  //             reduceQuality();
  //           } else {
  //             // Create a new File object from the initial blob
  //             const resizedFile = new File([initialBlob], file.name, {
  //               type: file.type,
  //               lastModified: Date.now(),
  //             });
  //             resolve(resizedFile);
  //           }
  //         });
  //       };
  //       img.src = event.target.result;
  //     console.log(img.height,img.width);

  //     };
  //     reader.readAsDataURL(file);
  //   });
  // }

  
 
  // resizeImage(file: File, width: number, height: number): Promise<File> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (event: any) => {
  //       const img = new Image();
  //       img.onload = () => {
  //         const canvas = document.createElement('canvas');
  //         canvas.width = width;
  //         canvas.height = height;
  //         const ctx = canvas.getContext('2d');
  //         ctx?.drawImage(img, 0, 0, width, height);
          
  //         // Function to create a blob with specified quality
  //         const createBlob = (quality: number, callback: (blob: Blob | null) => void) => {
  //           canvas.toBlob(callback, file.type, quality);
  //         };
  
  //         // Initial blob creation without quality parameter to get the size
  //         createBlob(1.0, (initialBlob) => {
  //           if (!initialBlob) {
  //             reject(new Error('Canvas is empty'));
  //             return;
  //           }
  
  //           // Check if the initial blob size is greater than 1 MB
  //           if (initialBlob.size > 1 * 1024 * 1024) {
  //             // Reduce quality to compress the image
  //             let quality = 0.8;
  //             const reduceQuality = () => {
  //               createBlob(quality, (compressedBlob) => {
  //                 if (!compressedBlob) {
  //                   reject(new Error('Canvas is empty'));
  //                   return;
  //                 }
  
  //                 if (compressedBlob.size <= 1 * 1024 * 1024 || quality <= 0.1) {
  //                   // Create a new File object from the compressed blob
  //                   const resizedFile = new File([compressedBlob], file.name, {
  //                     type: file.type,
  //                     lastModified: Date.now(),
  //                   });
  //                   resolve(resizedFile);
  //                 } else {
  //                   quality -= 0.1;
  //                   reduceQuality();
  //                 }
  //               });
  //             };
  //             reduceQuality();
  //           } else {
  //             // Create a new File object from the initial blob
  //             const resizedFile = new File([initialBlob], file.name, {
  //               type: file.type,
  //               lastModified: Date.now(),
  //             });
  //             resolve(resizedFile);
  //           }
  //         });
  //       };
  //       img.src = event.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // }
  
  deleteConfirm(data) {
    this.isSpinning = true;
    if (this.drawerData.ID) {
      // this.api
      //   .deletePdf('activityHeadImage/' + data.ACTIVITY_GIF)
      //   .subscribe((successCode) => {
      //     if (successCode['code'] == '200') {
      this.drawerData.ACTIVITY_GIF = null;
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
      this.drawerData.ACTIVITY_GIF = null;
      data.ACTIVITY_GIF = null;
      this.isSpinning = false;
    }
  }
  deleteConfirm2(data) {
    this.isSpinning = true;
    if (this.drawerData.ID) {
      // this.api
      //   .deletePdf('activityHeadImage/' + data.ACTIVITY_GIF)
      //   .subscribe((successCode) => {
      //     if (successCode['code'] == '200') {
      this.drawerData.ACTIVITY_THUMBNAIL_GIF = null;
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
      this.drawerData.ACTIVITY_THUMBNAIL_GIF = null;
      data.ACTIVITY_THUMBNAIL_GIF = null;
      this.isSpinning = false;
    }
  }
  deleteCancel(): void {}
  // Sort
  onTypeChange(type) {
    if (type == 'T') {
      this.drawerData.ACTIVITY_VALUE = '';
    } else {
      this.drawerData.ACTIVITY_VALUE = '';
    }
  }

  TIME_CHANGE: any;
  onTimeTypeChange(time: string): void {}

  onActivityTimingChange(): void {}
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
    this.drawerData = new activitymaster();
    activityform.form.markAsPristine();
    activityform.form.markAsUntouched();
  }

  save(addNew: boolean, activityform: NgForm): void {
    // console.log(activityform.form.value, this.drawerData);

    this.isOk = true;
    this.isSpinning = false;
    if (
      (this.drawerData.ACTIVITY_CATEGORY_ID == undefined ||
        this.drawerData.ACTIVITY_CATEGORY_ID == null) &&
      (this.drawerData.ACTIVITY_SUB_CATEGORY_ID == undefined ||
        this.drawerData.ACTIVITY_SUB_CATEGORY_ID == null) &&
      (this.drawerData.CATEGORY == undefined ||
        this.drawerData.CATEGORY == null ||
        this.drawerData.CATEGORY == '') &&
      (this.drawerData.ACTIVITY_NAME == undefined ||
        this.drawerData.ACTIVITY_NAME == null ||
        this.drawerData.ACTIVITY_NAME == '') &&
      (this.drawerData.ACTIVITY_GIF == undefined ||
        this.drawerData.ACTIVITY_GIF == null ||
        this.drawerData.ACTIVITY_GIF == '')
      //   &&
      // (this.drawerData.ACTIVITY_TYPE == undefined ||
      //   this.drawerData.ACTIVITY_TYPE == null ||
      //   this.drawerData.ACTIVITY_TYPE == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.ACTIVITY_CATEGORY_ID == null ||
      this.drawerData.ACTIVITY_CATEGORY_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Activity Category .', '');
    } else if (
      this.drawerData.ACTIVITY_SUB_CATEGORY_ID == null ||
      this.drawerData.ACTIVITY_SUB_CATEGORY_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Activity Sub Category .', '');
    }
    // else if (
    //   this.drawerData.CATEGORY == null ||
    //   this.drawerData.CATEGORY == '' ||
    //   this.drawerData.CATEGORY == undefined
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select Difficulty .', '');
    // }
    else if (
      this.drawerData.ACTIVITY_NAME == null ||
      this.drawerData.ACTIVITY_NAME == '' ||
      this.drawerData.ACTIVITY_NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Activity Name .', '');
    }
    // else if (
    //   this.drawerData.ACTIVITY_TYPE == null ||
    //   this.drawerData.ACTIVITY_TYPE == '' ||
    //   this.drawerData.ACTIVITY_TYPE == undefined ||
    //   this.drawerData.ACTIVITY_TYPE == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select Activity Type .', '');
    // } else if (
    //   this.drawerData.ACTIVITY_TYPE == 'T' &&
    //   (this.drawerData.ACTIVITY_VALUE == null ||
    //     this.drawerData.ACTIVITY_VALUE == undefined ||
    //     this.drawerData.ACTIVITY_VALUE == '')
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Activity Timing .', '');
    // } else if (
    //   this.drawerData.ACTIVITY_TYPE == 'S' &&
    //   (this.drawerData.ACTIVITY_VALUE == null ||
    //     this.drawerData.ACTIVITY_VALUE == undefined ||
    //     this.drawerData.ACTIVITY_VALUE == '')
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Activity Set .', '');
    // } else if (
    //   this.drawerData.ACTIVITY_TYPE == 'D' &&
    //   (this.drawerData.ACTIVITY_VALUE == null ||
    //     this.drawerData.ACTIVITY_VALUE == undefined ||
    //     this.drawerData.ACTIVITY_VALUE == '')
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter  Distance .', '');
    // }
    else if (
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0 ||
      this.drawerData.SEQ_NO == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Correct Sequence Number .', '');
    } else if (
      this.drawerData.ACTIVITY_GIF == null ||
      this.drawerData.ACTIVITY_GIF == '' ||
      this.drawerData.ACTIVITY_GIF == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Upload Activity Gif .', '');
    }
    if (this.isOk) {
      // if (this.TIMING_TYPE === 'Min') {
      //   this.drawerData.ACTIVITY_VALUE *= 60;
      // }
      // if (this.DISTANCE_TYPE === 'km') {
      //   this.drawerData.ACTIVITY_VALUE *= 1000;
      // }

      // if (this.drawerData.ACTIVITY_TYPE === 'S') {
      //   this.drawerData.ACTIVITY_VALUE = null;
      // } else {
      //   this.drawerData.ACTIVITY_VALUE = null;
      // }

      // console.log(this.drawerData);

      if(this.drawerData.ACTIVITY_THUMBNAIL_GIF==null){
        this.drawerData.ACTIVITY_THUMBNAIL_GIF= " "
      }
      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api
          .updateActivityMaster(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Activity Updated Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Activity Updation Failed...', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .createActivityMaster(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Activity Created Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new activitymaster();
                this.resetDrawer(activityform);
              }
              this.isSpinning = false;
            } else {
              this.message.error('Activity Creation Failed...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
}
