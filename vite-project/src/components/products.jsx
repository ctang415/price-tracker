import Product from "./product"

const Products = ({setAllProducts, allProducts}) => {

    return (
        <ul className='flex flex-row gap-16 p-2 flex-wrap justify-center'>
        {allProducts.map((product) => {
            return (
                <Product key={product.id} setAllProducts={setAllProducts} allProducts={allProducts} product={product}/>
            )
        })}
        </ul>
    )
}

export default Products