import { useState, useEffect } from "react";
import PersonForm from "./components/Form";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import * as personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchPersons = async () => {
      const data = await personService.getAll();
      setPersons(data);
    };
    fetchPersons();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.elements[0].value;
    const phone = e.target.elements[1].value;

    if (persons.find((person) => person.name === name)) {
      if (
        window.confirm(
          `${name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(persons.find((person) => person.name === name).id, {
            name,
            number: phone,
          })
          .then((data) => {
            setMessage({ message: `Updated ${data.name}`, status: "success" });
            setPersons((prev) => [
              ...prev.filter((x) => x.id !== data.id),
              { name: data.name, number: data.number, id: data.id },
            ]);
          })
          .catch(() => {
            setMessage({
              message: `Failed to update ${name}`,
              status: "error",
            });
          });
      }
    } else {
      personService
        .create({
          name,
          number: phone,
        })
        .then((data) => {
          if ("name" in data && "number" in data) {
            setMessage({ message: `Added ${data.name}`, status: "success" });
            setPersons((prev) => [
              ...prev,
              { name: data.name, number: data.number, id: data.id },
            ]);
          }
        })
        .catch((e) => {
          console.log("error", e);
          setMessage({
            message: `${e.response.data.error}`,
            status: "error",
          });
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {message && (
        <Notification
          status={message.status}
          message={message.message}
          onClear={() => setMessage(null)}
        />
      )}
      <Filter filter={filter} onChange={(e) => setFilter(e.target.value)} />
      <h2>add a new</h2>
      <PersonForm key={"form" + persons.length} onSubmit={onSubmit} />
      <h2>Numbers</h2>
      <Persons
        filter={filter}
        persons={persons}
        onDeletePerson={(id) =>
          personService
            .deletePerson(id)
            .then((success) => {
              if (success) {
                setMessage({
                  message: `Deleted ${persons.find((x) => x.id === id).name}`,
                  status: "success",
                });
                setPersons((prev) => prev.filter((x) => x.id !== id));
              }
            })
            .catch((e) => {
              console.log("error", e);
              setMessage({
                message: `Information of ${
                  persons.find((x) => x.id === id).name
                } has already been removed from server`,
                status: "error",
              });
            })
        }
      />
    </div>
  );
};

export default App;
