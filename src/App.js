import React, { Component } from 'react'
import VideoCanvas from './VideoCanvas'
import './App.css'

class App extends Component {
    render() {
        return (
            <VideoCanvas urlToLoad={this.props.location.state.url} />
        );
    }
}

export default App
