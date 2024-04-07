import { Routes, Route, Navigate } from "react-router-dom";
import { Search } from "@src/pages/Search";
import { NotFound } from "@src/pages/error/NotFound";

export const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/search" element={<Search />} />
      <Route path="/search/:id" element={<Search />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="/" element={<Navigate replace to="/search" />} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
};
