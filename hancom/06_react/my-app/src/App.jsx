import './App.css'
//import Hello from './components/18/Hello.jsx'
//import Greeting from './components/19/Greeting.jsx'
//import Profile from './components/20/Profile.jsx'
//import Card from './components/21/Card.jsx'
//import Avatar from './components/22/Avatar.jsx'
//import Badge from './components/23/Badge.jsx'
//import Alert from './components/24/Alert.jsx'
//import Rating from './components/25/Rating.jsx'
//import Tag from './components/26/Tag.jsx'
//import SubmitButton from './components/27/SubmitButton.jsx'

// import Header from './components/28/Header.jsx'
// import Menu from './components/28/Menu.jsx'
// import Content from './components/28/Content.jsx'
// import Footer from './components/28/Footer.jsx'
// import Counter from './components/29/Counter.jsx'
// import NameForm from './components/32/NameForm.jsx'
// import ProductItem from './components/33/ProductItem.jsx'
// import Hello from './components/34/Hello.jsx'
// import Clock from './components/35/Clock.jsx'
// import Counter from './components/36/Counter.jsx'
// import Every from './components/37/Every.jsx'
// import Users from './components/38/Users.jsx'
// import Wheather from './components/39/Weather.jsx'
import { BrowserRouter, Routes, Route, Link } from'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Qna from './pages/Qna.jsx'

function App() {
  //const list = ['깃허브', '블로그', '링크드인']     28번 
  //const list = ['HTML', 'CSS', 'JS', 'REACT']     26번 Tag
  return (
    <>
    {/* <Hello/> */}
    {/* <Greeting name="React" age="20"></Greeting>  */}
    {/* <Profile name="고양이" job="웹 프론트"/> */}
    {/* <Card title="한윤지" desc="개발자되기" emoji="😭"/> */}
    {/* <Avatar name="가나다" online={true}/> */}
    {/* <h1>삼항 연산자 조건식 ? True : False</h1>
    <Badge text="true 테스트" type="new"></Badge>
    <Badge text="false 테스트" type="not"></Badge> */}
    {/* <Alert type="success" text="성공했습니다"/>
    <Alert type="error" text="실패했습니다"/>
    <Alert type="warning" text="주의하세요"/> */}
    {/* <Rating score={3}/> */}
    {/* <Tag tags={list}/> */}
    {/* <SubmitButton /> */}
    {/* <div style={{display: 'flex', gap:'20px', background:'#0099ff'}}>
      <Header />
      <Menu />
    </div>
    <Content />
    <Footer contact={list}/> */}
    {/* <Counter /> */}
    {/* <NameForm /> */}
    {/* <ProductItem name="나이키 운동화" /> */}
    {/* <Hello /> */}
    {/* <Clock /> */}
    {/* <Counter /> */}
    {/* <Every /> */}
    {/* <Users /> */}
    {/* <Wheather /> */}
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/about">About</Link>
        {' | '}
        <Link to="/Qna">Q&a</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/About" element={<About />}/>
        <Route path="/Qna" element={<Qna/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
