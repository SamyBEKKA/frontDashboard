import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { PrestationService } from '../shared/prestation.service';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../shared/auth.service';
import { Service } from '../shared/auth';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet, CommonModule, RouterLink, LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  
  authService = inject(AuthService);
  isLog : boolean = false;
  services: Service[] = [];
  private activeMenu: string = '';
  public isCartOpen: boolean = false;
  constructor(private prestationService: PrestationService){
    
    }

  logout(){
    this.authService.logout();
  }

  loginCheck(){
    if(this.authService.isLogged()){
      this.isLog = true;
    }else{
      this.isLog = false;
    }
  }
  setActiveMenu(menu: string) {
      this.activeMenu = menu;
  }

  isActiveMenu(menu: string): boolean {
      return this.activeMenu === menu;
  }

  toggleCart() {
      this.isCartOpen = !this.isCartOpen;
  }
  prestations: any[] = [];

    
  ngOnInit(): void {
    this.loadServices();
    this.loginCheck();
    console.log(this.isLog);
  }

  loadServices() {
    this.prestationService.getServices().subscribe(data => {
      this.services = data['hydra:member'];
    });
  }

    
}
