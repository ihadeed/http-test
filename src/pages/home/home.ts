import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, NavController, Platform} from 'ionic-angular';
import {Http} from "@angular/http";
declare var cordova: any;

import 'rxjs/add/operator/toPromise'
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  concurrency: number = 1;

  response: string = '';

  useZyra: boolean = true;

  constructor(
    private http: Http,
    private alert: AlertController
  ) {

  }

  showResult(native: boolean, time: number) {
    this.alert.create({
      title: 'Result',
      message: `Made ${this.concurrency} calls via ${native? 'native' : 'angular'} HTTP service, in ${time}ms.`,
      buttons: ['Dismiss']
    }).present();
  }

  started  = false;
  ts: number;

  getDuration(){
    return Date.now() - this.ts
  }

  makeCall(native: boolean) {
    const url: string = this.useZyra? 'https://zyraapps.com/api/items' : 'http://requestb.in/r8p3okr8';
    const params: any = { ts: Date.now() };
    const promises: Promise<any>[] = [];

    const startTs: number = this.ts  = Date.now();

    for (let i = 0; i < this.concurrency; i++) {
      if (native) {
        promises.push(<Promise<any>>cordova.plugins.NativeHttp.get(url, params, {}));
      } else {
        promises.push(this.http.get(url, { params }).toPromise());
      }
    }

    Promise.all(promises)
      .then((res) => {
        console.log(res[0]);
        console.log(res);
        this.response = res.toString();
        this.started = false;
        this.showResult(native, Date.now() - startTs);
      })
      .catch((e) => {
        console.log(e[0]);
        console.log(e);
        this.response = e.toString();
        this.showResult(native, -1);
      })

  }

}
