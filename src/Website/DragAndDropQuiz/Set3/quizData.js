const quizData = [
  {
    id: 1,
    question: "Match the Agile principle with the real-world scenario.",
    terms: ["Customer Collaboration", "Responding to Change", "Working Software", "Individuals & Interactions"],
    definitions: [
      { text: "The product owner regularly seeks feedback from users.", match: "Customer Collaboration" },
      { text: "Midway through development, the team adjusts priorities based on feedback.", match: "Responding to Change" },
      { text: "Delivering small, functional increments instead of waiting for final release.", match: "Working Software" },
      { text: "Encouraging face-to-face meetings for better team communication.", match: "Individuals & Interactions" }
    ]
  },
  {
    id: 2,
    question: "Match the cost-related concept with the scenario.",
    terms: ["Cost Baseline", "Cost Budget"],
    definitions: [
      { text: "The approved, time-phased budget used for tracking expenses.", match: "Cost Baseline" },
      { text: "Includes management reserves for unexpected expenses.", match: "Cost Budget" }
    ]
  },
  {
    id: 3,
    question: "Match the team-building technique with the scenario.",
    terms: ["Colocation", "Virtual Teams", "Cross-Training", "Team-Building Activities"],
    definitions: [
      { text: "The entire team works together in the same office for better collaboration.", match: "Colocation" },
      { text: "Team members work remotely from different locations.", match: "Virtual Teams" },
      { text: "Team members learn multiple roles to increase flexibility.", match: "Cross-Training" },
      { text: "A company retreat is organized to improve collaboration.", match: "Team-Building Activities" }
    ]
  },
  {
    id: 4,
    question: "Match the decision-making method with the scenario.",
    terms: ["Autocratic", "Consensus", "Majority Vote", "Multicriteria Analysis"],
    definitions: [
      { text: "The project manager makes a decision without consulting the team.", match: "Autocratic" },
      { text: "The team discusses options and reaches an agreement.", match: "Consensus" },
      { text: "A decision is made based on a vote where more than 50% agree.", match: "Majority Vote" },
      { text: "A weighted scoring model is used to evaluate multiple factors.", match: "Multicriteria Analysis" }
    ]
  },
  {
    id: 5,
    question: "Match the OPA to its scenario.",
    terms: ["Lessons Learned Repository", "Standardized Templates", "Historical Information", "Policies and Guidelines"],
    definitions: [
      { text: "The team reviews past project data to improve planning.", match: "Lessons Learned Repository" },
      { text: "The PMO provides pre-approved project document formats.", match: "Standardized Templates" },
      { text: "The project team references past cost data to estimate budgets.", match: "Historical Information" },
      { text: "The organization mandates specific risk management procedures.", match: "Policies and Guidelines" }
    ]
  },
  {
    id: 6,
    question: "Match the Agile leadership role with the scenario.",
    terms: ["Servant Leadership", "Transactional Leadership", "Transformational Leadership", "Charismatic Leadership"],
    definitions: [
      { text: "The Scrum Master removes blockers to support the team’s work.", match: "Servant Leadership" },
      { text: "A leader rewards team members for achieving set goals.", match: "Transactional Leadership" },
      { text: "A leader inspires and motivates the team toward innovation.", match: "Transformational Leadership" },
      { text: "A leader uses personal influence to drive team success.", match: "Charismatic Leadership" }
    ]
  },
  {
    id: 7,
    question: "Match the risk response strategy to its example.",
    terms: ["Avoid", "Mitigate", "Transfer", "Accept"],
    definitions: [
      { text: "Changing the project plan to remove the risk completely.", match: "Avoid" },
      { text: "Taking proactive actions to reduce the impact of the risk.", match: "Mitigate" },
      { text: "Buying insurance to handle potential financial loss.", match: "Transfer" },
      { text: "Acknowledging the risk without taking any special action.", match: "Accept" }
    ]
  },
  {
    id: 8,
    question: "Match the project management document to its purpose.",
    terms: ["Project Charter", "Project Plan", "Risk Register", "Stakeholder Register"],
    definitions: [
      { text: "Defines the project’s objectives and officially authorizes it.", match: "Project Charter" },
      { text: "Outlines how the project will be executed, monitored, and controlled.", match: "Project Plan" },
      { text: "A log of identified risks, their analysis, and responses.", match: "Risk Register" },
      { text: "A document listing key people affected by the project.", match: "Stakeholder Register" }
    ]
  },
  {
    id: 9,
    question: "Match the quality management term with its meaning.",
    terms: ["Quality Assurance", "Quality Control", "Continuous Improvement", "Defect Repair"],
    definitions: [
      { text: "Processes to ensure quality is planned into the project.", match: "Quality Assurance" },
      { text: "Checking deliverables to ensure they meet requirements.", match: "Quality Control" },
      { text: "Ongoing efforts to improve processes and products.", match: "Continuous Improvement" },
      { text: "Fixing defects found in a product or service.", match: "Defect Repair" }
    ]
  },
  {
    id: 10,
    question: "Match the procurement type to its description.",
    terms: ["Fixed Price", "Time & Materials", "Cost Reimbursable"],
    definitions: [
      { text: "A contract with a set price for the entire project.", match: "Fixed Price" },
      { text: "A contract based on labor hours and material costs.", match: "Time & Materials" },
      { text: "A contract where costs are reimbursed with a fee added.", match: "Cost Reimbursable" }
    ]
  },
  {
    id: 11,
    question: "Match the cost management term to its definition.",
    terms: ["Planned Value", "Earned Value", "Actual Cost", "Cost Variance"],
    definitions: [
      { text: "The authorized budget assigned to scheduled work.", match: "Planned Value" },
      { text: "The value of work actually completed.", match: "Earned Value" },
      { text: "The actual expenses incurred for work completed.", match: "Actual Cost" },
      { text: "The difference between earned value and actual cost.", match: "Cost Variance" }
    ]
  },
  {
    id: 12,
    question: "Match the project constraint with its impact.",
    terms: ["Scope", "Time", "Cost", "Quality"],
    definitions: [
      { text: "Expanding requirements may require additional resources.", match: "Scope" },
      { text: "A tight deadline may limit the available options.", match: "Time" },
      { text: "Budget limitations may restrict available resources.", match: "Cost" },
      { text: "Cutting corners may lead to defects.", match: "Quality" }
    ]
  },
  {
    id: 13,
    question: "Match the project execution term to its definition.",
    terms: ["Monitoring", "Executing", "Controlling", "Closing"],
    definitions: [
      { text: "Tracking project progress to identify issues.", match: "Monitoring" },
      { text: "Carrying out project work as planned.", match: "Executing" },
      { text: "Making adjustments to keep the project on track.", match: "Controlling" },
      { text: "Finalizing all project activities.", match: "Closing" }
    ]
  },
  {
    id: 14,
    question: "Match the stakeholder engagement strategy to its approach.",
    terms: ["Manage Closely", "Keep Informed", "Monitor", "Keep Satisfied"],
    definitions: [
      { text: "Actively engaging key stakeholders in project decisions.", match: "Manage Closely" },
      { text: "Providing regular updates to stakeholders with interest but low influence.", match: "Keep Informed" },
      { text: "Observing stakeholders who have low influence and low interest.", match: "Monitor" },
      { text: "Maintaining a good relationship with stakeholders who have high influence but low interest.", match: "Keep Satisfied" }
    ]
  },
  {
    id: 15,
    question: "Match the items on the left with the methodology on the right that the project manager is using.",
    terms: ["Agile", "Traditional", "Hybrid", "All methodologies"],
    definitions: [
      { text: "Assign story points to the stories in the backlog.", match: "Agile" },
      { text: "Estimate activity duration and include it in the schedule.", match: "Traditional" },
      { text: "Involve team members to estimate duration or complexity.", match: "Hybrid" },
      { text: "Make sure each project phase ends when an iteration ends and vice versa.", match: "All methodologies" }
    ]
},
{
  id: 16,
  question: "Match the team development stages with the description on the right.",
  terms: ["Forming", "Storming", "Norming", "Performing", "Adjourning"],
  definitions: [
    { text: "Team members argue and are not openly collaborative.", match: "Forming" },
    { text: "Members are reassigned to other projects.", match: "Storming" },
    { text: "Team members are independent and work in silos.", match: "Norming" },
    { text: "Members adjust their work habits with trust.", match: "Performing" },
    { text: "Members are independent and work effectively.", match: "Adjourning" }
  ]
},
{
  id: 17,
  question: "Drag and Drop the communication event on the left to the main subject discussed during the event on the right.",
  terms: ["Daily meeting", "Retrospective", "Iteration Planning", "Iteration review"],
  definitions: [
    { text: "Goal for this iteration.", match: "Daily meeting" },
    { text: "Continue, stop, or start actions.", match: "Retrospective" },
    { text: "Organization of tasks.", match: "Iteration Planning" },
    { text: "Product increments check.", match: "Iteration review" }
  ]
},
{
  id: 18,
  question: "Drag the risk responses on the left to the correct situation on the right.",
  terms: ["Escalate", "Avoid", "Transfer", "Mitigate", "Accept"],
  definitions: [
    { text: "Discussing with Sponsor as threat is found to be beyond Project Manager’s authority.", match: "Escalate" },
    { text: "Changing the plan as a response to the threat.", match: "Avoid" },
    { text: "Buying an insurance plan to handle the threat.", match: "Transfer" },
    { text: "Conducting additional tests to reduce the probability of occurrence.", match: "Mitigate" },
    { text: "Deciding to not look for a response plan rather to keep a contingency reserve.", match: "Accept" }
  ]
},
{
  id: 19,
  question: "Drag the interpersonal skill required by Project Managers on the left to the correct situation on the right.",
  terms: ["Decision making", "Negotiation", "Political Awareness", "Cultural Awareness"],
  definitions: [
    { text: "The project manager needs to improve the conditions of the team member who have been complaining in the project.", match: "Decision making" },
    { text: "The project manager has been awarded a position to reform government policies in the new government.", match: "Negotiation" },
    { text: "The project manager wants to stay updated on instability of the government in the country.", match: "Political Awareness" },
    { text: "The project manager is assigned the work in a rural area where people have different customs.", match: "Cultural Awareness" }
  ]
},
{
  id: 1,
  question: "Match the following schedule conflict and buffer related terms to their definitions that help in evaluating the constraints.",
  terms: ["Parkinson's law", "Self-protection", "Student syndrome", "Dropped Baton"],
  definitions: [
    { text: "Developers in the team are using all the allocated time for the tasks regardless of how much it actually might take.", match: "Parkinson's law" },
    { text: "Developers in the team decided to not finish the task early as it will set a precedence and they’ll be troubled in future to complete fast.", match: "Self-protection" },
    { text: "Developers are procrastinating the start of activities and as a result there is no slack available while completing the tasks.", match: "Student syndrome" },
    { text: "A preceding activity has ended early but the definition of ready checklist for successor activity is not complete.", match: "Dropped Baton" }
  ]
}
];
export default quizData;