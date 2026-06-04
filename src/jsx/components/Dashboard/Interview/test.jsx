<ul>
                                                    {SidebarData?.map((item,index)=>(
                                                        <li key={index} onClick={(navindex)=>navhead(navindex)}>
                                                            <a href={item.path}>
                                                                {item.icon}
                                                                {item.title}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                     
                                     
                                     <div className=" top-head-data details ${navhead===tab1?"active":""}">
                                     <div className='row-flex ' style={{ width: "100%" }}>
                                        
                                     </div>
                                     <div className='col-flex table-data'>
                                         <div className='row-flex flex-wrap userInfo'>
                                             <div className='userInfoDetail'>First Name: <br></br><strong className='value-color'>{candidateDetails.first_name}</strong>{ }</div>
                                             <div className='userInfoDetail'>Last Name: <br></br><strong className='value-color'>{candidateDetails.last_name}</strong>{ }</div>
                                             <div className='userInfoDetail'>Email Id: <br></br><strong className='value-color'>{candidateDetails.primary_email}</strong>{ }</div>
                                             <div className='userInfoDetail'>Contact Number: <br></br><strong className='value-color'>{candidateDetails.primary_contact}</strong>{ }</div>
                                             <div className='userInfoDetail'>Visa Status: <br></br> <strong className='value-color'>{candidateDetails.visa_status}</strong> { }</div>
                                             <div className='userInfoDetail'>OPT Letter Status: <br></br> <strong className='value-color'>{candidateDetails.opt_letter_status}</strong>{ }</div>
                                             <div className='userInfoDetail'>US Entry Date: <br></br><strong className='value-color'>{candidateDetails.us_entry_date}</strong>{ }</div>
                                             <div className='userInfoDetail'>University: <br></br><strong className='value-color'>{candidateDetails.university_name}</strong>{ }</div>
                                             <div className='userInfoDetail'>Visa at the time of US Entry: <br></br><strong className='value-color'>{candidateDetails.us_entry_date}</strong>{ }</div>
                                             <div className='userInfoDetail'>Address:  <br></br><strong className='value-color'>{candidateDetails.candidate_address1}</strong>{ }</div>
                                         </div>

                                         <div className='row-flex'>
                                             
                                         </div>

                                         <div className='row-flex  '>
                                             
                                         </div>

                                         <div className='row-flex '>
                                             
                                         </div>
                                     </div>
                                 </div>
                                     <div className=" top-head-data details ${navhead===tab2?"active":""}">
                                     <div className='row-flex ' style={{ width: "100%" }}>
                                        
                                     </div>
                                     <div className='col-flex table-data'>
                                         <div className='row-flex flex-wrap userInfo'>
                                             <div className='userInfoDetail'>First Name: <br></br><strong className='value-color'>{candidateDetails.first_name}</strong>{ }</div>
                                             <div className='userInfoDetail'>Last Name: <br></br><strong className='value-color'>{candidateDetails.last_name}</strong>{ }</div>
                                             <div className='userInfoDetail'>Email Id: <br></br><strong className='value-color'>{candidateDetails.primary_email}</strong>{ }</div>
                                             <div className='userInfoDetail'>Contact Number: <br></br><strong className='value-color'>{candidateDetails.primary_contact}</strong>{ }</div>
                                             <div className='userInfoDetail'>Visa Status: <br></br> <strong className='value-color'>{candidateDetails.visa_status}</strong> { }</div>
                                             <div className='userInfoDetail'>OPT Letter Status: <br></br> <strong className='value-color'>{candidateDetails.opt_letter_status}</strong>{ }</div>
                                             <div className='userInfoDetail'>US Entry Date: <br></br><strong className='value-color'>{candidateDetails.us_entry_date}</strong>{ }</div>
                                             <div className='userInfoDetail'>University: <br></br><strong className='value-color'>{candidateDetails.university_name}</strong>{ }</div>
                                             <div className='userInfoDetail'>Visa at the time of US Entry: <br></br><strong className='value-color'>{candidateDetails.us_entry_date}</strong>{ }</div>
                                             <div className='userInfoDetail'>Address:  <br></br><strong className='value-color'>{candidateDetails.candidate_address1}</strong>{ }</div>
                                         </div>

                                         <div className='row-flex'>
                                             
                                         </div>

                                         <div className='row-flex  '>
                                             
                                         </div>

                                         <div className='row-flex '>
                                             
                                         </div>
                                     </div>
                                 </div>