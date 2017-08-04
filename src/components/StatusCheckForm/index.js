import React, { Component } from 'react';

const StatusCheckForm = (props) => {
    return (
    <div>
        <form onSubmit={props.statusCheck}>
            <label>
                Check Status: <input type="text" name="gfyname" />
            </label>
            <input type="submit" value="Submit" />
        </form>
    </div>
    )
}

export default StatusCheckForm;