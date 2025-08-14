import "./ProductsFilter.css";

function ProductsFilter({ setCategory, setSort, setSearchTerm }) {
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="pf-maincon">
      <div className="filter-controls-main-container">
        {/* Category Filter */}
        <div className="filter-con filter-con1">
          <label
            className="cat-label-category category-label"
            htmlFor="category"
          >
            <i className="m-2 fa-solid fa-filter"></i>
            FILTER CATEGORY
          </label>
          <select
            className="category-options shows"
            name="category"
            id="category"
            onChange={handleCategoryChange}
          >
            <option value="ALL">ALL</option>
            <option value="Coffee">COFFEE</option>
            <option value="Brewing Gear">BREWING GEAR</option>
            <option value="Accessories">ACCESSORIES</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div className="filter-con filter-con2">
          <label className="cat-label-category category-label2" htmlFor="sort">
            <i className="m-2 fa-solid fa-sort"></i> SORT BY
          </label>
          <select
            className="category-options shows"
            name="sort"
            id="sort"
            onChange={handleSortChange}
          >
            <option value="">-- Select --</option>
            <option value="name">SORT BY NAME</option>
            <option value="price-low">SORT BY PRICE: LOW - HIGH</option>
            <option value="price-high">SORT BY PRICE: HIGH - LOW</option>
          </select>
        </div>

        {/* Live Search */}
        <div className="search-con">
          <input
            type="search"
            placeholder="Search a product..."
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductsFilter;
