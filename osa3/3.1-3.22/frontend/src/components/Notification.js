import React from "react";

const Notification = (props) => {
  const { status, message } = props;
  const visibileTime = 5000;
  setTimeout(() => {
    props.onClear();
  }, visibileTime);
  return (
    <div className={`notification ${status === "error" ? "error" : "success"}`}>
      <div>{message}</div>
    </div>
  );
};

export default Notification;
