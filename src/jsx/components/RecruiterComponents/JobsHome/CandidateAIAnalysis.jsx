import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Custom-styled components to replace missing UI components
const Card = ({ children }) => (
  <div className="bg-white shadow-md rounded-lg p-4 border">{children}</div>
);
const CardContent = ({ children }) => <div>{children}</div>;
const Button = ({ children, ...props }) => (
  <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md" {...props}>
    {children}
  </button>
);

const COLORS = ["#40189D", "#E18309", "#0C9D8A", "#FFBB28", "#FF8042"];

const CandidateAIAnalysis = ({ candidateAi, onClose, setAiAnalysis, aiAnalysis }) => {
  if (!candidateAi?.match_summary) return null;
  console.log(candidateAi);

  

  const { candidate_profile, component_scores, overall_match, evaluation, gaps_and_recommendations } =
    candidateAi.match_summary;

  const scoreData = Object.keys(component_scores).map((key, index) => ({
    name: key.replace("_", " ").toUpperCase(),
    value: component_scores[key],
  }));

  return (
    <>
    <div className={`resumeOuter resumeAi light`}>
        <div className="resumeTab AiAiAnalysis">
            <div className="popup-Top-Head">
                <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAv9JREFUWAnNWNtxnTAQpQT/xNKnS9gS3IHdQdJB3IHdgf2XmYAgHdx0cEtwCZTgEvDsCj1WCMMKMcmduQMCaXXYx9ldNU2lH+jhDpT5AG0muqr+HZS5gG5fQLf3lbb5WgzcDDegh2fQ/fd0JujuD4FDgPn/CNoMoH/dpWurjTmI9iUWDKp9WgGWA3wOUAZQdW8xQLxHU4I2P+wfTdtdvdmXWh1zlkhlisbkZ9aUIg1Y4CsuoIZXEQjShPM11b2h34kFrCyIPpCbHQNKsg8gMGeSjClX9t/9eHYDDJoIaH8VCED/8YuH3QsFE602DQe519xEJ6hF0uR5tJAHaZ4E33n+VALpCB6thvcSf9wLMdpohG+/Ye86nAe33WPkUhOkpvYmPcD0jCO1EfutTYve7yemRRa1BcJJCzzVyQFiLg+BOWEO91awCd2jFwuvAZBkqO7iQSrzEQAiMbuoLXTQoya2H0mpMuLGilVQDYBWi3PJRhHd1qOcegBjM3d/vZmP3CCtJFWLmGrc/knAjg0JJ3pZFqFu0dYVdJKyDhDunKetH2KgcOFyp5xrwMixPRtMoPqHrY9L3zOA2kwNN00BwDQLcC4T9yJLgJYgByzZ06/ZM7ZZKIq8AHDcsz6dwwDGXJhOlIxnPw6lEyZ8YT52+7Gkofp39/zwtRrN6P4askklmsGvqwYwLr1cPiY/wn4X093/mOoYORb2IDU0mMgIQcYcs7TcYo27nPTn8j/m01BVWRNT3yrqd9PIsqQt59KMD0+nHpGkwLfGjPssjwbtbS0++32msxs3tWezwz9qOzMnZwsl1YjqhdDkQUZzE+6bTMsPa0R1XrJ9Sm0mI2TshwVpjZm4kLhzAOfeOTRGvrDorqUJgu0zm2Wgk1IBcKIfOg6OakUHbq9ZGZKVAWP6jOC5eLUHmNQlmguvNyOAaOLCEm8FXtOw4NEmNNZULNDJapwJ1u8P5PxVcPjC+yae3CcmZtp15ouvFBTLdV9uWPMlK1pthI6AJwWq+4mmL93rE0nB5c9YGEc5AAAAAElFTkSuQmCC"
                alt=""
                className="icon"
                />
                <h4 className="head">
                    Candidate Analysis
                </h4>
                <div class="close" onClick={()=>setAiAnalysis(false)}>+</div>
            </div>
            <div className="aiContent">

                
                    <div className="d-flex align-items-center justify-content-between jd-head">
                        <div className="suggestion-button">
                            <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAv9JREFUWAnNWNtxnTAQpQT/xNKnS9gS3IHdQdJB3IHdgf2XmYAgHdx0cEtwCZTgEvDsCj1WCMMKMcmduQMCaXXYx9ldNU2lH+jhDpT5AG0muqr+HZS5gG5fQLf3lbb5WgzcDDegh2fQ/fd0JujuD4FDgPn/CNoMoH/dpWurjTmI9iUWDKp9WgGWA3wOUAZQdW8xQLxHU4I2P+wfTdtdvdmXWh1zlkhlisbkZ9aUIg1Y4CsuoIZXEQjShPM11b2h34kFrCyIPpCbHQNKsg8gMGeSjClX9t/9eHYDDJoIaH8VCED/8YuH3QsFE602DQe519xEJ6hF0uR5tJAHaZ4E33n+VALpCB6thvcSf9wLMdpohG+/Ye86nAe33WPkUhOkpvYmPcD0jCO1EfutTYve7yemRRa1BcJJCzzVyQFiLg+BOWEO91awCd2jFwuvAZBkqO7iQSrzEQAiMbuoLXTQoya2H0mpMuLGilVQDYBWi3PJRhHd1qOcegBjM3d/vZmP3CCtJFWLmGrc/knAjg0JJ3pZFqFu0dYVdJKyDhDunKetH2KgcOFyp5xrwMixPRtMoPqHrY9L3zOA2kwNN00BwDQLcC4T9yJLgJYgByzZ06/ZM7ZZKIq8AHDcsz6dwwDGXJhOlIxnPw6lEyZ8YT52+7Gkofp39/zwtRrN6P4askklmsGvqwYwLr1cPiY/wn4X093/mOoYORb2IDU0mMgIQcYcs7TcYo27nPTn8j/m01BVWRNT3yrqd9PIsqQt59KMD0+nHpGkwLfGjPssjwbtbS0++32msxs3tWezwz9qOzMnZwsl1YjqhdDkQUZzE+6bTMsPa0R1XrJ9Sm0mI2TshwVpjZm4kLhzAOfeOTRGvrDorqUJgu0zm2Wgk1IBcKIfOg6OakUHbq9ZGZKVAWP6jOC5eLUHmNQlmguvNyOAaOLCEm8FXtOw4NEmNNZULNDJapwJ1u8P5PxVcPjC+yae3CcmZtp15ouvFBTLdV9uWPMlK1pthI6AJwWq+4mmL93rE0nB5c9YGEc5AAAAAElFTkSuQmCC"
                            alt=""
                            className="suggestion-icon"
                            />
                            Candidate Profile
                            {/* <span>|</span> 6.5 years */}
                        </div>
                        <div className="jddropdown active">
                            <svg
                            className="icon"
                            width={25}
                            height={25}
                            viewBox="0 0 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <circle cx="12.5" cy="12.5" r="12.5" fill="#D9D9D9" />
                            <path
                                d="M12.4697 16.5303C12.7626 16.8232 13.2374 16.8232 13.5303 16.5303L18.3033 11.7574C18.5962 11.4645 18.5962 10.9896 18.3033 10.6967C18.0104 10.4038 17.5355 10.4038 17.2426 10.6967L13 14.9393L8.75736 10.6967C8.46447 10.4038 7.98959 10.4038 7.6967 10.6967C7.40381 10.9896 7.40381 11.4645 7.6967 11.7574L12.4697 16.5303ZM12.25 15L12.25 16L13.75 16L13.75 15L12.25 15Z"
                                fill="#545454"
                            />
                            </svg>
                        </div>
                    </div>

                    <div className="jd-content">
                        <p><strong>Role:</strong> {candidate_profile.current_role}</p>
                        <p><strong>Domain:</strong> {candidate_profile.domain_expertise}</p>
                        <p><strong>Experience:</strong> {candidate_profile.total_experience} years</p>
                        <p><strong>Skills:</strong> {candidate_profile.key_skills.join(", ")}</p>
                    
                    </div>


                    

                    <div className="d-flex align-items-center justify-content-between jd-head">
                        <div className="suggestion-button">
                            <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAv9JREFUWAnNWNtxnTAQpQT/xNKnS9gS3IHdQdJB3IHdgf2XmYAgHdx0cEtwCZTgEvDsCj1WCMMKMcmduQMCaXXYx9ldNU2lH+jhDpT5AG0muqr+HZS5gG5fQLf3lbb5WgzcDDegh2fQ/fd0JujuD4FDgPn/CNoMoH/dpWurjTmI9iUWDKp9WgGWA3wOUAZQdW8xQLxHU4I2P+wfTdtdvdmXWh1zlkhlisbkZ9aUIg1Y4CsuoIZXEQjShPM11b2h34kFrCyIPpCbHQNKsg8gMGeSjClX9t/9eHYDDJoIaH8VCED/8YuH3QsFE602DQe519xEJ6hF0uR5tJAHaZ4E33n+VALpCB6thvcSf9wLMdpohG+/Ye86nAe33WPkUhOkpvYmPcD0jCO1EfutTYve7yemRRa1BcJJCzzVyQFiLg+BOWEO91awCd2jFwuvAZBkqO7iQSrzEQAiMbuoLXTQoya2H0mpMuLGilVQDYBWi3PJRhHd1qOcegBjM3d/vZmP3CCtJFWLmGrc/knAjg0JJ3pZFqFu0dYVdJKyDhDunKetH2KgcOFyp5xrwMixPRtMoPqHrY9L3zOA2kwNN00BwDQLcC4T9yJLgJYgByzZ06/ZM7ZZKIq8AHDcsz6dwwDGXJhOlIxnPw6lEyZ8YT52+7Gkofp39/zwtRrN6P4askklmsGvqwYwLr1cPiY/wn4X093/mOoYORb2IDU0mMgIQcYcs7TcYo27nPTn8j/m01BVWRNT3yrqd9PIsqQt59KMD0+nHpGkwLfGjPssjwbtbS0++32msxs3tWezwz9qOzMnZwsl1YjqhdDkQUZzE+6bTMsPa0R1XrJ9Sm0mI2TshwVpjZm4kLhzAOfeOTRGvrDorqUJgu0zm2Wgk1IBcKIfOg6OakUHbq9ZGZKVAWP6jOC5eLUHmNQlmguvNyOAaOLCEm8FXtOw4NEmNNZULNDJapwJ1u8P5PxVcPjC+yae3CcmZtp15ouvFBTLdV9uWPMlK1pthI6AJwWq+4mmL93rE0nB5c9YGEc5AAAAAElFTkSuQmCC"
                            alt=""
                            className="suggestion-icon"
                            />
                            Overall Match Score
                            {/* <span>|</span>{overall_match} */}
                        </div>
                        <div className="jddropdown active">
                            <svg
                            className="icon"
                            width={25}
                            height={25}
                            viewBox="0 0 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <circle cx="12.5" cy="12.5" r="12.5" fill="#D9D9D9" />
                            <path
                                d="M12.4697 16.5303C12.7626 16.8232 13.2374 16.8232 13.5303 16.5303L18.3033 11.7574C18.5962 11.4645 18.5962 10.9896 18.3033 10.6967C18.0104 10.4038 17.5355 10.4038 17.2426 10.6967L13 14.9393L8.75736 10.6967C8.46447 10.4038 7.98959 10.4038 7.6967 10.6967C7.40381 10.9896 7.40381 11.4645 7.6967 11.7574L12.4697 16.5303ZM12.25 15L12.25 16L13.75 16L13.75 15L12.25 15Z"
                                fill="#545454"
                            />
                            </svg>
                        </div>
                    </div>
                    <div className="jd-content">
                        <p className="text-4xl font-bold text-[#40189D]">Overall Score : {overall_match}%</p>
                        <p className="text-sm text-gray-600">Profile Insights : {evaluation.explanation}</p>
                    </div>

                    <div className="d-flex align-items-center justify-content-between jd-head">
                        <div className="suggestion-button">
                            <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAv9JREFUWAnNWNtxnTAQpQT/xNKnS9gS3IHdQdJB3IHdgf2XmYAgHdx0cEtwCZTgEvDsCj1WCMMKMcmduQMCaXXYx9ldNU2lH+jhDpT5AG0muqr+HZS5gG5fQLf3lbb5WgzcDDegh2fQ/fd0JujuD4FDgPn/CNoMoH/dpWurjTmI9iUWDKp9WgGWA3wOUAZQdW8xQLxHU4I2P+wfTdtdvdmXWh1zlkhlisbkZ9aUIg1Y4CsuoIZXEQjShPM11b2h34kFrCyIPpCbHQNKsg8gMGeSjClX9t/9eHYDDJoIaH8VCED/8YuH3QsFE602DQe519xEJ6hF0uR5tJAHaZ4E33n+VALpCB6thvcSf9wLMdpohG+/Ye86nAe33WPkUhOkpvYmPcD0jCO1EfutTYve7yemRRa1BcJJCzzVyQFiLg+BOWEO91awCd2jFwuvAZBkqO7iQSrzEQAiMbuoLXTQoya2H0mpMuLGilVQDYBWi3PJRhHd1qOcegBjM3d/vZmP3CCtJFWLmGrc/knAjg0JJ3pZFqFu0dYVdJKyDhDunKetH2KgcOFyp5xrwMixPRtMoPqHrY9L3zOA2kwNN00BwDQLcC4T9yJLgJYgByzZ06/ZM7ZZKIq8AHDcsz6dwwDGXJhOlIxnPw6lEyZ8YT52+7Gkofp39/zwtRrN6P4askklmsGvqwYwLr1cPiY/wn4X093/mOoYORb2IDU0mMgIQcYcs7TcYo27nPTn8j/m01BVWRNT3yrqd9PIsqQt59KMD0+nHpGkwLfGjPssjwbtbS0++32msxs3tWezwz9qOzMnZwsl1YjqhdDkQUZzE+6bTMsPa0R1XrJ9Sm0mI2TshwVpjZm4kLhzAOfeOTRGvrDorqUJgu0zm2Wgk1IBcKIfOg6OakUHbq9ZGZKVAWP6jOC5eLUHmNQlmguvNyOAaOLCEm8FXtOw4NEmNNZULNDJapwJ1u8P5PxVcPjC+yae3CcmZtp15ouvFBTLdV9uWPMlK1pthI6AJwWq+4mmL93rE0nB5c9YGEc5AAAAAElFTkSuQmCC"
                            alt=""
                            className="suggestion-icon"
                            />
                            Component Scores
                            {/* <span>|</span>{overall_match} */}
                        </div>
                        <div className="jddropdown active">
                            <svg
                            className="icon"
                            width={25}
                            height={25}
                            viewBox="0 0 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <circle cx="12.5" cy="12.5" r="12.5" fill="#D9D9D9" />
                            <path
                                d="M12.4697 16.5303C12.7626 16.8232 13.2374 16.8232 13.5303 16.5303L18.3033 11.7574C18.5962 11.4645 18.5962 10.9896 18.3033 10.6967C18.0104 10.4038 17.5355 10.4038 17.2426 10.6967L13 14.9393L8.75736 10.6967C8.46447 10.4038 7.98959 10.4038 7.6967 10.6967C7.40381 10.9896 7.40381 11.4645 7.6967 11.7574L12.4697 16.5303ZM12.25 15L12.25 16L13.75 16L13.75 15L12.25 15Z"
                                fill="#545454"
                            />
                            </svg>
                        </div>
                    </div>
                    <div className="jd-content">
                        <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={scoreData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {scoreData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                        </ResponsiveContainer>
                    </div>
                    
                

                    <div className="d-flex align-items-center justify-content-between jd-head">
                        <div className="suggestion-button">
                            <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAv9JREFUWAnNWNtxnTAQpQT/xNKnS9gS3IHdQdJB3IHdgf2XmYAgHdx0cEtwCZTgEvDsCj1WCMMKMcmduQMCaXXYx9ldNU2lH+jhDpT5AG0muqr+HZS5gG5fQLf3lbb5WgzcDDegh2fQ/fd0JujuD4FDgPn/CNoMoH/dpWurjTmI9iUWDKp9WgGWA3wOUAZQdW8xQLxHU4I2P+wfTdtdvdmXWh1zlkhlisbkZ9aUIg1Y4CsuoIZXEQjShPM11b2h34kFrCyIPpCbHQNKsg8gMGeSjClX9t/9eHYDDJoIaH8VCED/8YuH3QsFE602DQe519xEJ6hF0uR5tJAHaZ4E33n+VALpCB6thvcSf9wLMdpohG+/Ye86nAe33WPkUhOkpvYmPcD0jCO1EfutTYve7yemRRa1BcJJCzzVyQFiLg+BOWEO91awCd2jFwuvAZBkqO7iQSrzEQAiMbuoLXTQoya2H0mpMuLGilVQDYBWi3PJRhHd1qOcegBjM3d/vZmP3CCtJFWLmGrc/knAjg0JJ3pZFqFu0dYVdJKyDhDunKetH2KgcOFyp5xrwMixPRtMoPqHrY9L3zOA2kwNN00BwDQLcC4T9yJLgJYgByzZ06/ZM7ZZKIq8AHDcsz6dwwDGXJhOlIxnPw6lEyZ8YT52+7Gkofp39/zwtRrN6P4askklmsGvqwYwLr1cPiY/wn4X093/mOoYORb2IDU0mMgIQcYcs7TcYo27nPTn8j/m01BVWRNT3yrqd9PIsqQt59KMD0+nHpGkwLfGjPssjwbtbS0++32msxs3tWezwz9qOzMnZwsl1YjqhdDkQUZzE+6bTMsPa0R1XrJ9Sm0mI2TshwVpjZm4kLhzAOfeOTRGvrDorqUJgu0zm2Wgk1IBcKIfOg6OakUHbq9ZGZKVAWP6jOC5eLUHmNQlmguvNyOAaOLCEm8FXtOw4NEmNNZULNDJapwJ1u8P5PxVcPjC+yae3CcmZtp15ouvFBTLdV9uWPMlK1pthI6AJwWq+4mmL93rE0nB5c9YGEc5AAAAAElFTkSuQmCC"
                            alt=""
                            className="suggestion-icon"
                            />
                            Gaps & Recommendations
                            {/* <span>|</span>{overall_match} */}
                        </div>
                        <div className="jddropdown active">
                            <svg
                            className="icon"
                            width={25}
                            height={25}
                            viewBox="0 0 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <circle cx="12.5" cy="12.5" r="12.5" fill="#D9D9D9" />
                            <path
                                d="M12.4697 16.5303C12.7626 16.8232 13.2374 16.8232 13.5303 16.5303L18.3033 11.7574C18.5962 11.4645 18.5962 10.9896 18.3033 10.6967C18.0104 10.4038 17.5355 10.4038 17.2426 10.6967L13 14.9393L8.75736 10.6967C8.46447 10.4038 7.98959 10.4038 7.6967 10.6967C7.40381 10.9896 7.40381 11.4645 7.6967 11.7574L12.4697 16.5303ZM12.25 15L12.25 16L13.75 16L13.75 15L12.25 15Z"
                                fill="#545454"
                            />
                            </svg>
                        </div>
                    </div>
                    <div className="jd-content">
                        <div className="suggestionHead">
                        <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAAAXNSR0IArs4c6QAAAq9JREFUWAntWN1t3DAMvhHy0kiPGaEjMBMkG/Q2aDbojZC3ArV06gbpBhmhI9wIGcEBqR9TkinLSgsEQQ4wLMsS+fHjj+g7HD5/CwOg3Q1cm/tl5h2MQJvfoO0MV+7qn8GBL7++gjLfQVsH6vwXtL3QhWNln0BPJ0kZsYSA6JLXSfuredD2CPr87AVGwSt3Zf5Um8OEBx32KPuCBkprm/OgJwiMBAtXgCTr8d35WykQXUXMZutIzgX0z5tyffMZlEM3dYIJ6wrrPcPk4pYc1wUOtPuxGxAZsFi+j2E7txkaBoRsMVDX5j4kQoulGTC+tHUiKKwhYwz5JLhV57tSOLnQK67BYcZulYcuy+o4cyF2ZlDmsQSFz76UECMMWEdZGIwjyqAFlH2RLAc1PTAvXNbAV3NjLE1ATFAdi5kqM7DUOr+vAsEnxmJpUZ6YSq5dV0p6lHniusVxOpOS0Gi1eM/or0BRYK8DE0GUL3bVFFK4pD7KqkAl47De5WtL3eIzC0CWHQJLanooBXn3m2fQ7MrLgPMH+QR0dGHpUeZRSopDOJu2wXjr5SLHkMrMlYYKLs5binJT9tx1gJK8nKWGwQIoNLDPfdOJqMfOAa/i8I1E7SstLVDdlmXMVa7cXYBbR8xS1DKlDdppXQaKjpKUdV1ysrISmU53bGP7XJgpS6BCXGJrvGUIf5/2JyB8MGAlCk9CB4rvvNZRcEw0HnAhgepP/4zFtusiOp9Z2UZO9drY7Ut/Lrvu5SOO6p59cWzHB/ZRe+MIjetjKaIL1b1P0UgZoT0DZ+G4S7h7hPFbPtlDNvYxtu3m+HFwjB4Zvg/WnrWEuEhH0hvA4Sf7QEBT/EwnsT0ZRsQ2+nqE/ZIQL2ke1/xnMAwXDX2GYqdgj9S4+X9hjlTnWgdsKejz+SMx8ArjjQ7mP2IvzQAAAABJRU5ErkJggg=="
                            alt=""
                            className="icon"
                        />
                        Critical Gaps
                        </div>
                            <ul className="list-disc ml-5 text-gray-700">
                                {gaps_and_recommendations.critical_gaps.map((gap, idx) => (
                                <li key={idx}>{gap}</li>
                                ))}
                            </ul>
                            <div className="suggestionHead">
                            <img
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAAAXNSR0IArs4c6QAAAq9JREFUWAntWN1t3DAMvhHy0kiPGaEjMBMkG/Q2aDbojZC3ArV06gbpBhmhI9wIGcEBqR9TkinLSgsEQQ4wLMsS+fHjj+g7HD5/CwOg3Q1cm/tl5h2MQJvfoO0MV+7qn8GBL7++gjLfQVsH6vwXtL3QhWNln0BPJ0kZsYSA6JLXSfuredD2CPr87AVGwSt3Zf5Um8OEBx32KPuCBkprm/OgJwiMBAtXgCTr8d35WykQXUXMZutIzgX0z5tyffMZlEM3dYIJ6wrrPcPk4pYc1wUOtPuxGxAZsFi+j2E7txkaBoRsMVDX5j4kQoulGTC+tHUiKKwhYwz5JLhV57tSOLnQK67BYcZulYcuy+o4cyF2ZlDmsQSFz76UECMMWEdZGIwjyqAFlH2RLAc1PTAvXNbAV3NjLE1ATFAdi5kqM7DUOr+vAsEnxmJpUZ6YSq5dV0p6lHniusVxOpOS0Gi1eM/or0BRYK8DE0GUL3bVFFK4pD7KqkAl47De5WtL3eIzC0CWHQJLanooBXn3m2fQ7MrLgPMH+QR0dGHpUeZRSopDOJu2wXjr5SLHkMrMlYYKLs5binJT9tx1gJK8nKWGwQIoNLDPfdOJqMfOAa/i8I1E7SstLVDdlmXMVa7cXYBbR8xS1DKlDdppXQaKjpKUdV1ysrISmU53bGP7XJgpS6BCXGJrvGUIf5/2JyB8MGAlCk9CB4rvvNZRcEw0HnAhgepP/4zFtusiOp9Z2UZO9drY7Ut/Lrvu5SOO6p59cWzHB/ZRe+MIjetjKaIL1b1P0UgZoT0DZ+G4S7h7hPFbPtlDNvYxtu3m+HFwjB4Zvg/WnrWEuEhH0hvA4Sf7QEBT/EwnsT0ZRsQ2+nqE/ZIQL2ke1/xnMAwXDX2GYqdgj9S4+X9hjlTnWgdsKejz+SMx8ArjjQ7mP2IvzQAAAABJRU5ErkJggg=="
                                alt=""
                                className="icon"
                            />
                            Immediate Actions
                            </div>
                            <ul className="list-disc ml-5 text-gray-700">
                                {gaps_and_recommendations.immediate_actions.map((action, idx) => (
                                <li key={idx}>{action}</li>
                                ))}
                            </ul>
                        </div>
                    
            </div>
        </div>
        

    </div>
    
        
    </>
  );
};

export default CandidateAIAnalysis;
