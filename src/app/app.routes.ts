import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PrestationComponent } from './prestation/prestation.component';
import { CommandeComponent } from './commande/commande.component';
import { PanierComponent } from './panier/panier.component';
import { RecuperationMotDePasseComponent } from './recuperation-mot-de-passe/recuperation-mot-de-passe.component';
import { PaiementComponent } from './paiement/paiement.component';
import { ConfirmationCommandeComponent } from './confirmation-commande/confirmation-commande.component';
import { MesCommandesComponent } from './mes-commandes/mes-commandes.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    { path: '', component:HomeComponent},
    { path: 'prestations', component: PrestationComponent },
    { path: 'commande', component: CommandeComponent },
    { path: 'panier', component: PanierComponent },
    { path: 'recuperation-mot-de-passe', component: RecuperationMotDePasseComponent },
    { path: 'login', component:LoginComponent},
    { path: 'paiement', component: PaiementComponent, canActivate: [authGuard] },
    { path: 'confirmation-commande', component: ConfirmationCommandeComponent, canActivate: [authGuard] },
    { path: 'mes-commandes', component: MesCommandesComponent, canActivate: [authGuard] },
    // { path: '', redirectTo: '/prestations', pathMatch: 'full' },
    { path: '**', redirectTo: ''}
];
