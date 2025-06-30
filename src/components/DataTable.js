import React, { useState, useMemo } from "react";
import { useAppContext } from "../contexts/AppContext";
import styles from "../styles/DataTable.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearchOutline } from "react-icons/io5";
import InfoMessage from "./InfoMessage";
import ConfirmDialog from "./ConfirmDialog";

const DataTable = ({
  columns = [],
  data = [],
  search = false,
  searchPlaceholder = "Search...",
  onSearch,
  tabs = [],
  activeTab,
  onTabChange,
  renderers = {},
  actions,
  noDataInfo,
  onConfirmDelete,
  deleteDialogInfo,
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [searchValue, setSearchValue] = useState("");
  const { theme } = useAppContext();
  const [dialogState, setDialogState] = useState({ isOpen: false, item: null });

  const sortedData = useMemo(() => {
    let filtered = data;
    if (search && searchValue) {
      filtered = data.filter((row) =>
        columns.some((col) =>
          String(row[col.accessor] || "")
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
      );
    }
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (aVal === bVal) return 0;
        if (sortDir === "asc") return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      });
    }
    return filtered;
  }, [data, columns, search, searchValue, sortField, sortDir]);

  const handleSort = (accessor) => {
    if (sortField === accessor) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(accessor);
      setSortDir("asc");
    }
  };

  const openDeleteDialog = (item) => {
    setDialogState({ isOpen: true, item });
  };

  const closeDeleteDialog = () => {
    setDialogState({ isOpen: false, item: null });
  };

  const handleConfirm = () => {
    if (onConfirmDelete && dialogState.item) {
      onConfirmDelete(dialogState.item);
    }
    closeDeleteDialog();
  };

  if (sortedData.length === 0) {
    return <InfoMessage {...noDataInfo} />;
  }

  return (
    <div className={styles.dataTableWrap} data-theme={theme}>
      <div className={styles.toolbar}>
        {tabs.length > 0 && (
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? styles.activeTab : ""}
                onClick={() => onTabChange(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
        )}
        {search && (
          <div className={styles.searchWrapper}>
            <IoSearchOutline className={styles.searchIcon} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              aria-label="Search"
            />
          </div>
        )}
      </div>
      <div className={styles.tableOuter}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  onClick={() => handleSort(col.accessor)}
                  className={col.sortable !== false ? styles.sortable : ""}
                  aria-sort={sortField === col.accessor ? sortDir : undefined}
                  tabIndex={col.sortable !== false ? 0 : -1}
                >
                  {col.header}
                  {sortField === col.accessor && (
                    <span className={styles.sortArrow}>
                      {sortDir === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
              {actions && <th className={styles.actionsHeader}>Actions</th>}
            </tr>
          </thead>
          <AnimatePresence component="tbody">
            <tbody>
              {sortedData.map((row, i) => (
                <motion.tr
                  key={row.id || i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  {columns.map((col) => {
                    let value;
                    if (typeof col.accessor === "function") {
                      value = col.accessor(row);
                    } else {
                      value = row[col.accessor];
                    }

                    const renderedValue = col.header
                      ? renderers[col.header]
                        ? renderers[col.header](value)
                        : value
                      : value;

                    return <td key={col.accessor}>{renderedValue}</td>;
                  })}
                  {actions && (
                    <td className={styles.actionsCell}>
                      {actions(row, openDeleteDialog)}
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </AnimatePresence>
        </table>
      </div>
      {deleteDialogInfo && (
        <ConfirmDialog
          isOpen={dialogState.isOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleConfirm}
          title={deleteDialogInfo.title}
        >
          {deleteDialogInfo.message}
        </ConfirmDialog>
      )}
    </div>
  );
};

export default DataTable;
