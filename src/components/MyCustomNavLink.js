import { NavLink }  from "react-router-dom";
import styled       from "styled-components";
import { colorRedActive } from "../utils/constants";

/**
 * Component that show button current in header according to component active and NavLink
 * @param {Object} props 
 * @param {string} to pathname of component
 * @param {string} title text inside of NavLink
 * @param {string} iconSrc source of img that is inside of NavLink
 * @returns JSX.Element
 */
export const MyCustomNavLink = ({to, title, iconSrc, ...props}) => {

    return (
        <NavLink
            {...props}
            to={to}
            style={ ({isActive}) => ({
                backgroundColor: isActive? colorRedActive : "",
                color: "white",
                fontWeight: isActive? "bold" : "normal",
                height: "100%",
                padding: "0px 10px",
                textAlign: "center",
                textDecoration: "none"
            })}
            className="myCustomNavLink"
        >
            { ({isActive}) => (
                <ContainerNavLink isActive={isActive}>
                    <Icon src={iconSrc} isActive={isActive}/>
                    {title}
                </ContainerNavLink>
            )}

        </NavLink>
    );
}

const ContainerNavLink = styled.div`
    align-items: center;
    background-color: ${props => props.isActive? colorRedActive : ""};
    display: flex;
    height: 40px;
    
    @media(max-width: 1024px){
        padding: 0px 12px;
    }
`;

const Icon = styled.img`
    background-color: ${props => props.isActive? colorRedActive : ""};
    height: 22px;
    margin-right: 7px;
`;