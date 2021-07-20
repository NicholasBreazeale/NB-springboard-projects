const FirstConponent = () => (
  <h1>My very first component</h1>
);

const NamedComponent = ({name}) => (
  <p>My name is {name}</p>
);

const App = () => (
  <div>
    <FirstConponent />
    <NamedComponent name="Foo Bar" />
  </div>
);

ReactDOM.render(<App />,
  document.getElementById("root"));