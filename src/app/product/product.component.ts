import { Component, OnInit, ViewChild } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../world';

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

  constructor() { }

  progressbar: any;
  lastupdate: any;
  product: Product;
  cout: any;
  tcout: any;
  style: string;

  @Input() set prod(value: Product) { this.product = value; }
  @Input() set qtmulti(value: string) {this._qtmulti = value;if (this._qtmulti=="MAX" && this.product) this.calcMaxCanBuy();}
  @Input() set money(value: any) {this._money = value;}

  ngOnInit() {
    setInterval(() => { this.calcScore(); }, 100);
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, { strokeWidth: 50, color: '#00ff00' });
  }

  startFabrication(){
    if(this.product.timeleft==0){
      this.progressbar.animate(1, { duration: this.product.vitesse*1000 });
      this.product.timeleft=this.product.vitesse*1000;
      this.lastupdate = Date.now();
    }
  }

  buy(){
    let sum;
    //calcul suites geometriques
    sum = this.product.cout*((1-Math.pow(this.product.croissance,this._qtmulti))/(1-this.product.croissance));
    if(this._money>=sum){
      this.product.quantite+=this._qtmulti;
      console.log(this.product.quantite);
      this.tcout=sum;
      this.product.cout=this.product.cout*Math.pow(this.product.croissance,this._qtmulti);
      this.notifyMoney.emit(this);
    }
  }

  calcScore(){
    if(this.product.timeleft>0){
      let tempsEcoule = Date.now()-this.lastupdate;
      this.product.timeleft=(this.product.vitesse*1000)-tempsEcoule;
      if(this.product.timeleft<=0){
        this.product.timeleft=0;
        this.progressbar.set(0);
        // on prévient le composant parent que ce produit a généré son revenu.
        this.notifyProduction.emit(this.product);
      }
    }
  }

  calcMaxCanBuy(){
    let max = 0;
    let parth = 0;
    let nb = 0;
    while(max<=this._money){
      parth+=Math.pow(this.product.croissance,nb);
      max=this.product.cout*parth;
      nb++;
    }
    nb--;//je sais que c'est pas terrible, pas la peine de me le rappeler
    this._qtmulti=nb;
    parth-=Math.pow(this.product.croissance,nb+1);
    this.tcout=this.product.cout*parth;
  }

}
