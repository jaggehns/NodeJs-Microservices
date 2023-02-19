import styles from "../styles/Home.module.css";
import ListPeeps from "./ListPeeps";
import CreatePeep from "./CreatePeep";

const ListMessages = ({ myData, refreshData }) => {
  const renderMessages = Object.values(myData).map((message) => {
    return (
      <div className={styles.card} key={message.messageId}>
        <h1>Message</h1>
        <p>{message.message}</p>
        <ListPeeps peeps={message.peeps} />
        <CreatePeep
          messageId={message.messageId}
          refreshData={refreshData}
          myData={myData}
        />
      </div>
    );
  });

  return <div>{renderMessages}</div>;
};

export default ListMessages;
