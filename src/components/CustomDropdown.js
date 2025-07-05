import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/CustomDropdown.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDown, IoSearchOutline } from "react-icons/io5";
import { useAppContext } from "../contexts/AppContext";

const getOptionLabel = (option) =>
  typeof option === "object" && option !== null ? option.label : option;
const getOptionValue = (option) =>
  typeof option === "object" && option !== null ? option.value : option;

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  multiple,
  disabled,
}) => {
  const { theme } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Support both string and object options for filtering
  const filteredOptions = options.filter((option) =>
    getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Support both single and multi-select
  const isSelected = (option) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(getOptionValue(option));
    }
    return value === getOptionValue(option);
  };

  const handleOptionClick = (option) => {
    if (multiple) {
      let newValue = Array.isArray(value) ? [...value] : [];
      const optionVal = getOptionValue(option);
      if (newValue.includes(optionVal)) {
        newValue = newValue.filter((v) => v !== optionVal);
      } else {
        newValue.push(optionVal);
      }
      onChange(newValue);
    } else {
      onChange(getOptionValue(option));
      setIsOpen(false);
    }
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Display selected label(s)
  let displayValue = placeholder;
  if (multiple && Array.isArray(value) && value.length > 0) {
    displayValue = options
      .filter((option) => value.includes(getOptionValue(option)))
      .map(getOptionLabel)
      .join(", ");
  } else if (!multiple && value) {
    const selected = options.find((option) => getOptionValue(option) === value);
    displayValue = selected ? getOptionLabel(selected) : value;
  }

  return (
    <div
      className={styles.dropdownWrapper}
      ref={dropdownRef}
      data-theme={theme}
    >
      <div
        className={styles.dropdownHeader}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
      >
        <span>{displayValue || placeholder}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <IoChevronDown />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            className={styles.dropdownPanel}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className={styles.searchWrapper}>
              <IoSearchOutline className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                autoFocus
              />
            </div>
            <ul className={styles.optionsList} role="listbox">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={getOptionValue(option)}
                    onClick={() => handleOptionClick(option)}
                    className={isSelected(option) ? styles.selected : ""}
                    role="option"
                    aria-selected={isSelected(option)}
                  >
                    {getOptionLabel(option)}
                  </li>
                ))
              ) : (
                <li className={styles.noResults}>No results found</li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
