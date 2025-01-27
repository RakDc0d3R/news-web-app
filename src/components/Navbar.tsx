import { useRef } from "react";
import { useDispatch } from "react-redux";
import { setCategory, setFromDate, setSearchKeyword, setToDate } from "../redux/newSlice";

const Navbar = () => {
  const debounceTimeout = useRef<number | null>(null);
  const dispatch = useDispatch();

  const handleSearch = (searchKeyword?: string) => {
    if (debounceTimeout.current !== null) {
      window.clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = window.setTimeout(() => {
      dispatch(setSearchKeyword(searchKeyword));
    }, 1000);
  };

  const handleCategoryChange = (category?: string) => {
    dispatch(setCategory(category));
  };

  const handleFromDateChange = (fromDate?: string) => {
    dispatch(setFromDate(fromDate));
  };

  const handleToDateChange = (toDate?: string) => {
    dispatch(setToDate(toDate));
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          News 5
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end"
          tabIndex={-1}
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              News 5
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body align-items-lg-center justify-content-lg-end d-flex flex-column flex-lg-row gap-4">
            <div className="form-floating w-100">
              <select
                className="form-select text-capitalize"
                aria-label="Small select example"
                onChange={(event: any) =>
                  handleCategoryChange(event?.target?.value)
                }
                id="selectCategory"
              >
                {[
                  "all categories",
                  "business",
                  "entertainment",
                  "health",
                  "science",
                  "sports",
                  "technology",
                ].map((category) => (
                  <option
                    key={category}
                    value={category}
                    defaultValue={"all categories"}
                  >
                    {category}
                  </option>
                ))}
              </select>
              <label htmlFor="selectCategory">Select category</label>
            </div>
            <div className="form-floating w-100">
              <select
                className="form-select text-capitalize"
                aria-label="Small select example"
                // onChange={(event: any) =>
                //   handleCategoryChange(event?.target?.value)
                // }
                id="selectSource"
              >
                {["all sources"].map((source) => (
                  <option
                    key={source}
                    value={source}
                    defaultValue={"all sources"}
                  >
                    {source}
                  </option>
                ))}
              </select>
              <label htmlFor="selectCategory">Select source</label>
            </div>
            <div className="form-floating w-100">
              <input
                type="date"
                id="fromDate"
                className="form-control"
                placeholder="Start Date"
                onChange={(event: any) =>
                  handleFromDateChange(event?.target?.value)
                }
              />
              <label htmlFor="fromDate">From date</label>
            </div>
            <div className="form-floating w-100">
              <input
                type="date"
                id="toDate"
                className="form-control"
                placeholder="Start Date"
                onChange={(event: any) =>
                  handleToDateChange(event?.target?.value)
                }
              />
              <label htmlFor="toDate">To date</label>
            </div>
            <div className="form-floating w-100">
              <input
                className="form-control me-2"
                id="inputSearch"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={(event) => {
                  handleSearch(event?.target?.value);
                }}
              />
              <label htmlFor="inputSearch">Search by keyword</label>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
