import styles from "../styles/Home.module.css";

const ListPeeps = ({ peeps }) => {
  const renderPeeps = Object.values(peeps).map((peep) => {
    return (
      <div className={styles.card} key={peep.peepId}>
        <h1>Peep</h1>
        <p>{peep.peep}</p>
      </div>
    );
  });

  return <div>{renderPeeps}</div>;
};

export default ListPeeps;
