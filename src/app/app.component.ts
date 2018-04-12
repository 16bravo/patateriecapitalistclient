import { Component, Input, ViewChildren, QueryList } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Pallier, Product } from './world';
import { ProductComponent } from './product/product.component';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pataterie Capitalist 2k19';

  @ViewChildren(ProductComponent) productsComponent: QueryList<ProductComponent>;

  world: World = new World();
  server: string;
  qtmulti: any;
  money: any;
  score:any;
  username: string;
  manAv: any;
  upAv: any;
  toasterService: ToasterService;
  minqte: number;
  totalangels: number;
  activeangels: number;
  bonusangels: number;
  nbangelsgen: number;

  constructor(private service: RestserviceService, toasterService: ToasterService) {
    this.minqte = 0;
    this.totalangels=0;
    this.activeangels=0;
    this.nbangelsgen=0;
    this.bonusangels=2;
    this.toasterService = toasterService;
    this.server = service.getServer();
    this.username = localStorage.getItem("username");
    if(this.username==undefined){
      this.username = "Patatain"+Math.floor(Math.random() * 10000);
      localStorage.setItem("username", this.username);}
      service.setUser(this.username);
      service.getWorld().then(
        world => {
          this.world = world;
        });
      }

      ngOnInit() {
        this.qtmulti=1;
        this.money=this.world.money;
        this.score=this.world.score;
        //this.totalangels=this.world.totalangels;
        //console.log(this.world.totalangels);
        //this.activeangels=this.world.activeangels;
        //this.bonusangels=this.world.angelbonus;
      }

      onProductionDone(p:Product){
        this.world.money+=p.revenu*p.quantite;
        this.world.score+=p.revenu*p.quantite;
        this.nbangelsgen=150*Math.sqrt(this.world.score/Math.pow(10,15))-this.totalangels;
        console.log(this.totalangels);
        this.ManagersAvailable();
        this.UpgradesAvailable();
        this.service.putProduct(p);
      }

      onBuy(n:number){
        this.world.money-=n;
        this.ManagersAvailable();
        this.UpgradesAvailable();
        let min = this.world.products.product[0].quantite;
        this.world.products.product.forEach(p =>{if(p.quantite<min){min=p.quantite;}});
        this.world.allunlocks.pallier.forEach(unlock => {
        if(!unlock.unlocked){
          if(min>=unlock.seuil){
            this.calcUpgradeAll(unlock);
            this.toasterService.pop('success','Unlock débloqué !', unlock.name);
          };
        };
      });
    }

    calcUpgradeAll(u:Pallier){
      this.productsComponent.forEach(p => {
        p.calcUpgrade(u);
      });
    }

    toggleMulti(){
      if(this.qtmulti == 1){
        this.qtmulti=10;
      }else if(this.qtmulti==10){
        this.qtmulti=100;
      }else if(this.qtmulti==100){
        this.qtmulti="MAX";
      }else{
        this.qtmulti=1;
      }
    }

    ManagersAvailable(){
      this.manAv = false;
      this.world.managers.pallier.forEach(manager => {
        if(!manager.unlocked){
          if(this.world.money>=manager.seuil){
            this.manAv = true;
          }
        }
      })
    }

    UpgradesAvailable(){
      this.upAv = false;
      this.world.upgrades.pallier.forEach(upgrade => {
        if(!upgrade.unlocked){
          if(this.world.money>=upgrade.seuil){
            this.upAv = true;
          }
        }
      })
    }

    hireManager(m:Pallier){
      if(this.world.money>=m.seuil){
        this.onBuy(m.seuil);
        m.unlocked=true;
        this.world.products.product[m.idcible-1].managerUnlocked=true;
        this.toasterService.pop('success','Manager engagé !',m.name);
        //this.toasterService.pop('error', 'Problème : ', reason.status)
      }
      this.service.putManager(m);
    }

    buyUpgrade(m:Pallier){
      if(this.world.money>=m.seuil){
        this.onBuy(m.seuil);
        m.unlocked=true;
        this.toasterService.pop('success','Upgrade acheté !',m.name);
        console.log(this.productsComponent._results[m.idcible-1].product);
        //calcUpgrade(m);
        //this.service.putUpgrade(m);
      }
      this.UpgradesAvailable();
      //this.service.putManager(m);
    }

    onUsernameChanged(){
      if(this.username==undefined){
        this.username = "Patatain"+Math.floor(Math.random() * 10000);
        this.service.setUser(this.username);
        localStorage.setItem("username", this.username);
        this.service.getWorld().then( world => { this.world = world});
      }else{
        this.service.setUser(this.username);
        localStorage.setItem("username", this.username);
        this.service.getWorld().then( world => { this.world = world});
      };
    }
  }
