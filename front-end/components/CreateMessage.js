import { useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";

const CreateMessage = ({ myData, refreshData }) => {
  const [message, setMessage] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();

    axios
      .post("/api/message", { message: message })
      .then((res) => {
        res.data["peeps"] = [];
        const newData = Object.assign([], myData);
        newData.push(res.data);
        refreshData(newData);
      })
      .catch((err) => console.log(err));

    setMessage("");
  };

  const onChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <div className={styles.card}>
      <h1>Create a Message</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="message"
          placeholder="Message"
          value={message}
          onChange={onChange}
        />
        <input type="submit" value="Create Message" />
      </form>
    </div>
  );
};

export default CreateMessage;
