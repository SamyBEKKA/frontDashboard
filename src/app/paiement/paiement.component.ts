import { Component, OnInit } from '@angular/core';
import { ApiListResponse, Item, Order, Paiement, User } from '../shared/auth';
import { PaiementService } from '../shared/paiement.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { OrderService } from '../shared/order.service';
import { ItemService } from '../shared/item.service';
import { AuthService } from '../shared/auth.service';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FormsModule],
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.css'
})
export class PaiementComponent implements OnInit{
  paiements: Paiement[] = []; // Stocke la liste des méthodes de paiement
  selectedPaiement!: Paiement;// Stocke la méthode de paiement sélectionnée
  savedOrders: any[] = [];// Commandes sauvegardées dans le panier
  totalPrice: number = 0;
  totalOrders: number = 0; // Nombre total de commandes placé dans la nombre total d'article dans la bdd (exception)
  errorMessage: string | null = null; // Pour stocker un message d'erreur
  // items:Item[]=[]

  constructor(
    private router: Router, 
    private paiementService: PaiementService, 
    private orderService: OrderService, 
    private itemService: ItemService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPaiements();
    this.loadSavedOrders();
    this.calculateTotalOrders();
  }

  // Méthode pour charger les paiements depuis l'API
  loadPaiements(): void {
    this.paiementService.getPaiements().subscribe(
      (response: ApiListResponse<Paiement>) => {
        this.paiements = response['hydra:member']; // Hydrate la liste des paiements
        console.log('Méthodes de paiement récupérées : ', this.paiements);
      },
      (error) => {
        console.error('Erreur lors de la récupération des méthodes de paiement : ', error);
      }
    );
  }

  // Charger les commandes sauvegardées depuis le localStorage
  loadSavedOrders(): void {
    const orders = localStorage.getItem('orders');
    if (orders) {
      this.savedOrders = JSON.parse(orders);
      this.calculateTotalPrice();
    }
  }

  // Calculer le prix total
  calculateTotalPrice(): void {
    this.totalPrice = this.savedOrders.reduce((sum, order) => sum + order.price, 0);
  }

  // Calculer le nombre total de commandes
  calculateTotalOrders(): void {
    this.totalOrders = this.savedOrders.length;
  }

  // Extraire l'ID utilisateur depuis le token (ou une autre méthode d'identification)
  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Décoder le JWT
      return payload.user_id ? payload.user_id : null; // Retourner l'ID utilisateur
    }
    return null;
  }

  // submitOrder(): void {
  //   const currentUser: User | null = this.authService.getCurrentUser();
  
  //   if (!currentUser || !currentUser.id) {
  //     console.error('Utilisateur non trouvé ou ID non défini.');
  //     return;
  //   }

  //   this.authService.getUserByUsername(currentUser.user_name).subscribe(
  //     (user: User) => {
  //       const orderData: Order = {
  //         paiement_effect: true,
  //         user_id: `/api/users/${user.id}`,  // Utiliser l'ID de l'utilisateur récupéré
  //         // items: this.savedOrders.map(order => `http://localhost:8000/api/items/${order.id}`),
  //         status_id: 'http://localhost:8000/api/statuses/1',
  //         paiement_id: `http://localhost:8000/api/paiements/${this.selectedPaiement}`
  //       };

  //       console.log('Données envoyées pour la commande :', orderData);

  //       // Soumettre la commande
  //       this.orderService.createOrder(orderData).subscribe(
  //         (response) => {
  //           console.log('Commande soumise avec succès :', response);
  //           this.router.navigate(['/mes-commandes']);
  //         },
  //         (error) => {
  //           console.error('Erreur lors de la soumission de la commande :', error);
  //         }
  //       );
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la récupération de l\'ID utilisateur :', error);
  //     }
  //   );
  // }

  submitOrder(): void {
    this.errorMessage = null; // Réinitialiser le message d'erreur
    const userId = this.getUserIdFromToken();
    const user = this.authService.getCurrentUser();
    if (!user || !user.username) {
      console.error('Utilisateur non trouvé dans le token.');
      return;
    }
    console.log('Utilisateur trouvé dans le token :', user);
    // Vérifiez si l'utilisateur est connecté
    if (!userId) {
      console.error('Utilisateur non trouvé dans le token.');
      this.errorMessage = 'Utilisateur non connecté.';
      return;
    }
    if (!this.selectedPaiement) {
      console.error('Aucune méthode de paiement sélectionnée.');
      this.errorMessage = 'Veuillez sélectionner une méthode de paiement.';
      return;
    }
    // Créer la commande dans la table `order`
    const orderData: Order = {
      paiement_effect: true, // Confirmation que le paiement est effectué
      user_id: `http://localhost:8000/api/users/${userId}`, // L'ID de l'utilisateur sous forme d'URI
      // items: this.savedOrders.map(order => `http://localhost:8000/api/items/${order.id}`), // Les items sous forme d'URIs
      status_id: `http://localhost:8000/api/statuses/1`, // Statut "en attente de confirmation"
      paiement_id: `http://localhost:8000/api/paiements/${this.selectedPaiement.id}` // Méthode de paiement sélectionnée
    };
  
    console.log("Données envoyées pour la commande :", orderData);
  
    // Envoyer la commande
    this.orderService.createOrder(orderData).subscribe(
      (orderResponse: any) => {
        const orderId = orderResponse.id; // Récupérer l'ID de la commande créée
  
        // Ensuite, créer chaque item dans la table `item`
        this.savedOrders.forEach(order => {
          const itemData: Item = {
            id: 0, // sera défini par le backend
            article_id: order.article.id,
            service_id: order.service.id,
            material_id: order.material.id,
            total_price: order.price,
            order_id: `http://localhost:8000/api/orders/${orderId}` // Relier à la commande créée
          };
  
          console.log("Données envoyées pour l'item :", itemData);
  
          this.itemService.createItem(itemData).subscribe(
            (itemResponse: Item) => {
              console.log('Item saved:', itemResponse);
            },
            error => {
              console.error('Error saving item:', error);
            }
          );
        });
  
        // Rediriger l'utilisateur vers la page des commandes après succès
        this.router.navigate(['/mes-commandes']);
      },
      error => {
        console.error('Error saving order:', error);
        this.errorMessage = 'Échec de l\'enregistrement de la commande.';
      }
    );
  }
  
  
  // Méthode pour rediriger vers /mes-commandes
  goToMesCommandes() {
    this.router.navigate(['/mes-commandes']);
  }
}
