
  
const quizData = [
  {
      id: 1,
      question:  "Match the process group to its description.",
      terms: ["Initiating", "Planning", "Executing", "Monitoring & Controlling", "Closing"],
      definitions: [
          { text: "Define a new project or phase, securing authorization and stakeholders' agreement.", match: "Initiating" },
          { text: "Develop a roadmap for project execution, including scope, schedule, budget, and risk plans.", match: "Planning" },
          { text: "Implement the project plan, managing resources, communication, and stakeholder engagement.", match: "Executing" },
          { text: "Track, review, and regulate project progress and performance.", match: "Monitoring & Controlling" },
          { text: "Finalize all activities, obtain approvals, and formally close the project or phase.", match: "Closing" }
      ]
  },
  {
      id: 2,
      question: "Match each knowledge area with its description.",
      terms: ["Scope Management", "Schedule Management", "Cost Management", "Quality Management"],
      definitions: [
          { text: "Ensuring the project includes all the required work and only the required work.", match: "Scope Management" },
          { text: "Developing and controlling the project timeline.", match: "Schedule Management" },
          { text: "Planning, estimating, and controlling project expenses.", match: "Cost Management" },
          { text: "Ensuring the project meets the required quality standards.", match: "Quality Management" }
      ]
  },
  {
      id: 3,
      question: "Match the risk response strategy with its definition.",
      terms: ["Avoid", "Mitigate", "Transfer", "Accept"],
      definitions: [
          { text: "Eliminate the risk entirely by changing the project plan.", match: "Avoid" },
          { text: "Reduce the probability or impact of the risk.", match: "Mitigate" },
          { text: "Shift the impact of the risk to a third party (e.g., insurance).", match: "Transfer" },
          { text: "Recognize the risk and do nothing unless it occurs.", match: "Accept" }
      ]
  },
  {
    id: 4,
    question: "Match the EVM metric to its formula.",
    terms: ["Cost Variance (CV)", "Schedule Variance (SV)", "Cost Performance Index (CPI)", "Schedule Performance Index (SPI)", "Estimate at Completion (EAC)"],
    definitions: [
      { text: "EV - AC", match: "Cost Variance (CV)" },
      { text: "EV - PV", match: "Schedule Variance (SV)" },
      { text: "EV / AC", match: "Cost Performance Index (CPI)" },
      { text: "EV / PV", match: "Schedule Performance Index (SPI)" },
      { text: "BAC / CPI", match: "Estimate at Completion (EAC)" }
    ]
  },
  {
    id: 5,
    question: "Match the organizational structure to its characteristics.",
    terms: ["Functional", "Projectized", "Matrix"],
    definitions: [
      { text: "Employees report to department heads, project managers have limited authority.", match: "Functional" },
      { text: "Project managers have full authority, resources are dedicated to projects.", match: "Projectized" },
      { text: "Mix of functional and projectized; shared authority between PM and functional managers.", match: "Matrix" }
    ]
  },
  {
    id: 6,
    question: "Match each risk response strategy with its correct example.",
    terms: ["Avoid", "Mitigate", "Transfer", "Accept"],
    definitions: [
      { text: "Changing project scope to remove a high-risk activity.", match: "Avoid" },
      { text: "Adding extra resources to reduce the probability of schedule delays.", match: "Mitigate" },
      { text: "Purchasing insurance to handle potential financial loss.", match: "Transfer" },
      { text: "Taking no action and monitoring the risk.", match: "Accept" }
    ]
  },
  {
    id: 7,
    question: "Match the selection method to its definition.",
    terms: ["Net Present Value (NPV)", "Payback Period", "Internal Rate of Return (IRR)", "Benefit-Cost Ratio (BCR)"],
    definitions: [
      { text: "Considers time value of money to determine profitability.", match: "Net Present Value (NPV)" },
      { text: "Time required to recover initial project investment.", match: "Payback Period" },
      { text: "The discount rate that makes NPV zero.", match: "Internal Rate of Return (IRR)" },
      { text: "The ratio of benefits to costs, higher values are preferable.", match: "Benefit-Cost Ratio (BCR)" }
    ]
  },
  {
    id: 8,
    question: "Match the conflict resolution technique to its application.",
    terms: ["Collaborate", "Compromise", "Avoid", "Force"],
    definitions: [
      { text: "Working together to find a win-win solution.", match: "Collaborate" },
      { text: "Finding a middle ground where both parties give up something.", match: "Compromise" },
      { text: "Withdrawing from the conflict and not addressing it.", match: "Avoid" },
      { text: "Imposing a solution by using authority.", match: "Force" }
    ]
  },
  {
    id: 9,
    question: "Match the quality tool to its use case.",
    terms: ["Pareto Chart", "Fishbone Diagram", "Control Chart", "Histogram"],
    definitions: [
      { text: "Identifies the most significant causes of defects.", match: "Pareto Chart" },
      { text: "Analyzes root causes of a problem.", match: "Fishbone Diagram" },
      { text: "Monitors process stability over time.", match: "Control Chart" },
      { text: "Displays frequency distribution of data.", match: "Histogram" }
    ]
  },{
    id: 10,
    question: "Match the stakeholder engagement level with its description.",
    terms: ["Unaware", "Resistant", "Neutral", "Supportive"],
    definitions: [
      { text: "The stakeholder does not know about the project.", match: "Unaware" },
      { text: "The stakeholder opposes the project.", match: "Resistant" },
      { text: "The stakeholder is neither supportive nor opposed.", match: "Neutral" },
      { text: "The stakeholder supports the project and its goals.", match: "Supportive" }
    ]
  },
  {
    id: 11,
    question: "Match the communication method to its example.",
    terms: ["Interactive", "Push", "Pull"],
    definitions: [
      { text: "Meetings, phone calls, video conferences.", match: "Interactive" },
      { text: "Emails, memos, reports.", match: "Push" },
      { text: "Websites, knowledge repositories.", match: "Pull" }
    ]
  },
  {
    id: 12,
    question: "Match the contract type with its characteristic.",
    terms: ["Fixed Price", "Cost Reimbursable", "Time & Material"],
    definitions: [
      { text: "Price is set, and the risk is on the seller.", match: "Fixed Price" },
      { text: "Buyer reimburses actual costs plus a fee.", match: "Cost Reimbursable" },
      { text: "Price depends on labor hours and materials used.", match: "Time & Material" }
    ]
  },
  {
    id: 13,
    question: "Match the leadership style with its description.",
    terms: ["Autocratic", "Democratic", "Laissez-Faire", "Servant Leadership"],
    definitions: [
      { text: "The leader makes decisions alone and expects compliance.", match: "Autocratic" },
      { text: "The leader encourages team participation in decision-making.", match: "Democratic" },
      { text: "The leader provides minimal direction and allows team autonomy.", match: "Laissez-Faire" },
      { text: "The leader focuses on serving the needs of the team.", match: "Servant Leadership" }
    ]
  },
  {
    id: 14,
    question: "Match the change management step to its description.",
    terms: ["Identify Change", "Evaluate Impact", "Approve or Reject", "Implement Change"],
    definitions: [
      { text: "Recognizing a need for change in the project.", match: "Identify Change" },
      { text: "Assessing the effect of the change on project scope, time, cost, and quality.", match: "Evaluate Impact" },
      { text: "Decision made by the Change Control Board (CCB) or relevant authority.", match: "Approve or Reject" },
      { text: "Updating documents and communicating changes to stakeholders.", match: "Implement Change" }
    ]
  },
  {
    id: 15,
    question: "Match the dependency type with its example.",
    terms: ["Mandatory Dependency", "Discretionary Dependency", "External Dependency", "Internal Dependency"],
    definitions: [
      { text: "A foundation must be laid before building walls.", match: "Mandatory Dependency" },
      { text: "Design approval is required before development starts.", match: "Discretionary Dependency" },
      { text: "Approval from a government agency before proceeding.", match: "External Dependency" },
      { text: "A team must complete testing before deployment.", match: "Internal Dependency" }
    ]
  },
  {
    id: 16,
    question: "Match the contract type to its characteristics.",
    terms: ["Fixed-Price", "Cost-Reimbursable", "Time and Material (T&M)"],
    definitions: [
      { text: "A set price is agreed upon for the work, regardless of actual costs.", match: "Fixed-Price" },
      { text: "The seller is reimbursed for costs plus an additional fee.", match: "Cost-Reimbursable" },
      { text: "Payment is based on time spent and materials used.", match: "Time and Material (T&M)" }
    ]
  },
  {
    id: 17,
    question: "Match the leadership style to its characteristics.",
    terms: ["Autocratic", "Democratic", "Laissez-Faire", "Transformational"],
    definitions: [
      { text: "Leader makes decisions without input from the team.", match: "Autocratic" },
      { text: "Leader involves team members in decision-making.", match: "Democratic" },
      { text: "Leader provides minimal guidance and allows the team to make decisions.", match: "Laissez-Faire" },
      { text: "Leader inspires and motivates the team towards innovation and change.", match: "Transformational" }
    ]
  },
  {
    id: 18,
    question: "Match the procurement process step to its description.",
    terms: ["Plan Procurement", "Conduct Procurement", "Control Procurement", "Close Procurement"],
    definitions: [
      { text: "Determining what to procure and how to procure it.", match: "Plan Procurement" },
      { text: "Selecting sellers and awarding contracts.", match: "Conduct Procurement" },
      { text: "Monitoring contract performance and making adjustments.", match: "Control Procurement" },
      { text: "Finalizing contracts and verifying work is completed.", match: "Close Procurement" }
    ]
  },
  {
    id: 19,
    question: "Match the risk classification to its definition.",
    terms: ["Known Risks", "Unknown Risks", "Residual Risks", "Secondary Risks"],
    definitions: [
      { text: "Risks that can be identified and planned for.", match: "Known Risks" },
      { text: "Risks that cannot be predicted but may still occur.", match: "Unknown Risks" },
      { text: "Risks that remain after response strategies are implemented.", match: "Residual Risks" },
      { text: "New risks that arise as a result of implementing a risk response.", match: "Secondary Risks" }
    ]
  },
  {
    id: 20,
    question: "Match the project life cycle phase to its description.",
    terms: ["Initiation", "Planning", "Execution", "Monitoring and Controlling", "Closure"],
    definitions: [
      { text: "Defining the project and obtaining authorization to proceed.", match: "Initiation" },
      { text: "Developing a detailed project management plan.", match: "Planning" },
      { text: "Carrying out the work according to the project plan.", match: "Execution" },
      { text: "Tracking performance and making necessary changes.", match: "Monitoring and Controlling" },
      { text: "Finalizing all activities and formally closing the project.", match: "Closure" }
    ]
  }

];

export default quizData;