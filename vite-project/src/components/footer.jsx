const Footer = ({lastUpdated, allPages, sortText, sort, sortBy, search, retrieveProducts, setPage, page}) => {
    
    return (
        <div className="flex flex-col">
            <div className='flex gap-2 self-center text-lg'>{(() => {
                const arr = [];
                for (let i = 1; i < allPages+1; i++) {
                    arr.push(
                        <ul key={i}>
                            <li onClick={sort || search ? () => sortBy(sortText, i) : () => { retrieveProducts(i); setPage(i); }} className={'text-xxs cursor-pointer hover:scale-125 hover:font-bold'}>{i}</li>
                        </ul>
                    );
                }
                return arr;
            })()}
        </div>
      <footer className='text-center'>Prices last updated at: <b>{lastUpdated}</b></footer>
      </div>
    )
}

export default Footer