import { Link } from 'react-router-dom'

const Product = ({setAllProducts, allProducts}) => {
    
    return (
        <ul>
        {allProducts.map((product) => {
            return(
                <li key={product.id}>
                    <Link key={product.id} to={product.url}>
                        <img className="max-h-60" src={product.image_url} alt="Product image"/>
                    </Link>
                    <h3>{product.name}</h3>
                    <p>PRICE: ${product.price}</p>
                    <p>Lowest Price: ${product.lowest_price} on {product.lowest_price_date}</p>
                </li>
            )
        })}
        </ul>
    )
}

export default Product