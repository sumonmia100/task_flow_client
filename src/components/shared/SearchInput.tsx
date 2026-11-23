"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  defaultValue?: string;
}

export function SearchInput({
  placeholder = "Search...",
  onSearch,
  defaultValue = "",
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);
  const debounced = useDebounce(value, 400);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className="relative">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
