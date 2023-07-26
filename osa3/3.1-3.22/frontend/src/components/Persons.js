import React from "react";

const Persons = (props) => {
  const { filter, persons } = props;
  return (
    <div>
      {persons
        .filter((x) =>
          filter.length > 0 ? x.name.toLowerCase().includes(filter) : true
        )
        .map((person, i) => (
          <div key={i}>
            {person.name} {person.number}
            <div>
              <button
                onClick={() =>
                  window.confirm(`Delete ${person.name}`) &&
                  props.onDeletePerson(person.id)
                }
              >
                delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Persons;
