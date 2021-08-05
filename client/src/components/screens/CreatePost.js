import React from 'react'

const CreatePost =()=>{
    return(
        <div className="container col-4 mt-5 border border-2">
            <div className ="mt-2">
                <h4>Create Post</h4>
                <div className="form-floating mb-3">
                    <input type='text' className="form-control" placeholder='title'/>
                    <label >title</label>
                </div>
                <div className="form-floating mb-4">
                    <input type='text' className="form-control" placeholder='body'/>
                    <label >body</label>
                </div>
                <div class="mb-3">
                    <input class="form-control form-control-sm" id="formFileSm" type="file"/>
                </div>
                <div className="d-flex"> 
                    <div className="ml-auto p-2">
                        <button type="button" className="btn btn-primary mb-3">SUBMIT</button> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost