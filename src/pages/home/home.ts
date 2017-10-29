import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner';

import { NFC, Ndef } from '@ionic-native/nfc';
import { Subscription } from 'rxjs/Rx'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  options: BarcodeScannerOptions;
  results: {};

  readingTag:   boolean   = false;
  writingTag:   boolean   = false;
  isWriting:    boolean   = false;
  ndefMsg:      string    = '';
  subscriptions: Array<Subscription> = new Array<Subscription>();

  constructor(
    private barcode: BarcodeScanner,
    public navCtrl: NavController,
    private nfc: NFC,
    private ndef: Ndef
  ) {

    this.subscriptions.push(this.nfc.addNdefListener()
        .subscribe(data => {
          if (this.readingTag) {
            let payload = data.tag.ndefMessage[0].payload;
            let tagContent = this.nfc.bytesToString(payload).substring(3);
            this.readingTag = false;
            console.log("De stad is: ", tagContent);
            this.results = tagContent;
          }
          else if (this.writingTag) {
            if (!this.isWriting) {
              this.isWriting = true;
              this.nfc.write([this.ndefMsg])
                .then(() => {
                  this.writingTag = false;
                  this.isWriting = false;
                  console.log("written");
                })
                .catch(err => {
                  this.writingTag = false;
                  this.isWriting = false;
                });
            }
          }
        },
        err => {

        })
     );
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  readTag() {
    this.readingTag = true;
  }

  writeTag(writeText: string) {
    this.writingTag = true;
    this.ndefMsg = this.ndef.textRecord(writeText);
  }

  async scanBarcode(){

    this.options = {
      prompt: "Scan de QR-code stempel!"
    }

    this.results = await this.barcode.scan(this.options);
    console.log(this.results);
  }

}
