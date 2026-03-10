import { useState } from "react";
import AppShell from "../ui/AppShell";
import PageHeader from "../ui/PageHeader";
import FormCard from "../ui/FormCard";

export default function DrugLookup() {
  const [searchTerm, setSearchTerm] = useState("");
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event) {
    event.preventDefault();

    if (!searchTerm.trim()) {
      setError("Please enter a medication name.");
      setDrugs([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

     const query = encodeURIComponent(searchTerm.trim());


     const response = await fetch(
       `http://localhost:3001/api/drugs?search=${query}`
     );
      const data = await response.json();

      if (!response.ok || !data.results) {
        throw new Error("No medication data found.");
      }

      setDrugs(data.results);
    } catch (err) {
      setError("No medication data found for that search.");
      setDrugs([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader title="Drug Lookup" />

      <div className="drug-lookup-page">
        <FormCard>
          <h2 className="section-title">Search Medication</h2>
          <p className="section-subtitle">
            Search medication details using a third-party API.
          </p>

          <form className="drug-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter drug name..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <button type="submit" className="primary-btn">
              Search
            </button>
          </form>

          {loading && <p className="info-text">Loading medication data...</p>}
          {error && <p className="error-text">{error}</p>}
        </FormCard>

        <div className="drug-results-grid">
          {drugs.map((drug, index) => {
            const brandName = drug.openfda?.brand_name?.[0] || "N/A";
            const genericName = drug.openfda?.generic_name?.[0] || "N/A";
            const manufacturer = drug.openfda?.manufacturer_name?.[0] || "N/A";
            const purpose = drug.purpose?.[0] || "Not available";
            const warnings = drug.warnings?.[0] || "Not available";
            const dosage =
              drug.dosage_and_administration?.[0] || "Not available";

            return (
              <FormCard key={index}>
                <div className="drug-card">
                  <h3 className="drug-title">{brandName}</h3>
                  <p><strong>Generic Name:</strong> {genericName}</p>
                  <p><strong>Manufacturer:</strong> {manufacturer}</p>
                  <p><strong>Purpose:</strong> {purpose}</p>
                  <p><strong>Warnings:</strong> {warnings}</p>
                  <p><strong>Dosage:</strong> {dosage}</p>
                </div>
              </FormCard>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}