import React, { Component } from 'react';
import StatusHistoryList from './StatusHistoryList';

const StatusPanel = (props) => {
    return(
        <div className="status-panel-container">
            <h2>STATUS PANEL</h2>
            <h3>Copy/Paste this into Status Check:</h3>
            <h4>{props.gfyName}</h4>
            <StatusHistoryList status={props.status} historyList={props.historyList} />
        </div>
    );
}

export default StatusPanel;
