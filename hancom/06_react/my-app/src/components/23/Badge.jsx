import './Badge.css'

const Badge = ({text, type}) => {
    const color = type === "new" ? 'green' : 'crimson'
    return (
        <>
        <span style={{backgroundColor:color, color:'#fff', height:'50px', lineHeight:'50px', fontWeight:'700'}}>{text}</span>
        </>
    )
}

export default Badge