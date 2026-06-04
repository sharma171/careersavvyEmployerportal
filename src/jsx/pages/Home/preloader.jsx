import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./style.css";
import "./responsiveStyle.css";
import { useNavigate } from 'react-router-dom';
import CareerSavvyLogo from "../../../images/site_logo.jpg";
import TextAi from "./icons & images/textAiIcon.svg";
import heroBgMesh from "./icons & images/heroBgMesh.svg";
import AiGifIcon from "../../../jsx/components/Dashboard/SearchJobs/aiIcon.gif";
import AbsoluteOne from "./icons & images/AbsoluteThumb1.svg";
import AbsoluteTwo from "./icons & images/AbsoluteThumbTwo.svg";
import AbsoluteThree from "./icons & images/AbsoluteThumbThree.svg";
import AbsoluteFour from "./icons & images/AbsoluteThumbFour.svg";
import AbsoluteFive from "./icons & images/AbsoluteThumbFive.svg";
import AbsoluteSix from "./icons & images/AbsoluteThumbSix.svg";
import ResumeProfile from "./icons & images/ResumeProfile.svg";
import jobActivityTracking from "./icons & images/jobActivityTracking.svg";
import ResumeAiIcon from "./icons & images/ResumeAiIcon.svg";
import AiSmartAudio from "./icons & images/aiSmartAudio.svg";
import AiInterview from "./icons & images/AiInterview.svg";
import AspireQuestDashboard from "./icons & images/AspireQuestDashboard.svg";
import CuratedTips from "./icons & images/curated.svg";
import LevelUpInsights from "./icons & images/LevelUpCareer.svg";
import ClockIcons from "./icons & images/ClockIcons.svg";
import SatisfyIcons from "./icons & images/SatisfyIcons.svg";
import AiCompressIcon from "./icons & images/aigif compressed.gif";
import GraphIcons from "./icons & images/GraphIcons.svg";
import JourneyOne from "./icons & images/JourneyOne.svg";
import JourneyTwo from "./icons & images/JourneyTwo.svg";
import TopHeadIcon from "./icons & images/TopHeadIcon.svg";
import SignupForgotIcon from "./icons & images/SignUpForgotIcon.svg";
import TrialPlan from "./icons & images/TrialPlan.svg";
import TutorialCareerSavvy from "./icons & images/tutorialCareerSavvy.svg";
import QuestionAnswer from "./icons & images/QuestionAnswer.svg";
import OtherQuery from "./icons & images/OtherQuery.svg";
import CareerImage from "./icons & images/careerSavvy-wide.svg";
import SectionLoad from "./icons & images/spin.gif"
export default function Preloader() {
    const navigate = useNavigate();
    
    const [activeCard, setActiveCard] = useState(1);
    const [querySubmit, setQuerySubmit] = useState('');
    const [footerPage, setFooterPage] = useState('');
    const [showSection,setShowSection] = useState(false);
    const [loaderAnimation,setLoaderAnimation] = useState(true);
        
    useEffect(() => {
        setTimeout(()=>{
            setLoaderAnimation(false);
        },1000)
        setTimeout(()=>{
            setShowSection(true);
        },7000);
    }, [])
    

    const feedbackData = [
        { id: 1, icon: SignupForgotIcon, text: "Unable to Signup or Forgot Your Password or Username" },
        { id: 2, icon: TrialPlan, text: "Trial Plan Ask Queries & Question" },
        { id: 3, icon: TutorialCareerSavvy, text: "Tutorials of Career Savvy" },
        { id: 4, icon: TrialPlan, text: "Pricing plans Queries & Question" },
        { id: 5, icon: QuestionAnswer, text: "Questions & Queries of App" },
        { id: 6, icon: OtherQuery, text: "Do You have some Query, Ask Other Question" },
    ];

    const handleCardClick = (id) => {
        setActiveCard(id); // Set the clicked card as active
    };
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");
    const handleSubmit = async () => {
        if (!email || !feedback || activeCard === null) {
            alert("Please fill in all fields and select a query type.");
            return;
        }

        const selectedFeedbackText = feedbackData.find((card) => card.id === activeCard)?.text;

        const payload = {
            email,
            request_type: "Complaint",
            feedback_text: `${selectedFeedbackText}: ${feedback}`,
            app_name: "Career-Savvy",
        };

        try {
            const response = await fetch("https://us-east1-foursssolutions.cloudfunctions.net/all_user_query_forms_v2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setQuerySubmit("Your query or complaint has been submitted successfully.");
                setEmail("");
                setFeedback("");
                setActiveCard(null);
            } else {
                alert("Failed to submit the query. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting query:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    const [activeIndex, setActiveIndex] = useState(0);
    const faqData = [
        {
            question: "Is CareerSavvy free?",
            answer: "You’ll get a 3-day free trial as soon as you sign up. After that, you’ll need to upgrade to enjoy our premium features. Think of it as the VIP lounge for job seekers—free to peek inside, but you’ll want to stay and enjoy the perks! Plus, at $4.99, it’s cheaper than a fancy latte (and lasts longer too).",
        },
        {
            question: "Do I need to upload a resume to use CareerSavvy?",
            answer: "Yes, uploading a resume is mandatory. CareerSavvy is like a resume whisperer—everything revolves around it. Without it, we’d just be guessing, and nobody likes guesswork when it comes to landing a job. So, upload that masterpiece and let’s get started!",
        },
        {
            question: "What features are included in the free trial?",
            answer: "In the 3-day free trial, you’ll get a taste of the CareerSavvy magic, including: Job recommendations just for you (we swear we’re not stalking), resume tips that make you look like the rockstar you are, and one mock interview to show the world you’re ready. After that, upgrade to Pro and keep riding the job search wave. You won’t regret it!",
        },
        {
            question: "How does CareerSavvy help with job applications?",
            answer: "CareerSavvy’s AI is like your overachieving best friend—it matches your resume to the perfect jobs, optimizes it for recruiters, and basically does everything except the interview. (You’ve got that part covered, right?)",
        },
        {
            question: "Can CareerSavvy prepare me for interviews?",
            answer: "Absolutely! Our Mock Interview tool is like a brutally honest friend—it tells you what’s working, what’s not, and helps you polish your answers until they shine brighter than your morning coffee.",
        },
        {
            question: "Why is CareerSavvy’s subscription only $4.99?",
            answer: "Because we believe finding a job shouldn’t cost a fortune! At just $4.99, it’s cheaper than your favorite snack—plus, it helps you land a job to afford all the snacks you want.",
        },
        {
            question: "What happens if I don’t upgrade after the free trial?",
            answer: "You’ll still have access to a limited set of features, but honestly, it’s like eating fries without ketchup. Sure, it’s fine, but you’ll miss the full experience. Upgrade to Pro and dip into the good stuff!",
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer: "Yes, we’re not clingy. Cancel anytime, no hard feelings. But we think you’ll stay—after all, who walks away from the perfect wingman for their career?",
        },
        {
            question: "How does Aspire Quest work?",
            answer: "Aspire Quest is like your personal quiz master, throwing skill-based challenges at you. You’ll get AI-generated questions, feedback, and even ratings. Think of it as leveling up for your career—but without the boss battles.",
        },
        {
            question: "How often are job listings updated?",
            answer: "Our job listings are updated every hour—because job opportunities don’t sleep, and neither do we (just kidding, we sleep... sometimes). Rest assured, you’ll always see fresh opportunities tailored to you.",
        },
        {
            question: "Why is the subscription price $4.99 and not $5?",
            answer: "Because we know every cent counts. Plus, we like to keep things interesting—$4.99 just sounds cooler, doesn’t it? Also, now you have an excuse to tell your friends, 'I got all this for less than $5!'",
        },
    ];


    const toggleActive = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };
    function SignUpPage() {
        navigate("/login");
    }
    

    return (
        <>
        {loaderAnimation && (
                            <div className="LoaderAnimation">
                               <div className="gptAnimate"></div>
                               <img className="gptIcon" src={AiCompressIcon} alt="gptIcon"/>
                         </div>)}
            <div className="home-page">
                <div className="mainHeader d-flex align-items-center justify-content-between p-3">
                    <div className="d-flex align-items-center">
                        <img
                            src={CareerSavvyLogo}

                            alt="CareerSavvy Logo"
                            className="rounded-circle logo"
                        />
                        <h5 className="m-0">CareerSavvy</h5>
                    </div>
                    <button className="btn btn-primary rounded-pill subcribe-button" onClick={SignUpPage}>
                        <span className="text">Get Started</span><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.08936 0.419117L16.105 8.43474L8.08936 16.4504L6.68311 15.0441L12.2612 9.41912L0.0737309 9.41912V7.45037L12.2612 7.45037L6.68311 1.82537L8.08936 0.419117Z" fill="#221EA9" />
                        </svg>

                    </button>
                </div>
                <div className="hero">
                    <div className="square"></div>
                    <div className="circle"></div>
                    <div className="star"></div>
                    <div className="container">
                        <div className="col-flex heroCenter">
                            <h1 className='heading1 introductory'>
                                Welcome to CareerSavvy
                            </h1>
                            <h2 className="bigHeading">
                                Personalised AI
                                <span className='icon'>
                                    <img src={TextAi} alt="icons" />
                                </span>
                                Powered <br></br><strong>Job Search Assistant</strong>
                            </h2>

                            <div className="infographic col-flex">
                                <img src={heroBgMesh} className='heroBgMesh' alt="bgMesh" />
                                <img src={AiGifIcon} alt="AiIcon" className="centerAiIcon" />
                                <div className="inabsolute">
                                    <div className="info row-flex one">
                                        <div className="thumb">
                                            <div className="thumbInner"><img src={AbsoluteOne} alt="icons" /></div>
                                        </div>
                                        <h3 className="heading">Smart Jobs, Smarter AI</h3>
                                    </div>
                                    <div className="info row-flex two">
                                        <div className="thumb">
                                            <div className="thumbInner"><img src={AbsoluteTwo} alt="icons" /></div>
                                        </div>
                                        <h3 className="heading">Your Resume’s AI Stylist</h3>
                                    </div>
                                    <div className="info row-flex three">
                                        <div className="thumb">
                                            <div className="thumbInner"><img src={AbsoluteThree} alt="icons" /></div>
                                        </div>
                                        <h3 className="heading">Interviews? Nailed It (With AI)</h3>
                                    </div>
                                    <div className="info row-flex four">
                                        <div className="thumb">
                                            <div className="thumbInner"><img src={AbsoluteFour} alt="icons" /></div>
                                        </div>
                                        <h3 className="heading">Job Boards, Meet AI Magic</h3>
                                    </div>
                                    <div className="info row-flex five">
                                        <div className="thumb">
                                            <div className="thumbInner"><img src={AbsoluteFive} alt="icons" /></div>
                                        </div>
                                        <h3 className="heading">AI That Tracks, So You Don’t Have To</h3>
                                    </div>
                                    <div className="info row-flex six">
                                        <div className="thumb">
                                            <div className="thumbInner"><img src={AbsoluteSix} alt="icons" /></div>
                                        </div>
                                        <h3 className="heading">Career Advice, Straight From the Future</h3>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-primary rounded-pill subcribe-button" onClick={SignUpPage}>
                                <span className="text">Get Started</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.30266 6.08057H17.6385V17.4164H15.6497L15.6166 9.49457L6.99872 18.1124L5.6066 16.7203L14.2245 8.10245L6.30266 8.06931V6.08057Z" fill="#221EA9" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                {!showSection && (<>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:"center"
                }}>
                    <img src={SectionLoad} alt="section" style={{width:"60px",margin:"20px auto", borderRadius:"100px"}} />
                </div>
                </>)}
                {showSection ? (
                    <>
                    <div className="featuresSection">
                    <div className="container">
                        <div className="col-flex featuresInner">
                            <h3 className="mTopicHead">
                                Our Key Features
                            </h3>
                            <div className="TimeLine"></div>
                            <h4 className="topicSubHead">
                                AI Powered Job Matches
                            </h4>
                            <h5 className="subTopic">
                                Save time by finding jobs that match your profile.
                            </h5>
                            <div className="row-flex featuresRows">
                                <div className="featuresCard">
                                    <div className="featureThumb animation">
                                        <img src={ResumeProfile} alt="resume profile" className='featureIcon' />
                                        <div className="scanning"></div>
                                    </div>
                                    <span className='text'>AI Powered Profile Analysis for Jobs</span>
                                </div>
                                <div className="featuresCard">
                                    <div className="featureThumb">
                                        <img src={jobActivityTracking} alt="job track" className='featureIcon' />
                                    </div>
                                    <span className='text'>Applied Jobs Tracking and Recent Activities</span>
                                </div>
                                <div className="featuresCard">
                                    <div className="featureThumb">
                                        <img src={ResumeAiIcon} alt="insights" className='featureIcon' />
                                    </div>
                                    <span className='text'>Jobs Based Resume Insights</span>
                                </div>
                            </div>
                            <div className="widthDashDivider"></div>
                            <div className="botTimeLine"></div>
                            <h4 className="topicSubHead">
                                AI Powered Mock Interviews
                            </h4>
                            <h5 className="subTopic">
                                Practice with AI-driven interview simulations and get instant feedback.
                            </h5>
                            <div className="row-flex featuresRows">
                                <div className="featuresCard">
                                    <div className="featureThumb">
                                        <img src={AiSmartAudio} alt="resume profile" className='featureIcon' />
                                    </div>
                                    <span className='text'>Ai Smart Audio Recognition</span>
                                </div>
                                <div className="featuresCard">
                                    <div className="featureThumb">
                                        <img src={AiInterview} alt="job track" className='featureIcon' />
                                    </div>
                                    <span className='text'>AI Driven Interview Simulation</span>
                                </div>
                                <div className="featuresCard">
                                    <div className="featureThumb">
                                        <img src={AspireQuestDashboard} alt="insights" className='featureIcon' />
                                    </div>
                                    <span className='text'>Aspire Quest Exam and Dashboard</span>
                                </div>
                            </div>
                            <div className="widthDashDivider"></div>
                            <div className="botTimeLine"></div>
                            <h4 className="topicSubHead">
                                AI Powered Career Insights
                            </h4>
                            <h5 className="subTopic">
                                Stay ahead with curated tips, certifications, and trending technologies.
                            </h5>
                            <div className="row-flex featuresRows">
                                <div className="featuresCard">
                                    <div className="featureThumb">
                                        <img src={CuratedTips} alt="resume profile" className='featureIcon' />
                                    </div>
                                    <span className='text'>Stay ahead with curated tips</span>
                                </div>
                                <div className="featuresCard">
                                    <div className="featureThumb">
                                        <img src={LevelUpInsights} alt="job track" className='featureIcon' />
                                    </div>
                                    <span className='text'>Level-Up Career  with Insights</span>
                                </div>
                            </div>
                            <div className="widthDashDivider"></div>
                        </div>
                    </div>
                </div>
                <div className="resultSection">
                    <div className="container">
                        <div className="col-flex resultInner">
                            <h4 className="topicSubHead">
                                CareerSavvy at a <strong>Glance</strong>
                            </h4>
                            <h5 className="subTopic">
                                More opportunities, better offers, and a quicker journey to your dream job!
                            </h5>
                            <div className="resultRow row-flex">
                                <div className="resultCard col-flex">
                                    <div className="bigNumbers">1000+</div>
                                    <div className="row-flex head">
                                        <img src={ClockIcons} alt="" className="icons" />
                                        <span>Jobs Added Every Hour</span>
                                    </div>
                                </div>
                                <div className="resultCard col-flex">
                                    <div className="bigNumbers">99%</div>
                                    <div className="row-flex head">
                                        <img src={SatisfyIcons} alt="" className="icons" />
                                        <span>User Satisfaction Rate</span>
                                    </div>
                                </div>
                                <div className="resultCard col-flex">
                                    <div className="bigNumbers">Unlimited</div>
                                    <div className="row-flex head">
                                        <img src={GraphIcons} alt="" className="icons" />
                                        <span>Unlimited Growth Potential </span>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-primary rounded-pill subcribe-button" onClick={SignUpPage}>
                                <span className="text">Get Started</span><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.08936 0.419117L16.105 8.43474L8.08936 16.4504L6.68311 15.0441L12.2612 9.41912L0.0737309 9.41912V7.45037L12.2612 7.45037L6.68311 1.82537L8.08936 0.419117Z" fill="#221EA9" />
                                </svg>

                            </button>
                        </div>
                    </div>

                </div>
                <div className="JourneySection">
                    <div className="container">
                        <div className="journeyInner col-flex">
                            <h4 className="topicSubHead">
                                Streamline your entire job search journey with <strong> CareerSavvy</strong>
                            </h4>
                            <h5 className="subTopic">
                                Your Journey with CareerSavvy Starts Here:
                            </h5>
                            <div className="col-flex JColumns">
                                <div className="row-flex journeyCards">
                                    <div className="JourneyInfo col-flex">
                                        <div className="row-flex topHead">
                                            <img src={TopHeadIcon} alt="Join us" className="icon" />
                                            <span>Join Us and Register New Account</span>
                                        </div>
                                        <h3 className="infoHead">Start your career journey by <strong>creating New account</strong></h3>
                                        <span className='info'>Unlock a 3-day free trial of premium features to explore our full potential.</span>
                                        <button className="btn btn-primary rounded-pill subcribe-button" onClick={SignUpPage}>
                                            <span className="text">Get Started</span><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.08936 0.419117L16.105 8.43474L8.08936 16.4504L6.68311 15.0441L12.2612 9.41912L0.0737309 9.41912V7.45037L12.2612 7.45037L6.68311 1.82537L8.08936 0.419117Z" fill="#221EA9" />
                                            </svg>

                                        </button>
                                    </div>
                                    <div className="JourneyThumb">
                                        <img src={JourneyOne} alt="JourneyOne" className='bigImage' />
                                    </div>
                                </div>
                                <div className="row-flex journeyCards">
                                    <div className="JourneyInfo col-flex">
                                        <div className="row-flex topHead">
                                            <img src={TopHeadIcon} alt="Join us" className="icon" />
                                            <span>Grow and Track Your career Growth</span>
                                        </div>
                                        <h3 className="infoHead">Elevate & track career growth <strong>CareerSavvy</strong></h3>
                                        <span className='info'>Streamline your journey by managing applications, honing interview skills, and tracking your progress toward professional success - all in one place.</span>
                                        <button className='Product-Btn'>
                                            <span>All @ just $4.99</span>
                                            <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.86084 0.984375L16.8765 9L8.86084 17.0156L7.45459 15.6094L13.0327 9.98437H0.845215V8.01562H13.0327L7.45459 2.39062L8.86084 0.984375Z" fill="#221EA9" />
                                            </svg>

                                        </button>
                                    </div>
                                    <div className="JourneyThumb">
                                        <img src={JourneyTwo} alt="JourneyOne" className='bigImage' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contactUsSection">
                    <div className="container">
                        <div className="contactInner col-flex">
                            <div className="row-flex TwinHead">
                                <h4 className="topicSubHead">
                                    Contact Us
                                </h4>
                                <div className="divider"></div>
                                <h4 className="topicSubHead">
                                    Have any Queries ?
                                </h4>
                            </div>
                            <div className="feedbackBox row-flex">
                                <div className="feedbackSelect col-flex">
                                    <div className="topHead">
                                        Choose Your Queries and Issues
                                    </div>
                                    <div className="feedbackRow row-flex">
                                        {feedbackData.map((card) => (
                                            <div
                                                key={card.id}
                                                className={`feedbackCard col-flex ${activeCard === card.id ? 'active' : ''}`}
                                                onClick={() => handleCardClick(card.id)}
                                            >
                                                <div className="thumb">
                                                    <img src={card.icon} alt="icon" className="icon" />
                                                </div>
                                                <span className="text">{card.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="feedbackInputs col-flex">
                                    <div className="topHead">
                                        Fill Your Details
                                    </div>
                                    <div className="inputCard col-flex">
                                        <input
                                            type="email"
                                            placeholder="Enter your Email Id"
                                            className="name"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <textarea
                                            type="text"
                                            placeholder="Queries..."
                                            className="name"
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                        />
                                        <button className="submit-button" onClick={handleSubmit}>
                                            <span>Submit Your Query
                                            </span>
                                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="10.3264" cy="10.5759" r="9.92407" fill="#D6D1F3" />
                                                <path d="M12.804 10.9292C12.9992 10.734 12.9992 10.4174 12.804 10.2221L9.62198 7.04015C9.42672 6.84489 9.11014 6.84489 8.91488 7.04015C8.71961 7.23541 8.71961 7.55199 8.91488 7.74726L11.7433 10.5757L8.91488 13.4041C8.71961 13.5994 8.71961 13.916 8.91488 14.1112C9.11014 14.3065 9.42672 14.3065 9.62198 14.1112L12.804 10.9292ZM12.1279 11.0757L12.4504 11.0757L12.4504 10.0757L12.1279 10.0757L12.1279 11.0757Z" fill="#341FA8" />
                                            </svg>

                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="faqSection">
                    <div className="container">
                        <div className="faqInner col-flex">
                            <h3 className="mTopicHead">
                                Frequently Asked Questions
                            </h3>
                            <h5 className="subTopic">
                                Stuck on something? We're here to help with all your questions and answers in one place
                            </h5>
                            <div className="faqBox col-flex">
                                {faqData.map((faq, index) => (
                                    <div
                                        key={index}
                                        className={`faqCard col-flex ${activeIndex === index ? "active" : ""}`}
                                        onClick={() => toggleActive(index)}
                                    >
                                        <h4 className="faqHead">{faq.question}</h4>
                                        {activeIndex === index && <p className="faqText">{faq.answer}</p>}
                                        <div className="icon">
                                            <svg
                                                width="56"
                                                height="28"
                                                viewBox="0 0 56 28"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <g clipPath="url(#clip0_570_324)">
                                                    <path
                                                        d="M40.6464 5.7213L43.1198 8.19697L29.6401 21.6813C29.4241 21.8987 29.1673 22.0712 28.8844 22.1889C28.6014 22.3066 28.298 22.3672 27.9916 22.3672C27.6852 22.3672 27.3818 22.3066 27.0989 22.1889C26.8159 22.0712 26.5591 21.8987 26.3431 21.6813L12.8564 8.19697L15.3298 5.72364L27.9881 18.3796L40.6464 5.7213Z"
                                                        fill="black"
                                                    />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_570_324">
                                                        <rect
                                                            width="28"
                                                            height="56"
                                                            fill="white"
                                                            transform="translate(56) rotate(90)"
                                                        />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="fone"></div>
                    <div className="ftwo"></div>
                    <div className="fthree"></div>
                    <div className="ffour"></div>
                    <div className="ffive"></div>
                    <div className="fsix"></div>
                </div>
                <div className="footer">
                    <div className="container">
                        <div className="footer-col col-flex">
                            <div className="row-flex bottom-footer">
                                <img src={CareerImage} alt="careersavvy" className='logo' />
                                <div className='row-flex'>
                                    <span className="text" onClick={() => { setFooterPage('terms&Conditions'); }}>
                                        Terms and Conditions
                                    </span>
                                    <span className="text" onClick={() => { setFooterPage('privacypolicy'); }}>
                                        Privacy & Policy
                                    </span>
                                </div>
                                <div className='row-flex'>
                                    <ul className="social-icons mt-4" style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: "10px"
                                    }}>
                                        <li><Link to={"https://www.facebook.com/share/p/18Gv5rt2Lv/?mibextid=WC7FNe"}><i className="fab fa-facebook-f"
                                            style={{
                                                padding: "4px",
                                                border: "1px solid",
                                                borderRadius: "3px",
                                                width: "26px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignContent: "center",
                                                margin: "0 10px"
                                            }}></i></Link></li>
                                        {/* <li><Link to={"#"}><i className="fab fa-twitter"></i></Link></li> */}
                                        <li><Link to={"https://www.linkedin.com/company/career-savvy-ai/"}><i className="fab fa-linkedin-in"
                                            style={{
                                                padding: "4px",
                                                border: "1px solid",
                                                borderRadius: "3px",
                                                width: "26px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignContent: "center",
                                                margin: "0 10px"
                                            }}></i></Link></li>
                                        <li>
                                            <Link to={"https://www.instagram.com/p/DDYRi7XxGgv/?igsh=bHlla2s1cGwzdHo0"}>
                                                <i className="fab fa-instagram"
                                                    style={{
                                                        padding: "4px",
                                                        border: "1px solid",
                                                        borderRadius: "3px",
                                                        width: "26px",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignContent: "center",
                                                        margin: "0 10px"
                                                    }}></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={"https://www.youtube.com/watch?v=Nkl5TiWo6Bs"} target='blank'>
                                                <i className="fab fa-youtube"
                                                    style={{
                                                        padding: "4px",
                                                        border: "1px solid",
                                                        borderRadius: "3px",
                                                        width: "26px",
                                                        height: "26px",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center", // Corrected `alignContent` to `alignItems` for better centering
                                                        margin: "0 10px"
                                                    }}></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="footer-col col-flex">
                            <div className="row-flex bottom-footer">
                                <div></div>
                                Copyright © Designed & Developed by TB Soft Solutions LLC 2024
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
                {querySubmit !== '' && (
                    <div className="popup">
                        <div className="popup-content">
                            <button onClick={() => setQuerySubmit("")} className='close'>+</button>
                            <h3>Query Status</h3>
                            <p>{querySubmit}</p>
                        </div>
                    </div>
                )}
                {footerPage !== '' && (
                    <div className="footer-Pages">
                        <div className='close' onClick={() => { setFooterPage('') }}>+</div>
                        <div className="container">
                            <div className="col-flex">
                                {footerPage == 'terms&Conditions' ? (
                                    <>
                                        <h3>Terms & Conditions Of Our Portal</h3>
                                        <p>
                                            Welcome to Our Portal! These Terms and Conditions outline the rules and
                                            regulations for your use of our website and services. By accessing or using our site,
                                            you agree to comply with these terms.
                                        </p>
                                        <h5>1. Acceptance of Terms</h5>
                                        <p>
                                            By using our website, you confirm that you accept these Terms and Conditions and
                                            agree to abide by them. If you do not agree with any part of these terms, you must
                                            not use our site.
                                        </p>
                                        <h5>2. Use of Our Services</h5>
                                        <p>
                                            You agree to use our services for lawful purposes only and in a way that does not
                                            infringe on the rights of others or restrict their use and enjoyment of our services.
                                        </p>
                                        <h5>3. Account Responsibilities</h5>
                                        <p>
                                            If you create an account on our site, you are responsible for maintaining the
                                            confidentiality of your account details and for all activities that occur under your
                                            account. You agree to notify us immediately of any unauthorized use of your
                                            account.
                                        </p>
                                        <h5>4. Intellectual Property</h5>
                                        <p>
                                            All content on our website, including text, graphics, logos, and software, is the
                                            property of Our Portal or our licensors and is protected by copyright and other
                                            intellectual property laws. You may not reproduce, distribute, or create derivative
                                            works without our written consent.
                                        </p>
                                        <h5>5. Limitation of Liability</h5>
                                        <p>
                                            To the fullest extent permitted by law, Our Portal shall not be liable for any
                                            indirect, incidental, or consequential damages arising from your use of our site or
                                            services.
                                        </p>
                                        <h5>6. Changes to Terms</h5>
                                        <p>
                                            We reserve the right to modify these Terms and Conditions at any time. Any
                                            changes will be effective immediately upon posting the revised terms on our
                                            website.
                                        </p>
                                        <h5>7. Contact Information</h5>
                                        <p>
                                            If you have any questions about these Terms and Conditions, please contact us at
                                            support@yolojobs.com.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h3>Privacy Policy Of Our Portal</h3>
                                        <p>
                                            At Our Portal, we are committed to protecting your privacy. This Privacy Policy
                                            outlines how we collect, use, and protect your information when you use our
                                            website and services.
                                        </p>
                                        <h5>1. Information We Collect</h5>
                                        <p>
                                            • Personal Information: When you register, apply for jobs, or contact us, we may
                                            collect personal information such as your name, email address, phone number, and
                                            resume.
                                            • Usage Data: We collect information about how you interact with our site,
                                            including your IP address, browser type, jobs applied, and pages visited.
                                        </p>
                                        <h5>2. How We Use Your Information</h5>
                                        <p>
                                            • Job Applications: To facilitate job applications and build connections.
                                            • Job Matching: To connect you with job opportunities that align with your skills
                                            and preferences.
                                            • Application Processing: To facilitate your job applications and communicate
                                            with vendors on your behalf.
                                            • Communication: To send you updates, career roadmaps, and respond to inquiries.
                                            • Improvement of Services: To analyze usage patterns and improve our services and
                                            user experience.
                                        </p>
                                        <h5>3. Sharing Your Information</h5>
                                        <p>
                                            • With Vendors: We may share your information with potential vendors who are
                                            hiring for job openings you apply for.
                                            • Service Providers: We may use third-party services to help operate our website
                                            and services, who may have access to your data under strict confidentiality agreements.
                                        </p>
                                        <h5>4. Data Security</h5>
                                        <p>
                                            We implement a variety of security measures to protect your personal information
                                            from unauthorized access, disclosure, alteration, or destruction. However, please be
                                            aware that no method of transmission over the internet is 100% secure.
                                        </p>
                                        <h5>5. Third-Party Links</h5>
                                        <p>
                                            Our site may contain links to third-party websites. We are not responsible for their
                                            content or privacy practices.
                                        </p>
                                        <h5>6. ChatGPT</h5>
                                        <p>
                                            We may utilize AI technologies, including ChatGPT, to provide support and answer
                                            inquiries. Please note that while we strive for accuracy, we are not responsible for
                                            any inaccuracies or misunderstandings that may arise from the use of these AI tools.
                                        </p>
                                        <h5>7. Your Rights</h5>
                                        <p>
                                            You have the right to:
                                            • Access your personal information.
                                            • Request correction of inaccurate information.
                                            • Request deletion of your personal information.
                                            • Choose not to receive marketing communications.
                                        </p>
                                        <h5>8. Cookies</h5>
                                        <p>
                                            Our website uses cookies to enhance your experience. You can choose to accept or
                                            decline cookies through your browser settings.
                                        </p>
                                        <h5>9. Changes to This Privacy Policy</h5>
                                        <p>
                                            We may update this Privacy Policy from time to time. We will notify you of any
                                            changes by posting the new policy on our website with a new effective date.
                                        </p>
                                        <h5>10. Contact Us</h5>
                                        <p>
                                            If you have any questions about this Privacy Policy, please contact us at
                                            support@yolojobs.com.
                                        </p>
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                )}
                    </>
                ):(<></>)}
                
            </div>
        </>
    )
}
