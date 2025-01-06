import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_COUNTRIES } from "../lib/queries";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Modal } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ContinentChart = () => {
  const { data, loading, error } = useQuery(GET_COUNTRIES);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // console.log("contients", data);

  const [selectedContinent, setSelectedContinent] = useState<string | null>(
    null
  );
  const [selectedContinentPie, setSelectedContinentPie] = useState<{
    name: string;
    countries: string[];
  } | null>(null);
  const [barColor, setBarColor] = useState("rgba(75, 192, 192, 0.6)");
  const [pieColors, setPieColors] = useState([
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(238, 17, 17, 0.6)",
    "rgba(53, 253, 13, 0.6)",
  ]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const continents = [
    ...new Set(data.countries.map((c: any) => c.continent.name)),
  ];
  const filteredData = selectedContinent
    ? data.countries.filter((c: any) => c.continent.name === selectedContinent)
    : data.countries;

  const barChartData = {
    labels: filteredData.map((c: any) => `${c.name} (${c.code})`),
    datasets: [
      {
        label: "Number of Languages",
        data: filteredData.map((c: any) => c?.languages.length),
        backgroundColor: barColor,
      },
    ],
  };
  const barChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const country = filteredData[tooltipItem.dataIndex];
            const languages = country.languages
              .map((lang: any) => lang.name)
              .join(", ");
            return `${tooltipItem.raw} languages , Languages:${languages}`;
            // return `${country.name} \nLanguages: ${languages}`;
          },
        },
      },
    },
  };
  const pieChartData = {
    labels: continents,
    datasets: [
      {
        label: "Countries per Continent",
        data: (continents as string[]).map(
          (cont: string) =>
            data.countries.filter((c: any) => c?.continent?.name === cont)
              .length
        ),
        backgroundColor: pieColors,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const continent = tooltipItem.label;
            const countriesInContinent = data.countries.filter(
              (c: any) => c.continent.name === continent
            );
            const countryNames = countriesInContinent
              .map((c: any) => c.name)
              .join(", ");
            return `Countries per Continent : ${countriesInContinent.length}. Click to see details.`;
          },
        },
      },
    },
    onClick: (e: any, elements: any[]) => {
      if (elements.length > 0) {
        const chartElement = elements[0];
        const index = chartElement.index;
        const continentName = (pieChartData.labels as string[])[index];
        const countriesInContinent = data.countries.filter(
          (c: any) => c.continent.name === continentName
        );
        const countryNames = countriesInContinent.map((c: any) => c.name);

        setSelectedContinentPie({
          name: continentName,
          countries: countryNames,
        });
        setIsModalVisible(true);
      }
    },
  };
  const handlePieColorChange = (index: number, newColor: string) => {
    const updatedColors = [...pieColors];
    updatedColors[index] = newColor;
    setPieColors(updatedColors);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Continent Data Visualization</h1>

      <select
        onChange={(e) => setSelectedContinent(e.target.value || null)}
        className="p-2 border rounded mb-4"
      >
        <option value="">All Continents</option>
        {(continents as string[]).map((cont) => (
          <option key={cont} value={cont}>
            {cont}
          </option>
        ))}
      </select>

      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Customize Colors</h2>
        <div className="flex items-center space-x-4 mb-4">
          <label className="font-medium">Bar Color:</label>
          <input
            type="color"
            value={barColor}
            onChange={(e) => setBarColor(e.target.value)}
            className="w-10 h-10"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Number of Languages</h2>
        <Bar options={barChartOptions} data={barChartData} />
      </div>
      <div>
        <h3 className="font-medium mb-2">Pie Chart Colors:</h3>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {(continents as string[]).map((cont, index) => (
            <div key={cont} className="flex items-center space-x-2">
              <label className="text-sm font-medium">{cont}:</label>
              <input
                type="color"
                value={pieColors[index]}
                onChange={(e) => handlePieColorChange(index, e.target.value)}
                className="w-10 h-10"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <div>
          <h2 className="text-lg font-bold mb-2">Countries per Continent</h2>
        </div>
        <div className="flex justify-center items-center w-full h-full">
          <div className="w-[50%] ">
            <Pie options={pieChartOptions} data={pieChartData} />
          </div>
          <Modal
            title={`Details for ${selectedContinentPie?.name}`}
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            {selectedContinentPie && (
              <>
                <p>
                  <strong>Number of Countries:</strong>{" "}
                  {selectedContinentPie?.countries?.length}
                </p>
                <p>
                  <strong>Countries:</strong>
                </p>
                <ul style={{ maxHeight: "500px", overflowY: "auto" }}>
                  {selectedContinentPie?.countries?.map((country, index) => (
                    <li key={index}>{country}</li>
                  ))}
                </ul>
              </>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ContinentChart;
