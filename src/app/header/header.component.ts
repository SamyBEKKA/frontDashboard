import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
    authService = inject(AuthService);
    isLog : boolean = false;

    private activeMenu: string = '';
    public isCartOpen: boolean = false;


    setActiveMenu(menu: string) {
        this.activeMenu = menu;
    }

    isActiveMenu(menu: string): boolean {
        return this.activeMenu === menu;
    }

    toggleCart() {
        this.isCartOpen = !this.isCartOpen;
    }
    
    //deco
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
    ngOnInit(): void {
      this.loginCheck();
      console.log(this.isLog);
    }
}
