// ===================== AUTH =====================
export interface LoginRequest {
  email: string;
  motDePasse: string;
}
export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  role?: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  prenom: string;
  nom: string;
  role: string; 
  token: string;
  type: string;
  telephone: string;
}

// ===================== UTILISATEUR =====================
export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'USER' | 'ADMIN';
  actif: boolean;
  dateCreation: string;
}

// ===================== VOYAGEUR =====================
export interface Voyageur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  numeroCni: string;
  dateNaissance: string;
  dateEnregistrement: string;
}
export interface VoyageurRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  numeroCni: string;
  dateNaissance?: string;
}

// ===================== VOYAGE =====================
export type StatutVoyage = 'DISPONIBLE' | 'COMPLET' | 'PASSE' | 'ANNULE';

export interface Voyage {
  id: number;
  villeDepart: string;
  villeArrivee: string;
  dateDepart: string; 
  dateArrivee: string;
  heureDepart: string; // Assure-toi que ton backend envoie bien l'heure séparée ou formatée
  heureArrivee: string;
  nombrePlaces: number;   
  placesDisponibles: number; 
  siegesOccupes: number[]; 
  prix: number;
  compagnie: string;
  statut: StatutVoyage;
  bus: Bus; // L'objet Bus complet pour l'affichage
}

export interface VoyageRequest {
  id?: number;
  villeDepart: string;
  villeArrivee: string;
  dateDepart: string;
  dateArrivee: string;
  prix: number;
  nombrePlaces: number;
  bus: { id: number };
  compagnie: string; // Plus simple d'envoyer juste l'ID au backend
}

// ===================== RESERVATION =====================
export type StatutReservation = 'EN_ATTENTE' | 'CONFIRMEE' | 'PAYEE' | 'ANNULEE';

export interface Reservation {
  id: number;
  numeroReservation: string;
  reference: string;
  voyageur: Voyageur;
  voyage: Voyage;
  nombrePlaces: number; // ✅ Harmonisé avec le backend
  montantTotal: number;
  statut: StatutReservation;
  dateReservation: string;
  payee: boolean; // Ajouté pour faciliter les tests IF dans Angular
}

export interface ReservationRequest {
  voyageId: number;
  nombrePlaces: number; // ✅ On demande N places, pas un numéro de siège précis
  voyageurId?: number; 
  // Infos pour un nouveau voyageur (si pas connecté)
  nomVoyageur?: string;
  prenomVoyageur?: string;
  emailVoyageur?: string;
  telephoneVoyageur?: string;
  numeroCni?: string;
}

// ===================== PAIEMENT =====================
export type ModePaiement = 'CARTE_BANCAIRE' | 'MOBILE_MONEY' | 'ORANGE_MONEY';
export type StatutPaiement = 'EN_ATTENTE' | 'REUSSI' | 'ECHOUE' | 'REMBOURSE';
export interface Paiement {
  id: number;
  referenceTransaction: string;
  reservation: Reservation;
  montant: number;
  modePaiement: ModePaiement;
  statut: StatutPaiement;
  datePaiement: string;
}

export interface PaiementRequest {
  reservationId: number;
  modePaiement: 'ORANGE_MONEY' | 'MOBILE_MONEY' | 'CARTE_BANCAIRE'; // Doit matcher l'Enum Java
  referenceTransaction: string; // L'ID reçu de l'opérateur (OM/Moov/Flooz)
}

// ===================== TICKET =====================
export interface Ticket {
  id: number;
  numeroTicket: string;
  nomVoyageur: string;   
  numeroSiege: number;
  prixApplique: number;
  busId: number;
  dateEmission: string;
  imprime: boolean;
  reservationId?: number; 
  
  // AJOUTE CECI : La relation complète pour l'affichage
  reservation?: {
    id: number;
    statut: string;
    voyage: {
      villeDepart: string;
      villeArrivee: string;
      dateDepart: string;
      nomBus?: string;
    }
  };
}

// ===================== NOTIFICATION =====================
export type TypeNotification = 'EMAIL' | 'SMS' | 'SYSTEME';
export interface Notification {
  id: number;
  sujet: string;
  message: string;
  destinataire: string;
  type: TypeNotification;
  envoye: boolean;
  dateEnvoi?: string;
  dateCreation: string;
}
export interface NotificationRequest {
  sujet: string;
  message: string;
  destinataire: string;
  type: TypeNotification;
  utilisateurId?: number;
}

export interface Bus {
  id?: number;
  immatriculation: string;
  modele: string;
  capacite: number;
  statut:string;
  numeroBus: string;
}
export type StatutBus = 'DISPONIBLE' | 'EN_MAINTENANCE' | 'EN_ROUTE' | 'HORS_SERVICE';
export interface BusRequest {
  id?: number;            // Optionnel pour la création
  immatriculation: string;
  modele: string;
  capacite: number;
  statut: string;         // Doit correspondre au String dans le DTO Java
  numeroBus: string;
}
