export default function SearchBar({ placeholder, value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button type="button">Search</button>
    </div>
  );
}