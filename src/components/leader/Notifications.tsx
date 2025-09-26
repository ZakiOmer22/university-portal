export default function Notifications({ notifications }: { notifications: string[] }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Notifications</h3>
      <ul className="space-y-2">
        {notifications.map((note, idx) => (
          <li key={idx} className="text-sm text-gray-700 bg-indigo-50 p-2 rounded">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
