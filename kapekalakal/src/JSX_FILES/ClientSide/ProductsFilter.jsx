import "./ProductsFilter.css";

function ProductsFilter() {
  return (
    <>
      {" "}
      <div className="pf-maincon">
        <div className="filter-controls-main-container">
          <div className="filter-con filter-con1">
            <label className="cat-label-category category-label" for="cars">
              <i className="m-2 fa-solid fa-filter"></i>
              FILTER CATEGORY
            </label>
            <select className="category-options shows" name="cars" id="cars">
              <option className="cat-option car-option-1" value="Coffee Beans">
                COFFEE BEANS
              </option>
              <option className="cat-option car-option-2" value="Equipment">
                EQUIPMENT
              </option>
              <option className="cat-option car-option-3" value="accesories">
                ACCESORIES
              </option>
              <option className="cat-option car-option-4" value="Tools">
                TOOLS
              </option>
              <option className="cat-option car-option-5" value="Drinkware">
                DRINKWARE
              </option>
            </select>
          </div>

          <div className="filter-con filter-con2">
            <label className="cat-label-category category-label2" for="cars">
              <i class="m-2 fa-solid fa-sort"></i> SORT BY
            </label>
            <select className="category-options shows" name="cars" id="cars">
              <option className="car-option car-option-1" value="Coffee Beans">
                SORT BY NAME
              </option>
              <option className="cat-option car-option-3" value="accesories">
                SORT BY PRICE: LOW - HIGH
              </option>
              <option className="cat-option car-option-4" value="Tools">
                SORT BY PRICE: HIGH - LOW
              </option>
            </select>
          </div>

          <div className="price-filter-con filter-con3">
            <label className="cat-label-category category-label3" for="cars">
              <i className="m-2 fa-solid fa-filter"></i>
              PRICE FILTER
            </label>

            <div className="pf-container">
              <div className="pf1 pf">
                <input
                  className="price-filter price-filter-from text-input"
                  type="number"
                  placeholder="FROM"
                />
              </div>

              <div className="pf2 pf">
                <input
                  className="price-filter price-filter-from text-input"
                  type="number"
                  placeholder="TO"
                />
              </div>
            </div>
          </div>

          <div className="search-con">
            <input type="search" name="" id="" placeholder="Search a product" />
          </div>
        </div>
      </div>{" "}
    </>
  );
}

export default ProductsFilter;

<div className="search-con">
  <input type="search" name="" id="" placeholder="Search a product" />
</div>;
