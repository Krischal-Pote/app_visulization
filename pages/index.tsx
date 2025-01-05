import { ApolloProvider } from "@apollo/client";
import client from "../lib/apolloClient";
import CountriesList from "../components/CountriesList";
import ContinentChart from "../components/ContinentChart";

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <div className="p-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Countries Dashboard</h1>

        <div className="mb-10">
          <ContinentChart />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">List of Countries</h2>
          <CountriesList />
        </div>
      </div>
    </ApolloProvider>
  );
}
