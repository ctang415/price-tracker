import Product from "./product";

const Products = ({setAllProducts, allProducts, retrieveProducts, page}) => {

    return (
        <ul className='flex flex-row gap-16 xs:gap-12 p-2 flex-wrap justify-center'>
        {allProducts.map((product) => {
            return (
                <Product key={product.id} setAllProducts={setAllProducts} allProducts={allProducts} product={product}
                retrieveProducts={retrieveProducts} page={page}/>
            )
        })}
        </ul>
    )
}

export default Products