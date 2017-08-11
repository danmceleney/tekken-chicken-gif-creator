import React, { Component } from 'react';

const GifCuttingForm = (props) => {
  return (
  <div className="gif-cutting-form-container">
    <form onSubmit={props.handleSubmit} noValidate>
      <label>
        Character Name: <input type="text" name="charName" />
      </label>
      <label>
        Video URL: <input type="text" name="url" />
      </label>
      <label>
        Notation: <input type="text" name="title" />
      </label>
      <label>
        Start Time: 
          <input className="minute-input" type="number" name="startMinutes" maxLength="2" /> 
          :
          <input className="seconds-input" type="number" name="startSeconds" maxLength="2" />
      </label>
      <label>
        End Time: 
          <input className="minute-input" type="number" name="endMinutes" /> 
          :
          <input className="seconds-input" type="number" name="endSeconds" />
      </label>
      <input type="submit" value="Submit" />
    </form>
  </div>
  )
}
  

export default GifCuttingForm;