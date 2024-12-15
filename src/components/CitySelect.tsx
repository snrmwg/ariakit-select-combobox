import React, { startTransition, useState } from 'react';
import * as Ariakit from '@ariakit/react';
import { type City, type CityOption } from '../types/city';

interface CitySelectProps {
  cities: City[];
  value?: City | null;
  onChange?: (city: City | null) => void;
  placeholder?: string;
}

export function CitySelect({
  cities,
  value,
  onChange,
  placeholder = 'Stadt wählen...',
}: CitySelectProps) {
  const [searchValue, setSearchValue] = useState('');
  const deferredFilter = React.useDeferredValue(searchValue);

  // Convert cities to options format
  const options: CityOption[] = cities.map((city) => ({
    label: city.name,
    value: city,
  }));

  // Filter options based on search
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(deferredFilter.toLowerCase())
  );

  // Initialize select store with complex value handling
  const select = Ariakit.useSelectStore({
    value: value?.name ?? '',
    setValue: (newValue) => {
      const selectedCity = cities.find((city) => city.name === newValue);
      onChange?.(selectedCity ?? null);
    },
  });

  const handleSelectKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete') {
      select.setValue('');
      onChange?.(null);
    }
  };

  const clearSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    select.setValue('');
    onChange?.(null);
  };

  const currentValue = Ariakit.useStoreState(select, 'value');

  return (
    <div className="w-full">
      <Ariakit.ComboboxProvider
        resetValueOnHide
        setValue={(value) => {
          startTransition(() => setSearchValue(value));
        }}
      >
        <Ariakit.SelectProvider store={select}>
          <Ariakit.SelectLabel className="block text-sm font-medium text-gray-700 mb-1">
            Stadt
          </Ariakit.SelectLabel>

          <Ariakit.Select
            className="w-full px-3 h-10 bg-white rounded border border-gray-300 flex items-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            onKeyDown={handleSelectKeydown}
          >
            <div className="grow text-left truncate">
              {currentValue || placeholder}
            </div>
            {currentValue && (
              <span onClick={clearSelect} className="p-1">
                ×
              </span>
            )}
            <Ariakit.SelectArrow />
          </Ariakit.Select>

          <Ariakit.SelectPopover
            gutter={8}
            sameWidth
            className="bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
              <Ariakit.Combobox
                autoSelect
                placeholder="Search cities..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <Ariakit.ComboboxList className="py-2">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">Keine Treffer</div>
              ) : (
                filteredOptions.map((option) => (
                  <Ariakit.SelectItem
                    key={option.value.id}
                    value={option.value.name}
                    className="px-4 py-2 cursor-pointer data-[active-item]:bg-amber-400"
                    render={<Ariakit.ComboboxItem />}
                  />
                ))
              )}
            </Ariakit.ComboboxList>
          </Ariakit.SelectPopover>
        </Ariakit.SelectProvider>
      </Ariakit.ComboboxProvider>
    </div>
  );
}
