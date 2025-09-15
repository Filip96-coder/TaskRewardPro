import { useTaskStore } from "../../../store/taskStore";
import TaskCard from "../../components/TaskCard";

export default function DashboardPage() {
  const { tasks, toggleTask } = useTaskStore();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">📋 Dashboard</h1>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            title={task.title}
            description={task.description}
            completed={task.completed}
            onToggle={() => toggleTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
}
