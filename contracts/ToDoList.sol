pragma solidity ^0.5.0;

contract ToDoList {
    uint16 public taskCount = 0;
    struct Task {
        uint16 taskId;
        string taskContent;
        bool isCompleted;
    }

    mapping(uint16 => Task) public tasks; // basically fetch task's based on their id

    constructor() public {
        // gets called whenver called for the very first time
        createTask("My First Ever Dapp");
    }

    function createTask(string memory _content) public {
        taskCount = taskCount + 1;
        tasks[taskCount] = Task(taskCount, _content, false);
    }
}
