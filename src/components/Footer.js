import styled           from "styled-components";
import {useNavigate}    from "react-router-dom";

export const Footer = () => {

    const navigate = useNavigate();

    return (
        <div className="container">
            <ContainerFooter>
                <div style={{ textAlign: "center", marginTop: "5px"}}>
                    <ImgLogo src={"assets/logo.png"} alt="logo" onClick={() => navigate("/")}/>
                </div>

                <ContainerButtonsFooter>
                    <ButtonFooter>
                        Home
                    </ButtonFooter>
                    <ButtonFooter>
                        Terms of Use
                    </ButtonFooter>
                    <ButtonFooter>
                        Legal Notices
                    </ButtonFooter>
                    <ButtonFooter>
                        Help
                    </ButtonFooter>
                    <ButtonFooter>
                        Manage Account
                    </ButtonFooter>
                </ContainerButtonsFooter>

                <ContainerOSPhone>
                    <img src="assets/app-store.png" alt="app-store" height="100%"/>
                    <img src="assets/google-play.png" alt="google-play" height="100%"/>
                </ContainerOSPhone>
                
                <Copyright>
                    Copyright 2020 Dreadfull Tomato Streaming All Rights Reserved
                </Copyright>
            </ContainerFooter>
        </div>
    );
}

const ContainerFooter= styled.div`
    display: grid;
    font-size: 11px;
    row-gap: 7px;
`;

const ImgLogo = styled.img`
    cursor: pointer;
    height: 25px;
    text-align: center;
`;

const ContainerButtonsFooter = styled.div`
    display: grid;
    grid-template-columns: repeat(5, auto);
    justify-content: center;

    @media(max-width: 480px){
        grid-template-columns: auto;
    }
`;

const ButtonFooter = styled.button`
    background: transparent;
    border: none;
    color: white;
`;

const ContainerOSPhone = styled.div`
    column-gap: 20px;
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    height: 30px;
`;

const Copyright = styled.p`
    color: #838383;
    font-size: 9px;
    margin-top: 12px;
    text-align: center;
`;