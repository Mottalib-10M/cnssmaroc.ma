export interface TauxTVA {
  taux: number;
  label: string;
  description: string;
  exemples: string[];
}

export const TAUX_TVA: TauxTVA[] = [
  {
    taux: 0.20,
    label: '20%',
    description: 'Taux normal',
    exemples: [
      'Produits manufacturés',
      'Services divers',
      'Electroménager',
      'Vêtements',
      'Véhicules',
      'Télécommunications',
      'Restauration',
    ],
  },
  {
    taux: 0.14,
    label: '14%',
    description: 'Taux réduit',
    exemples: [
      'Transport',
      'Beurre',
      'Thé',
      'Confiture',
      'Énergie électrique (usage non domestique)',
    ],
  },
  {
    taux: 0.10,
    label: '10%',
    description: 'Taux réduit',
    exemples: [
      'Huiles alimentaires',
      'Sel',
      'Riz',
      'Pâtes alimentaires',
      'Opérations bancaires',
      'Hôtellerie',
      'Restauration touristique',
      'Conserves de sardines',
    ],
  },
  {
    taux: 0.07,
    label: '7%',
    description: 'Taux super-réduit',
    exemples: [
      'Eau (usage domestique)',
      'Électricité (usage domestique)',
      'Produits pharmaceutiques',
      'Fournitures scolaires',
      'Alimentation du bétail',
    ],
  },
  {
    taux: 0,
    label: '0% (exonéré)',
    description: 'Exonéré de TVA',
    exemples: [
      'Pain',
      'Lait frais',
      'Sucre brut',
      'Dattes',
      'Produits de première nécessité',
      'Produits de la pêche',
      'Viande fraîche',
      'Huile d\'olive',
    ],
  },
];

export const TAUX_TVA_OPTIONS = TAUX_TVA.map((t) => ({
  value: t.taux,
  label: `${t.label} - ${t.description}`,
}));
