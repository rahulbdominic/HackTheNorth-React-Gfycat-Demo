import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import enableInlineVideo from 'iphone-inline-video'
import axios from 'axios'

import TextField from '@material-ui/core/TextField';

class VideoCanvas extends Component {
    constructor() {
        super()

        this.state={
            startTime: 0,
            endTime: 0,
            duration: 0,
            canvasWidth: 0,
            canvasHeight: 0,
            videoUrl: undefined,
            aspectRatio: 0,
            videoFrameRate: 30,
            errorMessage: "",
            redirect: false
        }

        this.looper = this.looper.bind(this)
        this.loadedMetaDataHandler = this.loadedMetaDataHandler.bind(this)
        this.startTimeChangeHandler = this.startTimeChangeHandler.bind(this)
        this.endTimeChangeHandler = this.endTimeChangeHandler.bind(this)
        this.resetPlayer = this.resetPlayer.bind(this)
    }

    componentDidMount() {
        axios.get(this.props.urlToLoad)
            .then(res => {
                if (res.status / 100 === 2) {
                    const obj = res.data.gfyItem;
                    this.setState({
                        videoUrl: obj.mp4Url,
                        canvasWidth: window.innerWidth,
                        canvasHeight: window.innerWidth * obj.height / obj.width,
                        aspectRatio: obj.height / obj.width,
                        videoFrameRate: obj.frameRate
                    })
                    enableInlineVideo(this.player)
                }
            })
            .catch(thrown => {
                alert("Invalid GIF name. Redirecting. " + thrown.message)
                this.setState({
                    redirect: true
                })
            });
    }

    looper () {
        if(this.player == null || this.canvas == null) {
            return;
        }
        const video = this.player
        var ctx = this.canvas.getContext('2d')
        if(video.currentTime < this.state.startTime) {
            video.currentTime = this.state.startTime
            video.play()
        } else if (video.currentTime < this.state.endTime) {
            ctx.drawImage(video, 0, 0, this.state.canvasWidth, this.state.canvasHeight)
            setTimeout(this.looper, 1000 / this.state.videoFrameRate)
        } else {
            video.currentTime = this.state.startTime
            setTimeout(this.looper, 1000 / this.state.videoFrameRate)
        }
    }

    loadedMetaDataHandler(event) {
        var duration = this.player.duration
        this.setState({endTime: duration, duration: duration})

        this.startTimeInput.value = this.state.startTime
        this.endTimeInput.value = duration

        this.player.currentTime = this.state.startTime
        this.player.play()
    }

    startTimeChangeHandler(event) {
        var _startTime = Number(event.target.value)
        if (_startTime !== "NaN" && _startTime < this.state.duration && _startTime >= 0 && _startTime < this.state.endTime) {
            this.setState({
                startTime:_startTime,
                errorMessage: ""
            })
            this.resetPlayer()
        } else {
            this.setState({
                errorMessage:"Invalid input for one or more fields. \n" +
                    "1)Start time and end time must be numbers \n" +
                    "2)Start time must be >= 0 and end time must be <= " + this.state.duration + " \n" +
                    "3)Start time must be <= end time \n"
            })
        }
    }

    endTimeChangeHandler(event) {
        var _endTime = Number(event.target.value)
        if (_endTime !== "NaN" && _endTime < this.state.duration && _endTime >= 0 && _endTime > this.state.startTime) {
            this.setState({
                endTime:_endTime,
                errorMessage: ""
            })
            this.resetPlayer()
        } else {
            this.setState({
                errorMessage:"Invalid input for one or more fields. \n" +
                    "1)Start time and end time must be numbers \n" +
                    "2)Start time must be >= 0 and end time must be <= " + this.state.duration + " \n" +
                    "3)Start time must be <= end time \n"
            })
        }
    }

    resetPlayer() {
        var _startTime = Number(this.startTimeInput.value)
        var _endTime = Number(this.endTimeInput.value)
        this.setState({
            startTime: _startTime,
            endTime: _endTime
        })
        this.player.pause()
        this.player.currentTime = _startTime
        this.player.play()
    }

    render() {
        if(this.state.redirect) {
            return (
              <Redirect to={{
                pathname: '/'
              }} />
            )
        } else {
             return (
                <div>
                    <video onPlay={this.looper} onLoadedMetadata={this.loadedMetaDataHandler} src={this.state.videoUrl}
                        controls="false" style={{display:'none'}} ref={(player) => {this.player = player}} autoPlay loop playsInline/>

                    <canvas width={this.state.canvasWidth} height={this.state.canvasHeight} ref={(canvas) => {this.canvas = canvas}} />
                    <form className="Center">
                        <TextField
                            id="standard-uncontrolled"
                            label="Start Time"
                            onChange={this.startTimeChangeHandler}
                            inputRef={(input) => {this.startTimeInput=input}}
                            margin="normal"
                        />
                        <TextField
                            id="standard-uncontrolled"
                            label="End Time"
                            onChange={this.endTimeChangeHandler}
                            inputRef={(input) => {this.endTimeInput=input}}
                            margin="normal"
                        />
                    </form>
                    <span style={{color:'red', whiteSpace:"pre-line"}}>{this.state.errorMessage}</span>
                </div>
            )
        }
    }
}

VideoCanvas.propTypes = {
    urlToLoad: PropTypes.string.isRequired
}

export default VideoCanvas
