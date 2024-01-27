const Button = ({removeItem, product}) => {

    return (
        <button onClick={() => removeItem(product.id)} 
        type="button" className="text-slate-500 bg-transparent hover:bg-gray-100 hover:text-black rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-black" data-modal-hide="default-modal">
            X
        </button>
    )
}

export default Button