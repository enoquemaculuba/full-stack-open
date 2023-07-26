import React from "react";

const Form = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        name: <input id="name" name="name" />
      </div>
      <div>
        number: <input id="phone" name="phone" />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default Form;
