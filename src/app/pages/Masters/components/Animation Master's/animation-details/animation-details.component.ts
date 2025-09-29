import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { AnimationDetailsMaster } from '../../../Models/AnimationDetailsMaster';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-animation-details',
  templateUrl: './animation-details.component.html',
  styleUrls: ['./animation-details.component.css']
})
export class AnimationDetailsComponent implements OnInit {


  @Input()drawerClose: any = Function;
  @Input()AnimationID;
  @Input()VideoLength;

  @Input()drawerVisible: boolean = false;
  @Input()AnimationDetailsDatalist: any[] = [];

  isSpinning = false;
  drawerTitle!: string;
  drawerVisible2: boolean = false;
  isOk = true;
  drawerData: AnimationDetailsMaster = new AnimationDetailsMaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Animation Details  ';
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  drawerClose2!: Function;
  DURATION:any ;

  
  columns: string[][] = [
    ['REWARD_COUNT', ' REWARD_COUNT '],
    ['SEQ_NO', 'SEQ_NO'],
    ['STATUS', 'STATUS'],
    ['END_DURATION', 'END_DURATION'],
    ['START_DURATION', 'START_DURATION'],

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
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ")";
    }
    this.api
      .getALLAnimationDetails(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + 'AND ANIMATION_ID =' + this.AnimationID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.AnimationDetailsDatalist = data['data'];
            this.loadingRecords = false;
          } else {
            this.message.error('Something Went Wrong', '');
            this.AnimationDetailsDatalist = [];
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }
  taskurl: any = '';

  Max:any;
  Min:any;
  add(): void {
    this.drawerTitle = ' Create New Animation Detail ';
    this.drawerData = new AnimationDetailsMaster();
    // this.drawerVisible2 = true;
    // this.Max = 0
    this.Max = this.VideoLength
    this.DURATION = [0,this.VideoLength]
    this.api.getALLAnimationDetails(1, 1, 'SEQ_NO', 'desc', 'AND ANIMATION_ID =' + this.AnimationID).subscribe(
      (data) => {
        console.log(data);
        
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
          this.drawerVisible2 = true;
        } else {
        }
      },
      (err) => {}
    );
  }
  edit(data: AnimationDetailsMaster): void {
    console.log(data);
    this.drawerTitle = 'Update Animation Detail ';
    this.drawerData = Object.assign({}, data);
    this.Max = this.VideoLength

    this.DURATION = [data.START_DURATION , data.END_DURATION]
   
    
    this.drawerVisible2 = true;
  }
  
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerClose2f(): void {
    this.search();
    this.Max = this.VideoLength
    this.DURATION = [0,this.VideoLength]
    this.drawerVisible2 = false;
  }
  close(): void {
    this.drawerClose2f();
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
  save(addNew: boolean, AnimationDetailsPage: NgForm): void {

    console.log(this.DURATION);
    
    this.isOk = true;

    if (
      (this.drawerData.SEQ_NO == undefined ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO <= 0) &&
      (this.drawerData.END_DURATION == undefined ||
        this.drawerData.END_DURATION == null ) &&
        (this.drawerData.START_DURATION == undefined ||
          this.drawerData.START_DURATION == null )
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } 
    // else if (
    //   this.drawerData.START_DURATION == null ||
    //   this.drawerData.START_DURATION == undefined 
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select From Duration', '');
    // }
    // else if (
    //   this.drawerData.END_DURATION == null ||
    //   this.drawerData.END_DURATION == undefined 
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select To Duration', '');
    // } 
    // else if (
    //   (this.drawerData.END_DURATION != null ||
    //   this.drawerData.END_DURATION != undefined) &&  (this.drawerData.START_DURATION != null ||
    //     this.drawerData.START_DURATION == undefined ) && ( this.drawerData.START_DURATION && this.drawerData.END_DURATION <= this.drawerData.START_DURATION)
    // ) {
    //   this.isOk = false;
    //   this.message.error(' To Duration should be greater than From Duration', '');
    // }

    else if (
      this.DURATION == null ||
      this.DURATION == undefined ||
      this.DURATION.length <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select From - To Duration', '');
    }
    else if (
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0 ||
      this.drawerData.SEQ_NO == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    } 

    if (this.isOk) {

      if(this.DURATION.length >= 0)
        {
          this.drawerData.START_DURATION = this.DURATION[0]
          this.drawerData.END_DURATION = this.DURATION[1]

        }
        this.drawerData.ANIMATION_ID = this.AnimationID 


  
      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api.updateAnimationDetails(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Animation Details Information Updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose2f();
            this.isSpinning = false;
          } else {
            this.message.error(
              ' Failed To Update Animation Details Information...',
              ''
            );
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createAnimationDetails(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Animation Details Information Saved Successfully...',
              ''
            );
            if (!addNew) this.drawerClose2f();
            else {
              this.drawerData = new AnimationDetailsMaster();
              this.resetDrawer(AnimationDetailsPage);
              this.api.getALLAnimationDetails(1, 1, '', 'desc', 'AND ANIMATION_ID =' + this.AnimationID).subscribe(
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
            this.message.error(' Failed To Save Animation Details Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
  resetDrawer(AnimationDetailsPage: NgForm) {
    this.drawerData = new AnimationDetailsMaster();
    AnimationDetailsPage.form.markAsPristine();
    AnimationDetailsPage.form.markAsUntouched();
  }


  // MapAnimationDetails

  ANIMATION_REWARDSdrawerTitle!: string;
  ANIMATION_REWARDSdrawerVisible!: boolean;
  ANIMATION_REWARDSmapisSpinning: boolean = false;
  ANIMATION_REWARDSDatalist: any[] = [];
  ANIMATION_REWARDSID:any;
  MapANIMATION_REWARDSDetails(data: any): void {
    // this.ANIMATION_REWARDSdrawerTitle = `Map Details To ${data.NAME}`;
    this.ANIMATION_REWARDSdrawerTitle = `Map Rewards`;


    if (data != undefined && data != null) {
      this.ANIMATION_REWARDSID = data.ID
      // console.log(this.ANIMATION_REWARDSID,'MapANIMATION_REWARDSDetails',data);

      this.api.getALLAnimationRewards(1, 1, 'SEQ_NO', 'desc', 'AND ANIMATION_DETAILS_ID =' + data.ID).subscribe(
        (data) => {
          
          if (data['code'] == 200) {
            this.ANIMATION_REWARDSDatalist = data['data'];
            this.ANIMATION_REWARDSdrawerVisible = true;
          } else {
            this.ANIMATION_REWARDSDatalist = [];
            this.ANIMATION_REWARDSdrawerVisible = true;
          }
          // console.log(this.ANIMATION_REWARDSDatalist);
        },
        (err) => {}
      );
    }
  }

  ANIMATION_REWARDSdrawerClose(): void {
    this.search();
    this.ANIMATION_REWARDSdrawerVisible = false;
  }
  get ANIMATION_REWARDScloseCallback() {
    return this.ANIMATION_REWARDSdrawerClose.bind(this);
  }

  Close2()
  {
    this.drawerClose()
  }
}
