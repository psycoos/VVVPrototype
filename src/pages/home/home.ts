import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

import { NFC, Ndef } from '@ionic-native/nfc';
import { Subscription } from 'rxjs/Rx';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: Array<string> = [];


  readingTag: boolean = false;
  writingTag: boolean = false;
  isWriting: boolean = false;
  ndefMsg: string = '';
  subscriptions: Array<Subscription> = new Array<Subscription>();

  constructor(
    public platform: Platform,
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
          this.items.push(tagContent);
          console.log(this.items);
          this.changeValues();

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

  ionViewDidLoad() {
    this.changeValues();  
  }
  changeValues() {
    if (this.items.includes('Sneek'))
      (document.getElementById('Sneek') as HTMLImageElement).src = "assets/images/sneek_2.svg";
    else (document.getElementById('Sneek') as HTMLImageElement).src = "assets/images/sneek_1.svg";
    if (this.items.includes('Leeuwarden'))
      (document.getElementById('Leeuwarden') as HTMLImageElement).src = "assets/images/leeuwarden_2.svg";
    else (document.getElementById('Leeuwarden') as HTMLImageElement).src = "assets/images/leeuwarden_1.svg";
    if (this.items.includes('Hindeloopen'))
      (document.getElementById('Hindeloopen') as HTMLImageElement).src = "assets/images/hindeloopen_2.svg";
    else (document.getElementById('Hindeloopen') as HTMLImageElement).src = "assets/images/hindeloopen_1.svg";
  }



  // valuechecker() {
  //   if('Leeuwarden' in this.items) 
  //     console.log("Het werkt, pak een touw"); 
  // }


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

  scan() {
    this.platform.ready().then(() => {
      this.barcode.scan().then((barcodeData) => {
        // success
        this.items.push(barcodeData.text);
        console.log(this.items);
        this.changeValues();
        console.log("Henkie")
      }, (err) => {
        // error
        alert(err);
      });
    });
  }

  // async scanBarcode(){

  //   this.options = {
  //     prompt: "Scan de QR-code stempel!"
  //   }

  //   this.results = await this.barcode.scan(this.options);
  //   console.log(this.results);
  // }

}

