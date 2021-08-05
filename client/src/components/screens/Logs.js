import React,{useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Iframe from 'react-iframe'

const Logs =()=>{
    return(

            <div className = "container col-md-10 mt-5 border border-dark rounded border-5">
            <div>
                <h3>All Logs</h3>
                <div className="row" >
                    <div className ="col-md-8 mb-3 me-5 ms-4">
                      <Iframe url = 'http://localhost:8000/show' height="480" width="760"/>
                    </div>
                    <div className = "col-md-3 border border-dark mb-3">
                        <Iframe url = 'http://localhost:8000/log' width="255" height="480" />
                    </div>
                </div>
            </div>

        </div>
    
    )
}

export default Logs