// import { useWeb3React } from "@web3-react/core";
// import { InjectedConnector } from "@web3-react/injected-connector";
import { useState, useEffect } from "react";
// import { Web3ReactProvider } from "@web3-react/core";
// import { Web3Provider } from "@ethersproject/providers";
import TaskManager from "./artifacts/contracts/TaskManager.sol/TaskManager.json";
import "./App.css";
import { ethers } from "ethers";
// import getLibrary from "./index";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

function App() {
  const [title, setTitle] = useState("");
  const [employee, setEmployee] = useState("");
  const [contract, setContract] = useState(null);
  const [currentId, setCurrentId] = useState();
  const [tasks, setTasks] = useState([]);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState();

  // const injected = new InjectedConnector({
  //   supportedChainIds: [1, 3, 4, 5, 42, 56, 97, 1337],
  // });

  // const {
  //   active,
  //   activate,
  //   chainId,
  //   account,
  //   library: provider,
  // } = useWeb3React();

  let web3Modal;

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "7fd9754df43d4710862acf6fc1f719a3", // required
      },
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK, // Required
      options: {
        appName: "Task Manager", // Required
        infuraId: "7fd9754df43d4710862acf6fc1f719a3", // Required
        rpc: "", // Optional if `infuraId` is provided; otherwise it's required
        chainId: 3, // Optional. It defaults to 1 if not provided
        darkMode: true, // Optional. Use dark theme, defaults to false
      },
    },
  };

  if (typeof window !== "undefined") {
    web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions, // required
    });
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  }, []);

  const getTasks = async () => {
    const res = await contract.getTasks();
    setTasks(res);
  };

  const currentvalue = () => {
    const number = tasks;
  };

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);
  useEffect(() => {
    console.log(currentId);
  }, [currentId]);

  const createTask = async () => {
    const transaction = await contract.createTask(title, employee);
    await transaction.wait();
    setCurrentId(await contract.taskCounter());
    getTasks();
  };

  const updateTaskTitle = async (_index) => {
    let newtitle = prompt("Please enter new task name", "");
    // let index = prompt("Please enter task number", "");
    const transaction = await contract.updateTaskTitle(_index, newtitle);
    await transaction.wait();
    getTasks();
  };

  const updateTaskCompleteStatus = async (_index, _status) => {
    // let status = prompt("Please enter the task status 0-ToDo, 1-Completed", "");
    const transaction = await contract.updateTaskCompleteStatus(
      _index,
      _status
    );
    await transaction.wait();
    getTasks();
  };

  const updateAllocation = async (_index) => {
    let newemployee = prompt("Please enter employee name", "");

    const transaction = await contract.updateAllocation(_index, newemployee);
    await transaction.wait();
    getTasks();
  };

  let Employee = ["amit", "jakub", "Bart", "Michal", "ad"];

  function format_time(s) {
    var date = new Date(s * 1000);
    return (
      ("0" + date.getDate()).slice(-2) +
      "/" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      date.getFullYear() +
      " " +
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2)
    );
  }

  var countValuesInObj = function (obj, value) {
    var count = 0;
    for (const property in obj) {
      if (typeof obj[property] === "object") {
        count = count + countValuesInObj(obj[property], value);
      }

      if (obj[property] === value) {
        return 1; // count = count + 1; // count++;
      }
    }
    return count;
  };

  const initConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const web3ModalProvider = await web3Modal.connect();
        setIsConnected(true);
        console.log(isConnected);
        console.log(isConnected);

        const provider = new ethers.providers.Web3Provider(web3ModalProvider);
        setSigner(provider.getSigner());
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
    console.log(isConnected);

    if (isConnected) {
      setContract(
        new ethers.Contract(
          "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          TaskManager.abi,
          signer
        )
      );
    } else {
      console.log("Please install metamask.");
    }
  };

  const result1 = tasks.map((t, i) => ({ id: i, item: t }));
  const result2 = result1.filter((t) => t.item[1] == 1);

  useEffect(() => {
    initConnection();
  }, [isConnected]);

  console.log(isConnected);
  console.log(hasMetamask);

  return (
    <div className="page">
      <div className="header">
        <p>Task Manager</p>
        {hasMetamask ? (
          isConnected ? (
            <p>{"Connected to Wallet from address:"}</p>
          ) : (
            <button className="big_button" onClick={initConnection}>
              Connect
            </button>
          )
        ) : (
          "Please install metamask"
        )}
      </div>

      <div className="input_section">
        <div>
          <button className="big_button" onClick={createTask}>
            Create Task
          </button>
          <input
            className="input"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
          <input
            className="input"
            onChange={(e) => setEmployee(e.target.value)}
            placeholder="Task employee"
          />
        </div>
        <button
          className="big_button"
          onClick={() => {
            currentvalue();
            // testFn();
          }}
        >
          OngoingTasks
        </button>
      </div>

      <div className="main">
        <div className="main_col" style={{ backgroundColor: "lightPink" }}>
          <div className="main_col_heading">
            {" "}
            <span style={{ fontWeight: "bold" }}>ToDo</span>
          </div>
          {tasks
            .map((t, i) => ({ id: i, item: t }))
            .filter((t) => t.item[1] == 0)
            .map((task, index) => {
              return (
                <div key={index} className="main_ticket_card">
                  <p className="main_ticket_card_id">#{task.id}</p>
                  <p>
                    {"TaskName:"} {task.item[2]} {","} {"AssignedTo:"}{" "}
                    {task.item[3]}
                  </p>

                  <div className="main_ticket_button_section">
                    <button
                      className="small_button"
                      style={{ backgroundColor: "lightBlue" }}
                      onClick={() => updateTaskCompleteStatus(task.id, 1)}
                    >
                      Move to Completed
                    </button>
                    <button
                      className="small_button"
                      style={{ backgroundColor: "lightGrey" }}
                      onClick={() => updateTaskTitle(task.id)}
                    >
                      UpdateTaskName
                    </button>
                    <button
                      className="small_button"
                      style={{ backgroundColor: "lightGrey" }}
                      onClick={() => updateAllocation(task.id)}
                    >
                      UpdateEmployee
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="main_col" style={{ backgroundColor: "lightGreen" }}>
          <div className="main_col_heading">
            {" "}
            <span style={{ fontWeight: "bold" }}>Completed</span>
          </div>
          {tasks
            .map((t, i) => ({ id: i, item: t }))
            .filter((t) => t.item[1] == 1)
            .map((task, index) => {
              return (
                <div key={index} className="main_ticket_card">
                  <p className="main_ticket_card_id">#{task.id}</p>
                  <p>
                    {"TaskName:"} {task.item[2]} {","} {"AssignedTo:"}{" "}
                    {task.item[3]}
                  </p>
                  <div className="main_ticket_button_section">
                    <button
                      className="small_button"
                      style={{ backgroundColor: "lightBlue" }}
                      onClick={() => updateTaskCompleteStatus(task.id, 0)}
                    >
                      Move to ToDo
                    </button>
                    <button
                      className="small_button"
                      style={{ backgroundColor: "lightGrey" }}
                      onClick={() => updateTaskTitle(task.id)}
                    >
                      UpdateTaskName
                    </button>

                    <button
                      className="small_button"
                      style={{ backgroundColor: "lightGrey" }}
                      onClick={() => updateAllocation(task.id)}
                    >
                      UpdateEmployee
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="main_col" style={{ backgroundColor: "lightBlue" }}>
          <div className="main_col_heading">
            <span style={{ fontWeight: "bold" }}>
              Ongoing tasks with timelines
            </span>
          </div>
          {tasks
            .map((t, i) => ({ id: i, item: t }))
            .filter((t) => t.item[1] == 0)
            .map((task, index) => {
              return (
                <div key={index} className="main_ticket_card">
                  <p className="main_ticket_card_id">#{task.id}</p>
                  <p>
                    {"TaskName: "}
                    <span style={{ fontWeight: "bold" }}>{task.item[2]}</span>
                    {<br></br>}
                    {"AssignedTo: "}
                    <span style={{ fontWeight: "bold" }}>{task.item[3]}</span>
                    {<br></br>}
                    {" CreatedAt: "}
                    <span style={{ fontWeight: "bold" }}>
                      {format_time(task.item[4])}
                    </span>
                  </p>
                </div>
              );
            })}
        </div>
        <div className="main_col" style={{ backgroundColor: "yellow" }}>
          <div className="main_col_heading">
            <span style={{ fontWeight: "bold" }}>
              Employee: number of Total/Completed Tasks
            </span>
          </div>
          {Employee.map((t, i) => {
            return (
              <div key={i} className="main_ticket_card">
                <p className="main_ticket_card_id">
                  <span style={{ fontWeight: "bold" }}>#{Employee[i]}</span>
                </p>
                <p>
                  {"   Total Number of Assigned Tasks: "}{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {countValuesInObj(tasks, Employee[i])}
                  </span>
                  {"  (Completed: "} {"  "}{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {countValuesInObj(result2, Employee[i])}{" "}
                  </span>{" "}
                  {")"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
