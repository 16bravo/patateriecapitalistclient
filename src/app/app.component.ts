import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Pallier, Product } from './world';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pataterie Capitalist 2k19';

  world: World = new World();
  server: string;
  qtmulti: any;
  money: any;

  constructor(private service: RestserviceService) {
    this.server = service.getServer();
    service.getWorld().then(
      world => {
        this.world = world;
      });
    }

    ngOnInit() {
      this.qtmulti=1;
      this.money=this.world.money;
    }

    onProductionDone(p:Product){
      this.world.money+=p.revenu;
    }

    onBuy(p:Product){
      console.log(p.tcout);
      this.world.money-=p.tcout;
      console.log("onBuy active");
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
  }
