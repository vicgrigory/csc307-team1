import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
 
  const [characters, setCharacters] = useState([]);
 
  function removeOneCharacter(index) {
    const userToDelete = characters[index];

    const promise = fetch("http://localhost:8000/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userToDelete),
    }).then(() => {
      setCharacters((prev) => prev.filter((_, i) => i !== index));
    });


  }

  function updateList(person) { 
    postUser(person)
      .then((res) => res.json())
      .then((data) => setCharacters([...characters, data]))
      .catch((error) => {
        console.log(error);
      })
  }  

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }
    
  useEffect(() => {
    fetchUsers()
	  .then((res) => res.json())
	  .then((json) => {
      if (!Array.isArray(json)) {
        json = [json];
      }
      setCharacters(json)
    })
	  .catch((error) => { console.log(error); });
  }, [] );

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
    return promise;
  }

  return (
  <div className="container">
    <Table
      characterData={characters}
      removeCharacter={removeOneCharacter}
    />
    <Form handleSubmit={updateList} />
  </div>
  );


}


export default MyApp;
