const quizData = [
  {
    id: 1,
    question: "Match the power type to its example.",
    terms: ["Legitimate Power", "Expert Power", "Reward Power", "Coercive Power"],
    definitions: [
      { text: "A project manager makes decisions based on their formal position.", match: "Legitimate Power" },
      { text: "A project manager is respected due to their technical knowledge.", match: "Expert Power" },
      { text: "A project manager provides incentives for good performance.", match: "Reward Power" },
      { text: "A project manager enforces rules through threats of discipline.", match: "Coercive Power" }
    ]
  },
  {
    id: 2,
    question: "Match the communication model component to its role.",
    terms: ["Sender", "Receiver", "Message", "Medium"],
    definitions: [
      { text: "The person who originates the message.", match: "Sender" },
      { text: "The person who receives and interprets the message.", match: "Receiver" },
      { text: "The information being communicated.", match: "Message" },
      { text: "The channel used to convey the message.", match: "Medium" }
    ]
  },
  {
    id: 3,
    question: "Match the procurement risk to its scenario.",
    terms: ["Scope Creep", "Vendor Bankruptcy", "Delayed Deliverables", "Quality Defects"],
    definitions: [
      { text: "Additional work is added to the contract without a formal agreement.", match: "Scope Creep" },
      { text: "The supplier goes out of business mid-project.", match: "Vendor Bankruptcy" },
      { text: "The vendor fails to meet contract deadlines.", match: "Delayed Deliverables" },
      { text: "The supplier delivers substandard materials.", match: "Quality Defects" }
    ]
  },
  {
    id: 4,
    question: "Match the OPA to its example.",
    terms: ["Templates", "Lessons Learned", "Historical Information", "Policies & Procedures"],
    definitions: [
      { text: "Standardized documents used across projects.", match: "Templates" },
      { text: "Knowledge captured from previous projects.", match: "Lessons Learned" },
      { text: "Past project data used for estimation and planning.", match: "Historical Information" },
      { text: "Organizational rules governing project work.", match: "Policies & Procedures" }
    ]
  },
  {
    id: 5,
    question: "Match the stakeholder engagement strategy with the scenario.",
    terms: ["Manage Closely", "Keep Satisfied", "Keep Informed", "Monitor"],
    definitions: [
      { text: "A high-power, high-interest stakeholder is actively influencing project decisions.", match: "Manage Closely" },
      { text: "An executive sponsor funds the project but is not involved in daily operations.", match: "Keep Satisfied" },
      { text: "A government agency regulates your project but has no direct involvement.", match: "Keep Informed" },
      { text: "A minor stakeholder occasionally requests updates but has no real influence.", match: "Monitor" }
    ]
  },
  {
    id: 6,
    question: "Match the schedule management strategy with the scenario.",
    terms: ["Fast Tracking", "Crashing", "Re-sequencing", "Resource Leveling"],
    definitions: [
      { text: "The team overlaps design and development phases to meet a tight deadline.", match: "Fast Tracking" },
      { text: "Extra resources are added to speed up development.", match: "Crashing" },
      { text: "Non-critical path activities are moved to optimize dependencies.", match: "Re-sequencing" },
      { text: "Work is spread over available team members to avoid burnout.", match: "Resource Leveling" }
    ]
  },
  {
    id: 7,
    question: "Match the risk response strategy to the scenario.",
    terms: ["Exploit", "Share", "Escalate", "Enhance"],
    definitions: [
      { text: "The team secures an experienced expert to guarantee project success.", match: "Exploit" },
      { text: "Two organizations collaborate to reduce the cost of an innovative technology.", match: "Share" },
      { text: "A major risk affecting the company’s strategy is handed over to top management.", match: "Escalate" },
      { text: "Additional training is provided to maximize the benefit of an opportunity.", match: "Enhance" }
    ]
  },
  {
    id: 8,
    question: "Match the contract type with the associated risk.",
    terms: ["Fixed Price", "Cost Plus", "Time & Material", "Fixed Price Incentive Fee"],
    definitions: [
      { text: "The vendor delivers late, but costs remain the same.", match: "Fixed Price" },
      { text: "The vendor spends more than expected, and costs increase.", match: "Cost Plus" },
      { text: "The project budget is exceeded due to increased hourly work.", match: "Time & Material" },
      { text: "The vendor receives a bonus for early completion.", match: "Fixed Price Incentive Fee" }
    ]
  },
  {
    id: 9,
    question: "Match the schedule concept with the scenario.",
    terms: ["Float (Slack)", "Lead Time", "Lag Time", "Critical Path"],
    definitions: [
      { text: "A task can be delayed without impacting the project completion date.", match: "Float (Slack)" },
      { text: "The design phase starts before requirement gathering is fully completed.", match: "Lead Time" },
      { text: "A mandatory delay is required between pouring concrete and painting walls.", match: "Lag Time" },
      { text: "The sequence of tasks that determines the shortest possible project duration.", match: "Critical Path" }
    ]
  },
  {
    id: 10,
    question: "Match the communication method to the scenario.",
    terms: ["Push Communication", "Pull Communication", "Interactive Communication", "External Communication"],
    definitions: [
      { text: "A project manager sends a weekly status report via email.", match: "Push Communication" },
      { text: "The project team accesses a shared portal for documents.", match: "Pull Communication" },
      { text: "A live video conference is held with key stakeholders.", match: "Interactive Communication" },
      { text: "A press release is published about the project.", match: "External Communication" }
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
    question: "Match the risk response to its example.",
    terms: ["Avoid", "Mitigate", "Transfer", "Accept"],
    definitions: [
      { text: "A project eliminates a risky activity to prevent failure.", match: "Avoid" },
      { text: "Extra safety measures are put in place to reduce risk impact.", match: "Mitigate" },
      { text: "An insurance policy is purchased to cover potential losses.", match: "Transfer" },
      { text: "The project team acknowledges a minor risk and takes no action.", match: "Accept" }
    ]
  },
  {
    id: 13,
    question: "Match the conflict resolution technique to the scenario.",
    terms: ["Collaborating", "Compromising", "Forcing", "Avoiding"],
    definitions: [
      { text: "Both parties work together to find a win-win solution.", match: "Collaborating" },
      { text: "Each side gives up something to reach an agreement.", match: "Compromising" },
      { text: "One party forces a decision despite resistance.", match: "Forcing" },
      { text: "A team member ignores the issue to prevent conflict.", match: "Avoiding" }
    ]
  },
  {
    id: 14,
    question: "Match the project document to its purpose.",
    terms: ["Project Charter", "Project Plan", "Stakeholder Register", "Risk Register"],
    definitions: [
      { text: "Formally authorizes the project and defines objectives.", match: "Project Charter" },
      { text: "Outlines the overall execution and control approach.", match: "Project Plan" },
      { text: "Identifies stakeholders and their influence.", match: "Stakeholder Register" },
      { text: "Lists potential risks and response strategies.", match: "Risk Register" }
    ]
  },
  {
    id: 15,
    question: "Match the procurement contract type to its characteristics.",
    terms: ["Fixed Price", "Cost Reimbursable", "Time & Material", "Lump Sum"],
    definitions: [
      { text: "A set price is agreed upon before work begins.", match: "Fixed Price" },
      { text: "The seller is reimbursed for costs plus a profit margin.", match: "Cost Reimbursable" },
      { text: "The buyer pays based on hourly work and materials used.", match: "Time & Material" },
      { text: "A single price is paid for the entire project.", match: "Lump Sum" }
    ]
  },
  {
    id: 16,
    question: "Match the resource management technique to the scenario.",
    terms: ["Resource Leveling", "Resource Smoothing", "Crashing", "Fast Tracking"],
    definitions: [
      { text: "Tasks are adjusted to prevent overloading team members.", match: "Resource Leveling" },
      { text: "Tasks are scheduled within limits without affecting critical path.", match: "Resource Smoothing" },
      { text: "Additional resources are assigned to shorten project duration.", match: "Crashing" },
      { text: "Overlapping tasks to reduce schedule duration.", match: "Fast Tracking" }
    ]
  },
  {
    id: 17,
    question: "Match the quality management process to its purpose.",
    terms: ["Quality Planning", "Quality Assurance", "Quality Control", "Continuous Improvement"],
    definitions: [
      { text: "Defining quality requirements and standards.", match: "Quality Planning" },
      { text: "Ensuring quality standards are followed throughout the project.", match: "Quality Assurance" },
      { text: "Monitoring and testing deliverables to ensure quality.", match: "Quality Control" },
      { text: "Ongoing efforts to enhance processes and outputs.", match: "Continuous Improvement" }
    ]
  },
  {
    id: 18,
    question: "Match the leadership style to its characteristics.",
    terms: ["Autocratic", "Democratic", "Laissez-Faire", "Transformational"],
    definitions: [
      { text: "Leader makes decisions without consulting the team.", match: "Autocratic" },
      { text: "Leader involves the team in decision-making.", match: "Democratic" },
      { text: "Leader gives complete freedom to the team.", match: "Laissez-Faire" },
      { text: "Leader inspires and motivates team members.", match: "Transformational" }
    ]
  },
  {
    id: 19,
    question: "Match the agile concept to its principle.",
    terms: ["Scrum", "Kanban", "Lean", "Extreme Programming"],
    definitions: [
      { text: "Uses sprints and roles like Product Owner and Scrum Master.", match: "Scrum" },
      { text: "Visual workflow management with work-in-progress limits.", match: "Kanban" },
      { text: "Focuses on minimizing waste and maximizing value.", match: "Lean" },
      { text: "Emphasizes continuous testing and frequent releases.", match: "Extreme Programming" }
    ]
  },
  {
    id: 20,
    question: "Match the project constraint to its definition.",
    terms: ["Scope", "Time", "Cost", "Quality"],
    definitions: [
      { text: "The work required to complete the project.", match: "Scope" },
      { text: "The duration available to complete the project.", match: "Time" },
      { text: "The budget allocated for the project.", match: "Cost" },
      { text: "The degree to which project deliverables meet requirements.", match: "Quality" }
    ]
  }
];
export default quizData;