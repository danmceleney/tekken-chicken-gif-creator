import React, { Component } from 'react';
import StatusHistoryList from './StatusHistoryList';

const StatusPanel = (props) => {
    return(
        <div className="status-panel-container">
            <h2>STATUS PANEL</h2>
            <h3>Copy/Paste this into Status Check: {props.gfyName}</h3>
            <StatusHistoryList status={props.status} historyList={props.historyList} />
        </div>
    );
}

export default StatusPanel;
