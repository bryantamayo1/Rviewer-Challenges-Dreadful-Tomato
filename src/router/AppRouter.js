import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate }  from "react-router-dom";
import { Footer }               from "../components/Footer";
import { Header }               from "../components/Header";
import { HomePage }             from "../pages/HomePage";
import {MoviesPage}             from "../pages/MoviesPage";
import {TVShowPage}             from "../pages/TVShowPage";

export const AppRouter = () => {

    return (
        <div className="text-white">
            <Router>
                <Header/>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/movies" element={<MoviesPage/>}/>
                    <Route path="/series" element={<TVShowPage/>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
                <Footer/>
            </Router>
        </div>
    );
}