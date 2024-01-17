import Product from "./product"

const Products = ({setAllProducts, allProducts}) => {

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
             }
         } catch (err) {
             console.log(err)
         }
     }


    return (
        <ul className='flex flex-row gap-16 p-2 flex-wrap justify-center'>
        {allProducts.map((product) => {
            return (
                <Product setAllProducts={setAllProducts} allProducts={allProducts} removeItem={removeItem} product={product}/>
            )
        })}
        </ul>
    )
}

export default Products