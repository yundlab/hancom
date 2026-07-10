import { useState } from "react";

const Counter = () => {
    const [ count, setCount ] = useState(0)
    return (
        <>
            <div style={{display:'flex', gap:'50px', margin:'50px 0'}}>
                <button onClick={() => setCount(c => c+1)} style={{flex:1, background:'#ffa3a3', border:'none', height: '50px'}}>+1</button>
                <button onClick={() => setCount(c => c-1)} style={{flex:1, background:'#ffa3a3', border:'none', height: '50px'}}>-1</button>
                <button onClick={() => setCount(0)} style={{flex:1, background:'#ffa3a3', border:'none', height: '50px'}}>초기화</button>
            </div>
            <span>{count}</span>
        </>
    )
}

export default Counter