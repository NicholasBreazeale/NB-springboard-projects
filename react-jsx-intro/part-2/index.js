const Tweet = ({username, name, date, message}) => (
  <li>
    <p><strong>{username}</strong> {name}</p>
    <p>{message}</p>
    <p><em>{date}</em></p>
  </li>
);

const App = () => (
  <ul>
    <Tweet username="Foo" name="Bar" date="2/17/2019" message="Test message to see if this works." />
    <Tweet username="ThatGuy" name="Smith" date="4/6/2020" message="The human mind is an enigma." />
    <Tweet username="xXGamerXx" name="Josh" date="5/21/2021" message="No one will ever be as L33T as me!" />
  </ul>
);

ReactDOM.render(<App />,
  document.getElementById("root"));