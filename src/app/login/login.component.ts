import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { UserMaster } from 'src/app/Models/usermaster';
import { LoginserviceService } from 'src/app/Services/loginservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user: UserMaster = new UserMaster();
  EMAIL_ID = '';
  PASSWORD = '';
  supportKey = '';
  ORGANIZATION_ID: number | undefined;
  passwordVisible = false;
  isloginSpinning = false;
  isLogedIn = false;
  isOk = true;
  loginasteacher = false;
  loginasadmin = true;
  roleId = Number(sessionStorage.getItem('roleId'));
  constructor(
    private cookie: CookieService,
    private router: Router,
    private api: LoginserviceService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    // Assuming sessionStorage.getItem('roleId') returns a string representation of a number
    const roleIdString = sessionStorage.getItem('roleId');
    if (!roleIdString) {
        // console.error("Role ID not found in session storage.");
        this.router.navigate(['/login']);
        return;
    }

    this.roleId = Number(roleIdString);
    if (isNaN(this.roleId)) {
        // console.error("Role ID is not a valid number.");
        this.router.navigate(['/login']);
        return;
    }

    if (this.cookie.get('token') === '' || this.cookie.get('token') === null) {
        this.isLogedIn = false;
        this.router.navigate(['/login']);
    } else if (this.roleId === 2) {
        this.isLogedIn = true;
        this.router.navigate(['/admindashboard']);
    } else {
        // Assuming any role other than 2 should lead to the general dashboard
        this.isLogedIn = true;
        this.router.navigate(['/dashboard']);
    }

    const userId = '1';
    this.api.requestPermission(userId);
}


  handleLoginClick() {
    this.roleId = Number(sessionStorage.getItem('roleId'))
    this.loginasadmin = true;
    this.loginasteacher = false;
  }

  handleTeacherLoginClick() {
    this.loginasadmin = false;
    this.loginasteacher = true;
  }

  login(): void {
    if (this.EMAIL_ID == '' && this.PASSWORD == '') {
      this.isOk = false;
      this.message.error('Please enter email id and password', '');
    } else if (this.EMAIL_ID == null || this.EMAIL_ID.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Email', '');
    } else if (this.PASSWORD == null || this.PASSWORD.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Password', '');
    } else {
      this.isloginSpinning = true;
      if (this.loginasadmin) {
        this.api.login(this.EMAIL_ID, this.PASSWORD).subscribe(
          (data) => {
            if (data['code'] == '200') {
              // console.log(data['data']);

              this.isloginSpinning = false;
              this.message.success('Successfully Logged In', '');
              this.cookie.set(
                'token',
                data['data'][0]['token'],
                365,
                '',
                '',
                false,
                'Strict'
              );
              // this.cookie.set('userId', data["data"][0]['UserData'][0]['USER_ID'], 365, "", "", false, "Strict");
              // this.cookie.set('roleId', data["data"][0]['UserData'][0]['ROLE_ID'], 365, "", "", false, "Strict");
              // this.cookie.set('mobile', data["data"][0]['UserData'][0]['MOBILE_NUMBER'], 365, "", "", false, "Strict");
              sessionStorage.setItem(
                'countrydata',
                data['data'][0]['UserData'][0]['COUNTRY_ID']
              );
              sessionStorage.setItem(
                'userId',
                data['data'][0]['UserData'][0]['USER_ID']
              );
              sessionStorage.setItem(
                'userName',
                data['data'][0]['UserData'][0]['NAME']
              );
              sessionStorage.setItem(
                'emailId',
                data['data'][0]['UserData'][0]['EMAIL_ID']
              );
              sessionStorage.setItem(
                'roleId',
                data['data'][0]['UserData'][0]['ROLE_ID']
              );
              sessionStorage.setItem(
                'mobile',
                data['data'][0]['UserData'][0]['MOBILE_NUMBER']
              );
              sessionStorage.setItem(
                'roleName',
                data['data'][0]['UserData'][0]['ROLE_NAME']
              );
              sessionStorage.setItem(
                'schoolid',
                data['data'][0]['UserData'][0]['SCHOOL_ID']
              );
              sessionStorage.setItem(
                'yearId',
                data['data'][0]['UserData'][0]['YEAR_ID']
              );

              sessionStorage.setItem(
                'countryid',
                data['data'][0]['UserData'][0]['COUNTRY_ID']
              );
              sessionStorage.setItem(
                'stepid',
                data['data'][0]['UserData'][0]['STEP_NO']
              );
              sessionStorage.setItem(
                'boardId',
                data['data'][0]['UserData'][0]['BOARD_ID']
              );
              // console.log(data['data']);

              window.location.reload();
            } 
            else if(data['code'] == '404'){
              this.isloginSpinning = false;
              this.message.error('Login access is currently turned off','')
            }
            else {
              this.isloginSpinning = false;
              this.message.error('You have entered wrong credentials', '');
            }
          },
          (err) => {
            this.isloginSpinning = false;
            this.message.error(JSON.stringify(err), '');
          }
        );
      }
      if (this.loginasteacher) {
        this.api.loginasteacher(this.EMAIL_ID, this.PASSWORD).subscribe(
          (data) => {
            if (data['code'] == '200') {
              //
              this.isloginSpinning = false;
              this.cookie.set(
                'token',
                data['data'][1]['token'],
                365,
                '',
                '',
                false,
                'Strict'
              );

              sessionStorage.setItem(
                'yearId',
                data['data'][1]['UserData'][0]['YEAR_ID']
              );
              sessionStorage.setItem(
                'userName',
                data['data'][1]['UserData'][0]['NAME']
              );
             
              sessionStorage.setItem(
                'roleId',
                data['data'][1]['UserData'][0]['ROLE_ID']
              );
              sessionStorage.setItem(
                'userId',
                data['data'][1]['UserData'][0]['ID']
              );
              sessionStorage.setItem(
                'TeachersArray',
                JSON.stringify(data['data'][1]['UserData'])
              );
              sessionStorage.setItem(
                'ClassData',
                data['data'][1]['UserData'][0]['CLASS_DATA']
              );
              
              //
              // console.log(data['data'][1]['UserData'][0]['CLASS_DATA'],"userdata", '',data['data'][1]['UserData'][0]);
              const userdata = JSON.parse(data['data'][1]['UserData'][0]['CLASS_DATA'])
              // console.log(userdata);
              if (userdata == undefined || !Array.isArray(userdata) || userdata.length == 0) {
                
                this.message.error('No class mapped for this Teacher', '');
              } else {
                // console.log(userdata[0]);
                
                this.setClassId(userdata[0]);
              }
              window.location.reload();
            } 
            else if(data['code'] == '404'){
              this.message.error('Login access is currently turned off','')
            }
            else {
              // this.isloginSpinning = false;
              this.message.error('You have entered wrong credentials', '');
            }
          },
          (err) => {
            this.isloginSpinning = false;
            this.message.error(JSON.stringify(err), '');
          }
        );
      }
    }
  }
  setClassId(classInfo: any) {
    console.log(classInfo,"classinfo");
    
    sessionStorage.setItem('classid', classInfo['CLASS_ID']);
    sessionStorage.setItem('yearId', classInfo['YEAR_ID']);
    sessionStorage.setItem('divisionId', classInfo['DIVISION_ID']);
    sessionStorage.setItem('schoolID', classInfo['SCHOOL_ID']);

    this.message.success('Successfully Logged In', '');
    
    window.location.reload();
  }

  forgot(): void {
    this.router.navigate(['/forgot']);
  }
}
