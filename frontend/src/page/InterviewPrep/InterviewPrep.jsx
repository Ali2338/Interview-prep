import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import SpinnerLoader from '../../components/loader/SpinnerLoader'
import { toast } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { LuCircleAlert, LuListCollapse } from 'react-icons/lu'
import RoleInfoHeader from './components/RoleInfoHeader'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import QuestionCard from '../../components/cards/QuestionCard'
import AIResponsePreview from './components/AIResponsePreview'
import Drawer from '../../components/Drawer'
import SkeletonLoader from '../../components/loader/SkeletonLoader'
import { useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";


const InterviewPrep = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams()
  const [sessionData, setSessionData] = useState(null)
  const [errMsg, setErrMsg] = useState("")

  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false)
  const [explanation, setExplanation] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isUpdateLoader, setIsUpdateLoader] = useState(false)

  // ✅ Fetch session details
  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId))
      if (response.data && response.data.session) {
        setSessionData(response.data.session)
      }
    } catch (error) {
      console.log("Error:", error)
    }
  }

  // ✅ Generate AI explanation
  const generateConceptExplanations = async (question) => {
    try {
      setErrMsg("")
      setExplanation(null)
      setIsLoading(true)
      setOpenLearnMoreDrawer(true)

      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
        question,
      })
      if (response.data) {
        setExplanation(response.data)
      }
    } catch (error) {
      setExplanation(null)
      setErrMsg("Failed to generate explanation. Try again later.")
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Toggle pin status
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId))
      if (response.data && response.data.question) {
        fetchSessionDetailsById()
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  // ✅ Upload more questions
  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true)
      const airesponse = await axiosInstance.post(API_PATHS.AI.GENRATE_QUESTIONS, {
        role: sessionData?.role,
        experience: sessionData?.experience,
        topicToFocus: sessionData?.topicToFocus,
        numberOfQuestions: 10,
      })
      const generateQuestions = airesponse.data
      const response = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId,
        questions: generateQuestions,
      })
      if (response.data) {
        toast.success("Added more Q&A!!")
        fetchSessionDetailsById()
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrMsg(error.response.data.message)
      } else {
        setErrMsg("Something went wrong. Please try again later")
      }
    } finally {
      setIsUpdateLoader(false)
    }
  }

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById()
    }
    return () => { }
  }, [sessionId])

  return (
    <DashboardLayout>
      <div className="fixed top-20 left-6 z-50">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] font-semibold text-white px-2 py-1 rounded-lg hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-orange-300"
        >
          ← Dashboard
        </button>
      </div>


      {/* Header */}
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicToFocus={sessionData?.topicToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />

      {/* Main Q&A Section */}
      <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8 pb-4">
        <h2 className="text-lg font-semibold text-black">Interview Q & A</h2>

        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          {/* Questions Column */}
          <div
            className={`col-span-12 ${openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-8"
              }`}
          >
            <AnimatePresence>
              {sessionData?.questions?.map((data, index) => {
                return (
                  <motion.div
                    key={data._id || index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.1,
                      damping: 15,
                    }}
                    layout
                    layoutId={`question-${data._id || index}`}
                  >
                    <QuestionCard
                      question={data?.question}
                      answer={data?.answer}
                      onLearnMore={() =>
                        generateConceptExplanations(data.question)
                      }
                      isPinned={data?.isPinned}
                      onTogglePin={() => toggleQuestionPinStatus(data._id)}
                    />

                    {/* Load More button only after last question */}
                    {!isLoading &&
                      sessionData?.questions?.length === index + 1 && (
                        <div className="flex items-center justify-center mt-5">
                          <button
                            className="flex items-center gap-2 text-xs sm:text-sm text-white font-medium bg-black px-4 sm:px-5 py-2 rounded cursor-pointer disabled:opacity-50"
                            disabled={isLoading || isUpdateLoader}
                            onClick={uploadMoreQuestions}
                          >
                            {isUpdateLoader ? (
                              <SpinnerLoader />
                            ) : (
                              <LuListCollapse className="text-lg" />
                            )}
                            Load More
                          </button>
                        </div>
                      )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Drawer (Responsive) */}
        <Drawer
          isOpen={openLearnMoreDrawer}
          onClose={() => setOpenLearnMoreDrawer(false)}
          title={!isLoading && explanation?.title}
          mobileFullScreen
        >
          {errMsg && (
            <p className="flex gap-2 text-sm text-amber-600 font-medium">
              <LuCircleAlert className="mt-1" />
              {errMsg}
            </p>
          )}
          {isLoading && <SkeletonLoader />}
          {!isLoading && explanation && (
            <AIResponsePreview content={explanation?.explanation} />
          )}
        </Drawer>
      </div>
    </DashboardLayout>
  )
}

export default InterviewPrep
