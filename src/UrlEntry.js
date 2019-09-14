import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class UrlEntry extends Component {

    constructor() {
        super()
        this.state={
            url:"",
            redirect: false
        }
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.tryButtonHandler = this.tryButtonHandler.bind(this)
    }

    onChangeHandler(event) {
        this.setState({url: "https://api.gfycat.com/v1test/gfycats/" + event.target.value})
    }

    submitHandler(event) {
        this.setState({redirect:true})
    }

    tryButtonHandler(event) {
        this.setState({
            redirect: true,
            url: "https://api.gfycat.com/v1test/gfycats/TautWhoppingCougar"
        })
    }

    render() {
        if(this.state.redirect) {
            return (
              <Redirect push to={{
                pathname: 'view',
                state: { url: this.state.url }
              }} />
            )
        } else {
            return (
                <form style={{"padding":"20px"}}>
                    <TextField
                        id="standard-uncontrolled"
                        label="Name of GIF"
                        onChange={this.onChangeHandler}
                        margin="normal"
                    />
                        <span style={{display:"block"}}>Eg: TautWhoppingCougar, BravePlainAmmonite</span><br/>
                    <Button primary onClick={this.submitHandler}>Submit</Button>
                    <Button primary onClick={this.tryButtonHandler} style={{marginLeft: "5px"}}>Try a sample</Button>
                </form>
            )
        }
    }
}

export default UrlEntry
