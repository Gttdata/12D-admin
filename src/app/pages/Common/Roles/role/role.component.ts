import { Component, OnInit, Input } from '@angular/core';
import { RoleMaster } from 'src/app/Models/role-master';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormMaster } from 'src/app/Models/form-master';
import { LoginserviceService } from 'src/app/Services/loginservice.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  @Input() drawerClose!: Function;
  @Input() data: RoleMaster=new RoleMaster();
  isSpinning = false
  @Input() drawerVisible: boolean=false;
  roles: RoleMaster[]=[];
  forms: FormMaster[]=[];
  constructor(private api: LoginserviceService, private message: NzNotificationService) { }

  ngOnInit() {
    this.loadRoles()
  }

  close(): void {
    this.drawerClose();
  }

  loadRoles() {
    this.isSpinning = true;
    this.api.getAllRoles(0, 0, '', '', '').subscribe(roles => {
      if(roles['code']==200){
        this.roles = roles['data'];
        this.isSpinning = false;
      }
      else{
        this.isSpinning = false;
        this.message.error('Failed To Get Roles',`${roles.code}`)
      }
     
    }, err => {
      
      this.isSpinning = false;
    });
  }


  save(addNew: boolean): void {
    this.isSpinning = true;
    if (this.data.NAME != undefined && this.data.NAME != "")
     {
      if (this.data.ID) 
      {
        this.api.updateRole(this.data)
          .subscribe(successCode => {
            if(successCode['code'] == "200") 
            {
              this.message.success("Role Updated Successfully...", "");
              if (!addNew)
                this.drawerClose();
              this.isSpinning = false;
            }
            else 
            {
              this.message.error("Role Updation Failed...", "");
              this.isSpinning = false;
            }
          });
      }
      else {
        this.api.createRole(this.data)
          .subscribe(successCode => {
            if(successCode['code'] == "200") 
            {
            this.message.success("Role Created Successfully...", "");
            if (!addNew)
              this.drawerClose();
            else {
              this.data = new RoleMaster();
              
            }
            this.loadRoles()
            this.isSpinning = false;
           }
           else
           {
            this.message.error("Role Creation Failed...", "");
            this.isSpinning = false;
           }
       });
      }
    }
    else {
      this.message.error("Please Fill All Required Fields...", "");
      this.isSpinning = false;
    }
  }




 










}
