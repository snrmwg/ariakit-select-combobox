import React, { type MouseEvent, startTransition, useState } from 'react';
import * as Ariakit from '@ariakit/react';
import { CitySelect } from './components/CitySelect';
import { City } from './types/city';

const mockCityData = [
  { id: 1, name: 'Berlin' },
  { id: 2, name: 'Hamburg' },
  { id: 3, name: 'München' },
];

function App() {
  const [value, setValue] = useState('');
  const deferredFilter = React.useDeferredValue(value);

  const cityQuery = {
    isLoading: false,
    error: null,
    data: mockCityData.filter((city) =>
      city.name.toLowerCase().includes(deferredFilter.toLowerCase())
    ),
  };

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const select = Ariakit.useSelectStore({
    defaultValue: '',
  });

  const clearSelect = (e: MouseEvent) => {
    e.preventDefault();
    select.setValue('');
    setSelectedItem(null);
  };

  const a = Ariakit.useStoreState(select, 'value');

  const clickedItem = (item: any) => {
    console.log('clickedItem', item);
    setSelectedItem(item);
  };

  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  return (
    <div className="space-y-8">
      <div className="max-w-lg">
        <h2 className="p-2 bg-teal-200 text-xl font-bold">
          Ariakit Select+Combobox
        </h2>

        <div className='p-4 border-green-600 border-2'>
          <CitySelect
            cities={mockCityData}
            value={selectedCity}
            onChange={setSelectedCity}
          />

          <pre className="mt-4 bg-teal-100 p-4 rounded">
            Selected: {JSON.stringify(selectedCity, null, 2)}
          </pre>

          <div className="mt-4">
            <Ariakit.Button
              onClick={() => {
                setSelectedCity(mockCityData[0]);
              }}
            >
              wähle Berlin
            </Ariakit.Button>
          </div>
        </div>

        <Ariakit.ComboboxProvider
          resetValueOnHide
          setValue={(value) => {
            startTransition(() => setValue(value));
          }}
        >
          <Ariakit.SelectProvider store={select}>
            <Ariakit.SelectLabel>Stadt:</Ariakit.SelectLabel>
            <Ariakit.Select className="w-full px-2 h-8 bg-white rounded border flex items-center">
              <div className="grow text-left">{a}</div>
              {a && (
                <Ariakit.Button onClick={clearSelect} className="p-1 mr-2">
                  x
                </Ariakit.Button>
              )}
              <Ariakit.SelectArrow />
            </Ariakit.Select>

            <Ariakit.SelectPopover gutter={8} sameWidth className="popover">
              <div className="combobox-wrapper">
                <Ariakit.Combobox
                  autoSelect
                  placeholder="Suchen..."
                  className="combobox w-full"
                />
              </div>
              <Ariakit.ComboboxList>
                {cityQuery.isLoading && <div>Lade...</div>}
                {cityQuery.error && (
                  <div>Fehler: {cityQuery.error.message}</div>
                )}
                {cityQuery.data?.length ? (
                  cityQuery.data.map((item) => (
                    <Ariakit.SelectItem
                      key={item.id}
                      value={item.name}
                      className="combobox-item"
                      render={<Ariakit.ComboboxItem />}
                      onClick={() => clickedItem(item)}
                    />
                  ))
                ) : (
                  <div>Kein Treffer</div>
                )}
              </Ariakit.ComboboxList>
            </Ariakit.SelectPopover>
          </Ariakit.SelectProvider>
        </Ariakit.ComboboxProvider>

        <pre className="bg-teal-300 p-4 rounded">
          value= {JSON.stringify(selectedItem)}
        </pre>
        <div>
          <Ariakit.Button
            onClick={() => {
              setSelectedItem({ id: 42, name: 'Berlin' });
              select.setValue('Berlin');
            }}
          >
            wähle Berlin
          </Ariakit.Button>
        </div>
      </div>
    </div>
  );
}

export default App;
