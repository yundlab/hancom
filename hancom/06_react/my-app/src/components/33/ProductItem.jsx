import { useState } from "react";

const ProductItem = ({name}) => {
    const [ count, setCount ] = useState(0)
    return (
        <div>
            <div className="product">
                <h3 style={{fontSize:'20px', margin:'30px 0'}}>{name}</h3>
                <p style = {{fontSize:'14px'}}>{count}담음</p>
            </div>
            <button onClick={() => setCount(c => c+1)} style={{margin:"10px 0", width:'100px',height:'40px', border:'none', background:'#00b7ff', color:'#fff', fontWeight:700, borderRadius:'10px'}}>Product 담기</button>
        </div>
    )
}

export default ProductItem