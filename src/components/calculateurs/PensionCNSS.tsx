import { useState, useMemo } from 'react';
import { calculerPensionCNSS } from '../../lib/cnss-engine';
import { formatDH, formatPourcentBase100, parseNombre, formatEntier } from '../../lib/format';
import { JOURS_MINIMUM_PENSION, PLAFOND_MENSUEL, PENSION_MINIMUM, AGE_RETRAITE } from '../../data/cnss-rates';
import ChampSalaire from '../ui/ChampSalaire';

function BarChart({ pension, salaire }: { pension: number; salaire: number }) {
  if (pension === 0 || salaire === 0) return null;
  const max = Math.max(pension, salaire);
  const pensionWidth = (pension / max) * 100;
  const salaireWidth = (salaire / max) * 100;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Salaire moyen</span>
          <span className="font-medium tabular-nums">{formatDH(salaire)}</span>
        </div>
        <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gray-400 rounded-full" style={{ width: `${salaireWidth}%` }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-brand-700">Pension estimée</span>
          <span className="font-medium text-brand-700 tabular-nums">{formatDH(pension)}</span>
        </div>
        <div className="h-8 bg-brand-50 rounded-full overflow-hidden">
          <div className="h-full bg-brand-600 rounded-full" style={{ width: `${pensionWidth}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function PensionCNSS() {
  const [salaireInput, setSalaireInput] = useState('');
  const [joursInput, setJoursInput] = useState('');
  const [ageInput, setAgeInput] = useState('');

  const salaire = parseNombre(salaireInput);
  const jours = parseNombre(joursInput);
  const age = parseNombre(ageInput);

  const result = useMemo(() => calculerPensionCNSS(salaire, jours), [salaire, jours]);
  const hasInput = salaire > 0 && jours > 0;

  const anneesRestantes = age > 0 ? Math.max(0, AGE_RETRAITE - age) : 0;
  const joursProjection = age > 0 ? jours + anneesRestantes * 12 * 26 : 0;
  const projResult = useMemo(
    () => (joursProjection > 0 ? calculerPensionCNSS(salaire, joursProjection) : null),
    [salaire, joursProjection],
  );

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Simuler votre pension CNSS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChampSalaire
            label="Salaire moyen des 8 dernières années"
            value={salaireInput}
            onChange={setSalaireInput}
            placeholder="6000"
            helper={`Plafonné à ${formatDH(PLAFOND_MENSUEL)} pour le calcul`}
          />
          <ChampSalaire
            label="Nombre total de jours cotisés"
            value={joursInput}
            onChange={setJoursInput}
            placeholder="3240"
            suffix="jours"
            helper={`Minimum ${formatEntier(JOURS_MINIMUM_PENSION)} jours requis`}
          />
          <ChampSalaire
            label="Votre âge actuel (optionnel)"
            value={ageInput}
            onChange={setAgeInput}
            placeholder="45"
            suffix="ans"
            helper="Pour la projection jusqu'à la retraite"
          />
        </div>
      </div>

      {hasInput && (
        <>
          {!result.eligible ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Non éligible à la pension</h3>
              <p className="text-red-700">
                Il vous manque <strong>{formatEntier(result.joursManquants)} jours</strong> de cotisation.
                Le minimum requis est de {formatEntier(JOURS_MINIMUM_PENSION)} jours (environ 15 ans).
              </p>
              {age > 0 && projResult && projResult.eligible && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-red-100">
                  <p className="text-sm text-gray-700">
                    <strong>Projection :</strong> Si vous continuez à cotiser jusqu'à {AGE_RETRAITE} ans,
                    vous cumulerez environ <strong>{formatEntier(joursProjection)} jours</strong> et
                    pourrez prétendre à une pension de <strong>{formatDH(projResult.pensionMensuelle)}/mois</strong>.
                  </p>
                </div>
              )}
            </div>
          ) : (
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pension vs salaire</h3>
                <BarChart pension={result.pensionMensuelle} salaire={Math.min(salaire, PLAFOND_MENSUEL)} />
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Détail du calcul</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500">Salaire moyen (plafonné)</dt>
                    <dd className="font-medium">{formatDH(Math.min(salaire, PLAFOND_MENSUEL))}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Jours cotisés</dt>
                    <dd className="font-medium">{formatEntier(jours)} jours</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Taux de base (3 240 jours)</dt>
                    <dd className="font-medium">50 %</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Tranches supplémentaires (x 216 j.)</dt>
                    <dd className="font-medium">{result.tranchesSupplementaires} (+{result.tranchesSupplementaires} %)</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Taux de remplacement final</dt>
                    <dd className="font-medium">{formatPourcentBase100(result.tauxRemplacement)} (max 70 %)</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Pension minimum</dt>
                    <dd className="font-medium">{formatDH(PENSION_MINIMUM)}</dd>
                  </div>
                </dl>
              </div>

              {age > 0 && projResult && (
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-brand-800 mb-2">Projection à {AGE_RETRAITE} ans</h3>
                  <p className="text-brand-700 text-sm">
                    En continuant à cotiser {anneesRestantes} ans supplémentaires, vous cumulerez environ{' '}
                    <strong>{formatEntier(joursProjection)} jours</strong>. Votre pension estimée serait de{' '}
                    <strong>{formatDH(projResult.pensionMensuelle)}/mois</strong> (taux : {formatPourcentBase100(projResult.tauxRemplacement)}).
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
