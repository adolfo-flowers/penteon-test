import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import "./App.css";

async function getPersons(setPersons, page) {
  const { results: persons } = await (
    await fetch("https://randomuser.me/api?results=100")
  ).json();
  console.log(persons);
  const { data: catFacts, ...rest } = await (
    await fetch("https://catfact.ninja/facts?limit=100")
  ).json();
  console.log(catFacts, rest);
  const personsAndFacts = persons.reduce(
    (acc, p, i) => [...acc, { ...p, fact: catFacts[i].fact }],
    [],
  );
  setPersons((p) => [...p, ...personsAndFacts]);
  return;
}

function App() {
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    getPersons(setPersons);
  }, []);

  return (
    <InfiniteScroll
      style={{ width: "50%", background: "#f8fafc" }}
      pageStart={0}
      loadMore={(page) => getPersons(setPersons, page)}
      hasMore={true}
      loader={
        <div className="loader" key={0}>
          Loading ...
        </div>
      }
    >
      {persons.map((p) => (
        <div
          className="shadow-inner shadow-lg rounded"
          style={{
            margin: "30px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            padding: "20px",
          }}
          key={`${p.name.first}${p.name.last}${p.phone}`}
        >
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <img
              className="rounded-full"
              src={p.picture.thumbnail}
              alt="profile_picture"
            />
            <span
              style={{
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                marginLeft: "15px",
              }}
            >
              {`${p.name.title} ${p.name.first} ${p.name.last}`}
            </span>
          </div>
          <div style={{ flex: 1 }}>{p.fact}</div>
        </div>
      ))}
    </InfiniteScroll>
  );
}

export default App;
