import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";
import "./App.css";

async function getPersons() {
  try {
    const { results: persons } = await (
      await fetch("https://randomuser.me/api?results=100")
    ).json();
    const { data: catFacts } = await (
      await fetch("https://catfact.ninja/facts?limit=100")
    ).json();
    const personsAndFacts = persons.reduce(
      (acc, p, i) => [...acc, { ...p, fact: catFacts[i].fact }],
      [],
    );
    return personsAndFacts;
  } catch (e) {
    console.log(e);
    return [];
  }
}

function usePersons() {
  return useQuery({
    queryKey: ["persons"],
    queryFn: getPersons,
  });
}

function App() {
  const [persons, setPersons] = useState([]);
  const { data, error } = usePersons();

  useEffect(() => setPersons(data || []), [data]);
  return error ? (
    <div>Error while fetching data</div>
  ) : (
    <InfiniteScroll
      style={{ width: "50%", background: "#f8fafc" }}
      pageStart={0}
      loadMore={() =>
        getPersons().then((ps) => setPersons((p) => [...p, ...ps]))
      }
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
