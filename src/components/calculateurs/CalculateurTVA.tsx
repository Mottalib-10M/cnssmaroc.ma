import { useState, useMemo } from 'react';
import { calculerTVA, calculerTVAInverse } from '../../lib/cnss-engine';
import { formatDH, parseNombre } from '../../lib/format';
import { TAUX_TVA } from '../../data/tva-rates';
import ChampSalaire from '../ui/ChampSalaire';

export default function CalculateurTVA() {
  const [montantInput, setMontantInput] = useState('');
  const [taux, setTaux] = useState(0.20);
  const [direction, setDirection] = useState<'ht-ttc' | 'ttc-ht'>('ht-ttc');

  const montant = parseNombre(montantInput);

  const result = useMemo(() => {
    if (montant <= 0) return null;
    return direction === 'ht-ttc'
      ? calculerTVA(montant, taux)
      : calculerTVAInverse(montant, taux);
  }, [montant, taux, direction]);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Calculateur TVA Maroc</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <ChampSalaire
            label={direction === 'ht-ttc' ? 'Montant HT' : 'Montant TTC'}
            value={montantInput}
            onChange={setMontantInput}
            placeholder="1000"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taux de TVA</label>
            <select
              value={taux}
              onChange={(e) => setTaux(parseFloat(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            >
              {TAUX_TVA.filter((t) => t.taux > 0).map((t) => (
                <option key={t.taux} value={t.taux}>
                  {t.label} - {t.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDirection('ht-ttc')}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border transition-all ${
                  direction === 'ht-ttc'
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                HT &rarr; TTC
              </button>
              <button
                type="button"
                onClick={() => setDirection('ttc-ht')}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border transition-all ${
                  direction === 'ttc-ht'
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                TTC &rarr; HT
              </button>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Montant HT</p>
            <p className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">{formatDH(result.montantHT)}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wider">TVA ({(taux * 100).toFixed(0)}%)</p>
            <p className="text-2xl font-bold text-amber-800 mt-1 tabular-nums">{formatDH(result.montantTVA)}</p>
          </div>
          <div className="bg-brand-50 rounded-xl p-5 border border-brand-100">
            <p className="text-xs font-medium text-brand-700 uppercase tracking-wider">Montant TTC</p>
            <p className="text-2xl font-bold text-brand-800 mt-1 tabular-nums">{formatDH(result.montantTTC)}</p>
          </div>
        </div>
      )}

      {/* Reference table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Taux de TVA au Maroc</h3>
        <div className="space-y-4">
          {TAUX_TVA.map((t) => (
            <div key={t.taux} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                  {t.label}
                </span>
                <span className="text-sm font-medium text-gray-700">{t.description}</span>
              </div>
              <p className="text-sm text-gray-500">{t.exemples.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
