import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
};

export default function SidebarItem({ icon: Icon, label, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
      ${active ? "bg-blue-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}