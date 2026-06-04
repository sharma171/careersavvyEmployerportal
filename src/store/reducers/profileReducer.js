// profileReducer.js
const initialState = {
  resetEmail: '',
  apiToken: '',
  apiTokenReady: false,
  profileData: {},
  techSkills: [],
  productCode: "",
  fileResume: "",
  jobId: "",
  activities: [],
  jobsApplied: [],
  jobsList: [],
  overviewPost:{
        "employer_name": "",
        "employer_website": "",
        "employer_company_type": "",
        "employer_linkedin": "",
        "job_publisher": "",
        "job_employment_type": "",
        "job_title": "",
        "job_apply_link": "",
        "job_apply_quality_score": "",
        "job_city": "",
        "job_state": "",
        "job_country": "",
        "job_highlights": {
            "Qualifications": [""],
            "Responsibilities": [""],
            "Benefits": [""]
        },
        "job_is_remote": null,
        "job_description": {
            "overview": "",
            "requirements": "",
            "compensation": "",
            "additional_info": ""
        },
        "job_posted_by": "",
        "job_status": ""
  },
  questionAnswer: JSON.parse(localStorage.getItem("questionAnswer")) || "",
  docId: localStorage.getItem("docId") || "",
  answers: JSON.parse(localStorage.getItem("answers")) || [],
  subscriptionNextAction: "",
  featuresToBlock: [],
  showPro: false,
  membershipData: [],
  isDarkMode: false,
  detailedJob: '',
  detailedJobData:[],
  industryInterview :"",
  linkInterviewQuestions:"",
  userInterviewList:[],
  orgName:[],
  createJobStatus:"",
  sidebarPopupType:"",
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_API_TOKEN':
      return {
        ...state,
        apiToken: action.payload
      };
    case 'SET_RESET_EMAIL':
      return {
        ...state,
        resetEmail: action.payload
      };
    case 'SET_API_TOKEN_READY':
      return {
        ...state,
        apiTokenReady: action.payload
      };
    case 'SET_PROFILE_DATA':
      return {
        ...state,
        profileData: action.payload
      };
    case 'SET_TECH_SKILLS':
      return {
        ...state,
        techSkills: action.payload
      };
    case 'SET_PRODUCT_CODE':
      return {
        ...state,
        productCode: action.payload
      };
      case 'SET_JOB_ID':
      return {
        ...state,
        jobId: action.payload
      };
      case 'SETDETAILEDJOBDATA':
      return {
        ...state,
        detailedJobData: action.payload
      };
    case 'SET_FILE_RESUME':
      return {
        ...state,
        fileResume: action.payload
      };
    case 'SET_ACTIVITIES':
      return {
        ...state,
        activities: action.payload
      };
    case 'SET_JOBS_APPLIED':
      return {
        ...state,
        jobsApplied: action.payload
      };
    case 'SET_JOBS_LIST':
      return {
        ...state,
        jobsList: action.payload
      };
    case 'SET_DISPLAY_MODE':
      return {
        ...state,
        isDarkMode: action.payload
      };
    case 'SET_EXAM_QUESTION_ANSWER':
      return {
        ...state,
        questionAnswer: action.payload
      };
    case 'SET_DOC_ID':
      return {
        ...state,
        docId: action.payload
      };
    case 'SET_ANSWERS':
      return {
        ...state,
        answers: action.payload
      };
    case 'SET_Subscription_Actions':
      return {
        ...state,
        subscriptionNextAction: action.payload
      };
    case 'SET_FEATURES_TO_BLOCK':
      return {
        ...state,
        featuresToBlock: action.payload
      };
    case 'SET_SHOW_PRO':
      return {
        ...state,
        showPro: action.payload
      };
    case 'SET_MEMBERSHIP_DATA':
      return {
        ...state,
        membershipData: action.payload
      };
    case 'ACTIVE_JOB_ID':
      return {
        ...state,
        detailedJob: action.payload
      };
    case 'SET_OVERVIEW_POST':
      return {
        ...state,
        overviewPost: action.payload
      };
      case 'SET_INDUSTRY_INTERVIEW':
      return {
        ...state,
        industryInterview: action.payload
      };
    case 'SET_LINK_INTERVIEW_QUESTION':
      return {
        ...state,
        linkInterviewQuestions: action.payload
      };
    case 'SET_USER_INTERVIEW_LIST':
      return {
        ...state,
        userInterviewList: action.payload
      };
    case 'SET_ORGANISATION_NAME':
      return {
        ...state,
        orgName: action.payload
      };
    case 'SET_CREATE_JOB_STATUS':
      return {
        ...state,
        createJobStatus: action.payload
      };
    case 'SET_SIDEBAR_POPUP_TYPE':
      return {
        ...state,
        sidebarPopupType: action.payload
      };
    default:
      return state;
  }
};

export default profileReducer; // Ensure this is default export
