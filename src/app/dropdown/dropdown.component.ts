import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Routes, Router, ActivatedRoute, Params, NavigationEnd} from '@angular/router';
import { CartService } from '../cart.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  versionNumber:String;
  versionName:String;

  versions = [
       {id: 12, name: "12"},
       {id: 11, name: ">12"}
     ];
  licenses = [
      // {id: "free", name: "free"},
       {id: "converter", name: "converter"},
       {id: "home", name: "home"},
       {id: "professional", name: "professional"},
       {id: "ultimate", name: "ultimate"}
     ];
  form: FormGroup;

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private cartService: CartService,
              private cookieService: CookieService) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(
        params => this.LoadDropDown(params)
    );

  }

  LoadDropDown(params) {

    if(params && params.version){

      this.versionNumber = params.version ;
    }
    if(params && params.has){
      console.error(params.has);
      this.versionName = params.has ;
    }
  }

  onChangeVersions(newValue) {
    let scenario = "upg" ;
    if(newValue === "12" ) scenario = "ups" ;
    const urlTree = this.router.createUrlTree([], {
    queryParams: { version: newValue , scn : scenario },
    queryParamsHandling: "merge",
    preserveFragment: true });
    this.cookieService.set( 'scn', scenario );
    this.router.navigateByUrl(urlTree);

    // this.router.navigate( ['.'],  { queryParams: urlTree } );
    // ... do other stuff here ...
  }
  onChangeLicenses(newValue) {
    const urlTree = this.router.createUrlTree([], {
    queryParams: { has: newValue },
    queryParamsHandling: "merge",
    preserveFragment: true });
    this.router.navigateByUrl(urlTree);
    // ... do other stuff here ...
  }
}
