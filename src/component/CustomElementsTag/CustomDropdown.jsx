"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomDropdown = ({
  options = [],
  placeholder = "Select",
  value,
  onChange,
  labelKey = "name",
  valueKey = "_id",
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const selected = options.find((o) => o[valueKey] === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full text-sm">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-background border border-card-border px-3 py-3 rounded-xl text-left hover:border-primary transition"
      >
        <span className={selected ? "text-foreground" : "text-muted"}>
          {selected ? selected[labelKey] : placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-card border border-card-border rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {options.map((item) => (
            <button
              key={item[valueKey]}
              onClick={() => {
                onChange(item[valueKey], item);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-primary/10 text-foreground transition"
            >
              {item[labelKey]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
