import moment from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';
import './app.css';
import Footer from './components/footer';
import Input from './components/input';
import Products from './components/products';
import Search from './components/search';

function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [allPages, setAllPages] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(false);
  const [search, setSearch] = useState(false);
  const [sortText, setSortText] = useState('id DESC');
  const [searchText, setSearchText] = useState('');
  const [lastUpdated, setLastUpdated ] = useState('');
  let ignore = false;

  const retrieveProducts = async (pageNum) => {
    try {
      const response = await fetch (`http://localhost:3000/?page=${pageNum}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw await response.json();
        }
      }
      const data = await response.json();
      if (response.status === 200) {
        setAllProducts(data[0]);
        setAllPages(Math.floor(data[1][0].COUNT/6.5) + 1);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const sortBy = async (tar, page) => {
    if (!search) {
      try {
        const response = await fetch (`http://localhost:3000/?sort=${tar}&page=${page}`);
        if (!response.ok) {
          throw await response.json();
        }
        const data = await response.json();
        if (response.status === 200) {
          setAllProducts(data[0]);
          setAllPages(Math.floor(data[1][0].COUNT/6.5) + 1);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const response = await fetch (`http://localhost:3000/?search=${searchText}&sort=${tar}&page=${page}`)
        if (!response.ok) {
          throw await response.json();
        }
        const data = await response.json();
        if (response.status === 200) {
          setAllProducts(data[0]);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function getUpdate() {
    try {
      const response = await fetch (`http://localhost:3000/?update=true`);
      if (!response.ok) {
        throw await response.json();
      }
      const data = await response.json();
      if (response.status === 200) {
        let local = moment(data[0].updated_date).format('YYYY-MM-DD HH:mm A');
        setLastUpdated(local);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!ignore) {
      retrieveProducts(1);
      getUpdate();
    }
    return () => {
      ignore = true;
    }
  }, []);


  return (
    <div className='ease-in-out positive:relative duration-500 delay-350 min-h-screen w-screen bg-slate-100 flex flex-col items-center align-center p-10 gap-2 xs:gap-0 s:gap-0'>
      <h1 className='text-6xl text-center xs:text-4xl sm:text-center sm:text-4xl md:text-5xl font-serif text-extrabold text-center'>what's today's price?</h1>
      <Input retrieveProducts={retrieveProducts} page={page}/>
      <Search setSearch={setSearch} sortText={sortText} setSortText={setSortText} searchText={searchText} setSearchText={setSearchText} page={page} setAllPages={setAllPages} setAllProducts={setAllProducts}/>
      <select onChange={ (e) => { setSortText( prev => {return e.target.value}); setSort(true); sortBy(e.target.value, 1) } }>
        <option value=''>Please choose an option</option>
        <option value='price ASC'>Price: Low to High</option>
        <option value='price DESC'>Price: High to Low</option>
        <option value='id DESC'>Newest</option>
      </select>
        <Products page={page} retrieveProducts={retrieveProducts} allProducts={allProducts} setAllProducts={setAllProducts}/>
        <Footer lastUpdated={lastUpdated} allPages={allPages} sortText={sortText} sort={sort} sortBy={sortBy} search={search} retrieveProducts={retrieveProducts} setPage={setPage} page={page}/>
   </div>
  )
}

export default App
