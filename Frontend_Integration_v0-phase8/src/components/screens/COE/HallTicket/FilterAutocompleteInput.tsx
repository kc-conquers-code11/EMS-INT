import React, { useMemo, useState, useRef, useEffect } from 'react';

interface FilterAutocompleteInputProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
}

/** Match option when every whitespace-separated word appears in the label (case-insensitive). */
const matchesAllWords = (label: string, query: string) => {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = label.toLowerCase();
  return words.every((word) => hay.includes(word));
};

export const FilterAutocompleteInput: React.FC<FilterAutocompleteInputProps> = ({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(
    () => options.filter((opt) => matchesAllWords(opt, value)),
    [options, value]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-[6px]" ref={wrapperRef}>
      <label htmlFor={id} className="text-[14px] font-medium text-[#344054] leading-[20px]">
        {label}
      </label>
      <div className="relative">
        <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
          <div className="flex-1 px-[14px] py-[10px]">
            <input
              id={id}
              type="text"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              autoComplete="off"
              className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none font-['Instrument_Sans']"
            />
          </div>
        </div>
        {open && value.trim() && filteredOptions.length > 0 && (
          <ul
            className="absolute z-20 mt-1 w-full max-h-[200px] overflow-y-auto bg-white border border-[#d0d5dd] rounded-[8px] shadow-lg"
            role="listbox"
          >
            {filteredOptions.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  className="w-full text-left px-[14px] py-[10px] text-[15px] text-[#344054] hover:bg-[#f2f3fd] font-['Instrument_Sans']"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
