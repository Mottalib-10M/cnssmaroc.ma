import {
  PLAFOND_MENSUEL,
  SMIG_MENSUEL,
  PENSION_MINIMUM,
  JOURS_MINIMUM_PENSION,
  JOURS_PAR_TRANCHE,
  TAUX_BASE_PENSION,
  TAUX_PAR_TRANCHE,
  PLAFOND_TAUX_PENSION,
  TAUX_CMR_PAR_ANNEE,
  PLAFOND_TAUX_CMR,
  COTISATIONS_SALARIE,
  COTISATIONS_EMPLOYEUR,
  ALLOC_ENFANT_1_3,
  ALLOC_ENFANT_4_6,
  MAX_ENFANTS,
  IPE_JOURS_MINIMUM,
  IPE_JOURS_12_MOIS,
  IPE_TAUX,
  IPE_DUREE_MOIS,
} from '../data/cnss-rates';

/* ───────────────────────────────────────────────
   Types
   ─────────────────────────────────────────────── */

export interface LigneCotisation {
  label: string;
  taux: number;
  assiette: number;
  montant: number;
  plafonne: boolean;
}

export interface CNSSResult {
  brutMensuel: number;
  salarie: {
    lignes: LigneCotisation[];
    total: number;
  };
  employeur: {
    lignes: LigneCotisation[];
    total: number;
  };
  totalCotisations: number;
  coutEmployeur: number;
  netAvantIR: number;
}

export interface PensionResult {
  eligible: boolean;
  joursManquants: number;
  salaireMoyen: number;
  joursCotises: number;
  tauxRemplacement: number;
  pensionMensuelle: number;
  pensionAnnuelle: number;
  tranchesSupplementaires: number;
}

export interface PensionCMRResult {
  dernierTraitement: number;
  anneesService: number;
  tauxRemplacement: number;
  pensionMensuelle: number;
  pensionAnnuelle: number;
  cotisationMensuelleSalarie: number;
  cotisationMensuellePatronale: number;
}

export interface IPEResult {
  eligible: boolean;
  raisonIneligibilite: string;
  montantMensuel: number;
  dureeMois: number;
  montantTotal: number;
}

export interface TVAResult {
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  taux: number;
}

/* ───────────────────────────────────────────────
   Cotisations CNSS
   ─────────────────────────────────────────────── */

function calculerLigne(
  brut: number,
  taux: number,
  plafonne: boolean,
): { assiette: number; montant: number } {
  const assiette = plafonne ? Math.min(brut, PLAFOND_MENSUEL) : brut;
  return {
    assiette,
    montant: Math.round(assiette * taux * 100) / 100,
  };
}

export function calculerCotisationsCNSS(brutMensuel: number): CNSSResult {
  const brut = Math.max(0, brutMensuel);

  // Cotisations salarié
  const lignesSalarie: LigneCotisation[] = Object.values(COTISATIONS_SALARIE).map((c) => {
    const { assiette, montant } = calculerLigne(brut, c.taux, c.plafonne);
    return { label: c.label, taux: c.taux, assiette, montant, plafonne: c.plafonne };
  });
  const totalSalarie = lignesSalarie.reduce((s, l) => s + l.montant, 0);

  // Cotisations employeur
  const lignesEmployeur: LigneCotisation[] = Object.values(COTISATIONS_EMPLOYEUR).map((c) => {
    const { assiette, montant } = calculerLigne(brut, c.taux, c.plafonne);
    return { label: c.label, taux: c.taux, assiette, montant, plafonne: c.plafonne };
  });
  const totalEmployeur = lignesEmployeur.reduce((s, l) => s + l.montant, 0);

  return {
    brutMensuel: brut,
    salarie: { lignes: lignesSalarie, total: Math.round(totalSalarie * 100) / 100 },
    employeur: { lignes: lignesEmployeur, total: Math.round(totalEmployeur * 100) / 100 },
    totalCotisations: Math.round((totalSalarie + totalEmployeur) * 100) / 100,
    coutEmployeur: Math.round((brut + totalEmployeur) * 100) / 100,
    netAvantIR: Math.round((brut - totalSalarie) * 100) / 100,
  };
}

/* ───────────────────────────────────────────────
   Pension CNSS
   ─────────────────────────────────────────────── */

export function calculerPensionCNSS(
  salaireMoyen8Ans: number,
  joursCotises: number,
): PensionResult {
  const salaire = Math.max(0, salaireMoyen8Ans);
  const jours = Math.max(0, Math.floor(joursCotises));
  const eligible = jours >= JOURS_MINIMUM_PENSION;
  const joursManquants = eligible ? 0 : JOURS_MINIMUM_PENSION - jours;

  if (!eligible) {
    return {
      eligible: false,
      joursManquants,
      salaireMoyen: salaire,
      joursCotises: jours,
      tauxRemplacement: 0,
      pensionMensuelle: 0,
      pensionAnnuelle: 0,
      tranchesSupplementaires: 0,
    };
  }

  // Salaire plafonné à 6000 DH pour le calcul pension
  const salairePlafonne = Math.min(salaire, PLAFOND_MENSUEL);

  const joursExcedentaires = jours - JOURS_MINIMUM_PENSION;
  const tranches = Math.floor(joursExcedentaires / JOURS_PAR_TRANCHE);
  let taux = TAUX_BASE_PENSION + tranches * TAUX_PAR_TRANCHE;
  taux = Math.min(taux, PLAFOND_TAUX_PENSION);

  let pension = salairePlafonne * taux;
  pension = Math.max(pension, PENSION_MINIMUM);

  return {
    eligible: true,
    joursManquants: 0,
    salaireMoyen: salaire,
    joursCotises: jours,
    tauxRemplacement: Math.round(taux * 10000) / 100,
    pensionMensuelle: Math.round(pension * 100) / 100,
    pensionAnnuelle: Math.round(pension * 12 * 100) / 100,
    tranchesSupplementaires: tranches,
  };
}

/* ───────────────────────────────────────────────
   Pension CMR (Fonctionnaires)
   ─────────────────────────────────────────────── */

export function calculerPensionCMR(
  dernierTraitement: number,
  anneesService: number,
): PensionCMRResult {
  const traitement = Math.max(0, dernierTraitement);
  const annees = Math.max(0, anneesService);

  let taux = TAUX_CMR_PAR_ANNEE * annees;
  taux = Math.min(taux, PLAFOND_TAUX_CMR);

  const pension = traitement * taux;

  return {
    dernierTraitement: traitement,
    anneesService: annees,
    tauxRemplacement: Math.round(taux * 10000) / 100,
    pensionMensuelle: Math.round(pension * 100) / 100,
    pensionAnnuelle: Math.round(pension * 12 * 100) / 100,
    cotisationMensuelleSalarie: Math.round(traitement * 0.10 * 100) / 100,
    cotisationMensuellePatronale: Math.round(traitement * 0.10 * 100) / 100,
  };
}

/* ───────────────────────────────────────────────
   Allocations Familiales
   ─────────────────────────────────────────────── */

export function calculerAllocFamiliales(nbEnfants: number): number {
  const n = Math.max(0, Math.min(Math.floor(nbEnfants), MAX_ENFANTS));
  const premiers = Math.min(n, 3) * ALLOC_ENFANT_1_3;
  const suivants = Math.max(0, n - 3) * ALLOC_ENFANT_4_6;
  return premiers + suivants;
}

/* ───────────────────────────────────────────────
   IPE (Indemnité Perte d'Emploi)
   ─────────────────────────────────────────────── */

export function calculerIPE(
  salaireMoyen36Mois: number,
  joursCotises: number,
  joursDerniers12Mois: number,
): IPEResult {
  const salaire = Math.max(0, salaireMoyen36Mois);
  const jours = Math.max(0, Math.floor(joursCotises));
  const jours12 = Math.max(0, Math.floor(joursDerniers12Mois));

  if (jours < IPE_JOURS_MINIMUM) {
    return {
      eligible: false,
      raisonIneligibilite: `Il faut au minimum ${IPE_JOURS_MINIMUM} jours de cotisation (vous avez ${jours} jours).`,
      montantMensuel: 0,
      dureeMois: 0,
      montantTotal: 0,
    };
  }

  if (jours12 < IPE_JOURS_12_MOIS) {
    return {
      eligible: false,
      raisonIneligibilite: `Il faut au minimum ${IPE_JOURS_12_MOIS} jours de cotisation sur les 12 derniers mois (vous avez ${jours12} jours).`,
      montantMensuel: 0,
      dureeMois: 0,
      montantTotal: 0,
    };
  }

  let montant = salaire * IPE_TAUX;
  montant = Math.min(montant, SMIG_MENSUEL);
  montant = Math.round(montant * 100) / 100;

  return {
    eligible: true,
    raisonIneligibilite: '',
    montantMensuel: montant,
    dureeMois: IPE_DUREE_MOIS,
    montantTotal: Math.round(montant * IPE_DUREE_MOIS * 100) / 100,
  };
}

/* ───────────────────────────────────────────────
   TVA
   ─────────────────────────────────────────────── */

export function calculerTVA(montantHT: number, taux: number): TVAResult {
  const ht = Math.max(0, montantHT);
  const t = Math.max(0, taux);
  const tva = Math.round(ht * t * 100) / 100;
  return {
    montantHT: Math.round(ht * 100) / 100,
    montantTVA: tva,
    montantTTC: Math.round((ht + tva) * 100) / 100,
    taux: t,
  };
}

export function calculerTVAInverse(montantTTC: number, taux: number): TVAResult {
  const ttc = Math.max(0, montantTTC);
  const t = Math.max(0, taux);
  const ht = Math.round((ttc / (1 + t)) * 100) / 100;
  const tva = Math.round((ttc - ht) * 100) / 100;
  return {
    montantHT: ht,
    montantTVA: tva,
    montantTTC: Math.round(ttc * 100) / 100,
    taux: t,
  };
}
