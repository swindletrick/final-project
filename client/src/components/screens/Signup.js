import React,{useState} from 'react'
import {Link} from 'react-router-dom'
/*import M from 'materialize-css'*/
import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup =()=>{
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const [showA,SetShowA] = useState('form-control');
    const toggleShowA = () => SetShowA("form-control is-invalid");

    /*const history = useHistory()*/
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    

    const PostData =()=>{
        fetch('/signup',{
    
            method:'post',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        })
        .then(res =>res.json())
        .then(data =>{
            if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
                /*M.toast({html:"Invalid email",classes:"btn"})*/
                toggleShowA()
                return
            }
            if(data.error){
                /*M.toast({html: data.error,classes:"alert alert-danger"})*/
                toggleShowA()
            }

            else{
                /*M.toast({html: data.message,classes:"success"})*/
                handleShow()
                /*history.push('/signin')*/
            }
            
        })
    }
    return(
        <div className="container col-4 mt-5 border border-2 rounded-3">
            <h3 className = "mt-2">WebName</h3>
            <div className="form-floating mb-3">
                <input type="text" className={showA}
                placeholder="name" value={name} onChange={(e)=>setName(e.target.value)}/>
                <label >Name</label>
                <div className="invalid-feedback">
                please add name
            </div>
            </div>
            <div className="form-floating mb-3">
                <input type="text" className= {showA}
                placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <label >Email address</label>
                <div className="invalid-feedback">
                please add valid Email
            </div>
            </div>
            <div className="form-floating mb-3"> 
                <input type="password" className={showA}
                placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <label >Password</label>
                <div className="invalid-feedback">
                    please add password
                </div>
            </div>
            <div className="form-floating"> 
                <button type="button" id="liveToast" className="btn btn-dark mt-3 mb-3"
                onClick={()=>PostData()} >Signup</button> 
            </div>
            <Link to='/signin' >Have already accout?</Link>
            {/*Modal */}
    <div>
        <Modal show = {showModal} onHide={handleClose}>
        <Modal.Header>
        <Modal.Title>Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body><p className="success">Save successfull!!</p></Modal.Body>
        <Modal.Footer>
        <Button href='/signin'variant="primary" onClick={handleClose}>
            Close
        </Button>
        </Modal.Footer>
        </Modal>
    </div>
        </div>
    )
}

export default Signup