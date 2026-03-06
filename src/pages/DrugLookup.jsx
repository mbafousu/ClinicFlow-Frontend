import { useState } from "react";

export default function DrugLookup() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchDrug = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResults([]);

    try {
      const query = encodeURIComponent(`openfda.brand_name:${term}`);
      const url = `https://api.fda.gov/drug/label.json?search=${query}&limit=5`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Failed to fetch drug data");
      }

      setResults(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Drug Lookup</h1>

      <form className="card" onSubmit={searchDrug}>
        <label>Search medication name</label>
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Tylenol"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {results.map((drug, index) => (
          <div className="card" key={index}>
            <h3>{drug.openfda?.brand_name?.[0] || "Unknown Brand"}</h3>
            <p>
              <b>Generic:</b> {drug.openfda?.generic_name?.[0] || "N/A"}
            </p>
            <p>
              <b>Manufacturer:</b>{" "}
              {drug.openfda?.manufacturer_name?.[0] || "N/A"}
            </p>
            <p>
              <b>Purpose:</b> {drug.purpose?.[0] || "N/A"}
            </p>
            <p>
              <b>Warnings:</b> {drug.warnings?.[0]?.slice(0, 150) || "N/A"}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}