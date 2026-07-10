const Menu = () => {
    return (
        <>
            <nav>
                <ul style={{display:'flex', listStyle:'none', width:'100%', gap:'50px', padding:0, margin:'20px auto', lineHeight:'60px', color:'#fff', fontWeight:700}}>
                    <li style={{width:'100px'}}>한식</li>
                    <li style={{width:'100px'}}>양식</li>
                    <li style={{width:'100px'}}>중식</li>
                    <li style={{width:'100px'}}>일식</li>
                </ul>
            </nav>
        </>
    )
}


export default Menu