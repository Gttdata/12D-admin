import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RoleMaster } from 'src/app/Models/role-master';


import { LoginserviceService } from 'src/app/Services/loginservice.service';

@Component({
  selector: 'app-roledetails',
  templateUrl: './roledetails.component.html',
  styleUrls: ['./roledetails.component.css']
})
export class RoledetailsComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: RoleMaster = new RoleMaster();
  @Input() roleDetailsData: any[] = [];
  @Input() drawerVisible: boolean = false;
  isSpinning = false
  formTitle = "Role Details";
  loadingRecords = true;

  constructor(private api: LoginserviceService, private message: NzNotificationService) { }
  ngOnInit() { }

  close(): void {
    this.drawerClose();
  }

  save() {
    this.isSpinning = true;
    
    this.api.addRoleDetails(this.data.ID, this.roleDetailsData)
      .subscribe(successCode => {
        if (successCode['code'] == "200") {
          this.message.success("Role Details added Successfully ...", "");
          this.drawerClose();
          this.isSpinning = false;
        }
        else {
          this.message.error("Role Details assigning Failed...", "");
          this.isSpinning = false;
        }
      });
  }
}
