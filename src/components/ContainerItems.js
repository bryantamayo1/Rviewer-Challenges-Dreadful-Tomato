import { useEffect, useState, useContext }          from "react";
import styled                           from "styled-components";
import {colorRedActive, colorRedNoActive}         from '../utils/constants';
import moment                           from 'moment';
import {useSearchParams}                from 'react-router-dom';
import DatePicker                       from "react-datepicker";
import {AppContext}                     from '../context/AppContext';
import ClipLoader                       from "react-spinners/ClipLoader";
import "react-datepicker/dist/react-datepicker.css";

/**
 * 
 * @param {{}} props, category is a string, it can be movie or series 
 * @returns JSX.Element
 */
export const ContainerItems = ({title, category}) => {
    const {activeFilter, handleActiveFilter} = useContext(AppContext);

    let [searchParams, setSearchParams] = useSearchParams();

    const [listMovies, setListMovies] = useState([]);
    // We store amount movies with indexes and active = true or false. Each item is a object
    // with active = true or false and index respectively
    const [indexesMoviesArray, setindexesMoviesArray] = useState([]);     
    // We handle steps in buttons footer of pagintaion
    const [flagIndex, setFlagIndex] = useState(0);
    // We handle pagination according to button selected item.index and query page
    const [stepPagination, setStepPagination] = useState(1);
    const [inputValues, setInputValues] = useState({ name: "" });
    // We handle Datepicker
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    // Handle message fail request
    const [errorMessage, setErrorMessage] = useState({ active: false, message: "" });
    // Handle active spinner loading data
    const [spinnerLoading, setSpinnerLoading] = useState(false);

    const PORT = 3001;
    const stepMovies = 10;
    const stepFlagIndex = 5;

    useEffect(() => {
        (   
            async () => {
                try{
                    let movies = await getMovies(category);
                    
                    // Calculate array pagination with buttons
                    let arrayWithButtonsPagintation_1 = calculateArrayWithPagindation(movies);
                    setindexesMoviesArray(arrayWithButtonsPagintation_1);

                    // Get query url
                    const pageQuery = searchParams.get("page") || null;
                    const startYearFilter = +searchParams.get("startYear") ||  null;
                    const endYearFilter = +searchParams.get("endYear") || null;
                    const nameFilter = searchParams.get("name") || "";
                    handlePageQueryURL(movies, pageQuery, startYearFilter, endYearFilter, nameFilter);

                    // Filter items by queries
                    if(pageQuery && startYearFilter && endYearFilter){
                        let newListMovies = processFilterByParams(movies, startYearFilter, endYearFilter, nameFilter);

                        let arrayWithButtonsPagintation_2 = calculateArrayWithPagindation(newListMovies);
                        setStepPagination(+pageQuery);
                        setindexesMoviesArray(arrayWithButtonsPagintation_2);
                        handleButtonActiveIndexesMoviesArray(arrayWithButtonsPagintation_2, {active: true, index: +pageQuery});
                        setListMovies(newListMovies);
                    }else{
                        if(pageQuery){
                            setStepPagination(+pageQuery);
                            handleButtonActiveIndexesMoviesArray(arrayWithButtonsPagintation_1, {active: true, index: +pageQuery});
                        }
                        setListMovies(movies);
                    }
                }catch(err){
                    // Hnadle error
                }
            }
        )();
    }, []);

    useEffect(() => {
        return () => {
            handleActiveFilter(false);
        }
    }, []);

    /**
     * Get items ordered by releaseYear, in this case by movie
     * @param {string} filterBy It can be movie or series
     */
    const getMovies = async (filterBy = "") => {
        try{    
            setSpinnerLoading(true);
            const res = await fetch(`http://localhost:${PORT}/entries`);
            const data = await res.json();
            setSpinnerLoading(false);
            // 1º We check data is empty or no
            if(data.length > 0) {
                // 2º We filter by programType movie
                let listMovies = data.filter(movie => movie.programType === filterBy);
                // 3º We change property Poster Art by Poster to work with image correctly
                let newListMovies = listMovies.map(movie => {
                    let [property, imageInfo] =  Object.entries(movie.images)[0];
                    let newImages = {}
                    newImages[property.split(" ")[0]] = {...imageInfo}
                    return {
                        ...movie,
                        images: newImages
                    }
                });

                // Orden data by property releaseYear
                newListMovies.sort( (a,b ) => {
                    return b.releaseYear - a.releaseYear;
                });

                setErrorMessage({active: false, message: ""});
                return newListMovies;
            }else{
                setErrorMessage({active: true, message: "No data has been found"});
                throw new Error("Data is empty");
            }
        }catch(err){
            setSpinnerLoading(false);
            setErrorMessage({active: true, message: "No data available at the moment, please try again later"});
            throw err;
        }
    }

    /**
     * We handle query according pagination currently
     * @param {Array} movies 
     * @param {string} pageQuery 
     */
    const handlePageQueryURL = (movies, pageQuery, startYearFilter, endYearFilter, nameFilter) => {
        if(movies.length > 0) {
            // Queries from url
            if(pageQuery && startYearFilter && endYearFilter){
                setStartDate( moment(startYearFilter, "YYYY").toDate() );
                setEndDate( moment(endYearFilter, "YYYY").toDate() );
                setInputValues({
                    ...inputValues,
                    name: nameFilter
                });

                setSearchParams({page: pageQuery, startYear: startYearFilter, endYear: endYearFilter, name: nameFilter}, {replace: true});
            }else if(!pageQuery){
                const name = inputValues.name;
                const startYear = findLastItemByReleaseYear(movies);
                const endYear = findFirstItemByReleaseYear(movies);
                setStartDate( moment(startYear, "YYYY").toDate() );
                setEndDate( moment(endYear, "YYYY").toDate());

                setSearchParams({page: 1, startYear, endYear, name }, {replace: true});
            }
        }else{
            setSearchParams({}, {replace: true});
        }
    }

    /**
     * We search last item with valid date releaseYear property. For example, Star Trek: Enterprise has a releaseYear with value 0 or
     * At Home With Julia with value 0
     * @param {[]} arrayItems 
     * @returns number
     */
    const findLastItemByReleaseYear = (arrayItems) => {
        let lastYear = 0;
        for(let i = arrayItems.length - 1; i >= 0; i--) {
            if(arrayItems[i].releaseYear){
                lastYear = arrayItems[i].releaseYear;
                break;
            }
        }
        return lastYear;
    }

    /**
     * We search first item with valid date releaseYear property.
     * @param {[]} arrayItems 
     * @returns number
     */
    const findFirstItemByReleaseYear = (arrayItems) => {
        let firstYear = 0;
        for(let i = 0; i <  arrayItems.length; i--) {
            if(arrayItems[i].releaseYear){
                firstYear = arrayItems[i].releaseYear;
                break;
            }
        }
        return firstYear;
    }

    /**
     * Calculation of array with indexes pagination
     * @param {Array} newListMovies array with items prepared
     * @return {[]} array with buttons of pagination
     */
    const calculateArrayWithPagindation = (newListMovies) => {
        if(newListMovies.length === 0){
            setindexesMoviesArray([]);
            return [];
        }

        // We define first index as active
        let indixes = [{ active: true, index: 1 }];
        let stepByFive = Math.trunc( newListMovies.length / stepMovies );
        let auxDecimal = (newListMovies.length % stepMovies) === 0 ? 0 : 1;
        for(let i=1; i < stepByFive + auxDecimal; i++){
            indixes.push({
                active: false,
                index: i+1
            });
        }
        return indixes;
    }

    /**
     * We handle movement of index backwards and forwards
     * @param {number} i It can be only -1 or 1
     */
    const handleMoveLeftOrRight = (i) => {
        // We handle index e.g. -1 
        if(i === -1 && flagIndex === 0){
            return;
        }
        if(indexesMoviesArray.length <= stepFlagIndex){
            return;
        }
        // We handle negative out of range of buffer
        if(i === 1 && (indexesMoviesArray.length - stepFlagIndex === flagIndex)){
            return;
        }
        setFlagIndex(prevState  => prevState + i );
    }

    /**
     * We handle state of index and pagination
     * @param {{}} item e.g. {active: true, index: 1} 
     */
    const handleButtonIndex = (item) => {
        // WE HANDLE STATE OF INDEX IN BUTTONS OF PAGINTATION
        handleButtonActiveIndexesMoviesArray(indexesMoviesArray, item);

        // WE HANDLE PAGINATION
        const startYearFilter = searchParams.get("startYear") ||  null;
        const endYearFilter = searchParams.get("endYear") || null;
        const nameFilter = searchParams.get("name") || "";

        if(startYearFilter && endYearFilter){
            setSearchParams({page: item.index, startYear: startYearFilter, endYear: endYearFilter, name: nameFilter}, {replace: false});
        }else{
            setSearchParams({page: item.index}, {replace: false});
        }
        setStepPagination(item.index);
    }

    /**
     * Handle active button of pagintaion
     * @param {{}} item e.g. {active: true, index: 1} 
     */
    const handleButtonActiveIndexesMoviesArray = (indexesMoviesArrayProps, item) => {
        // We reset values of indexesMoviesArray with {active: false}
        let indexesCleaned = indexesMoviesArrayProps.map( e => {
            return {...e, active:false}
        });

        // We change property active = true according to item.index
        let newArray = indexesCleaned.map(e => {
            if(e.index === item.index){
                return {
                    ...e,
                    active: true,
                }
            }else{
                return e;
            }
        });
        setindexesMoviesArray(newArray);
    }

    const handleOnChange = ({target}) => {
        const {name, value} = target;
        setInputValues({
            ...inputValues,
            [name]: value
        });
        // Filter stage
    }
    
    /**
     * Handle key down in search input
     */
    const handleOnKeyDown = ({key}) => {
        if(key === "Enter") filterItems();
    }

    /**
     * Filter items by title according to name and start and end date, handle
     * uppercase nad lowercase. Filter only works when Enter key is pressed or icon search clicked.
     */
    const filterItems = () => {
        const startYearFilter = startDate? startDate.getFullYear() : null;
        const endYearFilter = endDate? endDate.getFullYear() : null;
        const nameFilter = inputValues.name;

        (   
            async () => {
                try{
                    let movies = await getMovies(category);
                    // Filter according to name and start and end date
                    let newListMovies = processFilterByParams(movies, startYearFilter, endYearFilter, nameFilter);
                    let arrayWithButtonsPagintation = calculateArrayWithPagindation(newListMovies);
                    setStepPagination(1);
                    setindexesMoviesArray(arrayWithButtonsPagintation);
                    setListMovies(newListMovies);
                    handlePageQueryURL(newListMovies, 1, startYearFilter, endYearFilter, nameFilter);
                }catch(err){
                    // Hnadle error
                }
            }
        )();
    }

    /**
     * Filter according to name and start and end date
     */
    const processFilterByParams = (movies, startYearFilter, endYearFilter, nameFilter) => {
        let moviesFiltered = [];
        moviesFiltered =  movies.filter( item => {
            if( item.title.toLowerCase().includes( nameFilter.toLowerCase() ) && 
            ( startYearFilter <= item.releaseYear && item.releaseYear <= endYearFilter) ){
                return item;
            }
        });
        if(moviesFiltered.length === 0) setErrorMessage({active: true, message: "No data has been found"});
        return moviesFiltered;
    }

    const onChangeDatePicker = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    }   

    return (
        <div>
            {activeFilter && (
                <ContainerBackgroundFilter style={{ height: "34px" }}>
                    <ContainerFilter className="container handleWidth">
                        <ContainerInput>
                            <SearchIcon className="fa fa-fw fa-search" onClick={filterItems}></SearchIcon>
                            <Input type="text" name="name" value={inputValues.name} placeholder="Name" onChange={handleOnChange} onKeyDown={handleOnKeyDown}/>
                        </ContainerInput>
                        <ContainerInput>
                            <SearchIcon className="fa fa-fw fa-calendar" onClick={filterItems}></SearchIcon>
                            <DatePicker
                                selected={startDate}
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                                onChange={onChangeDatePicker}
                                dateFormat="yyyy"
                                showYearPicker
                                calendarClassName="datepickerCss"
                                customInput={<InputDatePicker/>}
                            />
                        </ContainerInput>
                    </ContainerFilter>  
                </ContainerBackgroundFilter>
            )}

            <div className="container">
                <ContainerMoviesPage>
                    <p className="handleWidth">{title}</p>
                    {/* Loading data of backend... */}
                    {spinnerLoading? 
                            <ContainerInfoItems className="handleWidth" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <ClipLoader color="red" size={100}/>
                            </ContainerInfoItems>
                        :    
                            <ContainerInfoItems className="handleWidth" >
                                {errorMessage.active? 
                                    <ContainerErrorMessage>{errorMessage.message}</ContainerErrorMessage>
                                    :
                                    <ContainerMovies className="containerMovies">
                                        {listMovies.slice(stepPagination * stepMovies - stepMovies, stepMovies * stepPagination).map( movie => (
                                            <ContainerOneMovie className="containerOneMovie" key={movie.title} src={movie.images.Poster.url}>
                                                <div className="containerInfoOneMovie">
                                                    <p className="itemTitle"> {movie.title} </p>
                                                    <ContainerReleaseYear>
                                                        <i className="fa fa-fw fa-calendar"></i>
                                                        <p className="itemReleaseYear"> {movie.releaseYear} </p>
                                                    </ContainerReleaseYear>
                                                    <p className="itemDescription"> {movie.description} </p>
                                                </div>
                                            </ContainerOneMovie>
                                        ))}
                                    </ContainerMovies>
                                }
                            </ContainerInfoItems>
                    }
                    
                    <ContainerPagination>
                        {indexesMoviesArray.length > 0 && errorMessage.active === false && (
                            <>
                                <ContainerAngle onClick={() => handleMoveLeftOrRight(-1)}>
                                    <i className="fa fa-fw fa-angle-left"></i>
                                </ContainerAngle>
        
                                {indexesMoviesArray.slice(flagIndex, stepFlagIndex + flagIndex).map( item => (
                                    <ContainerIndex onClick={() => handleButtonIndex(item)} active={item.active} key={item.index.toString()}>
                                        {item.index}
                                    </ContainerIndex>
                                ))}
        
                                <ContainerAngle onClick={() => handleMoveLeftOrRight(1)}>
                                    <i className="fa fa-fw fa-angle-right"></i>
                                </ContainerAngle>
                            </>
                        )}
                    </ContainerPagination>

                </ContainerMoviesPage>
            </div>
        </div>
    );
}

const ContainerBackgroundFilter = styled.div`
    background-color: ${colorRedActive};
    display: flex;
    align-items: center;
`;

const ContainerFilter = styled.div`
    background-color: transparent;
    display: grid;
    grid-template-columns: 3fr 1fr;
    column-gap: 10px;

    @media(max-width: 580px){
        padding: 0px 12px;
    }
`;

const ContainerInput = styled.div`
    align-items: center;
    background-color: white;
    border-radius: 20px;
    display: flex;
    padding: 0px 10px;
`;

const InputDatePicker= styled.input`
    border: 0px;
    margin-left: 5px;
    outline: none;

    @media(max-width: 500px){
        width: 90px;
    }
`;

const SearchIcon = styled.i`
    background-color: transparent;
    color: ${colorRedActive}; 
    cursor: pointer;
`;

const Input = styled.input`
    background-color: transparent;
    border: none;
    font-size: 14px;
    margin-left: 5px;
    width: 100%;

    &:focus{
        outline: none;
    }
`;

const ContainerMoviesPage = styled.div`
    margin: 10px 0px;
    min-height: calc(100vh - 40px - 141px - 20px);  // height viewport - header - footer - margin
`;

const ContainerErrorMessage = styled.div`
    align-items: center;
    display: flex;
    font-size: 17px;
    height: 490px;
    justify-content: center;
`;

const ContainerInfoItems = styled.div`
    min-height: 490px;
`;

const ContainerMovies = styled.div`
    display: grid;
    gap: 10px 10px;
    justify-content: center;
`;

const ContainerOneMovie = styled.div`
    background-image: url(${props => props.src});
    background-position: center;
    background-size: cover; 
    border-radius: 5px;
    cursor: pointer;
    height: 240px;
    overflow: hidden;
    position: relative;

    @media(max-width: 500px){
        height: 340px;
    }
    @media(max-width: 450px){
        height: 500px;
    }
`;

const ContainerReleaseYear = styled.div`
    align-items: center;
    display: flex;
    padding: 0px 10px;
    background: rgba(52, 52 ,52, 0.7);
`;

const ContainerPagination = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 20px 0px;
`;

const ContainerAngle = styled.div`
    cursor: pointer;
`;

const ContainerIndex = styled.button`
    background-color: ${props => props.active? colorRedActive: colorRedNoActive};
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    height: 30px;
    margin: 0px 6px;
    opacity: ${props => props.active? "1": "0.7"};
    text-align: center;
    width: 30px;
`;