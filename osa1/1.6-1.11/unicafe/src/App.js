import { useState } from "react";

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const Statistics = (props) => {
  const { good, bad, neutral } = props.statistics;
  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticsLine text="good" value={good} />
          <StatisticsLine text="neutral" value={neutral} />
          <StatisticsLine text="bad" value={bad} />
          <StatisticsLine text="all" value={good + bad + neutral} />
          <StatisticsLine
            text="average"
            value={(good - bad) / (good + bad + neutral) || 0}
          />
          <StatisticsLine
            text="positive"
            value={(good / (good + bad + neutral)) * 100 || 0}
          />
        </tbody>
      </table>
    </div>
  );
};

const Button = (props) => {
  return <button onClick={props.onClick}>{props.text}</button>;
};

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      {good + neutral + bad !== 0 ? (
        <Statistics statistics={{ good, neutral, bad }} />
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
};

export default App;
