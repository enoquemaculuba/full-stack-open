const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Content = (props) => {
  const Part = (props) => {
    return (
      <p>
        {props.name} {props.exercises}
      </p>
    );
  };
  return (
    <div>
      <Part {...props.parts[0]} />
      <Part {...props.parts[1]} />
      <Part {...props.parts[2]} />
    </div>
  );
};

const Total = (props) => {
  return (
    <p>
      Number of exercises {props.parts.reduce((a, b) => a + b.exercises, 0)}
    </p>
  );
};

export default App;
