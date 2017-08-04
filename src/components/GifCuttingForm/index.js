import React, { Component } from 'react';

const GifCuttingForm = (props) => {
  return (
  <div className="gif-cutting-form-container">
    <form onSubmit={props.handleSubmit}>
      <label>
        Character URL: <input type="text" name="url" />
      </label>
      <label>
        Attack Notation: <input type="text" name="title" />
      </label>
      <label>
        Start Minute: <input type="text" name="minutes" />
      </label>
      <label>
        Start Seconds: <input type="text" name="seconds" />
      </label>
      <label>
        Seconds to record: <input type="text" name="length" />
      </label>
      <input type="submit" value="Submit" />
    </form>
  </div>
  )
}
  

export default GifCuttingForm;