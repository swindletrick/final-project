/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import Iframe from 'react-iframe'
const Home =()=>{
    return(
        
        <div className = "container col-md-10 mt-5 border border-dark rounded border-5">
            <div>
                <h3>Real-Time Video</h3>
                <div className="row" >
                    <div className ="col-md-8 mb-3 me-5 ms-4"style={{height:480}}>
                        
                    <img className="rounded border border-dark "
                        src="http://localhost:8000/video_feed"/>
                    </div>
                    <div className = "col-md-3 border border-dark mb-3">
                        <Iframe url = 'http://localhost:8000/log' width="255" height="480" />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home