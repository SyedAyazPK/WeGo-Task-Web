import Task from "./Task";

const TaskConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/tasks/:id",
      element: <Task />,
    },
  ],
};

export default TaskConfig;
