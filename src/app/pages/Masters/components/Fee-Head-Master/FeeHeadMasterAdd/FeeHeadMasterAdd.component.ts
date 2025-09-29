import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';
import { HeadMasterData } from '../../../Models/HeadMasterData';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';

@Component({
  selector: 'app-FeeHeadMasterAdd',
  templateUrl: './FeeHeadMasterAdd.component.html',
  styleUrls: ['./FeeHeadMasterAdd.component.css'],
})
export class FeeHeadMasterAddComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}
  isSpinning = false;
  isOk = true;
  ParentData: any = [];
  ngOnInit(): void {}
  public commonFunction = new CommomFunctionsService();
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  @Input() data: any = HeadMasterData;

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new HeadMasterData();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  close() {
    this.drawerClose();
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Fee Head Name.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      this.data.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'));
      {
        if (this.data.ID) {
          this.api.updateHead(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Fee Head Updated Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Fee Head Updation Failed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createHead(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Fee Head Created  Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new HeadMasterData();
                this.resetDrawer(websitebannerPage);
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Fee Head Creation Failed...', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }
}
