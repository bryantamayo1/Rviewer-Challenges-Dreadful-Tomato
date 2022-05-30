import {useEffect, useState, useContext}        from "react";
import styled                       from "styled-components";
import {useNavigate, useLocation}   from "react-router-dom";
import { MyCustomNavLink }          from './MyCustomNavLink';
import {colorRedActive}             from '../utils/constants';
import {AppContext}                 from '../context/AppContext';

export const Header = () => {
    const {activeFilter, handleActiveFilter} = useContext(AppContext);

    const [showButtons, setShowButtons] = useState(false);
    // Handle menu navbar responsie
    const [showMenuNavbar, setshowMenuNavbar] = useState(false);

    const navigate = useNavigate();
    const location = useLocation(); 

    useEffect(() => {
        // According to path we show or hide buttons Movies and Series
        if(location.pathname !== "/"){
            setShowButtons(true);
        }else{
            setShowButtons(false);
        }
    },[location]);

    return (
        <div className="container">
            <ContainerHeader>
                <ImgLogo src={"assets/logo.png"} alt="logo" onClick={() => navigate("/")}/>
            
                <ContainerButtonHamburger>
                    <div style={{ height: "40px", display: "flex", alignItems: "center" }} onClick={() => setshowMenuNavbar(prev => !prev)}>
                        <i className="fa fa-fw fa-bars"/>
                    </div>
                </ContainerButtonHamburger>

                <ContainerItemsNavbar showMenuNavbar={showMenuNavbar}>
                        {showButtons && (
                            <>
                                <MyCustomNavLink to="movies" title="Movies" iconSrc="assets/icon-movies.png"/>
                                <MyCustomNavLink to="series" title="Series" iconSrc="assets/icon-series.png"/>
                            </>
                        )}      

                        <ContainerButtonsInHeader >
                            {showButtons && (
                                <ContainerButtonFilter activeFilter={activeFilter}>
                                    <ContainerActionsHeader onClick={handleActiveFilter} style={{ position: "relative", top: "1px" }}>
                                        <Icon src="assets/icon-filter.png"/>
                                        Filters
                                    </ContainerActionsHeader>
                                </ContainerButtonFilter>
                            )}
                            
                            <ContainerActionsHeader>
                                Login
                                <Icon src="assets/icon-login.png" style={{ marginLeft: "7px" }}/>
                            </ContainerActionsHeader>
                            <ContainerButtonFreeTrail>
                                <ButtonFreeTrail>
                                    Star your free trial
                                </ButtonFreeTrail>
                            </ContainerButtonFreeTrail>
                        </ContainerButtonsInHeader>  
                </ContainerItemsNavbar>
          
            </ContainerHeader>
        </div>
    );
}

const ContainerHeader = styled.div`
    align-items: center;
    display: flex;
    flex-wrap: nowrap;
    font-size: 11px;
    height: 40px;
    letter-spacing: 1px;
    position: relative;
`;

const ImgLogo = styled.img`
    cursor: pointer;
    height: 100%;
    margin-right: 20px;
`;

const ContainerButtonHamburger = styled.div`
    display: none;
    @media(max-width: 1024px){
        cursor: pointer;
        display: flex;
        height: 40px;
        justify-content: flex-end;
        width: 100%;
        align-items: center;
    }
`;

const ContainerItemsNavbar = styled.div`
    display: flex;
    height: 40px;
    width: 100%;

    @media(max-width: 1024px){
       background-color: black;
       border-radius: 2px;
       box-shadow: ${colorRedActive} 0px 1px 24px;
       display: ${props => props.showMenuNavbar? "block" : "none"};
       height: auto;
       left: 0;
       position: absolute;
       right: 0;
       top: 40px;
       z-index: 20;
    }
`;

const ContainerButtonsInHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    align-items: center;

    @media(max-width: 1024px){
        display: block;
    }
`;

const Icon = styled.img`
    height: 22px;
    margin-right: 7px;
`;

const ContainerButtonFilter = styled.div`
    height: 40px;
    border-bottom: ${props => props.activeFilter? "2px solid " + colorRedActive : ""};
    display: flex;
    align-items: center;
`;

const ContainerActionsHeader = styled.div`
    align-items: center;
    border-left: 1px solid white;
    cursor: pointer;
    display: flex;
    height: 25px;
    padding: 0px 12px;

    @media(max-width: 1024px){
        height: 40px;
        border-left: none;
    }
`;

const ContainerButtonFreeTrail = styled.div`
    border-left: 1px solid white;
    height: 25px;
    padding-left: 12px;

    @media(max-width: 1024px){
        height: 40px;
        border-left: none;
    }
`;

const ButtonFreeTrail= styled.button`
    background-color: ${colorRedActive};
    border: none;
    border-radius: 20px;
    color: white;
    font-weight: bold;
    letter-spacing: 1px;
    outline: inherit;
    padding: 5px 15px;

    &:focus{
        border: 1px solid white;
    }
`;