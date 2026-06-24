import { useMemo } from 'react';
import { calculerCotisationsCNSS, type LigneCotisation } from '../../lib/cnss-engine';
import { formatDH, formatPourcent, parseNombre } from '../../lib/format';
import ChampSalaire from '../ui/ChampSalaire';
import ShareButtons from '../ui/ShareButtons';
import { useUrlState, getCurrentUrl } from '../../hooks/useUrlState';

function LignesTable({ titre, lignes, total, color }: { titre: string; lignes: LigneCotisation[]; total: number; color: string }) {
  return (
    <div>
      <h3 className={`text-lg font-semibold mb-3 ${color}`}>{titre}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 pr-2 font-medium text-gray-600">Cotisation</th>
              <th className="text-right py-2 px-2 font-medium text-gray-600">Taux</th>
              <th className="text-right py-2 px-2 font-medium text-gray-600">Assiette</th>
              <th className="text-right py-2 pl-2 font-medium text-gray-600">Montant</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2 pr-2">
                  {l.label}
                  {l.plafonne && (
                    <span className="ml-1 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">plafonné</span>
                  )}
                </td>
                <td className="text-right py-2 px-2 tabular-nums">{formatPourcent(l.taux)}</td>
                <td className="text-right py-2 px-2 tabular-nums">{formatDH(l.assiette)}</td>
                <td className="text-right py-2 pl-2 tabular-nums font-medium">{formatDH(l.montant)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300">
              <td colSpan={3} className="py-2 pr-2 font-semibold">Total</td>
              <td className="text-right py-2 pl-2 font-bold tabular-nums">{formatDH(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function PieChart({ salarie, employeur }: { salarie: number; employeur: number }) {
  const total = salarie + employeur;
  if (total === 0) return null;
  const salarieAngle = (salarie / total) * 360;
  const salariePercent = ((salarie / total) * 100).toFixed(1);
  const employeurPercent = ((employeur / total) * 100).toFixed(1);

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-32 h-32" aria-hidden="true">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#d1fae5" strokeWidth="10" />
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke="#059669"
          strokeWidth="10"
          strokeDasharray={`${(salarieAngle / 360) * 283} 283`}
          strokeDashoffset="0"
          transform="rotate(-90 50 50)"
        />
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke="#065f46"
          strokeWidth="10"
          strokeDasharray={`${((360 - salarieAngle) / 360) * 283} 283`}
          strokeDashoffset={`${-((salarieAngle / 360) * 283)}`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="text-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-brand-600 inline-block" />
          <span>Salarié : {salariePercent}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-brand-800 inline-block" />
          <span>Employeur : {employeurPercent}%</span>
        </div>
      </div>
    </div>
  );
}

export default function CotisationsCNSS() {
  const [salaireInput, setSalaireInput] = useUrlState('salaire', '');
  const brut = parseNombre(salaireInput);
  const result = useMemo(() => calculerCotisationsCNSS(brut), [brut]);
  const hasResult = brut > 0;

  const shareText = hasResult
    ? `Mes cotisations CNSS pour ${formatDH(brut)} : ${formatDH(result.salarie.total)}/mois (salarié). Calculez les vôtres :`
    : '';

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Calculer vos cotisations CNSS</h2>
        <div className="max-w-md">
          <ChampSalaire
            label="Salaire brut mensuel"
            value={salaireInput}
            onChange={setSalaireInput}
            placeholder="8000"
            helper="Entrez votre salaire brut mensuel en dirhams"
          />
        </div>
      </div>

      {hasResult && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
              <p className="text-xs font-medium text-brand-700 uppercase tracking-wider">Net avant IR</p>
              <p className="text-2xl font-bold text-brand-800 mt-1 tabular-nums">{formatDH(result.netAvantIR)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Part salarié</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">{formatDH(result.salarie.total)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Part employeur</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">{formatDH(result.employeur.total)}</p>
            </div>
            <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
              <p className="text-xs font-medium text-brand-700 uppercase tracking-wider">Coût employeur</p>
              <p className="text-2xl font-bold text-brand-800 mt-1 tabular-nums">{formatDH(result.coutEmployeur)}</p>
            </div>
          </div>

          {/* Pie chart */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des cotisations</h3>
            <PieChart salarie={result.salarie.total} employeur={result.employeur.total} />
            <p className="mt-3 text-sm text-gray-500">
              Total des cotisations : <strong>{formatDH(result.totalCotisations)}</strong> soit{' '}
              <strong>{((result.totalCotisations / brut) * 100).toFixed(2)} %</strong> du salaire brut
            </p>
          </div>

          {/* Detail tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <LignesTable
                titre="Part salarié (employé)"
                lignes={result.salarie.lignes}
                total={result.salarie.total}
                color="text-brand-700"
              />
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <LignesTable
                titre="Part employeur (patronale)"
                lignes={result.employeur.lignes}
                total={result.employeur.total}
                color="text-brand-800"
              />
            </div>
          </div>

          {/* Plafond note */}
          {brut > 6000 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>Note sur le plafond :</strong> Votre salaire de {formatDH(brut)} dépasse le plafond CNSS de 6 000 DH.
                Les cotisations plafonnées (prestations sociales et retraite) sont calculées sur une assiette de 6 000 DH.
                Seules l'AMO, les allocations familiales et la taxe de formation professionnelle sont calculées sur le salaire réel.
              </p>
            </div>
          )}

          {/* Share buttons */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <ShareButtons text={shareText} url={getCurrentUrl()} />
          </div>
        </>
      )}
    </div>
  );
}
