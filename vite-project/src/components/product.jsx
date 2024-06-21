import { Link } from 'react-router-dom';
import Button from './button';

const Product = ({product, setAllProducts, allProducts, retrieveProducts, page}) => {

    const removeItem = async (id) => {
       try {
            const response = await fetch(`http://localhost:3000/products/${id}`, {
                method: 'DELETE', credentials: 'include'
            });
            if (!response.ok) {
                throw await response.json();
            }
            const data = await response.json();
            if (response.status === 200) {
                alert('Item successfully removed!');
                retrieveProducts(page);
            }
        } catch (err) {
            //retrieveProducts(page--);
            alert(`${err.err}`)
        }
    }

    return (
        <li key={product.id} className='max-w-xs flex flex-col border-2 border-slate-200 p-8 xs:p-6 items-center rounded-md bg-white gap-4
        shadow-2xl'>
            <Button product={product} removeItem={removeItem}/>
            <Link key={product.id} to={product.url} className='self-center'>
                <img className="max-h-60 xs:max-h-52" src={product.image_url} alt="Product image"/>
            </Link>
            <h3 className='text-center font-bold'>{product.name}</h3>
            <p>Today's Price: <strong>{product.price ? "$" + product.price : "N/A"}</strong></p>
            <p>Yesterday's Price: { product.price_yesterday ? "$" + product.price_yesterday : "N/A" } { !product.price_yesterday ? "" :  `(${Math.round( (product.price - product.price_yesterday)/product.price_yesterday * 100 )}%)`}</p>
            <p className='text-xs'>Lowest Price: ${product.lowest_price} on {product.lowest_price_date.slice(0, 10)}</p>
        </li>
    )
}

export default Product