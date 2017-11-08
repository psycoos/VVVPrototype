import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner';

import { NFC, Ndef } from '@ionic-native/nfc';
import { Subscription } from 'rxjs/Rx';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: Array<string> = ["Bolsward"];

  readingTag:   boolean   = false;
  writingTag:   boolean   = false;
  isWriting:    boolean   = false;
  ndefMsg:      string    = '';
  subscriptions: Array<Subscription> = new Array<Subscription>();
  message = '';

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

   
//  ionViewDidLoad () {
//   console.log("hoi");
//   if(this.items.includes('Leeuwarden'))
//   console.log("Het werkt, pak een touw"); 
//  }



  // valuechecker() {
  //   if('Leeuwarden' in this.items) 
  //     console.log("Het werkt, pak een touw"); 
  // }


  ionViewWillLeave() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  // getImg(city) {
  //   switch (city) {
  //     case 'Bolsward':
  //       if (this.items.includes('Bolsward')) {
  //         console.log("Hoer")
  //         return 'hoer'
  //       } else {
  //         return '/src/assets/images/bolsward_1.svg'
  //       }
  //       break;
    
  //     default:
  //       break;
  //   }
  // } 


  readTag() {
    this.readingTag = true;
    if (this.readingTag == true){
      this.message = "Scan nu een NFC tag";
    }
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
          if(this.items.includes('Leeuwarden'))
          console.log("Het werkt, pak een touw");
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

