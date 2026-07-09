import './Profile.css'

const Profile = ({job = "개발자", name = "YUN"}) => {
    return (
        <>
        <h2>{name}</h2>
        <p>{job}</p>
        </>
    )
}

export default Profile