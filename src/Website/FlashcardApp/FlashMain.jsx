import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import agileData from "./agileData";
import domainData from "./domainData";
import processData from "./processGroupsData";
import Flashcard from "./Flashcard";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import AgileCategories from "./AgileCategories";
import DomainCategories from "./DomainCategories";
import ProcessCategories from "./ProcessCategories";
import FlashNavbar from "./FlashNavbar";
import Footer from "../components/Footer";
import { Nav } from "react-bootstrap";
import ProjectManagementCategories from "./ProjectManagementCategories";
import projectManagementData from "./projectManagementData";
import KnowledgeAreaCategories from "./KnowledgeAreaCategories";
import KnowledegeAreaData from "./KnowledgeAreaData";
import PerformanceDomainCategories from "./PerformanceDomainCategories";
import PerformanceDomainData from "./PerformanceDomainData";
// import './tabs.css'

const FlashMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFlipped, setIsFlipped] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("selectedCategory") || null
  );

  const [selectedType, setSelectedType] = useState(
    localStorage.getItem("selectedType") || null
  );

  const [currentCardIndex, setCurrentCardIndex] = useState(() => {
    return (
      parseInt(
        localStorage.getItem(
          `currentCardIndex_${selectedCategory}_${selectedType}`
        )
      ) || 0
    );
  });
  const [answeredCards, setAnsweredCards] = useState(() => {
    return (
      JSON.parse(
        localStorage.getItem(
          `answeredCards_${selectedCategory}_${selectedType}`
        )
      ) || {}
    );
  });
  const [score, setScore] = useState(() => {
    return (
      parseInt(
        localStorage.getItem(`score_${selectedCategory}_${selectedType}`)
      ) || 0
    );
  });
  const [progress, setProgress] = useState(() => {
    return (
      parseFloat(
        localStorage.getItem(`progress_${selectedCategory}_${selectedType}`)
      ) || 0
    );
  });

  const agileCategories = [...new Set(agileData.map((item) => item.category))];
  const domainCategories = [
    ...new Set(domainData.map((item) => item.category)),
  ];
  const processCategories = [
    ...new Set(processData.map((item) => item.category)),
  ];
  const projectManagementCategories = [
    ...new Set(projectManagementData.map((item) => item.category)),
  ];
  const knowledgeAreaCategories = [
    ...new Set(KnowledegeAreaData.map((item) => item.category)),
  ];
  const performanceDomainCategories = [
    ...new Set(PerformanceDomainData.map((item) => item.category)),
  ];

  const filteredFlashcards =
    selectedType === "Agile"
      ? agileData.filter((card) => card.category.includes(selectedCategory))
      : selectedType === "Domain"
      ? domainData.filter((card) => card.category === selectedCategory)
      : selectedType === "Project Management Foundation"
      ? projectManagementData.filter((card) =>
          card.category.includes(selectedCategory)
        )
      : selectedType === "Knowledge Area" // ✅ Corrected spelling
      ? KnowledegeAreaData.filter((card) =>
          card.category.includes(selectedCategory)
        ) // ✅ Ensured filtering consistency
      : selectedType === "Performance Domain"
      ? PerformanceDomainData.filter((card) =>
          card.category.includes(selectedCategory)
        ) // ✅ Ensured consistency
      : processData.filter((card) => card.category.includes(selectedCategory));

  // ✅ Handle URL Query Params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category")
      ? decodeURIComponent(params.get("category"))
      : null;
    const type = params.get("type")
      ? decodeURIComponent(params.get("type"))
      : null;

    if (location.pathname === "/flashcards" && !category && !type) {
      setSelectedType(null);
      setSelectedCategory(null);
    } else {
      setSelectedType(type || null);
      setSelectedCategory(category || null);
    }

    if (location.pathname.includes("/agile")) {
      setSelectedType("Agile");
      setSelectedCategory(null);
    } else if (location.pathname.includes("/domain")) {
      setSelectedType("Domain");
      setSelectedCategory(null);
    } else if (
      location.pathname.includes("/flashcards/process-groups") ||
      location.pathname === "/process-groups"
    ) {
      setSelectedType("Process");
      setSelectedCategory(null);
    } else if (location.pathname.includes("/project-management")) {
      setSelectedType("Project Management Foundation");
      setSelectedCategory(null);
    } else if (location.pathname.includes("/knowledge-area")) {
      // ✅ Fixed spelling
      setSelectedType("Knowledge Area");
      setSelectedCategory(null);
    } else if (location.pathname.includes("/performance-domain")) {
      setSelectedType("Performance Domain");
      setSelectedCategory(null);
    }
  }, [location]);

  console.log("Selected Type:", selectedType);
  console.log("Selected Category:", selectedCategory);
  console.log("Filtered Flashcards:", filteredFlashcards);

  console.log("Process Data:", processData);
  console.log(
    "Available Categories:",
    processData.map((card) => card.category)
  );
  console.log("Selected Type:", selectedType);
  console.log("Selected Category:", selectedCategory);
  console.log("Filtered Flashcards:", filteredFlashcards);

  const normalizeKey = (key) => {
    if (!key) return ""; // Handle null or undefined values safely
    return key.replace(/\s+/g, "_").replace(/&/g, "and"); // Replace spaces with "_" and "&" with "and"
  };

  Object.keys(localStorage).forEach((key) => {
    if (key.includes("Monitoring__Process")) {
      localStorage.removeItem(key);
    }
  });

  const handleCategoryChange = (category, type) => {
    console.log(`Switching to Category: ${category}, Type: ${type}`);

    if (selectedCategory && selectedType) {
      // ✅ Store previous category data correctly before switching
      localStorage.setItem(
        `currentCardIndex_${normalizeKey(selectedCategory)}_${normalizeKey(
          selectedType
        )}`,
        currentCardIndex
      );
      localStorage.setItem(
        `answeredCards_${normalizeKey(selectedCategory)}_${normalizeKey(
          selectedType
        )}`,
        JSON.stringify(answeredCards)
      );
      localStorage.setItem(
        `score_${normalizeKey(selectedCategory)}_${normalizeKey(selectedType)}`,
        score
      );
      localStorage.setItem(
        `progress_${normalizeKey(selectedCategory)}_${normalizeKey(
          selectedType
        )}`,
        progress
      );
    }

    // ✅ Debugging: Check the key format before retrieving data
    console.log(
      "Retrieving Data for:",
      `currentCardIndex_${normalizeKey(category)}_${normalizeKey(type)}`
    );

    const savedCurrentCardIndex =
      parseInt(
        localStorage.getItem(
          `currentCardIndex_${normalizeKey(category)}_${normalizeKey(type)}`
        )
      ) || 0;

    const savedAnsweredCards = JSON.parse(
      localStorage.getItem(
        `answeredCards_${normalizeKey(category)}_${normalizeKey(type)}`
      ) || "{}"
    );

    const savedScore =
      parseInt(
        localStorage.getItem(
          `score_${normalizeKey(category)}_${normalizeKey(type)}`
        )
      ) || 0;

    const savedProgress =
      parseFloat(
        localStorage.getItem(
          `progress_${normalizeKey(category)}_${normalizeKey(type)}`
        )
      ) || 0;

    console.log("Retrieved LocalStorage Data:", {
      savedCurrentCardIndex,
      savedAnsweredCards,
      savedScore,
      savedProgress,
    });

    // ✅ Update state with retrieved values
    setSelectedCategory(category);
    setSelectedType(type);
    setCurrentCardIndex(savedCurrentCardIndex);
    setAnsweredCards(savedAnsweredCards); // Fix: Now properly restoring answered cards
    setScore(savedScore);
    setProgress(savedProgress);

    // ✅ Navigate to the selected category & type
    navigate(`/flashcards?category=${category}&type=${type}`);
  };

  useEffect(() => {
    if (selectedCategory && selectedType) {
      const categoryKey = normalizeKey(selectedCategory);
      const typeKey = normalizeKey(selectedType);

      localStorage.setItem(
        `currentCardIndex_${categoryKey}_${typeKey}`,
        currentCardIndex
      );
      localStorage.setItem(
        `answeredCards_${categoryKey}_${typeKey}`,
        JSON.stringify(answeredCards)
      );
      localStorage.setItem(`score_${categoryKey}_${typeKey}`, score);
      localStorage.setItem(`progress_${categoryKey}_${typeKey}`, progress);
    }
  }, [
    selectedCategory,
    selectedType,
    currentCardIndex,
    answeredCards,
    score,
    progress,
  ]);

  // ✅ Progress Calculation
  useEffect(() => {
    const answeredCount = Object.keys(answeredCards).length;
    const newProgress = filteredFlashcards.length
      ? (answeredCount / filteredFlashcards.length) * 100
      : 0;
    setProgress(Math.min(newProgress, 100));
  }, [answeredCards, filteredFlashcards]);

  const tabs = [
    { label: "Flashcards", path: "/flashcards" },
    selectedType && {
      label:
        selectedType === "Process"
          ? "Process-Groups"
          : selectedType === "ProjectManagement"
          ? "Project Management"
          : selectedType === "Knowledege Area"
          ? "Knowledge Area" // ✅ Fixed label formatting
          : selectedType,
      path:
        selectedType === "Process" || selectedType === "Process-Groups"
          ? "/process-groups"
          : selectedType === "Agile"
          ? "/agile"
          : selectedType === "Domain"
          ? "/domain"
          : selectedType === "Project Management Foundation"
          ? "/project-management-foundation"
          : selectedType === "Knowledge Area"
          ? "/knowledge-area" // ✅ Fixed path
          : selectedType === "Performance Domain"
          ? "/performance-domain" // ✅ Fixed path
          : `/flashcards/${selectedType.toLowerCase()}`,
    },
    selectedCategory && {
      label: selectedCategory,
      path: `/flashcards?category=${selectedCategory}&type=${selectedType}`,
    },
  ].filter(Boolean);
  // ✅ Improved isActiveTab to handle both pathname and search
  const isActiveTab = (path) => {
    const currentPath = location.pathname + location.search;

    // ✅ Ensure Flashcards is active only for /flashcards (without query params)
    if (path === "/flashcards") {
      return location.pathname === "/flashcards" && !location.search;
    }

    // ✅ For other tabs, match both pathname and search if applicable
    return currentPath === path;
  };

  // ✅ Navigate only if different from the current path
  const handleTabClick = (path) => {
    if (location.pathname + location.search !== path) {
      navigate(path);
    }
  };

  return (
    <>
      <div className="container">
        <FlashNavbar
          setScore={setScore}
          setProgress={setProgress}
          setCurrentCardIndex={setCurrentCardIndex}
          setAnsweredCards={setAnsweredCards}
        />
      </div>
      <div className="container text-center">
        <Nav
          variant="tabs"
          className="d-flex flex-nowrap"
          style={{
            marginBottom: "15px",
            marginTop: "-40px",
            whiteSpace: "nowrap",
            overflowX: "auto", // ✅ Horizontal scroll only if needed
            overflowY: "hidden", // ✅ Removes vertical scrollbar on desktop
            maxWidth: "100%", // ✅ Prevents unnecessary wrapping
          }}
        >
          {tabs.map((tab, index) => {
            const tabPath = tab.path || "/flashcards";
            const isActive = isActiveTab(tabPath) || index === tabs.length - 1;

            return (
              <div
                key={index}
                className="d-flex align-items-center flex-shrink-0"
              >
                <Nav.Item>
                  <Nav.Link
                    active={isActive}
                    onClick={() => handleTabClick(tabPath)}
                    className={`px-3 py-1 ${
                      isActive
                        ? "border border-primary bg-light fw-bold rounded"
                        : "border-0"
                    }`}
                    style={{
                      cursor: "pointer",
                      color: "#4748ac",
                    }}
                  >
                    {tab.label}
                  </Nav.Link>
                </Nav.Item>

                {/* ">" Symbol Between Tabs */}
                {index !== tabs.length - 1 && (
                  <span className="mx-1 fw-bold text-primary">{">"}</span>
                )}
              </div>
            );
          })}
        </Nav>

        {selectedCategory && (
          <ProgressBar
            progress={progress}
            score={score}
            totalCards={filteredFlashcards.length}
          />
        )}

        {/* ✅ Show Main Category Cards */}
        {!selectedType && (
          <div className="row d-flex align-items-center justify-content-center gap-3 min-h-[400px]">
            <div
              className="card col-md-3 col-sm-6 bg-gray-500 transition-transform duration-300 hover:scale-105"
              style={{
                minWidth: "320px",
                cursor: "pointer",
                height: "160px",
                backgroundColor: "#ddd",
              }}
              onClick={() => {
                setSelectedType("Process");
                navigate("/process-groups");
              }}
            >
              <div className="card-body d-flex align-items-center justify-content-center">
                <h4 className="m-0">Process Groups</h4>
              </div>
            </div>

            <div
              className="card col-md-3 col-sm-6 bg-gray-300 transition-transform duration-300 hover:scale-105"
              style={{
                minWidth: "320px",
                cursor: "pointer",
                height: "160px",
                backgroundColor: "#ddd",
              }}
              onClick={() => {
                setSelectedType("Agile");
                navigate("/agile");
              }}
            >
              <div className="card-body d-flex align-items-center justify-content-center">
                <h4 className="m-0">Agile Categories</h4>
              </div>
            </div>

            <div
              className="card col-md-3 col-sm-6 bg-gray-500 transition-transform duration-300 hover:scale-105"
              style={{
                minWidth: "320px",
                cursor: "pointer",
                height: "160px",
                backgroundColor: "#ddd",
              }}
              onClick={() => {
                setSelectedType("Knowledge Area");
                navigate("/knowledge-area");
              }}
            >
              <div className="card-body d-flex align-items-center justify-content-center">
                <h4 className="m-0">Knowledge Area</h4>
              </div>
            </div>
            <div
              className="card col-md-3 col-sm-6 bg-gray-500 transition-transform duration-300 hover:scale-105"
              style={{
                minWidth: "320px",
                cursor: "pointer",
                height: "160px",
                backgroundColor: "#ddd",
              }}
              onClick={() => {
                setSelectedType("Project Management Foundation");
                navigate("/project-management-foundation");
              }}
            >
              <div className="card-body d-flex align-items-center justify-content-center">
                <h4 className="m-0">Project Management Foundation</h4>
              </div>
            </div>
            <div
              className="card col-md-3 col-sm-6 bg-gray-500 transition-transform duration-300 hover:scale-105"
              style={{
                minWidth: "320px",
                cursor: "pointer",
                height: "160px",
                backgroundColor: "#ddd",
              }}
              onClick={() => {
                setSelectedType("Performance Domain");
                navigate("/performance-domain");
              }}
            >
              <div className="card-body d-flex align-items-center justify-content-center">
                <h4 className="m-0">Performance Domain</h4>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Process Categories (Auto-load when visiting /process-groups) */}
        {!selectedCategory && selectedType === "Process" && (
          <>
            {console.log(
              "ProcessCategories rendering with categories:",
              processCategories
            )}
            <ProcessCategories
              categories={processCategories}
              onSelectCategory={(category) =>
                handleCategoryChange(category, "Process")
              }
            />
          </>
        )}

        {/* ✅ Agile Categories (Auto-load when visiting /agile) */}
        {!selectedCategory && selectedType === "Agile" && (
          <>
            <AgileCategories
              categories={agileCategories}
              onSelectCategory={(category) =>
                handleCategoryChange(category, "Agile")
              }
            />
          </>
        )}

        {!selectedCategory &&
          selectedType === "Project Management Foundation" && (
            <>
              <ProjectManagementCategories
                categories={projectManagementCategories}
                onSelectCategory={(category) =>
                  handleCategoryChange(
                    category,
                    "Project Management Foundation"
                  )
                }
              />
            </>
          )}

        {!selectedCategory && selectedType === "Knowledge Area" && (
          <>
            <KnowledgeAreaCategories
              categories={knowledgeAreaCategories}
              onSelectCategory={(category) =>
                handleCategoryChange(category, "Knowledge Area")
              }
            />
          </>
        )}

        {!selectedCategory && selectedType === "Performance Domain" && (
          <>
            <PerformanceDomainCategories
              categories={performanceDomainCategories}
              onSelectCategory={(category) =>
                handleCategoryChange(category, "Performance Domain")
              }
            />
          </>
        )}

        {/* ✅ Flashcards */}
        {selectedCategory && (
          <div>
            {/* <h3>{selectedCategory} Flashcards</h3> */}
            <Flashcard
              currentCard={
                filteredFlashcards[currentCardIndex] || filteredFlashcards[0]
              }
              currentCardIndex={currentCardIndex}
              setCurrentCardIndex={setCurrentCardIndex}
              totalCards={filteredFlashcards.length}
              isFlipped={isFlipped} // ✅ Pass flip state
              setIsFlipped={setIsFlipped} // ✅ Pass flip state handler
            />
            <Controls
              currentCardIndex={currentCardIndex}
              totalCards={filteredFlashcards.length}
              answeredCards={answeredCards}
              setAnsweredCards={setAnsweredCards}
              setCurrentCardIndex={setCurrentCardIndex}
              setScore={setScore}
              score={score}
              setSelectedCategory={setSelectedCategory}
              setIsFlipped={setIsFlipped} // ✅ Pass flip handler to Controls
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FlashMain;
