import { Component, OnInit, ViewChild } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { RestserviceService } from '../restservice.service';
import { ToasterService } from 'angular2-toaster';
import { Product, Pallier } from '../world';

declare var require;
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @ViewChild('bar') progressBarItem;
  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter();
  @Output() notifyMoney: EventEmitter<Product> = new EventEmitter();

  progressbar: any;
  lastupdate: any;
  product: Product;
  cout: any;
  _qtmulti: any;
  _qtmultip: any;
  _money: number;
  couttotal : number;
  bonusvitesse : number;
  toasterService: ToasterService;

  constructor(private service: RestserviceService, toasterService: ToasterService) {this.toasterService = toasterService; }

  @Input() set prod(value: Product) { this.product = value; if (this.product && this.product.timeleft > 0) { this.lastupdate = Date.now(); let progress = (this.product.vitesse - this.product.timeleft) / this.product.vitesse; this.progressbar.set(progress); this.progressbar.animate(1, { duration: this.product.timeleft }); } }
  @Input() set qtmulti(value: string) {this._qtmultip = value;this._qtmulti = value;if (this._qtmulti=="MAX" && this.product) this.calcMaxCanBuy();}
  @Input() set money(value: any) {this._money = value;}

  ngOnInit() {
    this.bonusvitesse=1;
    setInterval(() => { this.calcScore(); }, 100);
    setInterval(() => { if(this._qtmulti=="MAX"){this.calcMaxCanBuy()};}, 250);
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, { strokeWidth: 50, color: '#6eb56c' });
    //this.couttotal = this.product.cout;
  }

  startFabrication(){
    if(this.product.timeleft==0){
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.product.timeleft=this.product.vitesse;
      this.lastupdate = Date.now();
    }
  }

  buy(){
    let sum;
    //calcul suites geometriques
    sum = this.product.cout*((1-Math.pow(this.product.croissance,this._qtmultip))/(1-this.product.croissance));
    if(this._money>=sum){
      this.product.quantite+=this._qtmultip;
      this.product.cout=this.product.cout*Math.pow(this.product.croissance,this._qtmultip);
      this.notifyMoney.emit(sum);
    };
    this.product.palliers.pallier.forEach(unlock => {
      if(!unlock.unlocked){
          if(this.product.quantite>=unlock.seuil){
        this.calcUpgrade(unlock);
        this.toasterService.pop('success','Unlock débloqué !', unlock.name);
      };
      };
    });

    this.service.putProduct(this.product);
  }

  calcScore(){
    if(this.product.managerUnlocked==true){this.startFabrication();};
    /*console.log(this.bonusvitesse);
    this.product.timeleft = this.product.timeleft / this.bonusvitesse;
    this.bonusvitesse = 1;
    this.progressbar.animate(1, { duration: this.product.timeleft });*/
    if(this.product.timeleft>0){
      let tempsEcoule = Date.now()-this.lastupdate;
      this.product.timeleft=(this.product.vitesse)-tempsEcoule;
      if(this.product.timeleft<=0){
        this.product.timeleft=0;
        this.progressbar.set(0);
        // on prévient le composant parent que ce produit a généré son revenu.
        this.notifyProduction.emit(this.product);
        //this.couttotal = this.product.cout*((1-Math.pow(this.product.croissance,this._qtmultip))/(1-this.product.croissance));
        //if (this._qtmulti=="MAX") this.calcMaxCanBuy();
      }
    }
  }

  calcMaxCanBuy(){
  this._qtmultip=Math.floor(Math.log(1 - (this._money / this.product.cout) * (1 - this.product.croissance)) / Math.log(this.product.croissance));
}

calcUpgrade(tu:Pallier){
    if(tu.typeratio=="GAIN"){
      this.product.revenu = this.product.revenu*tu.ratio;
    }else if(tu.typeratio=="VITESSE"){
      this.product.vitesse = Math.round(this.product.vitesse/tu.ratio);
      this.bonusvitesse=tu.ratio;
    }
    tu.unlocked = true;
    this.service.putProduct(this.product);
}

}
