import Product from "./product";

const Products = ({setAllProducts, allProducts, retrieveProducts, page}) => {

    return (
        <ul className='flex flex-row gap-16 xs:gap-12 p-2 flex-wrap justify-center'>
            {allProducts.length == 0 ? 
            <div className="font-bold text-3xl">
                No products were found
            </div>
            : allProducts.map((product) => {
                return (
                    <Product key={product.id} setAllProducts={setAllProducts} allProducts={allProducts} product={product}
                    retrieveProducts={retrieveProducts} page={page}/>
                )
            })}
        </ul>
    )
}

export default Products