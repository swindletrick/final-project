import React,{useState,useContext} from 'react'
import {UserContext} from '../../App'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import 'bootstrap/dist/css/bootstrap.min.css';

const Signin =()=>{

    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()

    const [showA,SetShowA] = useState('form-control');
    const toggleShowA = () => SetShowA("form-control is-invalid");

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    

    const PostData =()=>{
        fetch('/signin',{
    
            method:'post',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(res =>res.json())
        .then(data =>{
            //console.log(data)
            /*if(data.error){
                M.toast({html: data.error,classes:"alert alert-danger"})
            }*/
            if(data.error){
                toggleShowA()
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER", payload: data.user})
                M.toast({html:"signin success",classes:"alert alert-danger"})
                history.push('/')
            }
            
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className="container col-4 mt-5 border rounded-3">
            <h3 className = "mt-2">WebName</h3>
            <div className="form-floating mb-3">
                <input type="email" className={showA} value ={email} onChange={(e)=>setEmail(e.target.value)} id="floatingInput" placeholder="name@example.com"/>
                <label htmlFor="floatingInput" >Email address</label>
            </div>
            <div className="form-floating"> 
                <input type="password" className={showA} value ={password} onChange={(e)=>setPassword(e.target.value)} id="floatingPassword" placeholder="Password"/>
                <label htmlFor="floatingPassword">Password</label>
                <div className="invalid-feedback">
                    invalid Email or password
                </div>
                <button type="button" className="btn btn-dark mt-3 mb-3" onClick={()=>PostData()}>Signin</button>
            </div>
            <Link to ='/signup'>Have not accout? signup</Link>
        </div>
    )
}

export default Signin