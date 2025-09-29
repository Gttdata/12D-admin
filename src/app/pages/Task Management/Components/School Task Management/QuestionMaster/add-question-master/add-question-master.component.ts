import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { ApiService } from 'src/app/Services/api.service';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { QuestionMaster } from 'src/app/pages/Task Management/Models/QuestionMaster';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-add-question-master',
  templateUrl: './add-question-master.component.html',
  styleUrls: ['./add-question-master.component.css'],
})
export class AddQuestionMasterComponent implements OnInit {
  @Input()
  drawerClose!: Function;
  @Input()
  data: QuestionMaster = new QuestionMaster();
  @Input()
  drawerVisible: boolean = false;
  isSpinning: boolean = false;
  passwordVisible = false;
  @Input() OptionList = [];
  index1 = -1;
  OPTION_TEXT: any;
  OPTION_IMAGE_URL: any;
  IS_CORRECT: any = false;
  SEQ_NO: any = 1;
  STATUS: boolean = true;
  urlOpt: any = '';
  isokfileOption = true;
  file_Options_URL: File = null;
  i = 2;
  loadingOptions: boolean = false;
  public commonFunction = new CommomFunctionsService();
  typeLoad: boolean = false;
  chapterLoad: boolean = false;
  classLoad: boolean = false;
  subjectLoad: boolean = false;
  imgUrl = appkeys.retriveimgUrl;
  questionTypeList: any[];
  @Input() chapterList: any[];
  QuePaperClassList: any[];
  @Input() QuePaperSubjectList: any[];
  classId: any;
  isOk = true;
  roleId: any;
  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {}
  @ViewChild('optionUrl', { static: false }) myInputVariableOption: ElementRef;
  close(): void {
    this.drawerClose();
  }
  ngOnInit() {
    this.roleId = sessionStorage.getItem('roleId');
    this.getallQuestionType();
    this.getAllQuePaperClasses();
    // this.getAllQuePaperSubject();

    this.classId = Number(sessionStorage.getItem('classid'));

    // if (this.roleId == 3) {
    //   this.getAllSubject();
    // } else {
    //   this.getallChapter();
    // }
  }

  getAllQuePaperSubject() {
    this.subjectLoad = true;
    this.api
      .getAllQuestionSubject(0, 0, '', '', ' AND STATUS!=false')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.QuePaperSubjectList = data['data'];
            this.subjectLoad = false;
          } else {
            this.QuePaperSubjectList = [];
            this.subjectLoad = false;
          }
        },
        (err) => {
          this.subjectLoad = false;
        }
      );
  }

  getAllQuePaperClasses() {
    this.classLoad = true;
    this.api
      .getAllQuestionPaperClassMaster(0, 0, '', '', ' AND STATUS!=false')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.QuePaperClassList = data['data'];
            this.classLoad = false;
          } else {
            this.QuePaperClassList = [];
            this.classLoad = false;
          }
        },
        (err) => {
          this.classLoad = false;
        }
      );
  }
  getAllSubject() {
    if (this.roleId == 3) {
      var extraFilter: any = '';
      extraFilter =
        'AND CLASS_ID = ' +
        Number(sessionStorage.getItem('classid')) +
        ' AND DIVISION_ID = ' +
        Number(sessionStorage.getItem('divisionId'));
    } else {
      extraFilter = '';
    }
    var subList: any = [];
    this.api
      .getAllQuestionSubject(0, 0, '', '', ' AND STATUS!=false ' + extraFilter)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length == 0) {
              subList = [];
            } else {
              subList = data['data'];
            }
            if (subList.length > 0) {
              const uniqueSubjectIds = new Set(
                subList.map((subject: any) => subject.ID)
              );
              const uniqueIdsArray = Array.from(uniqueSubjectIds);
              

              this.api
                .getAllChapterMaster(
                  0,
                  0,
                  '',
                  '',
                  ' AND STATUS!=false AND SUBJECT_ID in (' +
                    uniqueIdsArray +
                    ')'
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.chapterList = data['data'];
                      this.chapterLoad = false;
                    } else {
                      this.chapterList = [];
                      this.chapterLoad = false;
                    }
                  },
                  (err) => {
                    this.chapterLoad = false;
                  }
                );
            } else {
            }
          } else {
            subList = [];
          }
        },
        (err) => {}
      );
  }
  getallChapter() {
    this.chapterLoad = true;
    this.api.getAllChapterMaster(0, 0, '', '', ' AND STATUS!=false').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.chapterList = data['data'];
          this.chapterLoad = false;
        } else {
          this.chapterList = [];
          this.chapterLoad = false;
        }
      },
      (err) => {
        this.chapterLoad = false;
      }
    );
  }
  getallQuestionType() {
    this.typeLoad = true;
    this.api.getAllQuestionType(0, 0, '', '', ' AND STATUS!=false').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.questionTypeList = data['data'];
          this.typeLoad = false;
        } else {
          this.questionTypeList = [];
          this.typeLoad = false;
        }
      },
      (err) => {
        this.typeLoad = false;
      }
    );
  }
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.CLASS_ID == undefined ||
        this.data.CLASS_ID == null ||
        this.data.CLASS_ID == 0) &&
      (this.data.SUBJECT_ID == undefined ||
        this.data.SUBJECT_ID == null ||
        this.data.SUBJECT_ID == 0) &&
      (this.data.QUESTION_TYPE == undefined ||
        this.data.QUESTION_TYPE == null ||
        this.data.QUESTION_TYPE == 0) &&
      (this.data.CHAPTER_ID == undefined || this.data.CHAPTER_ID == null) &&
      (this.data.QUESTION == undefined ||
        this.data.QUESTION == null ||
        this.data.QUESTION == '') &&
      (this.data.MARKS == '' ||
        this.data.MARKS == null ||
        this.data.MARKS == undefined) &&
      (this.data.SEQ_NO != undefined ||
        this.data.SEQ_NO != null ||
        this.data.SEQ_NO <= 0) &&
      (this.data.ANSWER == undefined ||
        this.data.ANSWER == null ||
        this.data.ANSWER == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.data.CLASS_ID == undefined ||
      this.data.CLASS_ID == null ||
      this.data.CLASS_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Class ', '');
    } else if (
      this.data.SUBJECT_ID == undefined ||
      this.data.SUBJECT_ID == null ||
      this.data.SUBJECT_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Subject ', '');
    } else if (
      this.data.CHAPTER_ID == undefined ||
      this.data.CHAPTER_ID == null ||
      this.data.CHAPTER_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Chapter ', '');
    } else {
      if (
        this.data.QUESTION_TYPE == null ||
        this.data.QUESTION_TYPE == 0 ||
        this.data.QUESTION_TYPE == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Enter Question Type', '');
      } else if (
        this.data.QUESTION == undefined ||
        this.data.QUESTION == null ||
        this.data.QUESTION == '' ||
        this.data.QUESTION == ' '
      ) {
        this.isOk = false;
        this.message.error('Please Enter Question', '');
      } else if (
        this.data.SEQ_NO == undefined ||
        this.data.SEQ_NO == null ||
        this.data.SEQ_NO <= 0
      ) {
        this.isOk = false;
        this.message.error(' Please Enter Sequence Number ', '');
      } else if (
        this.data.ANSWER == undefined ||
        this.data.ANSWER == null ||
        this.data.ANSWER == ''
      ) {
        this.isOk = false;
        this.message.error(' Please Enter Answer ', '');
      } else if (
        this.data.MARKS == undefined ||
        this.data.MARKS == null ||
        this.data.MARKS == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Markes ', '');
      } else if (
        this.data.QUESTION_TYPE == 1 &&
        (this.OptionList.length == 0 ||
          this.OptionList == undefined ||
          this.OptionList == null)
      ) {
        this.isOk = false;
        this.message.error(' Please Add Options For MCQ ', '');
      } else if (this.data.QUESTION_TYPE == 1 && this.OptionList.length <= 1) {
        this.isOk = false;
        this.message.error(' Please Add At least 2 Options For MCQ ', '');
      }
    }
    if (this.isOk) {
      this.data.OPTIONS = this.OptionList;
      this.data.CLIENT_ID = this.api.clientId;

      this.isSpinning = true;
      // this.data.DIVISION_ID = Number(sessionStorage.getItem('divisionId'));
      this.data.SCHOOL_ID = 0;
      if (this.data.ID) {
        this.api
          .updateQuestionMasterBulk(this.data)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Question Details Updated Successfully...',
                ''
              );
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Update Question Details...', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .createQuestionMasterBulk(this.data)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Question Details Created Successfully...',
                ''
              );
              if (!addNew) this.drawerClose();
              else {
                this.data = new QuestionMaster();
                this.resetDrawer(websitebannerPage);
                this.api.getAllQuestionMaster(1, 1, '', 'desc', '').subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['count'] == 0) {
                        this.data.SEQ_NO = 1;
                      } else {
                        this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                      }
                    } else {
                    }
                  },
                  (err) => {}
                );
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Create Question Details...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new QuestionMaster();
    this.OptionList = [];
    this.index1 = -1;
    this.OPTION_TEXT = '';
    this.OPTION_IMAGE_URL = '';
    this.IS_CORRECT = false;
    this.SEQ_NO = 1;
    this.STATUS = true;
    this.urlOpt = '';
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  fileList: any;
  progressBarQuestionImage: boolean = false;
  percentQuestionImage = 0;
  timerOne: any;
  @Input() questionImageUrl: any = '';
  onFileSelectedQuestion(event: any) {
    this.fileList = <File>event.target.files[0];
    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      // this.fileList[0] = <File>event.target.files[0];
      const isLt2M = event.target.files[0].size < 10240000;
      if (isLt2M) {
        if (this.fileList != null) {
          var number = Math.floor(100000 + Math.random() * 900000);
          var fileExt = this.fileList.name.split('.').pop();
          var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          var url: any = '';
          url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();
          if (
            this.data.QUESTION_IMAGE != undefined &&
            this.data.QUESTION_IMAGE.trim() != ''
          ) {
            var arr = this.data.QUESTION_IMAGE.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }
        }
        this.isSpinning = true;

        this.progressBarQuestionImage = true;
        this.timerOne = this.api
          .onUpload('questionImage', this.fileList, url)
          .subscribe((res) => {
            if (res.type === HttpEventType.Response) {
            }
            if (res.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round((100 * res.loaded) / res.total);
              this.percentQuestionImage = percentDone;
              if (this.percentQuestionImage == 100) {
                this.isSpinning = false;
              }
            } else if (res.type == 2 && res.status != 200) {
              this.message.error('Failed To Upload Image...', '');
              this.isSpinning = false;
              this.progressBarQuestionImage = false;
              this.percentQuestionImage = 0;
              this.data.QUESTION_IMAGE = null;
              this.questionImageUrl = '';
            } else if (res.type == 4 && res.status == 200) {
              if (res.body['code'] == 200) {
                this.message.success('Image Uploaded Successfully...', '');
                this.isSpinning = false;
                this.data.QUESTION_IMAGE = url;
                this.questionImageUrl =
                  this.imgUrl + 'questionImage/' + this.data.QUESTION_IMAGE;
              } else {
                this.isSpinning = false;
              }
            }
          });
      }
    } else {
      this.message.error(' Please Select Only JPEG/ JPG/ PNG Extention.', '');
      this.fileList = null;
    }
  }

  fileList2: any;
  progressBarAnswerImage: boolean = false;
  percentAnswerImage = 0;
  timerTwo: any;
  @Input() answerImageUrl: any = '';
  onFileSelectedAnswer(event: any) {
    this.fileList2 = <File>event.target.files[0];
    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
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
            this.data.ANSWER_IMAGE != undefined &&
            this.data.ANSWER_IMAGE.trim() != ''
          ) {
            var arr = this.data.ANSWER_IMAGE.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }
        }
        this.isSpinning = true;

        this.progressBarAnswerImage = true;
        this.timerTwo = this.api
          .onUpload('answerImage', this.fileList2, url)
          .subscribe((res) => {
            if (res.type === HttpEventType.Response) {
            }
            if (res.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round((100 * res.loaded) / res.total);
              this.percentAnswerImage = percentDone;
              if (this.percentAnswerImage == 100) {
                this.isSpinning = false;
              }
            } else if (res.type == 2 && res.status != 200) {
              this.message.error('Failed To Upload Image...', '');
              this.isSpinning = false;
              this.progressBarAnswerImage = false;
              this.percentAnswerImage = 0;
              this.data.ANSWER_IMAGE = null;
              this.answerImageUrl = '';
            } else if (res.type == 4 && res.status == 200) {
              if (res.body['code'] == 200) {
                this.message.success('Image Uploaded Successfully...', '');
                this.data.ANSWER_IMAGE = url;

                this.answerImageUrl =
                  this.imgUrl + 'answerImage/' + this.data.ANSWER_IMAGE;

                this.isSpinning = false;
              } else {
                this.isSpinning = false;
              }
            }
          });
      }
    } else {
      this.message.error(' Please Select Only JPEG/ JPG/ PNG Extention.', '');
      this.fileList2 = null;
    }
  }

  fileList3: any;
  progressBarOptionImage: boolean = false;
  percentOptionImage = 0;
  timerThree: any;

  onFileSelectedOption(event: any) {
    this.fileList3 = <File>event.target.files[0];
    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      // this.fileList3[0] = <File>event.target.files[0];
      const isLt2M = event.target.files[0].size < 10240000;
      if (isLt2M) {
        if (this.fileList3 != null) {
          var number = Math.floor(100000 + Math.random() * 900000);
          var fileExt = this.fileList3.name.split('.').pop();
          var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          var url: any = '';
          url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();

          if (
            this.OPTION_IMAGE_URL != undefined &&
            this.OPTION_IMAGE_URL.trim() != ''
          ) {
            var arr = this.OPTION_IMAGE_URL.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }
        }
        this.isSpinning = true;

        this.progressBarOptionImage = true;
        this.timerThree = this.api
          .onUpload('optionImage', this.fileList3, url)
          .subscribe((res) => {
            if (res.type === HttpEventType.Response) {
            }
            if (res.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round((100 * res.loaded) / res.total);
              this.percentOptionImage = percentDone;
              if (this.percentOptionImage == 100) {
                this.isSpinning = false;
              }
            } else if (res.type == 2 && res.status != 200) {
              this.message.error('Failed To Upload Image...', '');
              this.isSpinning = false;
              this.progressBarOptionImage = false;
              this.percentOptionImage = 0;
              this.OPTION_IMAGE_URL = null;
            } else if (res.type == 4 && res.status == 200) {
              if (res.body['code'] == 200) {
                this.message.success('Image Uploaded Successfully...', '');
                this.isSpinning = false;
                this.OPTION_IMAGE_URL = url;

                this.urlOpt = url;
              } else {
                this.isSpinning = false;
              }
            }
          });
      }
    } else {
      this.message.error(' Please Select Only JPEG/ JPG/ PNG Extention.', '');
      this.fileList3 = null;
    }
  }

  imageshow: any;
  printOrderModalVisible = false;
  view = 0;
  sanitizedLink: any = '';
  getS(link: string) {
    this.imageshow = '';
    if (this.view == 1) {
      var a: any = this.api.retriveimgUrl + 'questionImage/' + link;
    }
    if (this.view == 2) {
      var a: any = this.api.retriveimgUrl + 'answerImage/' + link;
    }
    if (this.view == 3) {
      var a: any = this.api.retriveimgUrl + 'optionImage/' + link;
    }

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    this.imageshow = this.sanitizedLink;
  }

  ViewQuestion(pdfURL: string): void {
    this.view = 1;
    this.printOrderModalVisible = true;
    this.getS(pdfURL);
    // window.open(this.api.retriveimgUrl + 'invoiceUrl/' + pdfURL);
  }
  ViewAnswer(pdfURL: string): void {
    this.view = 2;
    this.printOrderModalVisible = true;
    this.getS(pdfURL);
    // window.open(this.api.retriveimgUrl + 'invoiceUrl/' + pdfURL);
  }
  ViewOption(pdfURL: string): void {
    this.view = 3;
    this.printOrderModalVisible = true;
    this.getS(pdfURL);
    // window.open(this.api.retriveimgUrl + 'invoiceUrl/' + pdfURL);
  }
  ViewModalCancel() {
    this.printOrderModalVisible = false;
  }

  deleteQuestionConfirm(data) {
    this.isSpinning = true;
    if (this.data.ID) {
      this.api.deletePdf('questionImage/' + data).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.QUESTION_IMAGE = null;
          this.api.updateQuestionMaster(this.data).subscribe((updateCode) => {
            if (updateCode.code == '200') {
              this.isSpinning = false;
            } else {
              this.message.error(' mage Has Not Deleted...', '');
              this.isSpinning = false;
            }
          });
          this.message.success(' Image Deleted...', '');
        } else {
          this.message.error(' Image Has Not Deleted...', '');
          this.isSpinning = false;
        }
      });
    } else {
      this.data.QUESTION_IMAGE = null;
      this.isSpinning = false;
    }
  }
  deleteAnswerConfirm(data) {
    this.isSpinning = true;
    if (this.data.ID) {
      this.api.deletePdf('answerImage/' + data).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.ANSWER_IMAGE = null;
          this.api.updateQuestionMaster(this.data).subscribe((updateCode) => {
            if (updateCode.code == '200') {
              this.isSpinning = false;
              this.fileList2 = '';
              this.data.ANSWER_IMAGE = '';
            } else {
              this.message.error(' Image Has Not Deleted...', '');
              this.isSpinning = false;
            }
          });
          this.message.success(' Image Deleted...', '');
        } else {
          this.message.error(' Image Has Not Deleted...', '');
          this.isSpinning = false;
        }
      });
    } else {
      this.data.ANSWER_IMAGE = null;
      this.isSpinning = false;
    }
  }
  deleteOptionConfirm(data) {
    this.isSpinning = true;
    if (this.data.ID) {
      this.api.deletePdf('optionImage/' + data).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.OPTION_IMAGE_URL = null;
          this.api.updateQuestionMaster(this.data).subscribe((updateCode) => {
            if (updateCode.code == '200') {
              this.isSpinning = false;
            } else {
              this.message.error(' Image Has Not Deleted...', '');
              this.isSpinning = false;
            }
          });
          this.message.success(' Image Deleted...', '');
        } else {
          this.message.error(' Image Has Not Deleted...', '');
          this.isSpinning = false;
        }
      });
    } else {
      this.OPTION_IMAGE_URL = null;
      this.isSpinning = false;
    }
  }
  deleteCancel(): void {}

  addOptions() {
    if (this.index1 > -1) {
      this.OptionList[this.index1]['OPTION_TEXT'] = this.OPTION_TEXT;
      this.OptionList[this.index1]['OPTION_IMAGE_URL'] = this.urlOpt;
      this.OptionList[this.index1]['STATUS'] = this.STATUS;

      this.index1 = -1;
    } else {
      var lastElementObject = this.OptionList[this.OptionList.length - 1];

      if (lastElementObject != undefined)
        this.SEQ_NO = lastElementObject['SEQ_NO'] + 1;

      if (this.OPTION_TEXT) {
        if (this.isokfileOption) {
          if (this.OptionList.length == 0) {
            this.OptionList = [
              {
                OPTION_TEXT: this.OPTION_TEXT,
                OPTION_IMAGE_URL:
                  this.OPTION_IMAGE_URL == null ? '' : this.urlOpt,

                IS_CORRECT: this.IS_CORRECT,
                SEQ_NO: this.SEQ_NO,
                STATUS: this.STATUS,
                QUESTION_ID: this.data.ID,
              },
            ];
            this.SEQ_NO++;
          } else {
            let sameName = this.OptionList.filter((object) => {
              return object['OPTION_TEXT'] == this.OPTION_TEXT;
            });
            if (sameName.length == 0) {
              this.OptionList = [
                ...this.OptionList,
                {
                  OPTION_TEXT: this.OPTION_TEXT,
                  OPTION_IMAGE_URL:
                    this.OPTION_IMAGE_URL == null ? '' : this.urlOpt,
                  IS_CORRECT: this.IS_CORRECT,
                  SEQ_NO: this.SEQ_NO,
                  STATUS: this.STATUS,
                  QUESTION_ID: lastElementObject.QUESTION_ID,
                },
              ];
              this.i++;
              this.SEQ_NO++;
            } else {
              this.message.error('Same Option Found', '');
            }
          }
        } else {
          this.message.error(
            'Only Images are allowed In Option ( JPG | PNG | JPEG)',
            ''
          );
        }
      } else {
        this.message.error('Please Enter Option Name', '');
      }
    }
    this.OPTION_TEXT = '';
    // this.myInputVariableOption.nativeElement.value = '';
    this.file_Options_URL = null;
    this.OPTION_IMAGE_URL = null;
    this.isokfileOption = true;
  }

  changeValue() {
    this.OptionList.forEach((element) => {
      element['IS_CORRECT'] = false;
    });
  }

  editRow(data, i1: number) {
    this.index1 = i1;
    this.OPTION_TEXT = data.OPTION_TEXT;
    this.OPTION_IMAGE_URL = data.OPTION_IMAGE_URL;
  }

  selectSubject(event) {
    if (event != null && event != undefined && event != '') {
      this.data.SUBJECT_ID = null;
      this.data.CHAPTER_ID = null;
      this.subjectLoad = true;
      this.api
        .getAllQuestionSubject(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false AND CLASS_ID =' + event
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.QuePaperSubjectList = data['data'];
              this.subjectLoad = false;
            } else {
              this.QuePaperSubjectList = [];
              this.subjectLoad = false;
            }
          },
          (err) => {
            this.subjectLoad = false;
          }
        );
    } else {
      this.data.SUBJECT_ID = null;
      this.data.CHAPTER_ID = null;
    }
  }
  selectChapter(event) {
    if (event != null && event != undefined && event != '') {
      this.data.CHAPTER_ID = null;
      this.chapterLoad = true;
      this.api
        .getAllChapterMaster(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false AND SUBJECT_ID =' + event
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.chapterList = data['data'];
              this.chapterLoad = false;
            } else {
              this.chapterList = [];
              this.chapterLoad = false;
            }
          },
          (err) => {
            this.chapterLoad = false;
          }
        );
    } else {
      this.data.CHAPTER_ID = null;
    }
  }

  correctOption(event, index) {
    if (event == true) {
      for (let i = 0; i < this.OptionList.length; i++) {
        if (i !== index) {
          this.OptionList[i].IS_CORRECT = false;
        } else {
          // this.data.ANSWER = this.OptionList[i].OPTION_TEXT;
          if (index == 0) {
            this.data.ANSWER = 'A';
          } else if (index == 1) {
            this.data.ANSWER = 'B';
          } else if (index == 2) {
            this.data.ANSWER = 'C';
          } else if (index == 3) {
            this.data.ANSWER = 'D';
          } else if (index == 4) {
            this.data.ANSWER = 'E';
          }
        }
      }
    }
  }
}
