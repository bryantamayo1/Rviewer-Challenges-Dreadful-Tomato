import styled           from "styled-components";
import {useNavigate}    from "react-router-dom";

export const HomePage = () => {

    const navigate = useNavigate();

    return (
        <ContainerHomePage>
            <ContainerImgHomePage src="assets/movies.png" onClick={() => navigate("/movies")}>
                <Label>
                    Movies
                </Label>
            </ContainerImgHomePage>  

            <ContainerImgHomePage src="assets/series.png" onClick={() => navigate("/series")}>
                <Label>
                    Series
                </Label>
            </ContainerImgHomePage>       
        </ContainerHomePage>
    );
}

const ContainerHomePage = styled.div`
    display: grid;
    height: calc(100vh - 40px - 141px); // height viewport - header - footer
    grid-template-columns: 50% 50%;

    @media(max-width: 600px){
        grid-template-columns: auto;
    }
`;

const Label = styled.div`
    background-color: #E12323;
    bottom: 0;
    font-size: 25px;
    height: 50px;
    left: 0;
    line-height: 45px; 
    letter-spacing: 1px;
    opacity: 0.6;
    padding-left: 20px;
    position: absolute;
    right: 0;
    transition: 0.5s;
`;

const ContainerImgHomePage = styled.div`
    background-image: url(${props => props.src});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover; 
    cursor: pointer;
    position: relative;
    width: calc(50vw);

    &:hover ${Label}{
        opacity: 1;
    }

    @media(max-width: 600px){
        width: 100%;
    }
`;