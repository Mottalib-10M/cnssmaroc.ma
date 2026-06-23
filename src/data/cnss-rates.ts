/** Plafond mensuel CNSS pour les cotisations plafonnées */
export const PLAFOND_MENSUEL = 6_000;

/** SMIG mensuel (2025) */
export const SMIG_MENSUEL = 3_111;

/** Pension minimum mensuelle */
export const PENSION_MINIMUM = 1_500;

/** Jours minimum de cotisation pour la pension */
export const JOURS_MINIMUM_PENSION = 3_240;

/** Jours par tranche supplémentaire */
export const JOURS_PAR_TRANCHE = 216;

/** Taux de base pension (pour 3240 jours) */
export const TAUX_BASE_PENSION = 0.50;

/** Taux supplémentaire par tranche de 216 jours */
export const TAUX_PAR_TRANCHE = 0.01;

/** Plafond taux pension */
export const PLAFOND_TAUX_PENSION = 0.70;

/** Age légal de départ à la retraite */
export const AGE_RETRAITE = 60;

/** Age retraite anticipée */
export const AGE_RETRAITE_ANTICIPEE = 55;

/** Age retraite CMR (fonctionnaires civils) */
export const AGE_RETRAITE_CMR = 63;

/** Taux CMR par année de service */
export const TAUX_CMR_PAR_ANNEE = 0.025;

/** Plafond taux CMR */
export const PLAFOND_TAUX_CMR = 0.70;

/** Cotisations salariales (employé) */
export const COTISATIONS_SALARIE = {
  prestationsSociales: {
    label: 'Prestations sociales (court terme)',
    taux: 0.0052,
    plafonne: true,
  },
  amo: {
    label: 'AMO (Assurance Maladie Obligatoire)',
    taux: 0.0226,
    plafonne: false,
  },
  retraite: {
    label: 'Retraite (long terme)',
    taux: 0.0396,
    plafonne: true,
  },
} as const;

/** Cotisations patronales (employeur) */
export const COTISATIONS_EMPLOYEUR = {
  allocationsFamiliales: {
    label: 'Allocations familiales',
    taux: 0.064,
    plafonne: false,
  },
  prestationsSociales: {
    label: 'Prestations sociales (court terme)',
    taux: 0.0105,
    plafonne: true,
  },
  amo: {
    label: 'AMO patronale',
    taux: 0.0411,
    plafonne: false,
  },
  retraite: {
    label: 'Retraite (long terme)',
    taux: 0.0793,
    plafonne: true,
  },
  formationProfessionnelle: {
    label: 'Taxe formation professionnelle',
    taux: 0.016,
    plafonne: false,
  },
} as const;

/** Allocations familiales */
export const ALLOC_ENFANT_1_3 = 300;
export const ALLOC_ENFANT_4_6 = 36;
export const MAX_ENFANTS = 6;

/** IPE (Indemnité Perte d'Emploi) */
export const IPE_JOURS_MINIMUM = 780;
export const IPE_JOURS_12_MOIS = 260;
export const IPE_TAUX = 0.70;
export const IPE_DUREE_MOIS = 6;

/** Cotisation CMR */
export const CMR_TAUX_SALARIE = 0.10;
export const CMR_TAUX_PATRONAL = 0.10;
