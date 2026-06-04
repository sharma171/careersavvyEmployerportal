import React, { useState } from "react";
import { useSelector } from "react-redux";
import { User } from 'lucide-react';
import "./style/OverviewDashboard.css";

const OverviewDashboard = ({overviewDashData}) => {
  return (
    <>
        <div className="overviewDash">
            <div className="row">
                <div className="col-md-3">
                    <div className="OvCards">
                        <div className="cardRow">
                            <div className="icon bluebg"> <User /></div>
                            <div className="DataCol">
                                <div className="number">{overviewDashData.total_requested}</div>
                                <div className="info">Total Requested</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="OvCards">
                        <div className="cardRow">
                            <div className="icon greenbg"> <User /></div>
                            <div className="DataCol">
                                <div className="number">{overviewDashData.total_completed}</div>
                                <div className="info">Completed</div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-md-3">
                    <div className="OvCards">
                        <div className="cardRow">
                            <div className="icon orangebg"> <User /></div>
                            <div className="DataCol">
                                <div className="number">{overviewDashData.pending}</div>
                                <div className="info">Pending</div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-md-3">
                    <div className="OvCards">
                        <div className="cardRow">
                            <div className="icon violetbg"> <User /></div>
                            <div className="DataCol">
                                <div className="number">{overviewDashData.in_progress||0}</div>
                                <div className="info">In Progress</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="progressDash">
                        <div className="dataCol">
                            <h3 className="cardHead">
                                Reference Collection Progress
                            </h3>
                            <div className="ProgressRow">
                                <h4 className="progressTitle">
                                    Overall Progress
                                </h4>
                                <h4 className="resultScore">
                                    {overviewDashData.total_completed||0}/{overviewDashData.total_requested} completed
                                </h4>
                            </div>
                            <div className="progressBar">
                                <div
                                    style={{
                                    width: `${
                                        overviewDashData.total_requested > 0
                                        ? (overviewDashData.total_completed / overviewDashData.total_requested) * 100
                                        : 0
                                    }%`
                                    }}
                                    className="progressIn"
                                ></div>
                            </div>
                            {/* <div className="ProgressRow">
                                <h4 className="progressDetails">
                                    Overall Progress
                                </h4>
                                <h4 className="progressDetails">
                                     {overviewDashData.total_completed}/{overviewDashData.total_requested} completed
                                </h4>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </>
  )
}

export default OverviewDashboard