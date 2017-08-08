import React, { Component } from 'react';
import StatusHistoryList from './StatusHistoryList';

const StatusPanel = (props) => {
    return(
        <div className="status-panel-container">
            <h2>STATUS PANEL</h2>
            <h3>Status for:</h3>
            <h4>{props.gfyName}</h4>
            <h4>{props.status}</h4>
            {props.status == 'gif complete!' ? <a href={`https://gfycat.com/${props.gfyName}`}>Link to gif!</a> : <h4>Waiting for Gif link</h4> }
        </div>
    );
}

export default StatusPanel;
