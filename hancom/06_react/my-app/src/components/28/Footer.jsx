const Footer = ({contact}) => {
    return (
        <>
            <footer>
                <ul style={{display:'flex', listStyle:'none', width:'50%', padding:0, margin:'20px auto', lineHeight:'60px', color:'#0099ff', fontWeight:700}}>
                    {contact.map((list) => (
                        <li style={{flex:1}}><a key={list} href="#" style={{color:'#0099ff', listStyle:'none'}}>{list}</a></li>
                    ))}
                </ul>
            </footer>
        </>
    )
}

export default Footer