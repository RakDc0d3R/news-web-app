import { useState } from "react";
import Navbar from "./components/Navbar";
import NewsBoard from "./components/NewsBoard";

const App = () => {
  const [category, setCategory] = useState<string | undefined>()
  const [fromDate, setFromDate] = useState<string | undefined>()
  const [toDate, setToDate] = useState<string | undefined>()
  const [searchKeyword, setSearchKeyword] = useState<string | undefined>()

  return (
    <div>
      <Navbar setCategory={setCategory} setFromDate={setFromDate} setToDate={setToDate} setSearchKeyword={setSearchKeyword} />
      <NewsBoard category={category} fromDate={fromDate} toDate={toDate} searchKeyword={searchKeyword} />
    </div>
  );
};

export default App;
