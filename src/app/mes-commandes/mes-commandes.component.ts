import { Component, inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-mes-commandes',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './mes-commandes.component.html',
  styleUrl: './mes-commandes.component.css'
})
export class MesCommandesComponent {

  // auth = inject(AuthService).logout();

  
  
 
}
