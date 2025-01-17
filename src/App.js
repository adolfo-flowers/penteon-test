import { useState, useEffect } from "react";
import "./App.css";

async function getPersons(setPersons) {
  const persons = (
    await (await fetch("https://randomuser.me/api?results=322")).json()
  ).results;
  console.log(persons);
  const { data: catFacts, ...rest } = await (
    await fetch("https://catfact.ninja/facts?limit=322")
  ).json();
  console.log(catFacts, rest);
  const personsAndFacts = persons.reduce(
    (acc, p, i) => [...acc, { ...p, fact: catFacts[i].fact }],
    [],
  );
  setPersons(personsAndFacts);
  return;
}

function App() {
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    console.log("Use effect!!!!!!!!!!!!!!!!");
    getPersons(setPersons);
  }, []);

  return (
    <div className="App">
      {persons.map((p) => (
        <div key={`${p.name.title} ${p.name.first} ${p.name.last} ${p.phone}`}>
          <div>
            <img src={p.picture.thumbnail} alt="profile_picture" />
            <div> {`${p.name.title} ${p.name.first} ${p.name.last}`}</div>
          </div>
          <div>{p.fact}</div>
        </div>
      ))}
    </div>
  );
}

export default App;
