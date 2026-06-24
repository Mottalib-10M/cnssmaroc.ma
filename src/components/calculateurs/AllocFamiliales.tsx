import { useMemo } from 'react';
import { calculerAllocFamiliales } from '../../lib/cnss-engine';
import { formatDH } from '../../lib/format';
import { ALLOC_ENFANT_1_3, ALLOC_ENFANT_4_6, MAX_ENFANTS } from '../../data/cnss-rates';
import ShareButtons from '../ui/ShareButtons';
import { useUrlNumber, getCurrentUrl } from '../../hooks/useUrlState';

export default function AllocFamiliales() {
  const [nbEnfants, setNbEnfants] = useUrlNumber('enfants', 1);

  const montantMensuel = useMemo(() => calculerAllocFamiliales(nbEnfants), [nbEnfants]);
  const montantAnnuel = montantMensuel * 12;

  const shareText = nbEnfants > 0
    ? `Mes allocations familiales CNSS pour ${nbEnfants} enfant${nbEnfants > 1 ? 's' : ''} : ${formatDH(montantMensuel)}/mois. Calculez les vôtres :`
    : '';

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Calculer vos allocations familiales</h2>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre d'enfants à charge
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setNbEnfants(Math.max(0, nbEnfants - 1))}
              className="w-12 h-12 rounded-lg border border-gray-300 text-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
              aria-label="Moins"
            >
              -
            </button>
            <span className="text-4xl font-bold text-brand-700 w-12 text-center tabular-nums">
              {nbEnfants}
            </span>
            <button
              type="button"
              onClick={() => setNbEnfants(Math.min(MAX_ENFANTS, nbEnfants + 1))}
              className="w-12 h-12 rounded-lg border border-gray-300 text-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
              aria-label="Plus"
            >
              +
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">Maximum {MAX_ENFANTS} enfants pris en charge</p>
        </div>
      </div>

      {nbEnfants > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-brand-50 rounded-xl p-5 border border-brand-100">
              <p className="text-xs font-medium text-brand-700 uppercase tracking-wider">Allocation mensuelle</p>
              <p className="text-3xl font-bold text-brand-800 mt-1 tabular-nums">{formatDH(montantMensuel)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Allocation annuelle</p>
              <p className="text-3xl font-bold text-gray-900 mt-1 tabular-nums">{formatDH(montantAnnuel)}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Détail par enfant</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-600">Enfant</th>
                    <th className="text-right py-2 font-medium text-gray-600">Montant/mois</th>
                    <th className="text-right py-2 font-medium text-gray-600">Montant/an</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: nbEnfants }, (_, i) => {
                    const rang = i + 1;
                    const montant = rang <= 3 ? ALLOC_ENFANT_1_3 : ALLOC_ENFANT_4_6;
                    return (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2">
                          {rang}<sup>e</sup> enfant
                          {rang <= 3 && <span className="ml-2 text-xs text-brand-600">(tranche 1-3)</span>}
                          {rang > 3 && <span className="ml-2 text-xs text-amber-600">(tranche 4-6)</span>}
                        </td>
                        <td className="text-right py-2 tabular-nums">{formatDH(montant)}</td>
                        <td className="text-right py-2 tabular-nums">{formatDH(montant * 12)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td className="py-2 font-semibold">Total</td>
                    <td className="text-right py-2 font-bold tabular-nums">{formatDH(montantMensuel)}</td>
                    <td className="text-right py-2 font-bold tabular-nums">{formatDH(montantAnnuel)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Share buttons */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <ShareButtons text={shareText} url={getCurrentUrl()} />
          </div>
        </>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Barème des allocations familiales CNSS</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li><strong>{ALLOC_ENFANT_1_3} DH/mois</strong> pour chacun des 3 premiers enfants</li>
          <li><strong>{ALLOC_ENFANT_4_6} DH/mois</strong> pour chacun des 3 suivants (4e, 5e, 6e)</li>
          <li>Maximum {MAX_ENFANTS} enfants ouvrent droit aux allocations</li>
        </ul>
      </div>
    </div>
  );
}
