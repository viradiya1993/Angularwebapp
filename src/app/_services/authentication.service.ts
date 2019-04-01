import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { User } from '../_models';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private httpOptions = { headers: new HttpHeaders().set("Content-Type", "application/json").set("apikey", environment.APIKEY) };

    constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(uesrname: string, password: string) {
        let detail = {
            user: uesrname, password: password, formatting: 'JSON', EmailAddress: "", SessionToken: ""
        };
        let loginResponses: any = {
            "login_response": {
                "SessionToken": "34g1LZMOLzvp0wfPk7RWrQhU0Ewt73",
                "TimeStampUTC": "1554104307665",
                "TimeStamp": "2019/04/01 18:38:27",
                "LoggedInStatus": "1",
                "Response": "OK",
                "LicenceNumber": "17",
                "AllowMobileAccess": "1",
                "UserGuid": "USRAAAAAAAAAAAA1",
                "UserId": "DLP",
                "UserName": "Diana Parkinson",
                "ProductType": "Barrister",
                "DefaultQuantityType": "H",
                "InitialWindow": "Matter",
                "ShowOutstanding": "1",
                "ShowWIPGraph": "0",
                "Permissions - Matter Details": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Tagging",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "View Balances",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Day Book / Time Entries": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create WIP",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create Disbursements",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Override WIP Price",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "View Other Fee Earner Entries",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create WIP for Other Fee Earners",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "View WIP Totals",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Contacts": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Tagging",
                        "VALUE": "0"
                    }
                ],
                "Permissions - Estimates": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Document/Email Generation": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Generate Template",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create Template",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit Template",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Generate Pack",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create Pack",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit Pack",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete Pack",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Generate Email",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create Email",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit Email",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete Email",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Document Register": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Tagging",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Invoicing": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Tagging",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Draft Invoice",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Print",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Write Off",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Receive Money": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Print",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Tagging",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Spend Money": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Chronology": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Topics": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Authorities": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    }
                ],
                "Permissions - File Notes": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Safe Custody": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Check In/Out",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Safe Custody Packet": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Searching": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Execute Search",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Import Results",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Download Result File",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "View Result Online",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Diary": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Personal",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Tasks": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Chart of Accounts": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Print",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "View Balances",
                        "VALUE": "1"
                    }
                ],
                "Permissions - General Journal": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Print",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Other Accounting": [
                    {
                        "NAME": "Bank Reconciliations",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Account Transactions",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Close Year Accounts",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Accounts",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Trust Money": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Trust Receipt",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Trust Withdrawal",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Trust Transfer",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Controlled Money Receipt",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Controlled Money Withdrawal",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Reversals",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Statutory Deposit/Withdrawal",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Allow Overdraws",
                        "VALUE": "0"
                    },
                    {
                        "NAME": "End Of Month",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Banking",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Reconcile Trust Account",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Trust Chart of Accounts": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Print",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Trust General Journal": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Trust Reports": [
                    {
                        "NAME": "Trial Balance",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Audit Log",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Overdrawn Balances",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Cashbook",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Account Reconciliation",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Ledgers",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Trust Money Statements",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Controlled Money Statements",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Controlled Money Listing",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Accounting Reports": [
                    {
                        "NAME": "Profit and Loss",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Balance Sheet",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "General Journal",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "General Ledger Summary",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "General Ledger Detail",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Trial Balance",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Management Reports": [
                    {
                        "NAME": "Aged Debtors",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Payment History",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Individual Matter Financials",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Aged Matter Summary",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Issued Invoices",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Unbilled Work",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "New Clients",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Top Clients",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Fee Earner Summary",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "GST Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Snap Shot",
                        "VALUE": "1"
                    }
                ],
                "Permissions - System": [
                    {
                        "NAME": "System Settings",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Users": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    }
                ],
                "Permissions - Activities/Sundries": [
                    {
                        "NAME": "Access",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Create",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Edit",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Delete",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Window Report",
                        "VALUE": "1"
                    },
                    {
                        "NAME": "Export Data",
                        "VALUE": "1"
                    }
                ]
            }
        };
        localStorage.setItem('currentUser', JSON.stringify(loginResponses));
        console.log(loginResponses);
        this.currentUserSubject.next(loginResponses);
        this.toastr.success('success');
        return true;
        // return this.http.post<any>(environment.APIEndpoint + 'login', detail, this.httpOptions).pipe(map(loginResponse => {
        // console.log(loginResponse);
        // if (loginResponse && loginResponse.login_response) {
        // let responseType = loginResponse.login_response.Response;
        // let LoggedInStatus = loginResponse.login_response.LoggedInStatus;
        // if (responseType == 'OK' && LoggedInStatus) {
        // localStorage.setItem('currentUser', JSON.stringify(loginResponse.login_response));

        // localStorage.setItem('currentUser', JSON.stringify(loginResponses));
        // this.currentUserSubject.next(loginResponse);
        // this.toastr.success('success');
        // return true;
        // } else if (responseType == 'error - login failure') {
        //     this.toastr.error(responseType);
        //     return false;
        // } else {
        //     this.toastr.error(responseType);
        //     console.log(loginResponse);
        //     return false;
        // }
        // }
        // }));
    }
    notLogin() {
        const currentUser = this.currentUserValue;
        if (currentUser) {
            this.router.navigate(['matters']);
            return false;
        }
        // not logged in so return true
        return true;
    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['login']);
    }
   
    forgetpassword(email: string){        
        return this.http.post<any>(environment.APIEndpoint + 'Login?Request=ForgottenPassword&EmailAddress='+email,'').pipe(map(loginResponse => {
            console.log(loginResponse);
            if (loginResponse && loginResponse.login_response) {
                let responseType = loginResponse.login_response.Response;
                if (responseType == 'OK') {
                    this.toastr.success('successfully mail send');
                }
                else {
                    this.toastr.error(responseType);
                    console.log(loginResponse);
                    return false;
                }
            }
        }));
    }
}