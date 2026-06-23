import { useState, useMemo } from 'react';
import { calculerPensionCMR } from '../../lib/cnss-engine';
import { formatDH, formatPourcentBase100, parseNombre } from '../../lib/format';
import { AGE_RETRAITE_CMR, PLAFOND_TAUX_CMR } from '../../data/cnss-rates';
import ChampSalaire from '../ui/ChampSalaire';

export default function PensionCMR() {
  const [traitementInput, setTraitementInput] = useState('');
  const [anneesInput, setAnneesInput] = useState('');

  const traitement = parseNombre(traitementInput);
  const annees = parseNombre(anneesInput);

  const result = useMemo(() => calculerPensionCMR(traitement, annees), [traitement, annees]);
  const hasInput = traitement > 0 && annees > 0;

  const anneesMax70 = Math.ceil(PLAFOND_TAUX_CMR / 0.025);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Simuler votre pension CMR</h2>
        <p className="text-sm text-gray-500 mb-4">
          La CMR (Caisse Marocaine des Retraites) couvre les fonctionnaires. Age de départ : {AGE_RETRAITE_CMR} ans.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChampSalaire
            label="Dernier traitement de base mensuel"
            value={traitementInput}
            onChange={setTraitementInput}
            placeholder="10000"
            helper="Traitement de base brut hors indemnités"
          />
          <ChampSalaire
            label="Années de service"
            value={anneesInput}
            onChange={setAnneesInput}
            placeholder="25"
            suffix="ans"
            helper={`Le taux plafonne à 70% (${anneesMax70} ans)`}
          />
        </div>
      </div>

      {hasInput && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
              <p className="text-xs font-medium text-brand-700 uppercase tracking-wider">Pension mensuelle</p>
              <p className="text-2xl font-bold text-brand-800 mt-1 tabular-nums">{formatDH(result.pensionMensuelle)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Pension annuelle</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">{formatDH(result.pensionAnnuelle)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Taux de remplacement</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">{formatPourcentBase100(result.tauxRemplacement)}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Détail du calcul</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Formule</dt>
                <dd className="font-medium">2,5% x {annees} ans x {formatDH(traitement)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Taux de remplacement</dt>
                <dd className="font-medium">{formatPourcentBase100(result.tauxRemplacement)} (max 70%)</dd>
              </div>
              <div>
                <dt className="text-gray-500">Cotisation mensuelle (salarié)</dt>
                <dd className="font-medium">{formatDH(result.cotisationMensuelleSalarie)} (10%)</dd>
              </div>
              <div>
                <dt className="text-gray-500">Cotisation mensuelle (Etat)</dt>
                <dd className="font-medium">{formatDH(result.cotisationMensuellePatronale)} (10%)</dd>
              </div>
            </dl>
          </div>

          {result.tauxRemplacement >= 70 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>Plafond atteint :</strong> Le taux de remplacement est plafonné à 70%.
                Au-delà de {anneesMax70} ans de service, la pension n'augmente plus.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
