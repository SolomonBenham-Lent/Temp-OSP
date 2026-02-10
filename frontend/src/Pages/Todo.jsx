import { useState } from "react";

const array = [
  { title: "title1", description: "description1", due: "12-03-2026" },
  { title: "title2", description: "description2", due: "12-03-2026" },
];

function Task({ title, description, due }) {
  return (
    <>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>{due}</p>
    </>
  );
}

function Todo() {
  return array.map((element, index) => {
    return (
      <Task
        key={index}
        title={element.title}
        description={element.description}
        due={element.due}
      />
    );
  });
}

export default Todo;
