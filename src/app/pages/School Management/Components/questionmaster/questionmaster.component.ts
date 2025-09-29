import { Component, OnInit } from '@angular/core';
import { questionmaster } from '../../Models/questionmaster';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';

@Component({
  selector: 'app-questionmaster',
  templateUrl: './questionmaster.component.html',
  styleUrls: ['./questionmaster.component.css']
})
export class QuestionmasterComponent implements OnInit {
  isLoading: boolean = false;
  formTitle: string = 'Question List';
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: any=new questionmaster();
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
  columns: string[][]=[
    ['DESCRIPTION','DESCRIPTION'],
    ['QUESTION_TYPE','QUESTION_TYPE'],
    ['SEQ_NO','SEQ_NO'],
    ['STATUS','STATUS'],
  ];
  isSpinning:boolean=false
  public commonFunction = new CommomFunctionsService();
  isOk: boolean=true;
  constructor(private message: NzNotificationService) {}
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
    // this.api.getAllPostMaster(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
    //   if(data['code']==200){
    //     this.loadingRecords = false;
    //     this.totalRecords = data['count'];
    //     this.dataList = data['data'];
    //   }
    //   else{
    //     this.message.error('Something Went Wrong','')

    //   }
    //   // if(this.totalRecords==0){
    //   //   data.SEQ_NO=1;
    //   // }else{
    //   //   data.SEQ_NO= this.dataList[this.dataList.length-1]['SEQ_NO']+1
    //   // }
    // }, err => {

    // });
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Add Question';
    this.drawerData= new questionmaster();
    // this.api.getAllPostMaster(1,1,'SEQ_NO','desc','').subscribe (data =>{
    //   if(data['code']==200){
    //     if (data['count']==0){
    //       this.drawerData.SEQ_NO=1;
    //     }else
    //     {
    //       this.drawerData.SEQ_NO=data['data'][0]['SEQ_NO']+1;
    //     }
    //   }
    //   else{
    //     this.message.error('Something Went Wrong','')

    //   }
    // },err=>{

    // })
    // this.drawerData.IS_ACTIVE=true;
    this.drawerVisible = true;
  }
  edit(data: any): void {
    this.drawerTitle = 'Update Question';
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
    const sortOrder = (currentSort && currentSort.value) || 'asc';

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
    // this.data=new PostMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  //save
  save(addNew: boolean,websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk=true;
  if (
    this.drawerData.NAME.trim() == '' &&
    this.drawerData.SCHOOL_ID==undefined &&
    this.drawerData.SEQ_NO == undefined 
  ) {
    this.isOk = false;
    this.message.error('Please Fill All Required Fields', '');
  } else if (
    this.drawerData.NAME == null ||
    this.drawerData.NAME.trim() == ''
  ) {
    this.isOk = false;
    this.message.error('Please Enter Class Name', '');
  } 
  else if (
    this.drawerData.SCHOOL_ID == null ||
    this.drawerData.SCHOOL_ID == undefined
  ) {
    this.isOk = false;
    this.message.error('Please Select School', '');
  }
  else if (
    this.drawerData.SEQ_NO == null ||
    this.drawerData.SEQ_NO == undefined ||
    this.drawerData.SEQ_NO<=0
  ) {
    this.isOk = false;
    this.message.error('Please Enter Sequence No', '');
  }
 
  //   if(this.isOk)
  //   {
  //     // this.isSpinning=false; 

  //     this.isSpinning=true; 
      
  //   if(this.data.ID)
  //   {
  //     this.api.updatePostMaster(this.data)
  //     .subscribe(successCode => {
  //       if(successCode.code=="200")
  //       {
  //           this.message.success("माहिती यशस्वीरित्या बदलली...", "");
  //           if(!addNew)
  //           this.drawerClose();
  //           this.isSpinning = false;
  //       }   
  //       else
  //       {
  //         this.message.error("माहिती बदलली नाही...", "");
  //         this.isSpinning = false;
  //       }
  //     });
  //   }
  //   else{ 
      
  //       this.api.createPostMaster(this.data)
  //       .subscribe(successCode => {
  //         if(successCode.code=="200")
  //         {
  //           this.message.success("माहिती यशस्वीरित्या भरली...", "");
  //            if(!addNew)
  //            this.drawerClose();
  //             else
  //             {
  //               this.data=new PostMaster();
  //               this.resetDrawer(websitebannerPage);
  //               this.data.STATUS==true;
  //               this.api.getAllPostMaster(1,1,'SEQ_NO','desc','').subscribe (data =>{
  //                 if (data['count']==0){
  //                   this.data.SEQ_NO=1;
  //                 }else
  //                 {
  //                   this.data.SEQ_NO=data['data'][0]['SEQ_NO']+1;
  //                 }
  //               },err=>{
                  
  //               })
  //             }
  //             this.isSpinning = false;
  //           }
  //            else
  //            {
  //             this.message.error("माहिती भरण्यात अयशस्वी...", "");
  //             this.isSpinning = false;
  //            }
  //           });
  //         }
  //   }

  // else
  // {
  //   this.message.error("Please Fill All Required Fields...","");
  //   this.isSpinning = false;
  // 
  // }
  }

}
