"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  Checkbox,
  Contact,
  DatePicker,
  Dropdown,
  Email,
  FileUpload,
  FormStep,
  MenuSelection,
  MultiChoice,
  Phone,
  Question,
  Slider,
  StepFormElement,
  StepFormProps,
  Textarea,
  YesNo,
} from "@/types";
import * as Popover from "@radix-ui/react-popover";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { format } from "date-fns";
import { enUS, lv } from "date-fns/locale";
import { Calendar, Check, ChevronDown, ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";

import "react-day-picker/style.css";

type FormValues = Record<
  string,
  string | string[] | number | Date | File | Record<string, string> | Record<string, number> | null
>;

export function StepForm(props: Readonly<StepFormProps>) {
  const {
    step: steps,
    recipientEmail,
    allowSkipSteps = false,
    nextButtonLabel = "Tālāk",
    backButtonLabel = "Atpakaļ",
    submitButtonLabel = "Iesniegt",
    successMessage = "Ziņojums nosūtīts veiksmīgi!",
    locale = "lv",
  } = props;

  const [currentStep, setCurrentStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previousStep, setPreviousStep] = useState<number | null>(null);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [animationPhase, setAnimationPhase] = useState<"idle" | "setup" | "animating">("idle");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );

  // Trigger the animation after the initial positioning
  useLayoutEffect(() => {
    if (animationPhase === "setup") {
      // Force a reflow to ensure the initial position is applied
      containerRef.current?.offsetHeight;
      // Then start the animation
      requestAnimationFrame(() => {
        setAnimationPhase("animating");
      });
    }
  }, [animationPhase]);

  // Clean up after animation completes
  useEffect(() => {
    if (animationPhase === "animating") {
      const timer = setTimeout(() => {
        setAnimationPhase("idle");
        setPreviousStep(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [animationPhase]);

  if (!steps || steps.length === 0) return null;

  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];

  const updateValue = (key: string, value: FormValues[string]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  // Check if a step has all elements answered
  const isStepComplete = (stepIndex: number): boolean => {
    const stepData = steps[stepIndex];
    if (!stepData.element || stepData.element.length === 0) return true;

    return stepData.element.every((element) => {
      const key = `${element.__component}-${element.id}`;
      const value = formValues[key];

      // Special handling for ContactElement - check required fields
      if (element.__component === "elements.contact") {
        const contactElement = element as Contact;
        const contactValues = (value as Record<string, string>) || {};

        // Check if all required fields are filled
        return (contactElement.field || []).every((field) => {
          if (!field.required) return true;
          const fieldValue = contactValues[String(field.id)];
          return fieldValue !== undefined && fieldValue.trim() !== "";
        });
      }

      if (value === undefined || value === null) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;

      return true;
    });
  };

  const currentStepComplete = isStepComplete(currentStep);

  const isAnimating = animationPhase !== "idle";

  const goToStep = (stepIndex: number) => {
    if (stepIndex === currentStep || isAnimating) return;
    // If going forward and allowSkipSteps is false, check if current step is complete
    if (!allowSkipSteps && stepIndex > currentStep && !currentStepComplete) return;

    setPreviousStep(currentStep);
    setDirection(stepIndex > currentStep ? "forward" : "backward");
    setCurrentStep(stepIndex);
    setAnimationPhase("setup");
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1 && (allowSkipSteps || currentStepComplete)) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitStatus("submitting");
    setErrorMsg(null);

    const formData: Record<string, string> = {};

    steps.forEach((step) => {
      step.element?.forEach((element) => {
        const key = `${element.__component}-${element.id}`;
        const value = formValues[key];

        if (value === undefined || value === null) return;

        // Get question text
        const question =
          (element as { question?: string }).question ||
          (element as { title?: string }).title ||
          key;

        // Format answer based on element type
        let answer: string;

        if (
          element.__component === "elements.multi-choice" ||
          element.__component === "elements.dropdown"
        ) {
          const choices = (element as MultiChoice | Dropdown).choice || [];
          const selectedChoice = choices.find((c) => String(c.id) === value);
          answer = selectedChoice?.name || String(value);
        } else if (element.__component === "elements.checkbox") {
          const choices = (element as Checkbox).choice || [];
          const selectedValues = value as string[];
          answer = selectedValues
            .map((v) => choices.find((c) => String(c.id) === v)?.name || v)
            .join(", ");
        } else if (element.__component === "elements.yes-no") {
          const yesNo = element as YesNo;
          answer = value === "yes" ? yesNo.yesLabel || "Jā" : yesNo.noLabel || "Nē";
        } else if (element.__component === "elements.date-picker") {
          answer = value instanceof Date ? format(value, "PPP") : String(value);
        } else if (element.__component === "elements.file-upload") {
          answer = value instanceof File ? value.name : String(value);
        } else if (element.__component === "elements.contact") {
          const contactElement = element as Contact;
          const contactValues = value as Record<string, string>;
          const fields = contactElement.field || [];
          answer = fields
            .map((f) => `${f.label}: ${contactValues[String(f.id)] || "-"}`)
            .join(", ");
        } else if (element.__component === "elements.menu-selection") {
          const menuElement = element as MenuSelection;
          const menuValues = value as Record<string, number>;
          const dishes = menuElement.dishes || [];

          // Format as dish names with quantities
          answer = Object.entries(menuValues)
            .filter(([, count]) => count > 0)
            .map(([dishId, count]) => {
              const dish = dishes.find((d) => String(d.id) === dishId);
              return dish ? `${dish.name}: ${count}` : `${dishId}: ${count}`;
            })
            .join(", ");
        } else {
          answer = String(value);
        }

        // Add unit if present
        const unit = (element as { unit?: string }).unit;
        if (unit) {
          answer = `${answer} ${unit}`;
        }

        formData[question] = answer;
      });
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recipientEmail }),
      });

      if (response.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
        setErrorMsg("Neizdevās nosūtīt ziņojumu");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMsg(error instanceof Error ? error.message : "Kļūda nosūtot ziņojumu");
    }
  };

  return (
    <div className="container mx-auto px-4 md:py-12 py-5 max-w-4xl md:min-h-[83vh]">
      <div className="rounded-2xl bg-neutral-900/40 backdrop-blur-sm border border-neutral-700/40 shadow-xl overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          {/* Mobile: Compact view */}
          <div className="flex flex-col items-center gap-3 md:hidden">
            <span className="text-sm text-neutral-300">
              {currentStep + 1} / {totalSteps}
            </span>
            <div className="w-full max-w-[200px] h-1.5 bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop: Full indicators */}
          <div className="hidden md:flex items-center justify-center max-w-md mx-auto">
            {steps.map((s, index) => {
              const canNavigate =
                index < currentStep ||
                index === currentStep ||
                allowSkipSteps ||
                (index === currentStep + 1 && currentStepComplete);

              return (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <button
                    onClick={() => goToStep(index)}
                    disabled={isAnimating || !canNavigate}
                    className={cn(
                      "relative flex items-center justify-center w-8 h-8 rounded-full font-medium text-xs transition-all duration-300",
                      index === currentStep
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                        : index < currentStep
                          ? "bg-primary/20 text-primary border border-primary cursor-pointer"
                          : canNavigate
                            ? "bg-neutral-800 text-neutral-400 border border-neutral-700 cursor-pointer"
                            : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed opacity-50",
                    )}
                  >
                    {index < currentStep ? <Check className="w-3.5 h-3.5" /> : s.title || index + 1}
                  </button>
                  {index < totalSteps - 1 && (
                    <div className="flex-1 mx-1.5 min-w-[24px]">
                      <div
                        className={cn(
                          "h-0.5 rounded-full transition-all duration-500",
                          index < currentStep ? "bg-primary" : "bg-neutral-700",
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div ref={containerRef} className="relative overflow-hidden min-h-[400px]">
          {/* Previous step (sliding out) */}
          {previousStep !== null && (
            <div
              className={cn(
                "absolute inset-0 px-8 pb-8",
                animationPhase === "setup"
                  ? "translate-x-0"
                  : animationPhase === "animating"
                    ? cn(
                        "transition-transform duration-300 ease-out",
                        direction === "forward" ? "-translate-x-full" : "translate-x-full",
                      )
                    : "hidden",
              )}
            >
              {steps[previousStep].description && (
                <p className="text-muted-foreground text-center mb-8">
                  {steps[previousStep].description}
                </p>
              )}
              <div className="space-y-6">
                {steps[previousStep].element?.map((element) => (
                  <ElementRenderer
                    element={element}
                    key={`${element.__component}-${element.id}`}
                    value={formValues[`${element.__component}-${element.id}`]}
                    onChange={(val) => updateValue(`${element.__component}-${element.id}`, val)}
                    locale={locale}
                    formValues={formValues}
                    steps={steps}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Current step (sliding in) */}
          <div
            className={cn(
              "px-8 pb-8",
              animationPhase === "setup"
                ? direction === "forward"
                  ? "translate-x-full"
                  : "-translate-x-full"
                : animationPhase === "animating"
                  ? "transition-transform duration-300 ease-out translate-x-0"
                  : "translate-x-0",
            )}
          >
            {currentStepData.description && (
              <p className="text-muted-foreground text-center mb-8">
                {currentStepData.description}
              </p>
            )}

            <div className="space-y-6">
              {currentStepData.element?.map((element) => (
                <ElementRenderer
                  element={element}
                  key={`${element.__component}-${element.id}`}
                  value={formValues[`${element.__component}-${element.id}`]}
                  onChange={(val) => updateValue(`${element.__component}-${element.id}`, val)}
                  locale={locale}
                  formValues={formValues}
                  steps={steps}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8 flex justify-between items-center">
          {currentStep > 0 ? (
            <Button className="gap-2" variant="outline" onClick={prevStep} disabled={isAnimating}>
              <ChevronLeft className="w-4 h-4" />
              {backButtonLabel}
            </Button>
          ) : (
            <div />
          )}

          {/* <span className="text-sm text-muted-foreground">
            {currentStep + 1} / {totalSteps}
          </span> */}

          {currentStep === totalSteps - 1 ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {submitStatus === "success" ? (
                <span className="text-sm text-green-400 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {successMessage}
                </span>
              ) : (
                <>
                  <Button
                    className="gap-2"
                    onClick={handleSubmit}
                    disabled={
                      isAnimating ||
                      submitStatus === "submitting" ||
                      (!allowSkipSteps && !currentStepComplete)
                    }
                  >
                    {submitStatus === "submitting" ? "Nosūta..." : submitButtonLabel}
                    {submitStatus !== "submitting" && <Check className="w-4 h-4" />}
                  </Button>
                  {submitStatus === "error" && (
                    <span className="text-sm text-red-400">
                      {errorMsg || "Kļūda nosūtot ziņojumu"}
                    </span>
                  )}
                </>
              )}
            </div>
          ) : (
            <Button
              className="gap-2"
              onClick={nextStep}
              disabled={isAnimating || (!allowSkipSteps && !currentStepComplete)}
            >
              {nextButtonLabel}
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ElementRendererProps {
  locale?: string;
  element: StepFormElement;
  value: FormValues[string];
  onChange: (value: FormValues[string]) => void;
  formValues: FormValues;
  steps: FormStep[];
}

function ElementRenderer({
  value,
  locale,
  element,
  onChange,
  formValues,
  steps,
}: ElementRendererProps) {
  switch (element.__component) {
    case "elements.multi-choice":
      return (
        <MultiChoiceElement
          onChange={onChange}
          value={value as string}
          element={element as MultiChoice}
        />
      );
    case "elements.question":
      return (
        <QuestionElement
          onChange={onChange}
          value={value as string}
          element={element as Question}
        />
      );
    case "elements.checkbox":
      return (
        <CheckboxElement
          onChange={onChange}
          value={value as string[]}
          element={element as Checkbox}
        />
      );
    case "elements.slider":
      return (
        <SliderElement element={element as Slider} value={value as number} onChange={onChange} />
      );
    case "elements.date-picker":
      return (
        <DatePickerElement
          locale={locale}
          onChange={onChange}
          value={value as Date}
          element={element as DatePicker}
        />
      );
    case "elements.textarea":
      return (
        <TextareaElement
          onChange={onChange}
          value={value as string}
          element={element as Textarea}
        />
      );
    case "elements.email":
      return (
        <EmailElement element={element as Email} value={value as string} onChange={onChange} />
      );
    case "elements.phone":
      return (
        <PhoneElement element={element as Phone} value={value as string} onChange={onChange} />
      );
    case "elements.dropdown":
      return (
        <DropdownElement
          onChange={onChange}
          value={value as string}
          element={element as Dropdown}
        />
      );
    case "elements.yes-no":
      return (
        <YesNoElement element={element as YesNo} value={value as string} onChange={onChange} />
      );
    case "elements.file-upload":
      return (
        <FileUploadElement
          onChange={onChange}
          value={value as File | null}
          element={element as FileUpload}
        />
      );
    case "elements.contact":
      return (
        <ContactElement
          onChange={onChange}
          element={element as Contact}
          value={value as Record<string, string>}
        />
      );
    case "elements.menu-selection":
      return (
        <MenuSelectionElement
          onChange={onChange as (val: Record<string, number>) => void}
          element={element as MenuSelection}
          value={value as Record<string, number>}
          formValues={formValues}
          steps={steps}
        />
      );
    default:
      return null;
  }
}

const questionLabelClass = "block text-2xl font-medium text-neutral-100 mb-6 mt-6";
const inputBaseClass =
  "w-full rounded-lg border border-neutral-700/60 bg-neutral-800/50 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/80 transition-all duration-200 autofill:shadow-[inset_0_0_0px_1000px_rgb(38,38,38)] autofill:[-webkit-text-fill-color:#f5f5f5] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]";

function MultiChoiceElement({
  value,
  element,
  onChange,
}: {
  value: string;
  element: MultiChoice;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <RadioGroup.Root
        value={value || ""}
        onValueChange={onChange}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {element.choice?.map((choice) => (
          <RadioGroup.Item
            key={choice.id}
            value={String(choice.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
              value === String(choice.id)
                ? "border-primary bg-primary/10 text-primary"
                : "border-neutral-700 bg-neutral-800/30 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800/50",
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                value === String(choice.id) ? "border-primary bg-primary" : "border-neutral-500",
              )}
            >
              {value === String(choice.id) && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <span className="font-medium">{choice.name}</span>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
}

function QuestionElement({
  value,
  element,
  onChange,
}: {
  value: string;
  element: Question;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <div className="flex items-center gap-3">
        <input
          value={value || ""}
          type={element.inputType}
          placeholder={element.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            inputBaseClass,
            element.unit && "flex-1",
            element.inputType === "number" && "max-w-[200px]",
          )}
        />
        {element.unit && (
          <span className="text-sm text-neutral-400 whitespace-nowrap">{element.unit}</span>
        )}
      </div>
    </div>
  );
}

function CheckboxElement({
  value,
  element,
  onChange,
}: {
  value: string[];
  element: Checkbox;
  onChange: (val: string[]) => void;
}) {
  const selectedValues = value || [];

  const toggleValue = (choiceId: string) => {
    if (selectedValues.includes(choiceId)) {
      onChange(selectedValues.filter((v) => v !== choiceId));
    } else {
      onChange([...selectedValues, choiceId]);
    }
  };

  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {element.choice?.map((choice) => {
          const isChecked = selectedValues.includes(String(choice.id));
          return (
            <div
              tabIndex={0}
              role="button"
              key={choice.id}
              onClick={() => toggleValue(String(choice.id))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleValue(String(choice.id));
                }
              }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all duration-200 text-left",
                isChecked
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-neutral-700 bg-neutral-800/30 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800/50",
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-all pointer-events-none",
                  isChecked ? "border-primary bg-primary" : "border-neutral-500 bg-transparent",
                )}
              >
                {isChecked && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="font-medium">{choice.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SliderElement({
  value,
  element,
  onChange,
}: {
  value: number;
  element: Slider;
  onChange: (val: number) => void;
}) {
  const currentValue = value ?? element.min;

  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <div className="px-2">
        <SliderPrimitive.Root
          min={element.min}
          max={element.max}
          value={[currentValue]}
          step={element.step || 1}
          onValueChange={([val]) => onChange(val)}
          className="relative flex items-center select-none touch-none w-full h-5"
        >
          <SliderPrimitive.Track className="bg-neutral-700 relative grow rounded-full h-2">
            <SliderPrimitive.Range className="absolute bg-primary rounded-full h-full" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block w-5 h-5 bg-white shadow-lg rounded-full hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer" />
        </SliderPrimitive.Root>
        <div className="flex justify-between mt-2 text-sm text-neutral-400">
          <span>
            {element.min}
            {element.unit}
          </span>
          <span className="text-primary font-semibold text-base">
            {currentValue}
            {element.unit}
          </span>
          <span>
            {element.max}
            {element.unit}
          </span>
        </div>
      </div>
    </div>
  );
}

function DatePickerElement({
  value,
  element,
  onChange,
  locale = "lv",
}: {
  value: Date;
  locale?: string;
  element: DatePicker;
  onChange: (val: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  const dateLocale = locale === "lv" ? lv : enUS;

  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className={cn(
              inputBaseClass,
              "flex items-center justify-between cursor-pointer max-w-[280px]",
              !value && "text-neutral-400",
            )}
          >
            {value
              ? format(value, "PPP", { locale: dateLocale })
              : element.placeholder || "Izvēlieties datumu"}
            <Calendar className="w-5 h-5 text-neutral-400" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-50 rounded-lg bg-neutral-900 border border-neutral-700 shadow-xl p-4"
            sideOffset={4}
          >
            <DayPicker
              mode="single"
              selected={value}
              locale={dateLocale}
              onSelect={(date) => {
                if (date) {
                  onChange(date);
                  setOpen(false);
                }
              }}
              classNames={{
                root: "text-neutral-100",
                month: "relative",
                month_caption: "text-neutral-100 font-semibold text-center mb-4 py-1",
                nav: "absolute top-0 left-0 right-0 flex items-center justify-between z-20",
                button_previous:
                  "p-2 rounded-lg hover:bg-neutral-700 text-white cursor-pointer relative z-30",
                button_next:
                  "p-2 rounded-lg hover:bg-neutral-700 text-white cursor-pointer relative z-30",
                month_grid: "w-full border-collapse",
                weekdays: "grid grid-cols-7",
                weekday:
                  "text-neutral-400 text-xs font-medium w-9 h-9 flex items-center justify-center",
                week: "grid grid-cols-7",
                day: "w-9 h-9 text-sm flex items-center justify-center",
                day_button:
                  "w-9 h-9 rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer",
                selected: "!bg-primary !text-primary-foreground font-semibold rounded-lg",
                today: "text-primary font-bold",
                outside: "text-neutral-600",
                disabled: "text-neutral-600 opacity-50",
              }}
            />
            <Popover.Arrow className="fill-neutral-700" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

function TextareaElement({
  value,
  element,
  onChange,
}: {
  value: string;
  element: Textarea;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <textarea
        value={value || ""}
        maxLength={element.maxLength}
        placeholder={element.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputBaseClass, "min-h-[120px] resize-y")}
      />
      {element.maxLength && (
        <div className="text-xs text-neutral-400 mt-1 text-right">
          {(value || "").length} / {element.maxLength}
        </div>
      )}
    </div>
  );
}

function EmailElement({
  value,
  element,
  onChange,
}: {
  value: string;
  element: Email;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <input
        type="email"
        value={value || ""}
        autoComplete="email"
        className={inputBaseClass}
        onChange={(e) => onChange(e.target.value)}
        placeholder={element.placeholder || "jusu@epasts.lv"}
      />
    </div>
  );
}

function PhoneElement({
  value,
  element,
  onChange,
}: {
  value: string;
  element: Phone;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <input
        type="tel"
        autoComplete="tel"
        value={value || ""}
        className={inputBaseClass}
        onChange={(e) => onChange(e.target.value)}
        placeholder={element.placeholder || "+371 20000000"}
      />
    </div>
  );
}

function DropdownElement({
  value,
  element,
  onChange,
}: {
  value: string;
  element: Dropdown;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <SelectPrimitive.Root value={value || ""} onValueChange={onChange}>
        <SelectPrimitive.Trigger
          className={cn(inputBaseClass, "flex items-center justify-between cursor-pointer")}
        >
          <SelectPrimitive.Value placeholder={element.placeholder || "Izvēlieties opciju"} />
          <SelectPrimitive.Icon>
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            sideOffset={4}
            position="popper"
            className="z-50 overflow-hidden rounded-lg bg-neutral-900 border border-neutral-700 shadow-xl"
          >
            <SelectPrimitive.Viewport className="p-1">
              {element.choice?.map((choice) => (
                <SelectPrimitive.Item
                  key={choice.id}
                  value={String(choice.id)}
                  className="relative flex items-center px-4 py-2.5 rounded-md text-sm text-neutral-100 cursor-pointer hover:bg-neutral-800 focus:bg-neutral-800 focus:outline-none data-[state=checked]:text-primary"
                >
                  <SelectPrimitive.ItemText>{choice.name}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-2">
                    <Check className="w-4 h-4 text-primary" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}

function YesNoElement({
  value,
  element,
  onChange,
}: {
  value: string;
  element: YesNo;
  onChange: (val: string) => void;
}) {
  const noLabel = element.noLabel || "Nē";
  const yesLabel = element.yesLabel || "Jā";

  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange("yes")}
          className={cn(
            "px-8 py-2.5 rounded-lg border-2 font-medium text-sm transition-all duration-200",
            value === "yes"
              ? "border-primary bg-primary/10 text-primary"
              : "border-neutral-700 bg-neutral-800/30 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800/50",
          )}
        >
          {yesLabel}
        </button>
        <button
          type="button"
          onClick={() => onChange("no")}
          className={cn(
            "px-8 py-2.5 rounded-lg border-2 font-medium text-sm transition-all duration-200",
            value === "no"
              ? "border-primary bg-primary/10 text-primary"
              : "border-neutral-700 bg-neutral-800/30 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800/50",
          )}
        >
          {noLabel}
        </button>
      </div>
    </div>
  );
}

function FileUploadElement({
  value,
  element,
  onChange,
}: {
  value: File | null;
  element: FileUpload;
  onChange: (val: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    if (element.maxSize && file.size > element.maxSize * 1024 * 1024) {
      alert(`Faila izmērs nedrīkst pārsniegt ${element.maxSize}MB`);
      return;
    }

    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <div
        onDrop={handleDrop}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          dragOver
            ? "border-primary bg-primary/10"
            : "border-neutral-700 bg-neutral-800/30 hover:border-neutral-600 hover:bg-neutral-800/50",
        )}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept={element.allowedTypes}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {value ? (
          <div className="flex items-center justify-center gap-3">
            <span className="text-neutral-100 font-medium">{value.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="p-1 rounded-full hover:bg-neutral-700 transition-colors"
            >
              <X className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-300 font-medium mb-1">
              Noklikšķiniet vai velciet failu šeit
            </p>
            <p className="text-sm text-neutral-500">
              {element.allowedTypes && `Atļautie formāti: ${element.allowedTypes}`}
              {element.maxSize && ` • Maks. ${element.maxSize}MB`}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function ContactElement({
  value,
  element,
  onChange,
}: {
  element: Contact;
  value: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
}) {
  const values = value || {};

  const updateField = (fieldId: string, fieldValue: string) => {
    onChange({ ...values, [fieldId]: fieldValue });
  };

  return (
    <div>
      {element.title && <h3 className={questionLabelClass}>{element.title}</h3>}
      <div className="space-y-4">
        {element.field?.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                required={field.required}
                placeholder={field.placeholder}
                value={values[String(field.id)] || ""}
                onChange={(e) => updateField(String(field.id), e.target.value)}
                className={cn(inputBaseClass, "min-h-[100px] resize-y max-w-md")}
              />
            ) : (
              <input
                required={field.required}
                placeholder={field.placeholder}
                value={values[String(field.id)] || ""}
                className={cn(inputBaseClass, "max-w-md")}
                type={field.type === "phone" ? "tel" : field.type}
                onChange={(e) => updateField(String(field.id), e.target.value)}
                autoComplete={
                  field.type === "email" ? "email" : field.type === "phone" ? "tel" : undefined
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Value structure: { "dishId": quantity, ... }
type MenuSelectionValue = Record<string, number>;

function MenuSelectionElement({
  value,
  element,
  onChange,
  formValues,
  steps,
}: {
  element: MenuSelection;
  value: MenuSelectionValue;
  onChange: (val: MenuSelectionValue) => void;
  formValues: FormValues;
  steps: FormStep[];
}) {
  const values = value || {};
  const dishes = element.dishes || [];
  const config = element.config || { rules: [] };
  const hasInitialized = useRef(false);

  // Get multiplier value from referenced field (e.g., guest count)
  const getMultiplier = (): number => {
    const { multiplierReferenceId } = config;
    if (!multiplierReferenceId) return 1;

    for (const step of steps) {
      for (const el of step.element || []) {
        const elWithRef = el as { referenceId?: string };
        if (elWithRef.referenceId === multiplierReferenceId) {
          const formKey = `${el.__component}-${el.id}`;
          const formValue = formValues[formKey];
          const num = Number(formValue);
          return isNaN(num) ? 1 : num;
        }
      }
    }
    return 1;
  };

  // Find the matching rule based on previous form values
  const getMatchingRule = () => {
    const { rules } = config;
    if (!rules || rules.length === 0) return null;

    // First, try to find a rule that matches a previous answer
    for (const rule of rules) {
      if (rule.sourceReferenceId && rule.value) {
        // Find the element with this referenceId
        for (const step of steps) {
          for (const el of step.element || []) {
            const elWithRef = el as { referenceId?: string };
            if (elWithRef.referenceId === rule.sourceReferenceId) {
              const formKey = `${el.__component}-${el.id}`;
              const formValue = formValues[formKey];

              // For multi-choice, we need to find the choice name by ID
              if (el.__component === "elements.multi-choice") {
                const multiChoice = el as MultiChoice;
                const selectedChoice = multiChoice.choice?.find((c) => String(c.id) === formValue);
                if (selectedChoice?.name === rule.value) {
                  return rule;
                }
              } else if (formValue === rule.value) {
                return rule;
              }
            }
          }
        }
      }
    }

    // Fall back to default rule
    return rules.find((rule) => rule.default);
  };

  const matchingRule = getMatchingRule();
  const multiplier = getMultiplier();

  // Apply multiplier to category limits
  const categoryLimits = matchingRule?.selection
    ? Object.fromEntries(
        Object.entries(matchingRule.selection).map(([key, val]) => [key, val * multiplier]),
      )
    : {};

  // Pre-fill dishes based on rule and guest count
  useEffect(() => {
    if (!matchingRule || dishes.length === 0 || hasInitialized.current) return;

    const prefilled: MenuSelectionValue = {};
    const categories = Object.keys(categoryLimits);

    for (const category of categories) {
      const requiredAmount = categoryLimits[category];
      const categoryDishes = dishes.filter((dish) => dish.kind === category);

      if (categoryDishes.length > 0 && requiredAmount > 0) {
        // Pre-fill the first dish with the required amount
        prefilled[String(categoryDishes[0].id)] = requiredAmount;
      }
    }

    if (Object.keys(prefilled).length > 0) {
      hasInitialized.current = true;
      onChange(prefilled);
    }
  }, [matchingRule, multiplier, dishes, categoryLimits, onChange]);

  // Get total selected count for a category
  const getCategoryTotal = (category: string) => {
    return dishes
      .filter((dish) => dish.kind === category)
      .reduce((sum, dish) => sum + (values[String(dish.id)] || 0), 0);
  };

  // Update dish quantity (no max limit - user chooses freely)
  const updateDish = (dishId: string, delta: number) => {
    const currentValue = values[dishId] || 0;
    const newValue = Math.max(0, currentValue + delta);
    onChange({ ...values, [dishId]: newValue });
  };

  const categoryLabels: Record<string, string> = {
    first: "Pirmais ēdiens",
    second: "Otrais ēdiens",
    sweet: "Saldais",
  };

  if (dishes.length === 0) {
    return null;
  }

  // Get ALL unique categories from dishes (always show full menu)
  const allCategories = [...new Set(dishes.map((dish) => dish.kind))];

  // Sort categories in a logical order
  const categoryOrder = ["first", "second", "sweet"];
  const availableCategories = allCategories.sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b),
  );

  // Group dishes by category
  const dishesByCategory = availableCategories.reduce(
    (acc, category) => {
      acc[category] = dishes.filter((dish) => dish.kind === category);
      return acc;
    },
    {} as Record<string, typeof dishes>,
  );

  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <div className="space-y-6">
        {availableCategories.map((category) => {
          const categoryDishes = dishesByCategory[category];
          const requiredCount = categoryLimits[category] || 0;
          const currentTotal = getCategoryTotal(category);
          const hasRequirement = requiredCount > 0;
          const remaining = requiredCount - currentTotal;
          const isComplete = !hasRequirement || remaining <= 0;

          if (categoryDishes.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-neutral-100">
                  {categoryLabels[category] || category}
                </h4>
                <span
                  className={cn(
                    "text-sm font-medium",
                    !hasRequirement
                      ? "text-neutral-400"
                      : isComplete
                        ? "text-green-400"
                        : "text-amber-400",
                  )}
                >
                  {!hasRequirement
                    ? `${currentTotal} izvēlēti`
                    : isComplete
                      ? `✓ ${currentTotal} izvēlēti`
                      : `${currentTotal} / ${requiredCount} (vēl ${remaining})`}
                </span>
              </div>
              <div className="space-y-2">
                {categoryDishes.map((dish) => {
                  const dishId = String(dish.id);
                  const quantity = values[dishId] || 0;

                  return (
                    <div
                      key={dish.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border transition-all",
                        quantity > 0
                          ? "border-primary bg-primary/10"
                          : "border-neutral-700 bg-neutral-800/30",
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-neutral-100 font-medium">{dish.name}</span>
                        {dish.description && (
                          <p className="text-sm text-neutral-400 mt-1">{dish.description}</p>
                        )}
                      </div>
                      {dish.price != null && (
                        <span className="text-sm text-primary font-medium whitespace-nowrap w-16 text-right mx-4">
                          €{dish.price.toFixed(2)}
                        </span>
                      )}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateDish(dishId, -1)}
                          disabled={quantity <= 0}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all",
                            quantity <= 0
                              ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                              : "bg-neutral-700 text-neutral-100 hover:bg-neutral-600",
                          )}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-lg font-semibold text-neutral-100">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateDish(dishId, 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all bg-primary text-primary-foreground hover:bg-primary/80"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
