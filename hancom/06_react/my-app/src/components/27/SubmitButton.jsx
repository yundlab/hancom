import {AppBar, Button, TextField} from '@mui/material'

const SubmitButton = () => {
    return (
        <>
            <AppBar style={{position:'static', height:'60px', lineHeight:'60px', fontSize:'20px'}}>메뉴</AppBar>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'20px', marginTop: '50px'}}>
                
                <TextField ></TextField>
                <Button variant='contained' onClick={() => alert('안녕하세요')} style={{height:'54px', fontSize:'20px'}}>버튼</Button>
            </div>
        </>
    )
}

export default SubmitButton