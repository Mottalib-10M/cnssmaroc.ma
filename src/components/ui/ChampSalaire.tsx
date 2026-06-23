import { useId } from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  suffix?: string;
  helper?: string;
  min?: number;
  max?: number;
}

export default function ChampSalaire({
  label,
  value,
  onChange,
  placeholder = '0',
  suffix = 'DH',
  helper,
  min,
  max,
}: Props) {
  const id = useId();

  function handleChange(raw: string) {
    const cleaned = raw.replace(/[^0-9.,]/g, '').replace(',', '.');
    onChange(cleaned);
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-14 text-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
          autoComplete="off"
          min={min}
          max={max}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
          {suffix}
        </span>
      </div>
      {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
    </div>
  );
}
