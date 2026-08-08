import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Check } from 'lucide-react';

export const rwandaAddressSuggestions = [
  'KG 7 Ave, Kacyiru, Kigali',
  'KN 5 Rd, City Center, Nyarugenge, Kigali',
  'Kigali Heights & KBC, Kimihurura, Kigali',
  'Kigali Convention Centre, Kimihurura, Kigali',
  'KG 11 Ave, Kimironko Market Area, Kigali',
  'KK 18 Ave, Kanombe, Kicukiro, Kigali',
  'Kigali International Airport, Kanombe, Kigali',
  'Remera Taxi Park & Amahoro Stadium, Kigali',
  'Nyabugogo Bus Park, Nyarugenge, Kigali',
  'CHUK Hospital Area, Nyarugenge, Kigali',
  'King Faisal Hospital, Kacyiru, Kigali',
  'Nyamirambo Green Mosque Area, Kigali',
  'Gikondo Expo Ground, Kicukiro, Kigali',
  'Rebero Mount Area, Kicukiro, Kigali',
  'Kabuga Town Center, Kicukiro, Kigali',
  'Gatsata Industrial Zone, Gasabo, Kigali',
  'Jabana Area, Gasabo, Kigali',
  'Rubavu / Gisenyi Town Center & Lake Kivu Beach',
  'Musanze / Ruhengeri Town Center',
  'Huye / Butare University Town Center',
  'Rwamagana Town Center, Eastern Province',
  'Kayonza Junction & Park Gate Area',
  'Muhanga / Gitarama Town Center',
  'Karongi / Kibuye Town & Lake Kivu Resort Area',
];

const AddressAutocompleteInput = ({
  value,
  onChange,
  name = 'address',
  placeholder = 'Start typing address (e.g. Kacyiru, Kimironko, Nyarugenge...)',
  className = '',
  required = false,
}) => {
  const [query, setQuery] = useState(value || '');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Filter suggestions as user types
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onChange) {
      onChange(e);
    }

    if (val.trim().length > 0) {
      const matches = rwandaAddressSuggestions.filter((item) =>
        item.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredSuggestions(matches);
      setIsOpen(true);
    } else {
      setFilteredSuggestions(rwandaAddressSuggestions.slice(0, 6));
      setIsOpen(true);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion);
    setIsOpen(false);
    if (onChange) {
      onChange({ target: { name, value: suggestion } });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          name={name}
          value={query}
          onFocus={() => {
            const matches = query.trim()
              ? rwandaAddressSuggestions.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
              : rwandaAddressSuggestions.slice(0, 6);
            setFilteredSuggestions(matches);
            setIsOpen(true);
          }}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600 transition-colors ${className}`}
        />
      </div>

      {/* Interactive Autocomplete Suggestions Dropdown */}
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-fadeIn">
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            Suggested Kigali & Rwanda Locations
          </div>
          {filteredSuggestions.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectSuggestion(item)}
              className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-xs text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center space-x-2 truncate pr-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate group-hover:font-bold">{item}</span>
              </div>
              {query === item && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocompleteInput;
