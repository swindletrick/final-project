import React,{useContext} from 'react';
import {Link,useHistory} from 'react-router-dom'
import { UserContext } from '../App';

const Navbar = ()=>{

    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const routeList = () =>{
      if(state){
        return[
          <span key = {0} className = "nav-link active">Hi, welcome {state ? state.name:""}</span>,
          <button key = {4} type="button" className="btn btn-danger" onClick={()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push('/signin')
          }}>Logout</button>   
        ]
      }else{
        return[
          <li key = {2}><Link to ='/signin' className="btn btn-dark" type="button">Signin</Link></li>,
          <li key = {3}><Link to ='/signup' className="btn btn-dark" type="button">Signup</Link></li>
        ]
      }
    }

    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link to={state ? "/" :"/signin"} className="navbar-brand">Real Time Video</Link>
          <div className = "collapse navbar-collapse">
            <Link to={state ? "/logs" :"/signin"} className="btn btn-dark">All Logs</Link>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="d-flex justify-content-end">
            <div className="navbar-nav">
              {routeList()}
            </div>
          </div>
        </div>
      </nav>
    )
    
}

export default Navbar