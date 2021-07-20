const Person = ({name, age, hobbies}) => (
  <div>
    <p>Learn some information about this person</p>
    <h3>{age < 18 ? "You must be 18" : "Please go vote!"}</h3>
    <ul>
      <li>Name: {name.length > 8 ? `${name.substring(0,6)}...` : name}</li>
      <li>Age: {age}</li>
      <li>
        Hobbies:
        <ul>
          {hobbies.map(h => <li>{h}</li>)}
        </ul>
      </li>
    </ul>
  </div>
);

const App = () => (
  <div>
    <Person name="John Doe" age={44} hobbies={[]} />
    <Person name="Christopher" age={24} hobbies={["Hiking", "Cars", "Swimming"]} />
    <Person name="Dave" age={14} hobbies={["High school", "Biking", "Computers"]} />
  </div>
);

ReactDOM.render(<App />,
  document.getElementById("root"));