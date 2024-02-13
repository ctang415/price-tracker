import moment from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';
import './app.css';
import Input from './components/input';
import Products from './components/products';
import Search from './components/search';

function App(){
  const [allProducts, setAllProducts] = useState([]);
  const [allPages, setAllPages] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(false);
  const [search, setSearch] = useState(false);
  const [sortText, setSortText] = useState('');
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
        console.log(data);
        setAllProducts(data[0]);
        setAllPages(Math.floor(data[1][0].COUNT/6.5) + 1);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const sortBy = async (sort, page) => {
    if (!search) {
      try {
        const response = await fetch (`http://localhost:3000/?sort=${sort}&page=${page}`);
        if (!response.ok) {
          throw await response.json();
        }
        const data = await response.json();
        if (response.status === 200) {
          console.log(data);
          setAllProducts(data[0]);
          setAllPages(Math.floor(data[1][0].COUNT/6.5) + 1);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const response = await fetch (`http://localhost:3000/?search=${sort}&page=${page}`)
        if (!response.ok) {
          throw await response.json();
        }
        const data = await response.json();
        if (response.status === 200) {
          console.log(data);
          setAllProducts(data[0]);
          setAllPages(Math.floor(data[1][0].COUNT/6.5) + 1);
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
        console.log(data);
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
    <div className='ease-in-out duration-500 delay-350 h-full w-screen bg-slate-100 flex flex-col items-center align-center p-10 gap-2 xs:gap-0 s:gap-0'>
      <h1 className='text-6xl text-center xs:text-4xl sm:text-center sm:text-4xl md:text-5xl font-serif text-extrabold text-center'>what's today's price?</h1>
      <Input retrieveProducts={retrieveProducts} page={page}/>
      <Search setSearch={setSearch} sortText={sortText} setSortText={setSortText} page={page} setAllPages={setAllPages} setAllProducts={setAllProducts}/>
      <select onChange={ (e) => { setSortText(e.target.value); setSort(true); sortBy(e.target.value, 1) } }>
        <option value=''>Please choose an option</option>
        <option value='price ASC'>Price: Low to High</option>
        <option value='price DESC'>Price: High to Low</option>
        <option value='id DESC'>Newest</option>
      </select>
      <Products page={page} retrieveProducts={retrieveProducts} allProducts={allProducts} setAllProducts={setAllProducts}/>
      <div className='flex flex-row gap-2'>{(() => {
            const arr = [];
            for (let i = 1; i < allPages+1; i++) {
                arr.push(
                    <ul key={i}>
                        <li onClick={sort || search ? () => sortBy(sortText, i) : () => { retrieveProducts(i); setPage(i) }} className='text-xxs cursor-pointer'>{i}</li>
                    </ul>
                );
            }
            return arr;
        })()}
      </div>
      <footer className='text-center'>Prices last updated at: {lastUpdated}</footer>
   </div>
  )
}

export default App
