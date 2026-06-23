import { useState, useMemo } from 'react';
import { calculerIPE } from '../../lib/cnss-engine';
import { formatDH, formatEntier, parseNombre } from '../../lib/format';
import { IPE_JOURS_MINIMUM, IPE_JOURS_12_MOIS, IPE_DUREE_MOIS, SMIG_MENSUEL } from '../../data/cnss-rates';
import ChampSalaire from '../ui/ChampSalaire';

export default function IPE() {
  const [salaireInput, setSalaireInput] = useState('');
  const [joursInput, setJoursInput] = useState('');
  const [jours12Input, setJours12Input] = useState('');

  const salaire = parseNombre(salaireInput);
  const jours = parseNombre(joursInput);
  const jours12 = parseNombre(jours12Input);

  const result = useMemo(() => calculerIPE(salaire, jours, jours12), [salaire, jours, jours12]);
  const hasInput = salaire > 0 && jours > 0 && jours12 > 0;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Simuler l'Indemnité Perte d'Emploi (IPE)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChampSalaire
            label="Salaire moyen des 36 derniers mois"
            value={salaireInput}
            onChange={setSalaireInput}
            placeholder="5000"
            helper="Salaire mensuel moyen brut"
          />
          <ChampSalaire
            label="Total jours cotisés CNSS"
            value={joursInput}
            onChange={setJoursInput}
            placeholder="1000"
            suffix="jours"
            helper={`Minimum ${formatEntier(IPE_JOURS_MINIMUM)} jours requis`}
          />
          <ChampSalaire
            label="Jours cotisés (12 derniers mois)"
            value={jours12Input}
            onChange={setJours12Input}
            placeholder="260"
            suffix="jours"
            helper={`Minimum ${formatEntier(IPE_JOURS_12_MOIS)} jours requis`}
          />
        </div>
      </div>

      {hasInput && (
        <>
          {!result.eligible ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Non éligible à l'IPE</h3>
              <p className="text-red-700">{result.raisonIneligibilite}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-brand-50 rounded-xl p-5 border border-brand-100">
                  <p className="text-xs font-medium text-brand-700 uppercase tracking-wider">Indemnité mensuelle</p>
                  <p className="text-2xl font-bold text-brand-800 mt-1 tabular-nums">{formatDH(result.montantMensuel)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Durée</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{result.dureeMois} mois</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Total perçu</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">{formatDH(result.montantTotal)}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Détail du calcul</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500">Salaire moyen 36 mois</dt>
                    <dd className="font-medium">{formatDH(salaire)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">70% du salaire moyen</dt>
                    <dd className="font-medium">{formatDH(salaire * 0.70)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Plafond (SMIG)</dt>
                    <dd className="font-medium">{formatDH(SMIG_MENSUEL)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Indemnité retenue</dt>
                    <dd className="font-medium text-brand-700">{formatDH(result.montantMensuel)}</dd>
                  </div>
                </dl>
              </div>

              {salaire * 0.70 > SMIG_MENSUEL && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Plafonnement :</strong> 70% de votre salaire moyen ({formatDH(salaire * 0.70)}) dépasse le SMIG
                    ({formatDH(SMIG_MENSUEL)}). L'indemnité est plafonnée au SMIG.
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Conditions de l'IPE</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Minimum {formatEntier(IPE_JOURS_MINIMUM)} jours de cotisation CNSS au total</li>
          <li>Dont minimum {formatEntier(IPE_JOURS_12_MOIS)} jours sur les 12 derniers mois</li>
          <li>Montant : 70% du salaire moyen des 36 derniers mois</li>
          <li>Plafonné au SMIG ({formatDH(SMIG_MENSUEL)})</li>
          <li>Durée maximale : {IPE_DUREE_MOIS} mois</li>
          <li>Perte involontaire de l'emploi uniquement</li>
        </ul>
      </div>
    </div>
  );
}
