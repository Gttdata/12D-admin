import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { appkeys } from 'src/app/app.constant';
import { Ticketgroup } from 'src/app/pages/Task Management/Models/Ticketgroup';

@Component({
  selector: 'app-list-bulk-task',
  templateUrl: './list-bulk-task.component.html',
  styleUrls: ['./list-bulk-task.component.css'],
})
export class ListBulkTaskComponent implements OnInit {
  formTitle = 'Task Group Master';
  formTitleHead;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  addFirstQuestion = false;
  parentLoading = false;
  departmentLoading = false;
  loadingRecords = false;
  mapFaqVisible = false;
  totalRecords = 1;
  filterQuery = '';
  faqs: any[] = [];
  ticketGroups: Ticketgroup[];
  ticketGroup: Ticketgroup;
  ticketData: Ticketgroup = new Ticketgroup();
  ticketDat2: Ticketgroup = new Ticketgroup();
  isSpinning = false;
  date = new Date();
  date1 = this.datePipe.transform(this.date, 'yyyyMMddHHmmss');
  fileDataLOGO_URL: File = null;
  folderName = 'ticketGroup';
  nodes = [];
  ID: number;
  ticketGroupId: number;
  dataList = [];
  columns: string[][] = [
    ['TYPE', 'Type'],
    ['VALUE', 'Value'],
    ['SEQ_NO', 'Sequence No'],
    ['IS_LAST_STATUS', 'Is Last'],
    ['TASK_ASSIGN_TYPE', 'Task Type'],
  ];
  addOptionVisible = false;
  visibleAdd = true;
  NAME: string;
  Question: string;
  applicationId = Number(this.cookie.get('applicationId'));
  ticketId: number;
  name1 = 'None';
  newId = 0;
  loadingRecordsFaqs = false;
  item = {};
  parentId = 0;
  type = '';
  ticketQuestion: Ticketgroup[] = [];
  is_first = 0;
  title = '';
  clickedParentID = 0;
  parentTicketGroups: Ticketgroup[] = [];
  Title = '';
  FAQHead = 0;
  faqdataList = [];
  constructor(
    private api: ApiService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService
  ) {}
  public commonFunction = new CommomFunctionsService();

  ngOnInit() {
    // console.log(this.nodes,'nodes');

    let get = 'AND APPLICATION_ID=' + this.applicationId;
    // this.loadTicketGroups(get)
    var filterQuery = 'AND PARENT_ID=0 ';
    this.loadTicketGroups(filterQuery);

    // this.api.getAllFaqHeads(0, 0, 'NAME', 'ASC', ' AND STATUS = 1' + ' AND  ORG_ID =' + this.cookie.get('orgId')).subscribe(data => {
    //   if (data['code'] == '200' && data['count'] > 0) {
    //     this.faqdataList = data['data'];
    //     this.FAQHead = this.faqdataList[0]['ID'];

    //   } else {
    //     this.faqdataList = []
    //     this.FAQHead = 0;
    //   }

    // }, err => {
    //   console.log(err);
    // });
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
  }

  setFilter(event) {
    this.FAQHead = event;
    this.mapFaq3(this.ticketGroupId);
  }

  Visible(n) {
    this.is_first = n;
    this.ticketData = Object.assign({}, this.ticketDat2);
    this.parentTicketGroups = [];
    // console.log(this.ticketData);

    if (this.ticketData.ID) {
      this.addFirstQuestion = true;
      this.newId = this.ticketData.PARENT_ID;
      this.name1 = 'None';
    } else {
      this.newId = 0;
      this.name1 = 'None';
      this.ticketData.PARENT_ID = 0;
      this.ticketData.ID = undefined;
      this.ticketData.STATUS = true;
      this.ticketData.IS_LAST = false;
      // this.ticketData.URL = "";
      this.ticketData.TYPE = "Q";
      this.addFirstQuestion = true;
    }
  }

  drawerClose(): void {
    this.is_first = 0;
    this.addFirstQuestion = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  drawerClose1(): void {
    this.addOptionVisible = false;
  }

  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }

  drawerClose2(): void {
    this.mapFaqVisible = false;
  }

  get closeCallback2() {
    return this.drawerClose2.bind(this);
  }

  loadTicketGroups(filter?) {
    this.loadingRecords = true;
    this.parentLoading = true;
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    if (this.searchText != '') {
      var likeQuery = this.filterQuery + ' AND ';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      filter = likeQuery;
    }

    this.dataList = [];
    this.ticketDat2 = new Ticketgroup();

    console.log( filter);
    
    this.api.getAllTicketGroups(0, 0, '', '', filter).subscribe(
      (ticketGroups) => {
        if (filter.match('AND PARENT_ID=0')) {
          if (ticketGroups['count'] != 0) {
            console.log(ticketGroups,"ticketGroups");

            this.ticketDat2 = Object.assign({}, ticketGroups['data'][0]);
            this.ticketId = this.ticketDat2.ID;
            console.log(this.ticketDat2, this.ticketId);

            this.nodes = ticketGroups['data'];
            this.nodes = [
              {
                title:
                  ticketGroups['data'][0]['TYPE'] +
                  '.1) ' +
                  ticketGroups['data'][0]['VALUE'],
                key: ticketGroups['data'][0]['ID'],
                type: ticketGroups['data'][0]['TYPE'],
                department: ticketGroups['data'][0]['DEPARTMENT_ID'],
                islast: ticketGroups['data'][0]['IS_LAST_STATUS'],
                parentID: ticketGroups['data'][0]['PARENT_ID'],
              },
            ];

            console.log(this.nodes,'nodes');

            this.loadingRecords = false;
          } else {
            this.ticketDat2 = new Ticketgroup();
          }
        } else {
          if (ticketGroups['count'] > 0) {
            this.ticketData.PARENT_ID = ticketGroups['data'][0]['ID'];
          } else {
            this.ticketDat2 = new Ticketgroup();
          }

          this.loadingRecords = false;
          this.totalRecords = ticketGroups['count'];
          this.ticketGroups = ticketGroups['data'];
          this.dataList = ticketGroups['data'];
        }

        // if (ticketGroups['count'] >= 1) {
        //   if (ticketGroups['data'][0]['TYPE'] == "O") {
        //     this.ticketData.TYPE = 'Q'
        //     this.NAME = "Options"
        //   }
        //   else {
        //     this.ticketData.TYPE = 'O'
        //   }
        // }
        // else {
        //   this.NAME = "Question"
        // }

        this.parentLoading = false;
      },
      (err) => {
        this.loadingRecords = false;
        this.parentLoading = false;
      }
    );
  }

  loadTicketGroups2(filter?) {
    this.loadingRecords = true;
    this.parentLoading = false;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';
    if (this.searchText != '') {
      var likeQuery = this.filterQuery + ' AND ';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      //console.log("likeQuery" + likeQuery);
      filter = likeQuery;
    }

    this.ticketGroups = [];
    this.ticketQuestion = [];
    this.api.getAllTicketGroups(0, 0, 'SEQ_NO', 'ASC', filter).subscribe(
      (ticketGroups) => {
        if (ticketGroups['code'] == 200) {
          if (ticketGroups['count'] == 0) {
            this.totalRecords = 0;
            this.loadingRecords = false;
          } else {
            this.ticketQuestion = ticketGroups['data'].filter(
              (item) => item.TYPE == 'Q'
            );
            this.ticketGroups = ticketGroups['data'].filter(
              (item) => item.TYPE == 'O'
            );
            this.totalRecords = ticketGroups['count'];
            this.loadingRecords = false;
          }
        }
      },
      (err) => {
        this.loadingRecords = false;
        this.message.error(JSON.stringify(err), '');
      }
    );
  }

  onFileSelectedURL(event) {
    this.fileDataLOGO_URL = <File>event.target.files[0];
    var fileExt = this.fileDataLOGO_URL.name.split('.').pop();
  }

  close(accountMasterPage: NgForm) {
    accountMasterPage.form.reset();
    this.addFirstQuestion = false;
  }

  close2() {
    this.addFirstQuestion = false;
    // if (this.is_first == 1) {
    this.filterQuery = ' AND PARENT_ID=0';
    // AND APPLICATION_ID=" + this.applicationId;
    this.loadTicketGroups(this.filterQuery);
    // } else {
    //   this.filterQuery = " AND PARENT_ID=" + this.parentId
    //   this.loadTicketGroups2(this.filterQuery);
    // }
  }

  save(addNew: boolean, accountMasterPage: NgForm) {
    var ok = true;
    // this.ticketData['ORG_ID'] = Number(this.cookie.get('orgId'));

    if (
      this.ticketData.VALUE != undefined &&
      this.ticketData.VALUE.toString().trim() != ''
    ) {
      if (this.ticketData.IS_LAST) {
        if (
          this.ticketData.TASK_ASSIGN_TYPE != undefined &&
          this.ticketData.TASK_ASSIGN_TYPE.toString().trim() != ''
        ) {

          if (
           ( this.ticketData.TASK_ASSIGN_DAYS < 2 ||
            this.ticketData.TASK_ASSIGN_DAYS == undefined ||
            this.ticketData.TASK_ASSIGN_DAYS == null) && this.ticketData.TASK_ASSIGN_TYPE=='C'
          ) {
            ok = false;
            this.message.error('Please Enter Task Assigned Days...', '');
          }
        } else {
          ok = false;
          this.message.error('Please Select Task Assign Type...', '');
        }
      }

      if (this.ticketData.TYPE == 'O') {
        if (
          this.ticketData.SEQ_NO == undefined ||
          this.ticketData.SEQ_NO <= 0
        ) {
          ok = false;
          this.message.error('Please Enter Sequence No....', '');
        }
      } else {
        this.ticketData.SEQ_NO = 0;
      }

      // if (this.ticketData.IS_LAST == 1) {
      //   if (this.ticketData.DEPARTMENT_ID == undefined || this.ticketData.DEPARTMENT_ID.toString().trim() == '' || this.ticketData.DEPARTMENT_ID < 0) {
      //     ok = false
      //     this.message.error("Please Select Department....", "");
      //   }
      // } else {
      //   this.ticketData.DEPARTMENT_ID = 0;
      // }

      console.log(this.ticketData);
      
      if (ok) {
        this.isSpinning = true;
        if (this.ticketData.ID) {
          this.api
            .updateTicketGroup(this.ticketData)
            .subscribe((successCode) => {
              if (successCode['code'] == '200') {
                this.message.success('Ticket group update Successfully...', '');
                accountMasterPage.form.reset();
                this.close2();
                this.isSpinning = false;
              } else {
                this.message.error(
                  'Failed to update ticket group information...',
                  ''
                );
                this.isSpinning = false;
              }
            });
        } else {
          //console.log(this.ticketData);
          this.ticketData.TASK_ASSIGN_TYPE = 'D';
          this.ticketData.DESCRIPTION = '';

          // console.log(this.ticketData);

          this.api
            .createTicketGroup(this.ticketData)
            .subscribe((successCode) => {
              if (successCode['code'] == '200') {
                this.message.success(
                  'Ticket Group information added successfully...',
                  ''
                );
                if (!addNew) {
                  accountMasterPage.form.reset();
                  this.close2();
                } else {
                  this.ticketData = new Ticketgroup();
                  accountMasterPage.form.reset();
                  this.clearData();
                }
                this.isSpinning = false;
              } else {
                this.message.error(
                  'Failed to add ticket group information...',
                  ''
                );
                this.isSpinning = false;
              }
            });
        }
      }
    } else {
      this.message.error('Please Fill All Required * Fields...', '');
      this.isSpinning = false;
    }
  }

  // genarateKeyLOGO_URL() {
  //   var number = Math.floor(100000 + Math.random() * 900000)
  //   var fileExt = this.fileDataLOGO_URL.name.split('.').pop();
  //   var url = this.date1 + number + "." + fileExt;
  //   this.api.onUpload(this.folderName, this.fileDataLOGO_URL, url)
  //   this.ticketData.URL = this.api.retriveimgUrl + this.folderName + "/" + url;
  //   return this.ticketData.URL
  // }

  nzEvent(event) {
    // console.log(event)
    if (event['eventName'] == 'expand') {
      let node = event['node'];
      this.clickedParentID = node.origin.parentID;

      if (node['key'] != undefined) {
        this.filterQuery = 'AND PARENT_ID=' + node['key'];
        this.api
          .getAllTicketGroups(0, 0, '', '', this.filterQuery)
          .subscribe((ticketGroups) => {
            // console.log(ticketGroups['data']);
            if (ticketGroups['count'] > 0) {
              node.clearChildren(childrens);
              var childrens = ticketGroups['data'];

              for (var index = 0; index < ticketGroups['count']; index++) {
                childrens = [
                  {
                    title:
                      ticketGroups['data'][index]['TYPE'] +
                      '.' +
                      (index + 1) +
                      ') ' +
                      ticketGroups['data'][index]['VALUE'],
                    key: ticketGroups['data'][index]['ID'],
                    type: ticketGroups['data'][index]['TYPE'],
                    parentID: ticketGroups['data'][0]['PARENT_ID'],
                    department: ticketGroups['data'][index]['DEPARTMENT_ID'],
                    islast: ticketGroups['data'][index]['IS_LAST_STATUS'],
                  },
                ];

                node.addChildren(childrens);
              }
            } else {
              this.message.info('No any Child', '');
            }
          });
      }
    }

    // if (event['eventName'] == "click") {
    //   this.addOptionVisible = true;

    //   this.ID = event['node']['origin']['key']
    //   this.type = event['node']['origin']['type']
    //   this.title = event['node']['origin']['title']
    //   this.clickedParentID = event['node']['origin']['parentID'];
    //   this.loadingRecords = true;
    //   this.parentId = this.ID;

    //   if (this.type == 'O')
    //     this.formTitleHead = "View Questions";
    //   else
    //     this.formTitleHead = "View Options";

    //   this.filterQuery = " AND PARENT_ID=" + this.ID + " AND APPLICATION_ID=" + this.applicationId
    //   this.loadTicketGroups2(this.filterQuery);
    // }
  }

  editOption(event) {
    console.log(event);
    
    this.ID = event;
    this.parentId = this.ID;
    var data = new Ticketgroup();

    this.api
      .getAllTicketGroups(1, 1, 'ID', 'DESC', ' AND ID=' + event)
      .subscribe((ticketGroups) => {
        if (ticketGroups['code'] == 200) {
          data = ticketGroups['data'][0];
          console.log(data);
          
          // this.clickedParentID = data.PARENT_ID;

          this.api
            .getAllTicketGroups(1, 1, 'ID', 'DESC', ' AND ID=' + data.PARENT_ID)
            .subscribe((ticketGroups) => {
              if (ticketGroups['code'] == 200 && ticketGroups['count'] > 0) {
                this.clickedParentID = ticketGroups['data'][0].PARENT_ID;
                this.edit(data);
              } else {
                this.clickedParentID = 0;
                this.edit(data);
              }
            });
        }
      });
  }

  add() {
    // console.log(this.addFirstQuestion);

    this.is_first = 0;
    this.clearData();
    this.newId = 0;
    this.name1 = 'None';
    this.ticketData.PARENT_ID = this.ID;
    var filterQuery = ' AND PARENT_ID=' + this.clickedParentID;
    this.api.getAllTicketGroups(0, 0, 'SEQ_NO', 'ASC', filterQuery).subscribe(
      (ticketGroups) => {
        if (ticketGroups['code'] == 200) {
          this.parentTicketGroups = ticketGroups['data'];
        }
        this.addFirstQuestion = true;
      },
      (err) => {
        this.loadingRecords = false;
        this.message.error(JSON.stringify(err), '');
      }
    );
  }

  add2(event, type, node) {
    // console.log(node)
    this.is_first = 0;
    this.clearData();
    this.newId = 0;
    this.name1 = 'None';
    this.ticketData.PARENT_ID = Number(node.origin.key);
    this.ticketData.TYPE = type;
    this.ticketData.STATUS = true;
    this.clickedParentID = node.origin.parentID;
    this.ID = Number(node.origin.key);
    this.Title = type == 'O' ? 'Add New Option' : 'Add New Question';
    this.filterQuery = 'AND PARENT_ID=' + node.origin['key'];

    if (type == 'Q') {
      this.api
        .getAllTicketGroups(0, 0, '', '', this.filterQuery)
        .subscribe((ticketGroups) => {
          if (ticketGroups['count'] > 0) {
            this.message.info('You can add only one question to options.', '');
          } else {
            var filterQuery = ' AND PARENT_ID=' + this.clickedParentID;
            this.api
              .getAllTicketGroups(0, 0, 'SEQ_NO', 'ASC', filterQuery)
              .subscribe(
                (ticketGroups) => {
                  if (ticketGroups['code'] == 200) {
                    this.parentTicketGroups = ticketGroups['data'];
                  }
                  this.addFirstQuestion = true;
                },
                (err) => {
                  this.loadingRecords = false;
                  this.message.error(JSON.stringify(err), '');
                }
              );
          }
        });
    } else {
      var filterQuery = ' AND PARENT_ID=' + this.clickedParentID;
      this.api.getAllTicketGroups(0, 0, 'SEQ_NO', 'ASC', filterQuery).subscribe(
        (ticketGroups) => {
          if (ticketGroups['code'] == 200) {
            this.parentTicketGroups = ticketGroups['data'];
          }
          this.addFirstQuestion = true;
        },
        (err) => {
          this.loadingRecords = false;
          this.message.error(JSON.stringify(err), '');
        }
      );

      this.api
        .getAllTicketGroups(0, 0, 'SEQ_NO', 'DESC', ' AND PARENT_ID=' + this.ID)
        .subscribe(
          (ticketGroups2) => {
            if (ticketGroups2['code'] == 200) {
              if (ticketGroups2['data'].length == 0) {
                this.ticketData.SEQ_NO = 1;
              } else {
                this.ticketData.SEQ_NO =
                  Number(ticketGroups2['data'][0]['SEQ_NO']) + 1;
              }
            }
          },
          (err) => {}
        );
    }
  }

  clearData() {
    this.ticketData.ID = undefined;
    this.ticketData.VALUE = '';
    this.ticketData.SEQ_NO = 0;
    this.ticketData.TASK_ASSIGN_TYPE = 'D';
    this.ticketData.DESCRIPTION = '';
  }

  edit(data: Ticketgroup) {
    console.log(data);
    
    this.ticketData = data;
    this.ticketData['PARENT_ID'] = Number(data.PARENT_ID);
    this.newId = 0;
    this.name1 = 'None';
    this.Title =
      this.ticketData['TYPE'] == 'O' ? 'Update Option' : 'Update Question';
    var filterQuery = ' AND PARENT_ID=' + this.clickedParentID;
    this.api.getAllTicketGroups(0, 0, 'SEQ_NO', 'ASC', filterQuery).subscribe(
      (ticketGroups) => {
        if (ticketGroups['code'] == 200) {
          this.parentTicketGroups = ticketGroups['data'];
        }
      },
      (err) => {
        this.loadingRecords = false;
        this.message.error(JSON.stringify(err), '');
      }
    );

    this.addFirstQuestion = true;
  }

  mapFaq(data: Ticketgroup) {
    this.loadingRecordsFaqs = true;
    this.ticketGroupId = data.ID;
    this.Question = data.VALUE;

    // this.api.getMappingFaqs(data.ID, this.FAQHead).subscribe(data => {
    //   if (data['code'] = "200") {
    //     this.faqs = data['data'];
    //     this.loadingRecordsFaqs = false;
    //     this.mapFaqVisible = true;

    //   } else {
    //     this.loadingRecordsFaqs = false;
    //     this.message.error('Failed to load Mapped FAQ data', '');
    //   }

    // }, err => {
    //   this.loadingRecordsFaqs = false;
    //   this.message.error('Failed to load Mapped FAQ data', '');
    // });
  }

  mapFaq2(node) {
    this.loadingRecordsFaqs = true;
    this.ticketGroupId = node.key;
    this.Question = node.title;

    // this.api.getMappingFaqs(node.key, this.FAQHead).subscribe(data => {
    //   if (data['code'] = "200") {
    //     this.faqs = data['data'];
    //     this.loadingRecordsFaqs = false;
    //     this.mapFaqVisible = true;

    //   } else {
    //     this.loadingRecordsFaqs = false;
    //     this.message.error('Failed to load Mapped FAQ data', '');
    //   }

    // }, err => {
    //   this.loadingRecordsFaqs = false;
    //   this.message.error('Failed to load Mapped FAQ data', '');
    // });
  }

  mapFaq3(node) {
    this.loadingRecordsFaqs = true;
    this.ticketGroupId = node;

    // this.api.getMappingFaqs(node, this.FAQHead).subscribe(data => {
    //   if (data['code'] = "200") {
    //     this.faqs = data['data'];
    //     this.loadingRecordsFaqs = false;
    //     this.mapFaqVisible = true;

    //   } else {
    //     this.loadingRecordsFaqs = false;
    //     this.message.error('Failed to load Mapped FAQ data', '');
    //   }

    // }, err => {
    //   this.loadingRecordsFaqs = false;
    //   this.message.error('Failed to load Mapped FAQ data', '');
    // });
  }

  closeFaqMap() {
    this.mapFaqVisible = false;
  }

  saveMappping() {
    this.isSpinning = true;

    // this.api.addMappingFaqs(this.ticketGroupId, this.faqs).subscribe(successCode => {
    //   if (successCode['code'] == "200") {
    //     this.message.success("Faq Map Successfully ...", "");
    //     this.closeFaqMap();
    //     this.isSpinning = false;

    //   } else {
    //     this.message.error("Faq Map assigning Failed...", "");
    //     this.isSpinning = false;
    //   }
    // });
  }

  // ImageCode
  //Choose Image

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
          if (img.width < 832 && img.height < 596) {
            // Continue with uploading process
            const number = Math.floor(100000 + Math.random() * 900000);
            const fileExt = this.fileList2.name.split('.').pop();
            const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            let url = '';
            url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();
            if (
              this.ticketData.IMAGE_URL != undefined &&
              this.ticketData.IMAGE_URL.trim() != ''
            ) {
              const arr = this.ticketData.IMAGE_URL.split('/');
              if (arr.length > 1) {
                url = arr[5];
              }
            }

            this.isSpinning = true;
            this.progressBarProfilePhoto = true;
            this.timerThree = this.api
              .onUpload('ticketImage', this.fileList2, url)
              .subscribe((res) => {
                if (res.type === HttpEventType.Response) {
                }
                if (res.type === HttpEventType.UploadProgress) {
                  const percentDone = Math.round(
                    (100 * res.loaded) / res.total
                  );
                  this.percentProfilePhoto = percentDone;
                  if (this.percentProfilePhoto == 100) {
                    this.isSpinning = false;
                  }
                } else if (res.type == 2 && res.status != 200) {
                  this.message.error('Failed to upload image.', '');
                  this.isSpinning = false;
                  this.progressBarProfilePhoto = false;
                  this.percentProfilePhoto = 0;
                  this.ticketData.IMAGE_URL = null;
                  this.taskurl = '';
                } else if (res.type == 4 && res.status == 200) {
                  if (res.body['code'] == 200) {
                    this.message.success('Image uploaded successfully.', '');
                    this.isSpinning = false;
                    this.ticketData.IMAGE_URL = url;
                    this.taskurl =
                      this.imgUrl + 'ticketImage/' + this.ticketData.IMAGE_URL;
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
            this.ticketData.IMAGE_URL = null;
          }
        };
      } else {
        this.message.error('File size exceeds 10MB.', '');
        this.fileList2 = null;
        this.ticketData.IMAGE_URL = null;
      }
    } else {
      this.message.error('Please select only JPEG/JPG/PNG extensions.', '');
      this.fileList2 = null;
    }
  }

  deleteConfirm(data) {
    this.isSpinning = true;
    if (this.ticketData.ID) {
      this.api
        .deletePdf('ticketImage/' + data.IMAGE_URL)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.ticketData.IMAGE_URL = null;
            this.api
              .updateAdvertise(this.ticketData)
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
      this.ticketData.IMAGE_URL = null;
      data.IMAGE_URL = null;
      this.isSpinning = false;
    }
  }
  deleteCancel(): void {}
}
