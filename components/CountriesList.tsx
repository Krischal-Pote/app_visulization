import { useQuery } from "@apollo/client";
import { GET_COUNTRIES } from "../lib/queries";
import { useState } from "react";

const CountriesList = () => {
  const { data, loading, error } = useQuery(GET_COUNTRIES);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredCountries = selectedLetter
    ? data.countries.filter((country: any) =>
        country.name.toUpperCase().startsWith(selectedLetter)
      )
    : data.countries;

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div>
      <div className="mb-4">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className="px-2 py-1 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {letter}
          </button>
        ))}
        <button
          onClick={() => setSelectedLetter(null)}
          className="px-2 py-1 mx-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          All
        </button>
      </div>

      {/* Countries List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredCountries.map((country: any) => (
          <div key={country.code} className="p-4 border rounded shadow">
            <h3 className="text-lg font-bold">{country.name}</h3>
            <p>Continent: {country.continent.name}</p>
            <p>
              Languages:{" "}
              {country.languages.map((lang: any) => lang.name).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountriesList;
