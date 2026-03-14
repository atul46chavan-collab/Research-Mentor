import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, ArrowRight, ArrowLeft, Check, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const studyDesigns = ["Observational", "Experimental", "Cohort", "Case-control", "Cross-sectional", "Clinical trial"];
const dataCollections = ["Survey/Questionnaire", "Clinical examination", "Hospital records", "Laboratory tests"];
const statisticalTests = ["Descriptive statistics", "Chi-square test", "t-test", "ANOVA", "Regression analysis"];
const analysisTools = ["SPSS", "R", "Python", "Stata", "SAS"];

interface FormData {
  studyDesign: string;
  objective: string;
  population: string;
  location: string;
  ageGroup: string;
  sampleSize: string;
  samplingMethod: string;
  dataCollection: string[];
  independentVars: string;
  dependentVars: string;
  ethicalApproval: boolean;
  informedConsent: boolean;
  statisticalTests: string[];
  analysisTools: string[];
}

const initialForm: FormData = {
  studyDesign: "",
  objective: "",
  population: "",
  location: "",
  ageGroup: "",
  sampleSize: "",
  samplingMethod: "",
  dataCollection: [],
  independentVars: "",
  dependentVars: "",
  ethicalApproval: false,
  informedConsent: false,
  statisticalTests: [],
  analysisTools: [],
};

const MethodologyBuilder = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [generatedText, setGeneratedText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const steps = [
    { title: "Study Design", subtitle: "Select your research design" },
    { title: "Population", subtitle: "Define your study population" },
    { title: "Data Collection", subtitle: "How will you collect data?" },
    { title: "Variables", subtitle: "Define your variables" },
    { title: "Ethics & Analysis", subtitle: "Ethical considerations and statistical plan" },
  ];

  const toggleArray = (field: keyof FormData, val: string) => {
    const arr = form[field] as string[];
    setForm({ ...form, [field]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] });
  };

  const generate = async () => {
    setGenerating(true);
    
    const requestData = {
      study_design: form.studyDesign,
      study_objective: form.objective,
      study_population: form.population,
      sample_size: form.sampleSize,
      sampling_method: form.samplingMethod,
      data_collection_method: form.dataCollection.join(", "),
      variables: `Independent: ${form.independentVars}, Dependent: ${form.dependentVars}`,
      ethical_considerations: `${form.ethicalApproval ? "Approval obtained. " : ""}${form.informedConsent ? "Consent obtained." : ""}`,
      statistical_analysis: `Tools: ${form.analysisTools.join(", ")}, Tests: ${form.statisticalTests.join(", ")}`
    };

    try {
      const response = await fetch('http://localhost:5000/api/generate-methodology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) throw new Error('Failed to generate methodology');
      const data = await response.json();
      setGeneratedText(data.methodology);
    } catch (error) {
      console.error('Methodology Error:', error);
      toast({ 
        title: "Error", 
        description: "Could not generate methodology. Using local fallback.", 
        variant: "destructive" 
      });
      // Fallback
      setGeneratedText(
        `This ${form.studyDesign.toLowerCase()} study was conducted among ${form.population || "the target population"}... [Local Placeholder]`
      );
    } finally {
      setGenerating(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    toast({ title: "Copied!", description: "Materials & Methods section copied." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Methodology Builder
        </h1>
        <p className="text-muted-foreground mb-8">
          Design your medical research methodology step by step.
        </p>
      </motion.div>

      {!generatedText && (
        <>
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    i < step
                      ? "bg-accent text-accent-foreground"
                      : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 ${i < step ? "bg-accent" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-1">
              {steps[step].title}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">{steps[step].subtitle}</p>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {step === 0 && (
                  <>
                    <div>
                      <Label className="text-foreground">Study Design</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {studyDesigns.map((d) => (
                          <button
                            key={d}
                            onClick={() => setForm({ ...form, studyDesign: d })}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                              form.studyDesign === d
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card text-foreground border-border hover:border-primary/50"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="objective" className="text-foreground">Study Objective</Label>
                      <Textarea
                        id="objective"
                        value={form.objective}
                        onChange={(e) => setForm({ ...form, objective: e.target.value })}
                        placeholder="e.g., To assess the prevalence and determinants of anemia..."
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div>
                      <Label htmlFor="population" className="text-foreground">Target Population</Label>
                      <Input id="population" value={form.population} onChange={(e) => setForm({ ...form, population: e.target.value })} placeholder="e.g., Tribal children aged 5-12 years" />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-foreground">Location</Label>
                      <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g., Rural districts of Madhya Pradesh" />
                    </div>
                    <div>
                      <Label htmlFor="ageGroup" className="text-foreground">Age Group</Label>
                      <Input id="ageGroup" value={form.ageGroup} onChange={(e) => setForm({ ...form, ageGroup: e.target.value })} placeholder="e.g., 5-12 years" />
                    </div>
                    <div>
                      <Label htmlFor="sampleSize" className="text-foreground">Sample Size</Label>
                      <Input id="sampleSize" value={form.sampleSize} onChange={(e) => setForm({ ...form, sampleSize: e.target.value })} placeholder="e.g., 500" />
                    </div>
                    <div>
                      <Label htmlFor="sampling" className="text-foreground">Sampling Method</Label>
                      <Input id="sampling" value={form.samplingMethod} onChange={(e) => setForm({ ...form, samplingMethod: e.target.value })} placeholder="e.g., Stratified random sampling" />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <div>
                    <Label className="text-foreground">Data Collection Methods</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {dataCollections.map((d) => (
                        <button
                          key={d}
                          onClick={() => toggleArray("dataCollection", d)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                            form.dataCollection.includes(d)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-foreground border-border hover:border-primary/50"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <>
                    <div>
                      <Label htmlFor="indep" className="text-foreground">Independent Variables</Label>
                      <Textarea id="indep" value={form.independentVars} onChange={(e) => setForm({ ...form, independentVars: e.target.value })} placeholder="e.g., Age, gender, socioeconomic status, dietary intake" rows={2} />
                    </div>
                    <div>
                      <Label htmlFor="dep" className="text-foreground">Dependent Variables</Label>
                      <Textarea id="dep" value={form.dependentVars} onChange={(e) => setForm({ ...form, dependentVars: e.target.value })} placeholder="e.g., Hemoglobin level, anemia status" rows={2} />
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <div className="space-y-3">
                      <Label className="text-foreground">Ethical Considerations</Label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.ethicalApproval} onChange={(e) => setForm({ ...form, ethicalApproval: e.target.checked })} className="rounded border-border" />
                        <span className="text-sm text-foreground">Ethical approval obtained</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.informedConsent} onChange={(e) => setForm({ ...form, informedConsent: e.target.checked })} className="rounded border-border" />
                        <span className="text-sm text-foreground">Informed consent obtained</span>
                      </label>
                    </div>
                    <div>
                      <Label className="text-foreground">Statistical Tests</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {statisticalTests.map((t) => (
                          <button
                            key={t}
                            onClick={() => toggleArray("statisticalTests", t)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                              form.statisticalTests.includes(t)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card text-foreground border-border hover:border-primary/50"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-foreground">Analysis Tools</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {analysisTools.map((t) => (
                          <button
                            key={t}
                            onClick={() => toggleArray("analysisTools", t)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                              form.analysisTools.includes(t)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card text-foreground border-border hover:border-primary/50"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)}>
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={generate} disabled={generating}>
                  {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FlaskConical className="w-4 h-4 mr-2" />}
                  Generate Methods Section
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {generatedText && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-primary" />
              Materials & Methods
            </h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setGeneratedText(""); setStep(0); }}>
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={copyText}>
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{generatedText}</p>
        </motion.div>
      )}
    </div>
  );
};

export default MethodologyBuilder;
