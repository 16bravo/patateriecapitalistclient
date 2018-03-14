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

  constructor(private service: RestserviceService) {
    this.server = service.getServer();
    service.getWorld().then(
      world => {
        this.world = world;
      });
    }
  }
