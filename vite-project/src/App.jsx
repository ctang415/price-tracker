import { useEffect } from 'react'
import { useState } from 'react'
import './app.css'
import Input from './components/input'
import Product from './components/product'

function App() {
  const [allProducts, setAllProducts] = useState([]);

  const retrieveProducts = async () => {
    try {
      const response = await fetch ('http://localhost:3000')
      if (!response.ok) {
        if (response.status === 404) {
          throw await response.json()
        }
      } 
      const data = await response.json()
      if (response.status === 200) {
        console.log(data)
        setAllProducts(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    retrieveProducts()
  }, [])
  
  return (
    <div className='h-screen w-screen bg-slate-100 flex flex-col items-center align-center p-10'>
      <h1 className='text-6xl font-serif text-extrabold'>what's today's price?</h1>
      <Input/>
      <Product allProducts={allProducts} setAllProducts={setAllProducts}/>
   </div>
  )
}

export default App
