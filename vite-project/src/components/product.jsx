import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './button'

const Product = ({product, setAllProducts, allProducts, retrieveProducts, page}) => {

    const removeItem = async (id) => {
       try {
            const response = await fetch (`http://localhost:3000/products/${id}`, {
                method: 'DELETE', credentials: 'include'
            })
            if (!response.ok) {
                throw await response.json();
            }
            const data = await response.json();
            if (response.status === 200) {
                alert('Item successfully removed!')
                //setAllProducts(allProducts.filter(x => x.id !== id))
                retrieveProducts(page)
            }
        } catch (err) {
            retrieveProducts(page--)
            console.log(err)
        }
    }

    return (
        <li key={product.id} className='max-w-xs flex flex-col border-4 border-white p-2 items-center rounded-md bg-white gap-4'>
            <Button product={product} removeItem={removeItem}/>
            <Link key={product.id} to={product.url} className='self-center'>
                <img className="max-h-30" src={product.image_url} alt="Product image"/>
            </Link>
            <h3 className='text-center font-bold'>{product.name}</h3>
            <p>Today's Price: <strong>${product.price}</strong></p>
            <p className='text-xs'>Lowest Price: ${product.lowest_price} on {product.lowest_price_date.slice(0, 10)}</p>
        </li>
    )
}

export default Product