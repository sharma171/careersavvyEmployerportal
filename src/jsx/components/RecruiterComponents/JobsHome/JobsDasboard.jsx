import React, { Fragment, useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../../context/ThemeContext";
import "../css/jobDashboard.css?ver0.5";
import ShareIcon from "../images/ShareIcon.png";
import JobComp from "../images/jobComp.svg";
import filterIcon from "../images/filter.svg";
import NJobIcon from "../images/nJobsIcon.png";
import celanderIcon from "../images/celanderIcon.png"
import locationIcon from "../images/locationIcon.png"
import { setJobId  } from "../../../../store/actions/actions";
import UserIcon from "../images/userIcon.png";

const JobsDashboardHome = () => {
        const userEmail = useSelector(state => state.auth.auth.email);
        const dispatch = useDispatch();
        const { jobId } = useSelector((state) => state.profile);
        const navigate = useNavigate();
        const [ jobsData, setJobsData ] = useState([]);
        useEffect(()=>{
            if(userEmail!==""){
                retrieveJobPost();
            }
        },[userEmail]);
        
        
        const retrieveJobPost = async () => {
            try {
            const queryObj = {
                "task_name": "retrieve",
                "job_posted_by": userEmail
            };
        
            const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/save_employer_job_post_v2", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(queryObj),
            });
        
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
        
            const data = await response.json();
            setJobsData(data.data)
            } catch (error) {
            console.error("File Error:", error);
            }
        };
    return(
        <>
            <Fragment>
                <div className="jobDashboard row">
                    <div className="col-xl-4">
                        <div className="GraphicalCard d-flex">
                            <div className="card-head-row ">
                                <h3 className="head">Candidates Applied</h3>
                                <img src={ShareIcon} alt="" className="shareIcon" />
                            </div>
                            <div className="widthDivider"></div>
                            <div className="Infographic-row d-flex">
                                <div className="left-number d-flex">
                                    <span className="value">250</span>
                                    <span className="value">200</span>
                                    <span className="value">150</span>
                                    <span className="value">100</span>
                                    <span className="value">50</span>
                                    <span className="value">0</span>
                                </div>
                                <div className="rightgraph d-flex flex-col">
                                    <div className="graphical-relative d-flex flex-col">
                                        <div className="gridLines">
                                            <div className="grid"></div>
                                            <div className="grid"></div>
                                            <div className="grid"></div>
                                            <div className="grid"></div>
                                            <div className="grid"></div>
                                            <div className="grid"></div>
                                        </div>
                                        <div className="barLines">
                                            <div className="lineData" style={{left:"0", height:"20%"}}>
                                                
                                            </div>
                                            <div className="lineData" style={{left:"16.6%"}}>

                                            </div>
                                            <div className="lineData" style={{left:"33.333%"}}>

                                            </div>
                                            <div className="lineData" style={{left:"49.9999%"}}>

                                            </div>
                                            <div className="lineData" style={{left:"65.6666666%"}}>

                                            </div>
                                            <div className="lineData" style={{left:"83.333%"}}>

                                            </div>
                                            <div className="lineData" style={{left:"100%"}}>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="bottom-number d-flex">
                                        <div className="value">05/24</div>
                                        <div className="value">06/24</div>
                                        <div className="value">07/24</div>
                                        <div className="value">08/24</div>
                                        <div className="value">09/24</div>
                                        <div className="value">10/24</div>
                                        <div className="value">11/24</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4">
                        <div className="GraphicalCard two d-flex">
                                                    <div className="card-head-row ">
                                                        <h3 className="head">Jobs Posted By User</h3>
                                                        <img src={ShareIcon} alt="" className="shareIcon" />
                                                    </div>
                                                    <div className="widthDivider"></div>
                                                    <div className="Infographic-row d-flex">
                                                        <div className="left-number d-flex">
                                                            <span className="value">250</span>
                                                            <span className="value">200</span>
                                                            <span className="value">150</span>
                                                            <span className="value">100</span>
                                                            <span className="value">50</span>
                                                            <span className="value">0</span>
                                                        </div>
                                                        <div className="rightgraph d-flex flex-col">
                                                            <div className="graphical-relative d-flex flex-col">
                                                                <div className="gridLines">
                                                                    <div className="grid"></div>
                                                                    <div className="grid"></div>
                                                                    <div className="grid"></div>
                                                                    <div className="grid"></div>
                                                                    <div className="grid"></div>
                                                                    <div className="grid"></div>
                                                                </div>
                                                                <div className="barLines">
                                                                    <div className="lineData" style={{left:"0", height:"20%"}}>
                                                                        
                                                                    </div>
                                                                    <div className="lineData" style={{left:"16.6%"}}>
                        
                                                                    </div>
                                                                    <div className="lineData" style={{left:"33.333%"}}>
                        
                                                                    </div>
                                                                    <div className="lineData" style={{left:"49.9999%"}}>
                        
                                                                    </div>
                                                                    <div className="lineData" style={{left:"65.6666666%"}}>
                        
                                                                    </div>
                                                                    <div className="lineData" style={{left:"83.333%"}}>
                        
                                                                    </div>
                                                                    <div className="lineData" style={{left:"100%"}}>
                        
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="bottom-number d-flex">
                                                                <div className="value">05/24</div>
                                                                <div className="value">06/24</div>
                                                                <div className="value">07/24</div>
                                                                <div className="value">08/24</div>
                                                                <div className="value">09/24</div>
                                                                <div className="value">10/24</div>
                                                                <div className="value">11/24</div>
                                                            </div>
                                                        </div>
                                                    </div>
                    </div>
                    </div>
                    <div className="col-xl-4">
                        <div className="GraphicalCard three d-flex">
                            <div className="card-head-row ">
                                <h3 className="head">Job Apply By Users</h3>
                                <img src={ShareIcon} alt="" className="shareIcon" />
                            </div>
                            <div className="widthDivider"></div>
                            <div className="Infographic-row d-flex">
                                <div className="left-number d-flex">
                                    <span className="value">250</span>
                                    <span className="value">200</span>
                                    <span className="value">150</span>
                                    <span className="value">100</span>
                                    <span className="value">50</span>
                                    <span className="value">0</span>
                                </div>
                                <div className="rightgraph d-flex flex-col">
                                    <div className="graphical-relative d-flex flex-col">
                                        <div className="gridLines">
                                            <div className="grid"></div>
                                            <div className="grid"></div>
                                            <div className="grid"></div>
                                            <div className="grid"></div>
                                            <div className="grid"></div>
                                            <div className="grid"></div>
                                        </div>
                                        <div className="barLines">
                                            <div className="lineData" style={{left:"0", height:"20%"}}>
                                                
                                            </div>
                                            <div className="lineData" style={{left:"16.6%"}}>

                                            </div>
                                            <div className="lineData" style={{left:"33.333%"}}>

                                            </div>
                                            <div className="lineData" style={{left:"49.9999%"}}>

                                            </div>
                                            <div className="lineData" style={{left:"65.6666666%"}}>

                                            </div>
                                            <div className="lineData" style={{left:"83.333%"}}>

                                            </div>
                                            <div className="lineData" style={{left:"100%"}}>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="bottom-number d-flex">
                                        <div className="value">05/24</div>
                                        <div className="value">06/24</div>
                                        <div className="value">07/24</div>
                                        <div className="value">08/24</div>
                                        <div className="value">09/24</div>
                                        <div className="value">10/24</div>
                                        <div className="value">11/24</div>
                                    </div>
                                </div>
                            </div>
                    </div>
                    </div>
                    <div className="col-xl-12">
                        <div className="dashJobList">
                            <div className="topHead">
                                <div className="twoOptionButton">
                                    <div className="left active">Open For Hire</div>
                                    <div className="right">Closed For Hire</div>
                                </div>
                                <div className="searchFilter">
                                    <input type="text" placeholder="Search By Title, Candidates, Email Id" className="search" />
                                    <button className="filter-Button">
                                        <img src={filterIcon} alt="" className="icon" />
                                        Filters
                                    </button>
                                </div>
                                <div className="newJobButton" onClick={()=>navigate("/createjobs")}>
                                    <img src={NJobIcon} alt="" className="icon" />
                                    Post a New Job
                                </div>
                            </div>
                            <div className="f-w-divider"></div>
                            <div className="jobList">
                                {jobsData.map((item)=>(
                                    <>
                                    <div className="item">
                                        <div className="jobRow">
                                            <div className="Micon">
                                            {item.employer_name
                                            ? `${item.job_title.charAt(0)}${item.job_title.charAt(item.job_title.length - 1)}`
                                            : ""}
                                            </div>
                                            <div className="compTitle">
                                                <h4 className="compName">{item.employer_name}</h4>
                                                <h3 className="mHead">{item.job_title}</h3>
                                            </div>
                                        </div>
                                        <div className="jobInfo">
                                            <div className="colorTags">
                                                <div className="tags">
                                                    {item.job_is_remote ? "Remote" : "Onsite"}
                                                </div>
                                                <div className="tags">
                                                    {item.job_employment_type}
                                                </div>
                                                <div className="tags">
                                                    {item.job_description.compensation}
                                                </div>
                                            </div>
                                            <div className="infoGraph">
                                                <div className="info">
                                                    <img src={celanderIcon} alt="" className="icon" />
                                                    {new Date(item.job_posted_at_datetime_utc).toLocaleDateString('en-US')}
                                                </div>
                                                <div className="info">
                                                    <img src={locationIcon} alt="" className="icon" />
                                                    {item.job_city}, {item.job_state}, {item.job_country}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="actionButton">
                                            <button className="applybutton voilet" onClick={()=>{dispatch(setJobId(item.job_id));navigate(`/overviewPage?candidateList=${item.job_id}`)}}>
                                                <img src={UserIcon} alt="user" className="user" />
                                                Candidates List
                                            </button>
                                            <button className="applybutton yellow ml-2" onClick={()=>{dispatch(setJobId(item.job_id));navigate(`/createjobs?id=${item.job_id}`)}} style={{marginLeft:"12px"}}>
                                                Edit Job
                                            </button>
                                        </div>
                                    </div>
                                    <div className="f-w-divider"></div>
                                    </>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        </>
    )
}
export default JobsDashboardHome