"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// --- TYPES ---
type ScreeningData = {
    // Section 0
    userContext: { status?: string; ageRange?: string }
    // Section 1
    safety: { harm: string; unsafe: string; psychosis: string }
    // Section 2
    wellbeing: { score?: string; difficultAreas: string[] }
    // Modules (simplified storage)
    modules: Record<string, any>
    // Section 3
    background: { childhood: string; previousSupport: string; willingToSpeak: string }
}

const INITIAL_DATA: ScreeningData = {
    userContext: {},
    safety: { harm: "", unsafe: "", psychosis: "" },
    wellbeing: { difficultAreas: [] },
    modules: {},
    background: { childhood: "", previousSupport: "", willingToSpeak: "" },
}

// --- QUESTIONS CONFIG ---
// (We can extract this to a separate file later if it gets too large)

const STEPS = [
    { id: "context", title: "About You" },
    { id: "safety", title: "Safety Check" },
    { id: "wellbeing", title: "Wellbeing" },
    { id: "modules", title: "Deep Dive" }, // Dynamic based on wellbeing
    { id: "background", title: "Background" },
]

export default function WellnessScreeningForm() {
    const [step, setStep] = useState(0)
    const [data, setData] = useState<ScreeningData>(INITIAL_DATA)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSafetyWarning, setShowSafetyWarning] = useState(false)

    // --- HANDLERS ---
    const handleNext = () => {
        // Safety Check Logic
        if (step === 1) {
            if (data.safety.harm === "Yes" || data.safety.unsafe === "Yes" || data.safety.psychosis === "Yes") {
                setShowSafetyWarning(true)
                return
            }
        }
        setStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    }

    const handleBack = () => {
        setStep((prev) => Math.max(prev - 1, 0))
    }

    const updateData = (section: keyof ScreeningData, key: string, value: any) => {
        setData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }))
    }

    const toggleArrayItem = (section: keyof ScreeningData, key: string, item: string) => {
        setData((prev) => {
            const currentArray = (prev[section] as any)[key] || []
            const newArray = currentArray.includes(item)
                ? currentArray.filter((i: string) => i !== item)
                : [...currentArray, item]
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [key]: newArray,
                },
            }
        })
    }

    // Submit Handler
    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/ai/wellness-check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                // Redirect to profile or show result
                window.location.href = "/patient/profile"
            }
        } catch (error) {
            console.error("Submission failed", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (showSafetyWarning) {
        return (
            <div className="p-8 max-w-2xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Safety First</h2>
                <p className="text-lg text-gray-600">
                    It looks like you might need immediate support. Please reach out to emergency services or a trusted contact right away.
                </p>
                <div className="bg-slate-50 p-6 rounded-xl text-left space-y-2">
                    <p className="font-semibold">Helplines:</p>
                    <ul className="list-disc pl-5">
                        <li>Emergency: 112</li>
                        <li>Suicide Prevention: 988</li>
                    </ul>
                </div>
                <button
                    onClick={() => window.location.href = "/patient/resources"}
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 w-full"
                >
                    View Support Resources
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto pb-12">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                    <span>{STEPS[step].title}</span>
                    <span>Step {step + 1} of {STEPS.length}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-teal-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-8"
                >
                    {step === 0 && (
                        <Section0 data={data} updateData={updateData} />
                    )}
                    {step === 1 && (
                        <Section1 data={data} updateData={updateData} />
                    )}
                    {step === 2 && (
                        <Section2 data={data} updateData={updateData} toggleArrayItem={toggleArrayItem} />
                    )}
                    {step === 3 && (
                        <SectionModules data={data} updateData={updateData} />
                    )}
                    {step === 4 && (
                        <Section3 data={data} updateData={updateData} />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-12 pt-6 border-t border-slate-200">
                <button
                    onClick={handleBack}
                    disabled={step === 0}
                    className="px-6 py-2 text-slate-600 font-medium hover:text-slate-900 disabled:opacity-50"
                >
                    Back
                </button>
                {step === STEPS.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-emerald-600 disabled:opacity-70 flex items-center gap-2"
                    >
                        {isSubmitting ? "Generating Report..." : "Complete Check-in"}
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="px-8 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    )
}

// --- SUB-COMPONENTS (Can extract later) ---

function Section0({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Let's get to know you</h2>
            <Question
                label="What best describes you?"
                options={["Student", "Working adult", "Not currently working", "Prefer not to say"]}
                selected={data.userContext.status}
                onSelect={(val) => updateData("userContext", "status", val)}
            />
            <Question
                label="Age range"
                options={["Under 18", "18–24", "25–40", "41–60", "60+"]}
                selected={data.userContext.ageRange}
                onSelect={(val) => updateData("userContext", "ageRange", val)}
            />
        </div>
    )
}

function Section1({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <div className="bg-amber-50 p-4 rounded-lg text-amber-800 text-sm mb-4">
                We ask these questions to ensure your safety. Your answers are private.
            </div>
            <Question
                label="In the past two weeks, have you had thoughts about harming yourself?"
                options={["No", "Yes"]}
                selected={data.safety.harm}
                onSelect={(val) => updateData("safety", "harm", val)}
                highlight="No"
            />
            <Question
                label="Have you felt unsafe or unable to keep yourself safe?"
                options={["No", "Yes"]}
                selected={data.safety.unsafe}
                onSelect={(val) => updateData("safety", "unsafe", val)}
                highlight="No"
            />
            <Question
                label="Are you experiencing things others don’t seem to (voices, visions)?"
                options={["No", "Yes"]}
                selected={data.safety.psychosis}
                onSelect={(val) => updateData("safety", "psychosis", val)}
                highlight="No"
            />
        </div>
    )
}

function Section2({ data, updateData, toggleArrayItem }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">How have you been feeling?</h2>
            <Question
                label="Over the past two weeks, how would you rate your overall wellbeing?"
                options={["Very good", "Good", "Fair", "Poor"]}
                selected={data.wellbeing.score}
                onSelect={(val) => updateData("wellbeing", "score", val)}
            />

            <div className="space-y-3">
                <label className="block text-lg font-medium text-gray-800">
                    Which areas have been difficult recently? (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        "Mood / emotions", "Worry or fear", "Focus or attention", "Sleep",
                        "Stress or burnout", "Trauma or loss", "Eating or body image",
                        "Substance use", "Anger or impulse control"
                    ].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => toggleArrayItem("wellbeing", "difficultAreas", opt)}
                            className={`p-4 rounded-xl border text-left transition-all ${data.wellbeing.difficultAreas.includes(opt)
                                ? "border-teal-500 bg-teal-50 text-teal-800 font-medium shadow-sm"
                                : "border-slate-200 hover:border-slate-300 text-slate-600"
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Module mapping logic is crucial here
const MODULE_QUESTIONS = {
    "Mood / emotions": [
        { q: "How often have you felt low, sad, or down?", key: "q3_1" },
        { q: "How often have you lost interest in things?", key: "q3_2" },
    ],
    "Worry or fear": [
        { q: "How often have you felt nervous, anxious, or on edge?", key: "q4_1" },
        { q: "Hard to stop worrying?", key: "q4_2" },
    ],
    // ... Add more mappings based on request. 
    // For brevity in this initial pass, I'll map a few key modules.
}

function SectionModules({ data, updateData }: any) {
    const selectedAreas: string[] = data.wellbeing.difficultAreas || []

    if (selectedAreas.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700">Great to hear things are steady.</h3>
                <p className="text-gray-500 mt-2">We can skip the deep dive section.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Let's explore a bit more</h2>
            {selectedAreas.map((area) => (
                <div key={area} className="border-t border-slate-200 pt-6 first:border-0 first:pt-0">
                    <h3 className="text-lg font-semibold text-teal-700 mb-4">{area}</h3>
                    <div className="space-y-6">
                        <ModuleQuestionsForArea area={area} data={data} updateData={updateData} />
                    </div>
                </div>
            ))}
        </div>
    )
}

function ModuleQuestionsForArea({ area, data, updateData }: any) {
    const commonOptions = ["Not at all", "Several days", "More than half days", "Nearly every day"]

    // Simple switch to render correct questions. In a full app, I'd use the config object above more strictly.
    if (area === "Mood / emotions") {
        return (
            <>
                <Question label="How often have you felt low, sad, or down?" options={commonOptions}
                    selected={data.modules["mood_low"]} onSelect={(v) => updateData("modules", "mood_low", v)} />
                <Question label="Lost interest or pleasure in things you usually enjoy?" options={commonOptions}
                    selected={data.modules["mood_interest"]} onSelect={(v) => updateData("modules", "mood_interest", v)} />
                <Question label="Felt tired or lacking energy?" options={commonOptions}
                    selected={data.modules["mood_energy"]} onSelect={(v) => updateData("modules", "mood_energy", v)} />
                <Question label="How much have these feelings affected your daily life?" options={["Not at all", "A little", "A lot", "Extremely"]}
                    selected={data.modules["mood_impact"]} onSelect={(v) => updateData("modules", "mood_impact", v)} />
            </>
        )
    }
    if (area === "Worry or fear") {
        return (
            <>
                <Question label="How often have you felt nervous, anxious, or on edge?" options={commonOptions}
                    selected={data.modules["anx_nervous"]} onSelect={(v) => updateData("modules", "anx_nervous", v)} />
                <Question label="How often have you found it hard to stop worrying?" options={commonOptions}
                    selected={data.modules["anx_worry"]} onSelect={(v) => updateData("modules", "anx_worry", v)} />
                <Question label="Do you avoid certain situations because of fear or discomfort?" options={["No", "Sometimes", "Often"]}
                    selected={data.modules["anx_avoid"]} onSelect={(v) => updateData("modules", "anx_avoid", v)} />
                <Question label="Have you experienced sudden waves of intense fear or panic?" options={["No", "Yes"]}
                    selected={data.modules["anx_panic"]} onSelect={(v) => updateData("modules", "anx_panic", v)} />
            </>
        )
    }
    if (area === "Stress or burnout") {
        return (
            <>
                <Question label="How often have you felt overwhelmed by responsibilities?" options={["Rarely", "Sometimes", "Often", "Almost always"]}
                    selected={data.modules["stress_overwhelmed"]} onSelect={(v) => updateData("modules", "stress_overwhelmed", v)} />
                <Question label="Do you feel emotionally drained at the end of the day?" options={["No", "Sometimes", "Yes"]}
                    selected={data.modules["stress_drained"]} onSelect={(v) => updateData("modules", "stress_drained", v)} />
                <Question label="Do you feel pressure to perform or meet expectations constantly?" options={["No", "Yes"]}
                    selected={data.modules["stress_pressure"]} onSelect={(v) => updateData("modules", "stress_pressure", v)} />
            </>
        )
    }
    if (area === "Focus or attention") {
        return (
            <>
                <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm mb-4">
                    Screening only — not an assessment.
                </div>
                <Question label="Do you struggle to stay focused on tasks?" options={["No", "Sometimes", "Often"]}
                    selected={data.modules["focus_struggle"]} onSelect={(v) => updateData("modules", "focus_struggle", v)} />
                <Question label="Do you find it hard to organize tasks or manage time?" options={["No", "Sometimes", "Often"]}
                    selected={data.modules["focus_organize"]} onSelect={(v) => updateData("modules", "focus_organize", v)} />
                <Question label="Have these difficulties been present since childhood?" options={["No", "Yes", "Not sure"]}
                    selected={data.modules["focus_childhood"]} onSelect={(v) => updateData("modules", "focus_childhood", v)} />
            </>
        )
    }
    if (area === "Sleep") {
        return (
            <>
                <Question label="How would you describe your sleep quality?" options={["Good", "Fair", "Poor"]}
                    selected={data.modules["sleep_qual"]} onSelect={(v) => updateData("modules", "sleep_qual", v)} />
                <Question label="Do you have trouble falling or staying asleep?" options={["No", "Yes"]}
                    selected={data.modules["sleep_trouble"]} onSelect={(v) => updateData("modules", "sleep_trouble", v)} />
                <Question label="Do you feel rested during the day?" options={["Yes", "No"]}
                    selected={data.modules["sleep_rested"]} onSelect={(v) => updateData("modules", "sleep_rested", v)} />
            </>
        )
    }
    if (area === "Trauma or loss") {
        return (
            <>
                <Question label="Have you experienced a distressing or traumatic event?" options={["No", "Yes"]}
                    selected={data.modules["trauma_event"]} onSelect={(v) => updateData("modules", "trauma_event", v)} />
                <Question label="Do reminders of that event cause strong emotional reactions?" options={["No", "Sometimes", "Often"]}
                    selected={data.modules["trauma_reaction"]} onSelect={(v) => updateData("modules", "trauma_reaction", v)} />
                <Question label="Do you avoid places, people, or thoughts related to it?" options={["No", "Yes"]}
                    selected={data.modules["trauma_avoid"]} onSelect={(v) => updateData("modules", "trauma_avoid", v)} />
            </>
        )
    }
    if (area === "Eating or body image") {
        return (
            <>
                <Question label="Are you concerned about your eating habits?" options={["No", "Yes"]}
                    selected={data.modules["eating_habits"]} onSelect={(v) => updateData("modules", "eating_habits", v)} />
                <Question label="Do you feel distressed about your body or weight?" options={["No", "Sometimes", "Often"]}
                    selected={data.modules["eating_distress"]} onSelect={(v) => updateData("modules", "eating_distress", v)} />
                <Question label="Have eating habits affected your health or daily life?" options={["No", "Yes"]}
                    selected={data.modules["eating_impact"]} onSelect={(v) => updateData("modules", "eating_impact", v)} />
            </>
        )
    }
    if (area === "Substance use") {
        return (
            <>
                <Question label="Do you use alcohol, tobacco, or other substances?" options={["No", "Occasionally", "Regularly"]}
                    selected={data.modules["substance_use"]} onSelect={(v) => updateData("modules", "substance_use", v)} />
                <Question label="Have you felt a loss of control over use?" options={["No", "Yes"]}
                    selected={data.modules["substance_control"]} onSelect={(v) => updateData("modules", "substance_control", v)} />
                <Question label="Has substance use caused problems in your life?" options={["No", "Yes"]}
                    selected={data.modules["substance_impact"]} onSelect={(v) => updateData("modules", "substance_impact", v)} />
            </>
        )
    }
    if (area === "Anger or impulse control") {
        return (
            <>
                <Question label="How often do you feel intense anger?" options={["Rarely", "Sometimes", "Often"]}
                    selected={data.modules["anger_freq"]} onSelect={(v) => updateData("modules", "anger_freq", v)} />
                <Question label="Do you act impulsively when upset?" options={["No", "Sometimes", "Yes"]}
                    selected={data.modules["anger_impulse"]} onSelect={(v) => updateData("modules", "anger_impulse", v)} />
                <Question label="Have these reactions caused regret or problems?" options={["No", "Yes"]}
                    selected={data.modules["anger_regret"]} onSelect={(v) => updateData("modules", "anger_regret", v)} />
            </>
        )
    }

    return <p className="text-gray-500 italic">Questions for {area} will appear here.</p>
}


function Section3({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Background</h2>
            <Question
                label="Have these challenges been present since childhood?"
                options={["No", "Yes"]}
                selected={data.background.childhood}
                onSelect={(val) => updateData("background", "childhood", val)}
            />
            <Question
                label="Have you ever received mental health support before?"
                options={["No", "Yes"]}
                selected={data.background.previousSupport}
                onSelect={(val) => updateData("background", "previousSupport", val)}
            />
            <Question
                label="Would you consider speaking to a professional if needed?"
                options={["Yes", "Maybe", "No"]}
                selected={data.background.willingToSpeak}
                onSelect={(val) => updateData("background", "willingToSpeak", val)}
            />
        </div>
    )
}

type QuestionProps = {
    label: string
    options: string[]
    selected?: string
    onSelect: (value: string) => void
    highlight?: string
}

function Question({ label, options, selected, onSelect, highlight }: QuestionProps) {
    return (
        <div className="space-y-3">
            <label className="block text-lg font-medium text-gray-800">{label}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((opt: string) => (
                    <button
                        key={opt}
                        onClick={() => onSelect(opt)}
                        className={`px-4 py-3 rounded-xl border text-left transition-all ${selected === opt
                            ? "border-teal-500 bg-teal-50 text-teal-800 font-medium shadow-sm"
                            : "border-slate-200 hover:border-slate-300 text-slate-600"
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    )
}
