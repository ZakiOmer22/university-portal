import { FiMessageCircle } from "react-icons/fi";
import { MessageCircle, Video, Phone } from "lucide-react";

interface QuickChatButtonProps {
    childId: string;
    childName: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    showOptions?: boolean;
}

export default function QuickChatButton({ 
    childId, 
    childName, 
    onClick, 
    variant = "primary",
    size = "md",
    showOptions = false
}: QuickChatButtonProps) {
    const baseClasses = "flex items-center gap-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const sizeClasses = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-sm",
        lg: "px-6 py-4 text-base"
    };

    const variantClasses = {
        primary: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-500 shadow-md",
        secondary: "bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 focus:ring-blue-500 shadow-md",
        outline: "bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 focus:ring-indigo-500"
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                type="button"
                onClick={onClick ?? (() => alert(`Opening chat for ${childName}`))}
                className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
                aria-label={`Quick message to teacher about ${childName}`}
            >
                <MessageCircle size={size === "sm" ? 16 : 20} />
                <span>Message Teacher</span>
            </button>

            {showOptions && (
                <div className="flex gap-2 justify-center">
                    <button
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Video Call"
                        aria-label="Start video call with teacher"
                    >
                        <Video size={16} />
                    </button>
                    <button
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Voice Call"
                        aria-label="Start voice call with teacher"
                    >
                        <Phone size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}