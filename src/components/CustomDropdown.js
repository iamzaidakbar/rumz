import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/CustomDropdown.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDown, IoSearchOutline } from "react-icons/io5";
import { useAppContext } from "../contexts/AppContext";

const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const { theme } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
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

  return (
    <div
      className={styles.dropdownWrapper}
      ref={dropdownRef}
      data-theme={theme}
    >
      <div className={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>
        <span>{value || placeholder}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <IoChevronDown />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
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
            <ul className={styles.optionsList}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className={value === option ? styles.selected : ""}
                  >
                    {option}
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
