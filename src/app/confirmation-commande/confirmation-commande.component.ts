import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation-commande',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './confirmation-commande.component.html',
  styleUrl: './confirmation-commande.component.css'
})
export class ConfirmationCommandeComponent implements OnInit {

  user: any;
  city: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Récupérer les informations utilisateur à partir du token
    this.user = this.authService.getCurrentUser().subscribe;

    if (this.user) {
      console.log('Utilisateur récupéré à partir du token :', this.user);
    } else {
      console.error('Aucun utilisateur connecté');
    }
  }

  continue(): void {
    // Par exemple, navigation vers une autre page
    this.router.navigate(['/paiement']);  // Change '/next-page' avec l'URL de la page souhaitée
  }
}
