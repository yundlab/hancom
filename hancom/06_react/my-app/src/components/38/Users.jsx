import { useState , useEffect } from 'react';

const Users = () => {
    const [ users, setUsers ] = useState([])
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users').then((res) => res.json()).then((data) => setUsers(data)).catch((error) => console.error('데이터 로딩 실패:', error))
    }, [])
    return(
        <ul style={{margin:"20px 0"}}>
            {users.map((u) => (
                <li key={u.id}style={{lineHeight:'50px'}}>
                    <span style={{flex:'1', display:'inline-block', width:"50%", height:'50px'}}><b>이름:</b> {u.name}</span>
                    <span style={{flex:'1', display:'inline-block', width:"50%", height:'50px', background:'#333', color:'#fff'}}><b>회사명:</b> {u.company.name}</span>
                </li>
            ))}
        </ul>
    )
}

export default Users

