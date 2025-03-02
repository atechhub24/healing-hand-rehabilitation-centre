import { User } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PatientSearchProps {
  onSearch: (query: string) => void;
}

/**
 * PatientSearch component provides a search input for filtering patients
 * @param onSearch - Callback function that receives the search query
 */
export function PatientSearch({ onSearch }: PatientSearchProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search patients..."
        className="pl-10"
        onChange={(e) => onSearch(e.target.value)}
      />
      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  );
}
