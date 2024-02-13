import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import "../scss/app.scss";
import doc_swagger from "../docs/doc.json";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import home from '../assets/icons/home.svg';
import back from '../assets/icons/back.svg';

function SwaggerDocs() {
    const navigate = useNavigate();
    return (
        <div className="container-page">
            <Header />
            <div className="swagger__docs">
                <div className="top__header-page">
                    <div onClick={() => navigate("/home")}>
                        <img className='back__button' src={back} />
                    </div>
                    <div className='m__initial' onClick={() => navigate("/home")}>
                        <img className='home__button' src={home} />
                    </div>
                </div>
                <SwaggerUI spec={doc_swagger} />
            </div>
        </div>
    );
}

export default SwaggerDocs;