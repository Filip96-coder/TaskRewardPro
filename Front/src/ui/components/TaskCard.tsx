interface Props {
  title: string;
  description: string;
  completed: boolean;
  onToggle: () => void;
}

export default function TaskCard({ title, description, completed, onToggle }: Props) {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`px-3 py-1 rounded ${
          completed ? "bg-green-500 text-white" : "bg-gray-300"
        }`}
      >
        {completed ? "✔ Hecho" : "Pendiente"}
      </button>
    </div>
  );
}
