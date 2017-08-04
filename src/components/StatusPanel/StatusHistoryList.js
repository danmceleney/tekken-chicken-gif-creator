import React, { Component } from 'react';

const renderList = (list) => {
    return list.map((item) => {
        return (
            <li key={item}>
                https://gfycat.com/{item}
            </li>
        )
    })
} 

const StatusHistoryList = (props) => {
    return (
        <div className="status-history-list">
            <h3>Completed Gyfcats!</h3>
            <h2>{props.status}</h2>
            <ul>
                {renderList(props.historyList)}
            </ul>
        </div>
    );
}

export default StatusHistoryList;