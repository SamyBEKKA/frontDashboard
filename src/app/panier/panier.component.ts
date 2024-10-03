import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.css'
})
export class PanierComponent implements OnInit {

  savedOrders: any[] = [];
  totalPrice:number = 0;
  totalOrders: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadSavedOrders();
    this.calculateTotalPrice();
    this.totalOrders = this.savedOrders.length;
  }

  // Charger les commandes sauvegardées depuis le localStorage
  loadSavedOrders(): void {
    this.savedOrders = localStorage.getItem('orders') 
      ? JSON.parse(localStorage.getItem('orders')!) 
      : [];
  }

  // Calculer le total des prix des commandes
  calculateTotalPrice(): void {
    this.totalPrice = this.savedOrders.reduce((total, order) => total + order.price, 0);
  }

  // Naviguer vers la page de confirmation de commande
  goToConfirmation(): void {
    this.router.navigate(['/confirmation-commande']);
  }

  // Naviguer vers la page de commande
  goToCommande(): void {
    this.router.navigate(['/commande']);
  }
}
