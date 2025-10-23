const processData = [
    
      {
        category: "Initiation",
        question: "Project Initiation",
        answer: "Project initiation is the first phase of the project life cycle, where the project is formally authorized, defined, and assigned a project manager.",
        example: "Before developing an online PMP prep course, the sponsor formally approves the project and assigns a project manager to lead the initiative."
      },
      {
        category: "Initiation",
        question: "Business Case",
        answer: "A business case justifies the need for a project, outlining the problem, benefits, risks, and return on investment.",
        example: "A business case for a new EdTech app may highlight how it increases student engagement and revenue growth."
      },
      {
        category: "Initiation",
        question: "Feasibility Study",
        answer: "A feasibility study evaluates technical, financial, and operational aspects to determine whether a project is viable.",
        example: "Before launching a subscription-based LMS, a feasibility study assesses if the target market is willing to pay for premium content."
      },
      {
        category: "Initiation",
        question: "Project Charter",
        answer: "The project charter is a formal document that authorizes the project, defining its objectives, scope, stakeholders, and assigned project manager.",
        example: "A project charter for a mobile learning app includes the project’s budget, key milestones, and stakeholder list."
      },
      {
        category: "Initiation",
        question: "Assumption Log",
        answer: "The assumption log records assumptions and constraints that impact project planning and execution.",
        example: "Assuming that all instructors will submit video lectures on time is recorded in the assumption log for an online course development project."
      },
      {
        category: "Initiation",
        question: "Stakeholder Identification",
        answer: "Stakeholder identification is the process of determining individuals and groups who have an interest in the project.",
        example: "Stakeholders for an e-learning platform may include students, instructors, developers, and marketing teams."
      },
      {
        category: "Initiation",
        question: "Stakeholder Register",
        answer: "A stakeholder register is a document listing key stakeholders, their interests, power levels, and influence on the project.",
        example: "A stakeholder register for a mock exam platform identifies the sponsor, product owner, and end users, along with their level of engagement."
      },
      {
        category: "Initiation",
        question: "Benefit Management Plan",
        answer: "A benefit management plan outlines how a project’s benefits will be measured, sustained, and realized over time.",
        example: "A benefit management plan for a corporate LMS details how employee productivity improvements will be tracked post-launch."
      },
      {
        category: "Initiation",
        question: "Agreement (Contract or MOU)",
        answer: "An agreement (contract, MOU, or SLA) is a formal document that establishes the terms and responsibilities between project stakeholders.",
        example: "A contract between a software vendor and Edzest outlines payment terms for developing a learning management system (LMS)."
      },
      {
        category: "Initiation",
        question: "Enterprise Environmental Factors (EEFs)",
        answer: "EEFs are external and internal factors that influence project success, such as company culture, regulations, and market conditions.",
        example: "A government-mandated cybersecurity policy impacts how an EdTech platform manages student data."
      },
      {
        category: "Initiation",
        question: "Organizational Process Assets (OPAs)",
        answer: "OPAs include historical data, templates, and best practices that organizations use to guide projects.",
        example: "A project manager uses previous project reports and risk logs from past LMS development projects as OPAs for the new project."
      },
      {
        category: "Initiation",
        question: "Project Selection Methods",
        answer: "Project selection methods include techniques like cost-benefit analysis, scoring models, and ROI calculations to choose the best project.",
        example: "A company chooses to develop an AI-powered test analytics tool over a basic quiz app because of higher ROI and market demand."
      },
      {
        category: "Initiation",
        question: "Sponsor Approval",
        answer: "Sponsor approval is the formal authorization from the project sponsor to proceed with the project.",
        example: "Before launching a new course portal, the project sponsor approves the budget and milestones."
      },
      {
        category: "Initiation",
        question: "High-Level Scope Statement",
        answer: "A high-level scope statement outlines what the project will and will not deliver at an early stage.",
        example: "A high-level scope for an LMS project states that it will include video streaming but not live tutoring features."
      },
      {
        category: "Initiation",
        question: "Project Constraints",
        answer: "Project constraints are limitations that impact project execution, such as time, cost, resources, or technology.",
        example: "A project to develop an online mock exam platform has a fixed budget of $30,000 and a four-month timeline."
      },
      {
        category: "Initiation",
        question: "Risk Identification (Early-Stage Risks)",
        answer: "Early-stage risk identification involves assessing potential project threats and opportunities before execution begins.",
        example: "A risk for a global virtual training project is language barriers affecting communication between trainers and learners."
      },
      {
        category: "Initiation",
        question: "Roles & Responsibilities Definition",
        answer: "Clearly defining who does what ensures project roles are assigned properly to team members.",
        example: "In a course development project, instructors create content, editors proofread, and developers build the platform."
      },
      {
        category: "Initiation",
        question: "Kickoff Meeting",
        answer: "The kickoff meeting is the first official project meeting, where stakeholders discuss objectives, expectations, and initial plans.",
        example: "A kickoff meeting for an LMS upgrade project includes developers, UX designers, and business leaders to align on goals."
      },
      {
        category: "Initiation",
        question: "Authorization to Proceed (Go/No-Go Decision)",
        answer: "A go/no-go decision is a formal assessment that determines whether the project should start based on available information.",
        example: "After reviewing the feasibility study, the company gives a 'go' decision to proceed with developing an AI-powered course recommendation system."
      },
      {
        category: "Planning",
        question: "Planning Process Group",
        answer: "The Planning Process Group involves defining the scope, objectives, deliverables, schedule, costs, and risks to create a structured project plan.",
        example: "Before building a mock exam portal, the team outlines the exam formats, user experience, and testing schedule to ensure smooth development."
    },
    {
        category: "Planning",
        question: "Project Management Plan",
        answer: "A comprehensive document that integrates and coordinates all subsidiary plans (scope, schedule, cost, quality, risk, etc.).",
        example: "A PMP-certified manager creates a detailed plan for an LMS development project, defining how work will be executed and controlled."
    },
    {
        category: "Planning",
        question: "Scope Management Plan",
        answer: "A document that outlines how the project scope will be defined, validated, and controlled.",
        example: "A scope management plan for a PMP certification training website details the included course modules and exclusions like one-on-one mentoring."
    },
    {
        category: "Planning",
        question: "Requirements Management Plan",
        answer: "Defines how project requirements will be collected, analyzed, and documented.",
        example: "A requirements management plan for a student dashboard system ensures that features like progress tracking and performance analytics are properly gathered."
    },
    {
        category: "Planning",
        question: "Schedule Management Plan",
        answer: "Defines how the project schedule will be planned, developed, managed, and controlled.",
        example: "A schedule management plan for an e-learning app launch includes task sequencing, milestone tracking, and buffer time for testing."
    },
    {
        category: "Planning",
        question: "Cost Management Plan",
        answer: "Outlines how project costs will be estimated, budgeted, and controlled to stay within financial constraints.",
        example: "A cost management plan for a course video production project includes camera rentals, editing software licenses, and instructor fees."
    },
    {
        category: "Planning",
        question: "Quality Management Plan",
        answer: "Defines quality standards and processes to ensure deliverables meet stakeholder expectations.",
        example: "A quality management plan for an LMS platform specifies video resolution, content accuracy, and system uptime requirements."
    },
    {
        category: "Planning",
        question: "Resource Management Plan",
        answer: "A plan that details how project resources (people, materials, equipment) will be acquired, allocated, and managed.",
        example: "A resource plan for a hybrid training program defines instructor roles, student support teams, and required learning materials."
    },
    {
        category: "Planning",
        question: "Communications Management Plan",
        answer: "Outlines who communicates what, when, and how to ensure effective project communication.",
        example: "A communications plan for a global virtual seminar ensures stakeholders receive weekly progress emails and monthly video updates."
    },
    {
        category: "Planning",
        question: "Risk Management Plan",
        answer: "A strategy to identify, assess, and mitigate project risks throughout the project lifecycle.",
        example: "A risk management plan for a live online class includes contingency plans for internet outages and software crashes."
    },
    {
        category: "Planning",
        question: "Procurement Management Plan",
        answer: "Defines how goods and services will be purchased and managed during the project.",
        example: "A procurement plan for an online learning platform includes contracts for third-party video hosting and AI assessment tools."
    },
    {
        category: "Planning",
        question: "Stakeholder Engagement Plan",
        answer: "Outlines strategies to engage and manage stakeholder expectations throughout the project.",
        example: "A stakeholder engagement plan for a university's digital transformation project details faculty meetings, student surveys, and leadership reports."
    },
    {
        category: "Planning",
        question: "Work Breakdown Structure (WBS)",
        answer: "A hierarchical breakdown of project work into smaller, manageable components.",
        example: "A WBS for a PMP training program breaks the work into content creation, video production, website development, and marketing."
    },
    {
        category: "Planning",
        question: "WBS Dictionary",
        answer: "A document that provides detailed descriptions of each WBS element, including deliverables, activities, and responsible parties.",
        example: "In a software project, the WBS dictionary defines each module's requirements, developers, and estimated completion time."
    },
    {
        category: "Planning",
        question: "Activity List",
        answer: "A detailed list of all project activities required to complete the deliverables.",
        example: "An activity list for a course launch includes content writing, video recording, editing, and uploading."
    },
    {
        category: "Planning",
        question: "Activity Sequencing",
        answer: "The process of arranging project activities in a logical order based on dependencies.",
        example: "In an LMS development project, 'Design UI' must happen before 'Develop Frontend', ensuring a logical sequence."
    },
    {
        category: "Planning",
        question: "Network Diagram",
        answer: "A visual representation of task dependencies and project flow to determine sequencing.",
        example: "A network diagram for an Agile sprint shows feature development, testing, and deployment in sequential order."
    },
    {
        category: "Planning",
        question: "Critical Path Method (CPM)",
        answer: "Identifies the longest sequence of dependent tasks to determine the shortest project duration.",
        example: "If content writing, recording, and editing are on the critical path for an e-learning course, any delay in these tasks will push the launch date."
    },
    {
        category: "Planning",
        question: "Schedule Baseline",
        answer: "The approved version of the project schedule against which progress is measured.",
        example: "The original LMS launch date of June 1 is the schedule baseline, with deviations tracked for project control."
    },
    {
        category: "Planning",
        question: "Cost Baseline",
        answer: "The approved budget, used to compare actual spending against planned costs.",
        example: "A project's approved $50,000 budget is the cost baseline, and exceeding it triggers a review."
    },
    {
        category: "Planning",
        question: "Change Management Plan",
        answer: "A strategy for handling change requests and project adjustments effectively.",
        example: "A scope change request for adding AI-based student progress tracking to an LMS follows the change management process."
    },
    {
        category: "Planning",
        question: "Performance Measurement Baseline",
        answer: "An integrated baseline of scope, schedule, and cost, used to measure performance.",
        example: "If an LMS project’s performance baseline is 50% completion by month three, progress reports track deviations."
    },
    {
        category: "Planning",
        question: "Contingency Reserve",
        answer: "A budget or time buffer allocated for known risks.",
        example: "A 10% contingency reserve is set aside for potential unexpected content development delays."
    },
    {
        category: "Planning",
        question: "Project Kickoff Meeting",
        answer: "A formal meeting that marks the transition from planning to execution, aligning stakeholders.",
        example: "A kickoff meeting for a virtual learning project involves instructors, developers, and marketing teams discussing the launch plan."
    },{
      category: "Execution",
      question: "Execution Process Group",
      answer: "The execution phase is where project work is performed according to the project management plan to produce deliverables.",
      example: "In a learning management system (LMS) project, execution involves coding the platform, recording course videos, and setting up user registration."
  },
  {
      category: "Execution",
      question: "Direct and Manage Project Work",
      answer: "The process of leading and coordinating project activities to achieve project objectives.",
      example: "A project manager ensures that the development team builds the new course platform according to the approved scope and schedule."
  },
  {
      category: "Execution",
      question: "Manage Project Knowledge",
      answer: "The process of capturing, sharing, and using project knowledge to enhance performance and outcomes.",
      example: "A team developing an online certification program documents best practices and lessons learned for future course development projects."
  },
  {
      category: "Execution",
      question: "Implement Risk Responses",
      answer: "The process of executing planned risk response strategies to address identified risks.",
      example: "A risk response for potential server downtime in an online exam system includes implementing cloud-based redundancy."
  },
  {
      category: "Execution",
      question: "Acquire Resources",
      answer: "The process of obtaining human, physical, and material resources needed for project execution.",
      example: "Before launching a mock exam app, the team hires content creators, developers, and UI/UX designers."
  },
  {
      category: "Execution",
      question: "Develop Team",
      answer: "The process of improving team competencies, interactions, and overall effectiveness.",
      example: "A project team for a virtual workshop series attends collaboration training to improve remote teamwork."
  },
  {
      category: "Execution",
      question: "Manage Team",
      answer: "The process of tracking team performance, resolving conflicts, and motivating team members.",
      example: "A project manager mediates a conflict between designers and developers to ensure smooth execution of an LMS project."
  },
  {
      category: "Execution",
      question: "Manage Communications",
      answer: "The process of creating, collecting, distributing, storing, and retrieving project information.",
      example: "A project team shares weekly progress reports with stakeholders via email and dashboards."
  },
  {
      category: "Execution",
      question: "Manage Stakeholder Engagement",
      answer: "The process of actively engaging stakeholders to meet their expectations and resolve concerns.",
      example: "The product owner hosts a demo session with instructors to get feedback on an upcoming e-learning platform."
  },
  {
      category: "Execution",
      question: "Conduct Procurements",
      answer: "The process of selecting, contracting, and managing vendors and suppliers.",
      example: "A project team signs a contract with a video hosting service for an online training platform."
  },
  {
      category: "Execution",
      question: "Create Deliverables",
      answer: "The process of producing tangible and intangible outputs as per project requirements.",
      example: "A project team delivers a fully functional mobile app for online certification exams."
  },
  {
      category: "Execution",
      question: "Perform Quality Assurance",
      answer: "The process of ensuring project deliverables meet quality standards before final delivery.",
      example: "Before launching a new PMP course, an editor reviews and validates all learning materials to ensure accuracy."
  },
  {
      category: "Execution",
      question: "Issue Management",
      answer: "The process of identifying, tracking, and resolving project issues.",
      example: "A bug in the exam portal's time tracking feature is logged and assigned to the development team for resolution."
  },
  {
      category: "Execution",
      question: "Manage Work Performance Data",
      answer: "The process of gathering and analyzing work performance information to ensure project health.",
      example: "A project manager tracks student enrollment numbers and engagement levels to assess the success of an e-learning platform."
  },
  {
      category: "Execution",
      question: "Hold Daily Standups (Agile Projects)",
      answer: "A short, daily meeting where the team discusses progress, roadblocks, and next steps.",
      example: "In a scrum-based software development project, the team meets every morning to review sprint tasks and blockers."
  },
  {
      category: "Execution",
      question: "Manage Change Requests",
      answer: "The process of reviewing and approving modifications to project scope, schedule, or cost.",
      example: "A change request is submitted to add a new discussion forum feature to an online learning platform."
  },
  {
      category: "Execution",
      question: "Monitor Contractor Performance",
      answer: "The process of evaluating vendor work to ensure compliance with contract terms.",
      example: "A company reviews the progress of an outsourced UI/UX design team to confirm milestones are met."
  },
  {
      category: "Execution",
      question: "Conduct Pilot Testing",
      answer: "The process of testing a deliverable in a controlled environment before full rollout.",
      example: "A beta version of an online mock exam is tested with a small group of students before the public launch."
  },
  {
      category: "Execution",
      question: "Conduct Training Sessions",
      answer: "The process of educating end-users on how to use new systems or products.",
      example: "Before launching a new learning portal, administrators are trained on course upload and student management features."
  },
  {
      category: "Execution",
      question: "Celebrate Achievements (Motivation & Recognition)",
      answer: "Recognizing and rewarding team members for their contributions to project success.",
      example: "After successfully launching a new certification program, the project team receives bonuses and recognition in a company-wide meeting."
  },  
  {
    category: "Monitoring and Controlling",
    question: "Monitoring and Controlling Process Group",
    answer: "The process of tracking, reviewing, and regulating project progress to meet objectives and performance baselines.",
    example: "A project manager reviews a budget report to ensure that costs for developing a mock exam platform remain within the approved limits."
},
{
    category: "Monitoring and Controlling",
    question: "Monitor and Control Project Work",
    answer: "The process of tracking performance, identifying variances, and recommending corrective actions.",
    example: "A team compares the actual development progress of an LMS against the project schedule to spot delays."
},
{
    category: "Monitoring and Controlling",
    question: "Perform Integrated Change Control",
    answer: "The process of reviewing, approving, and managing changes to scope, schedule, and cost.",
    example: "A sponsor requests adding live chat support to an online learning platform, requiring approval through change control."
},
{
    category: "Monitoring and Controlling",
    question: "Validate Scope",
    answer: "The process of formally accepting completed project deliverables.",
    example: "Before launching an LMS, stakeholders review the course modules and approve them based on requirements."
},
{
    category: "Monitoring and Controlling",
    question: "Control Scope",
    answer: "The process of managing scope changes and preventing unauthorized additions.",
    example: "A project manager rejects an unapproved request to add a mobile quiz feature to an LMS to prevent scope creep."
},
{
    category: "Monitoring and Controlling",
    question: "Control Schedule",
    answer: "The process of monitoring project timeline performance and making adjustments to stay on track.",
    example: "A project team fast-tracks testing by performing it parallel to development to compensate for delays."
},
{
    category: "Monitoring and Controlling",
    question: "Control Costs",
    answer: "The process of monitoring expenditures, ensuring cost adherence, and preventing budget overruns.",
    example: "The finance team tracks LMS development expenses to ensure they do not exceed the allocated $50,000 budget."
},
{
    category: "Monitoring and Controlling",
    question: "Control Quality",
    answer: "The process of reviewing work performance and deliverables to ensure compliance with quality standards.",
    example: "A quality assurance team checks that all e-learning videos meet HD resolution and audio clarity standards."
},
{
    category: "Monitoring and Controlling",
    question: "Control Resources",
    answer: "The process of ensuring project resources are allocated properly and used efficiently.",
    example: "A project manager shifts developers to a critical task when a delay occurs in an LMS feature implementation."
},
{
    category: "Monitoring and Controlling",
    question: "Monitor Communications",
    answer: "The process of ensuring project communications are timely, clear, and effective.",
    example: "A project manager reviews stakeholder email response times and adjusts reporting frequency for better engagement."
},
{
    category: "Monitoring and Controlling",
    question: "Monitor Risks",
    answer: "The process of tracking identified risks, reassessing risks, and implementing response strategies.",
    example: "A development team monitors for potential server crashes in an online mock exam system and adds redundancy measures."
},
{
    category: "Monitoring and Controlling",
    question: "Control Procurement",
    answer: "The process of monitoring vendor performance and contract adherence.",
    example: "A project manager reviews vendor progress reports to ensure an outsourced LMS module is delivered on time."
},
{
    category: "Monitoring and Controlling",
    question: "Monitor Stakeholder Engagement",
    answer: "The process of ensuring stakeholders remain engaged and their needs are addressed.",
    example: "A feedback survey is sent to instructors to gauge their satisfaction with the LMS development progress."
},
{
    category: "Monitoring and Controlling",
    question: "Earned Value Management (EVM)",
    answer: "A performance measurement technique that compares planned vs. actual cost and schedule progress.",
    example: "If the Earned Value (EV) of an LMS project is lower than the Planned Value (PV), it indicates schedule delays."
},
{
    category: "Monitoring and Controlling",
    question: "Schedule Variance (SV)",
    answer: "A measure of whether a project is ahead or behind schedule (SV = EV - PV).",
    example: "If an LMS project was planned to be 50% complete but is only 40% done, it has a negative Schedule Variance."
},
{
    category: "Monitoring and Controlling",
    question: "Cost Variance (CV)",
    answer: "A measure of whether a project is over or under budget (CV = EV - AC).",
    example: "If a project has spent more money than planned without completing the expected work, it has a negative CV."
},
{
    category: "Monitoring and Controlling",
    question: "Schedule Performance Index (SPI)",
    answer: "A ratio that indicates schedule efficiency (SPI = EV / PV).",
    example: "An SPI below 1.0 means the LMS development is behind schedule."
},
{
    category: "Monitoring and Controlling",
    question: "Cost Performance Index (CPI)",
    answer: "A ratio that indicates cost efficiency (CPI = EV / AC).",
    example: "If a project has a CPI greater than 1.0, it is under budget and using resources efficiently."
},
{
    category: "Monitoring and Controlling",
    question: "Trend Analysis",
    answer: "A technique for analyzing project data trends to predict future performance.",
    example: "If LMS enrollment rates increase consistently, trend analysis suggests demand will continue growing."
},
{
    category: "Monitoring and Controlling",
    question: "Variance Analysis",
    answer: "The process of comparing actual project performance against baselines to identify deviations.",
    example: "If a project's planned cost was $100,000 but the actual cost is $120,000, variance analysis is performed to find causes."
},
{
    category: "Monitoring and Controlling",
    question: "Root Cause Analysis (RCA)",
    answer: "A problem-solving technique that identifies the underlying causes of project issues.",
    example: "If students drop out of an online course, RCA might reveal poor engagement due to unstructured content."
},
{
    category: "Monitoring and Controlling",
    question: "Lessons Learned Register",
    answer: "A document capturing project successes, failures, and improvement recommendations for future reference.",
    example: "After launching an LMS, the project team documents what worked well and what challenges arose during development."
},
{
    category: "Monitoring and Controlling",
    question: "Corrective Action",
    answer: "A planned response to bring project performance back in line with the plan.",
    example: "To fix delays in an Agile sprint, the team adds extra development resources to meet the deadline."
},
{
    category: "Monitoring and Controlling",
    question: "Preventive Action",
    answer: "A proactive step taken to prevent potential project issues before they occur.",
    example: "Installing an automatic data backup system to prevent potential LMS content loss."
},
{
    category: "Monitoring and Controlling",
    question: "Defect Repair",
    answer: "A process of fixing a non-conforming deliverable to meet project quality standards.",
    example: "After an LMS test run, developers fix a bug where students' progress isn't saved correctly."
},
{
  category: "Closing",
  question: "Closing Process Group",
  answer: "The phase in project management where all activities across all process groups are finalized to formally close a project or phase.",
  example: "After delivering an online course platform, the project manager ensures all project tasks are completed, deliverables are accepted, and resources are released."
},
{
  category: "Closing",
  question: "Close Project or Phase",
  answer: "The process of finalizing all activities to formally complete the project or phase.",
  example: "Upon completing the development phase of an LMS, the project manager conducts a phase-end review and obtains formal acceptance before moving to the next phase."
},
{
  category: "Closing",
  question: "Final Product Transition",
  answer: "The process of handing over the completed project deliverables to the client or operational team.",
  example: "The project team transfers the newly developed e-learning platform to the client's IT department for ongoing maintenance and support."
},
{
  category: "Closing",
  question: "Final Report",
  answer: "A comprehensive document summarizing project performance, including objectives achieved, scope, quality, cost, and schedule performance.",
  example: "The project manager prepares a final report detailing the successful launch of a certification program, highlighting adherence to timelines and budgets."
},
{
  category: "Closing",
  question: "Lessons Learned Documentation",
  answer: "A record of knowledge gained during the project, capturing what went well and areas for improvement.",
  example: "The team documents that early stakeholder engagement led to better requirement gathering, a practice to be applied in future projects."
},
{
  category: "Closing",
  question: "Administrative Closure",
  answer: "The process of completing all project records, archiving documents, and updating organizational process assets.",
  example: "After project completion, all contracts, agreements, and project documents are archived in the company's project management system for future reference."
},
{
  category: "Closing",
  question: "Contract Closure",
  answer: "The process of completing and settling the terms of any contracts and resolving any open items.",
  example: "The project manager ensures that all deliverables from a third-party content provider are received and approved, and final payments are processed."
},
{
  category: "Closing",
  question: "Post-Implementation Review",
  answer: "An evaluation conducted after project completion to assess the project's success and identify lessons learned.",
  example: "Following the deployment of a new LMS, a review is held to evaluate user satisfaction and system performance, providing insights for future improvements."
},
{
  category: "Closing",
  question: "Release of Resources",
  answer: "The process of reassigning project team members and releasing project resources upon completion.",
  example: "After project closure, team members are reassigned to new projects, and equipment is returned to the resource pool."
},
{
  category: "Closing",
  question: "Stakeholder Satisfaction Assessment",
  answer: "The process of evaluating stakeholder satisfaction with the project's outcomes.",
  example: "Surveys are distributed to course instructors and students to gather feedback on the new e-learning platform's effectiveness and usability."
},
{
  category: "Closing",
  question: "Archiving Project Documents",
  answer: "The process of storing project documents, reports, and key artifacts for future reference and audits.",
  example: "All design documents, requirement specifications, and project reports for an LMS project are archived in the company's knowledge repository."
},
{
  category: "Closing",
  question: "Legal and Compliance Closure",
  answer: "Ensuring all project activities adhere to legal and regulatory requirements before project closure.",
  example: "A data security compliance audit is conducted before closing an LMS project to ensure GDPR compliance."
},
{
  category: "Closing",
  question: "Operational Handover",
  answer: "Transferring the project deliverables to the operations or maintenance team for ongoing support.",
  example: "The development team hands over an LMS to the IT support team, who will maintain and update the platform post-launch."
},
{
  category: "Closing",
  question: "Client Acceptance Sign-Off",
  answer: "Formal acknowledgment from the client or sponsor that the project deliverables meet their expectations.",
  example: "The client signs off on the new e-learning platform after reviewing all agreed-upon features and functionalities."
},
{
  category: "Closing",
  question: "Final Budget Reconciliation",
  answer: "Reviewing and finalizing all financial transactions to ensure project expenses match the allocated budget.",
  example: "A financial audit is conducted to confirm that all vendor invoices for the LMS development project have been paid."
},
{
  category: "Closing",
  question: "Measuring Project Benefits",
  answer: "Assessing whether the intended benefits of the project have been realized post-completion.",
  example: "After implementing an AI-based student progress tracker, the team evaluates improvements in course completion rates."
},
{
  category: "Closing",
  question: "Project Closure Checklist",
  answer: "A structured list of tasks that need to be completed before formally closing the project.",
  example: "A project closure checklist for a corporate training program includes deliverable validation, budget reconciliation, and stakeholder feedback collection."
},
{
  category: "Closing",
  question: "Celebrating Project Completion",
  answer: "Recognizing and appreciating the contributions of the project team to boost morale and encourage future success.",
  example: "After a successful LMS launch, the project team holds a celebration event and recognizes key contributors with awards."
}
    ]
    
    export default processData;
    