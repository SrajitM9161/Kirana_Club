import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  DataTable,
  Spinner,
  TextField,
  Select,
  Button,
  Tooltip as PolarisTooltip,
} from "@shopify/polaris";
import { Link } from "react-router-dom";
import { fetchContests } from "../api";
import PaginationControls from "./Pagenation"; 
const Table = () => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [favorites, setFavorites] = useState(new Set());
  const [favoriteFilter, setFavoriteFilter] = useState(false);

  useEffect(() => {
    const getContests = async () => {
      try {
        const contests = await fetchContests();
        const formattedData = contests.map((contest) => ({
          id: contest.id,
          name: contest.name,
          type: contest.type,
          phase: contest.phase,
          frozen: contest.frozen ? "Yes" : "No",
          duration: contest.durationSeconds,
          startTime: new Date(contest.startTimeSeconds * 1000).toLocaleString(),
          relativeTime: contest.relativeTimeSeconds,
        }));
        setTableData(formattedData);
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };

    getContests();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);

      if (searchValue.trim()) {
        const filteredSuggestions = tableData
          .filter((item) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase())
          )
          .map((item) => item.name);
        setSuggestions(filteredSuggestions.slice(0, 5)); 
      } else {
        setSuggestions([]);
      }
    }, 300); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue, tableData]);

  const toggleFavorite = (id) => {
    const updatedFavorites = new Set(favorites);
    if (updatedFavorites.has(id)) {
      updatedFavorites.delete(id);
    } else {
      updatedFavorites.add(id);
    }
    setFavorites(updatedFavorites);
  };

  const filteredData = useMemo(() => {
    let filtered = tableData;

    if (debouncedSearchValue) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(debouncedSearchValue.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((item) => item.type === typeFilter);
    }

    if (phaseFilter) {
      filtered = filtered.filter((item) => item.phase === phaseFilter);
    }

    if (favoriteFilter) {
      filtered = filtered.filter((item) => favorites.has(item.id));
    }

    return filtered;
  }, [tableData, debouncedSearchValue, typeFilter, phaseFilter, favoriteFilter, favorites]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const favoriteCount = favorites.size;

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  const columnHeadings = [
    "ID",
    "Name",
    "Type",
    "Phase",
    "Frozen",
    "Duration (s)",
    "Start Time",
    "Relative Time (s)",
    "Favorite",
  ];

  return (
    <div className="overflow-x-auto bg-white">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-4 relative">
        <div className="w-full md:w-1/2 relative">
          <TextField
            label="Search Contests"
            value={searchValue}
            onChange={(value) => setSearchValue(value)}
            placeholder="Enter contest name..."
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 w-full z-10 mt-1 shadow-md">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => setSearchValue(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-4 items-center w-full md:w-1/2">
          <PolarisTooltip content="Filter contests by type" preferPlace="above">
            <Select
              label="Filter by Type"
              options={[
                { label: "All", value: "" },
                { label: "ICPC", value: "ICPC" },
                { label: "CF", value: "CF" },
              ]}
              value={typeFilter}
              onChange={setTypeFilter}
            />
          </PolarisTooltip>

          <PolarisTooltip content="Filter contests by phase" preferPlace="above">
            <Select
              label="Filter by Phase"
              options={[
                { label: "All", value: "" },
                { label: "FINISHED", value: "FINISHED" },
                { label: "BEFORE", value: "BEFORE" },
                { label: "CODING", value: "CODING" },
              ]}
              value={phaseFilter}
              onChange={setPhaseFilter}
            />
          </PolarisTooltip>

          <PolarisTooltip content="Filter by your favorite contests" preferPlace="above">
            <Select
              label="Filter by Favorites"
              options={[
                { label: "All", value: false },
                { label: "Favorites", value: true },
              ]}
              value={favoriteFilter}
              onChange={(value) => setFavoriteFilter(value === "true")}
            />
          </PolarisTooltip>
        </div>
      </div>

      <div className="mb-4">
        <span>Total Favorites: {favoriteCount}</span>
      </div>

      <Card>
        <div className="overflow-y-auto max-h-[400px]">
          <table className="w-full border-collapse">
            <thead className="bg-gray-400">
              <tr>
                {columnHeadings.map((heading, index) => (
                  <th
                    key={index}
                    className={`p-4 text-left ${index < 2 ? "bg-gray-400" : "bg-gray-400"}`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-200">
                  <td className="p-4">
                    <Link to={`/contest/${item.id}`}>{item.id}</Link>
                  </td>
                  <td className="p-4">
                    <Link to={`/contest/${item.id}`}>{item.name}</Link>
                  </td>
                  <td className="p-4">{item.type}</td>
                  <td className="p-4">{item.phase}</td>
                  <td className="p-4">{item.frozen}</td>
                  <td className="p-4">{item.duration}</td>
                  <td className="p-4">{item.startTime}</td>
                  <td className="p-4">{item.relativeTime}</td>
                  <td className="p-4">
                    <Button
                      onClick={() => toggleFavorite(item.id)}
                      primary={favorites.has(item.id)}
                    >
                      {favorites.has(item.id) ? "❌" : "♥️"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          onNext={() => handlePageChange(currentPage + 1)} 
          onPrevious={() => handlePageChange(currentPage - 1)} 
        />
      </Card>
    </div>
  );
};

export default Table;
