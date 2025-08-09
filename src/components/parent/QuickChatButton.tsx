import { FiMessageCircle } from "react-icons/fi";

interface QuickChatButtonProps {
    childId: string;
    childName: string;
    onClick?: () => void;
}

export default function QuickChatButton({ childId, childName, onClick }: QuickChatButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick ?? (() => alert(`Opening chat for ${childName}`))}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            aria-label={`Quick message to teacher about ${childName}`}
        >
            <FiMessageCircle />
            Message Teacher
        </button>
    );
}