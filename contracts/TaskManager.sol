//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;


contract TaskManager {
    uint public taskCounter=0;

    struct Tasks {
        uint id;
        Status status;
        string title;
        string assignedto;
        uint256 createdAt;
    }

    Tasks[] public tasks;

    enum Status {ToDo, Completed}

    // enum Employee{abc, xyx, abc1}


    event taskCreated(
        uint id,
        Status status,
        string title,
        string assignedto,
        uint256 createdAt
    );

    

    function createTask(string memory _title, string memory _assignee) external {
        taskCounter++;
        tasks.push(Tasks(
            taskCounter,
            Status.ToDo,
            _title,
            _assignee,
            block.timestamp
        ));
        emit taskCreated(taskCounter, Status.ToDo, _title, _assignee ,block.timestamp);

    }

    function updateTaskTitle(uint256 _index, string memory _title) external {
        tasks[_index].title = _title;
    }

    function updateTaskCompleteStatus(uint256 _index, Status _status) external {
        tasks[_index].status = _status;
    }

    function updateAllocation(uint256 _index, string memory _assignee) external {
        tasks[_index].assignedto = _assignee;

    }

    // function gettasks() public view returns (address[] memory){
    // address[] memory ret = new address[](taskCounter);
    // for (uint i = 0; i < taskCounter; i++) {
    //     ret[i] = tasks(i).[title];
    // }
    // return ret;
    // }

    function getTasks() external view returns (Tasks[] memory) {
        return tasks;
    }

    // function getTasks(uint256 id) public view returns (uint, Status, string memory, Employee, uint256) {
    //     // for (uint i = 0; i < taskCounter; i++) {
    //     return (tasks[id].id, tasks[id].status, tasks[id].title, tasks[id].assignedto, tasks[id].createdAt);
    // }

    //  function getTasks() public view returns (uint, Status, string memory, Employee, uint256) {
    //     while (taskCounter>0) {
    //     return (tasks[taskCounter].id, tasks[taskCounter].status, tasks[taskCounter].title, tasks[taskCounter].assignedto, tasks[taskCounter].createdAt);
    // }
    //  }


}
