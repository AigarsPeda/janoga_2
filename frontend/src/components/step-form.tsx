"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  CalculatorElement,
  Checkbox,
  Contact,
  DatePicker,
  Dropdown,
  Email,
  FileUpload,
  MultiChoice,
  Phone,
  Question,
  Slider,
  StepFormProps,
  Textarea,
  YesNo,
} from "@/types";
import * as Popover from "@radix-ui/react-popover";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { format } from "date-fns";
import { Calendar, Check, ChevronDown, ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";

import "react-day-picker/style.css";

type FormValues = Record<string, string | string[] | number | Date | File | Record<string, string> | null>;

export function StepForm(props: Readonly<StepFormProps>) {
  const {
    step: steps,
    backButtonLabel = "Atpakaļ",
    nextButtonLabel = "Tālāk",
    submitButtonLabel = "Iesniegt",
    allowSkipSteps = false,
  } = props;

  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState<number | null>(null);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [animationPhase, setAnimationPhase] = useState<"idle" | "setup" | "animating">("idle");
  const [formValues, setFormValues] = useState<FormValues>({});
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = () => {
    console.log("════════════════════════════════════════");
    console.log("📋 FORM SUBMISSION");
    console.log("════════════════════════════════════════");

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

        if (element.__component === "elements.multi-choice" || element.__component === "elements.dropdown") {
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
          answer = value === "yes" ? (yesNo.yesLabel || "Jā") : (yesNo.noLabel || "Nē");
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
        } else {
          answer = String(value);
        }

        // Add unit if present
        const unit = (element as { unit?: string }).unit;
        if (unit) {
          answer = `${answer} ${unit}`;
        }

        console.log(`${question} - ${answer}`);
      });
    });

    console.log("════════════════════════════════════════");
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="rounded-2xl bg-neutral-900/40 backdrop-blur-sm border border-neutral-700/40 shadow-xl overflow-hidden">
        {/* Step Indicators - Compact on mobile */}
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
                />
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8 flex justify-between items-center">
          <Button
            className="gap-2"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0 || isAnimating}
          >
            <ChevronLeft className="w-4 h-4" />
            {backButtonLabel}
          </Button>

          {/* <span className="text-sm text-muted-foreground">
            {currentStep + 1} / {totalSteps}
          </span> */}

          {currentStep === totalSteps - 1 ? (
            <Button
              className="gap-2"
              onClick={handleSubmit}
              disabled={isAnimating || (!allowSkipSteps && !currentStepComplete)}
            >
              {submitButtonLabel}
              <Check className="w-4 h-4" />
            </Button>
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
  element: CalculatorElement;
  value: FormValues[string];
  onChange: (value: FormValues[string]) => void;
}

function ElementRenderer({ element, value, onChange }: ElementRendererProps) {
  switch (element.__component) {
    case "elements.multi-choice":
      return (
        <MultiChoiceElement
          element={element as MultiChoice}
          value={value as string}
          onChange={onChange}
        />
      );
    case "elements.question":
      return (
        <QuestionElement
          element={element as Question}
          value={value as string}
          onChange={onChange}
        />
      );
    case "elements.checkbox":
      return (
        <CheckboxElement
          element={element as Checkbox}
          value={value as string[]}
          onChange={onChange}
        />
      );
    case "elements.slider":
      return (
        <SliderElement element={element as Slider} value={value as number} onChange={onChange} />
      );
    case "elements.date-picker":
      return (
        <DatePickerElement
          element={element as DatePicker}
          value={value as Date}
          onChange={onChange}
        />
      );
    case "elements.textarea":
      return (
        <TextareaElement
          element={element as Textarea}
          value={value as string}
          onChange={onChange}
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
          element={element as Dropdown}
          value={value as string}
          onChange={onChange}
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
          element={element as Contact}
          value={value as Record<string, string>}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}

const questionLabelClass = "block text-2xl font-medium text-neutral-100 mb-6 mt-6";
const inputBaseClass =
  "w-full rounded-lg border border-neutral-700/60 bg-neutral-800/50 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/80 transition-all duration-200 autofill:shadow-[inset_0_0_0px_1000px_rgb(38,38,38)] autofill:[-webkit-text-fill-color:#f5f5f5]";

function MultiChoiceElement({
  element,
  value,
  onChange,
}: {
  element: MultiChoice;
  value: string;
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
  element,
  value,
  onChange,
}: {
  element: Question;
  value: string;
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
  element,
  value,
  onChange,
}: {
  element: Checkbox;
  value: string[];
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
              key={choice.id}
              role="button"
              tabIndex={0}
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
  element,
  value,
  onChange,
}: {
  element: Slider;
  value: number;
  onChange: (val: number) => void;
}) {
  const currentValue = value ?? element.min;

  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <div className="px-2">
        <SliderPrimitive.Root
          value={[currentValue]}
          onValueChange={([val]) => onChange(val)}
          min={element.min}
          max={element.max}
          step={element.step || 1}
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
  element,
  value,
  onChange,
}: {
  element: DatePicker;
  value: Date;
  onChange: (val: Date) => void;
}) {
  const [open, setOpen] = useState(false);

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
            {value ? format(value, "PPP") : element.placeholder || "Izvēlieties datumu"}
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
              onSelect={(date) => {
                if (date) {
                  onChange(date);
                  setOpen(false);
                }
              }}
              classNames={{
                root: "text-neutral-100",
                month_caption: "text-neutral-100 font-semibold mb-2",
                weekday: "text-neutral-400 text-xs font-medium",
                day: "w-9 h-9 text-sm rounded-lg hover:bg-neutral-800 transition-colors",
                selected: "!bg-primary !text-primary-foreground font-semibold",
                today: "text-primary font-bold",
                outside: "text-neutral-600",
                disabled: "text-neutral-600 opacity-50",
                nav: "flex items-center justify-between mb-2",
                button_previous: "p-2 rounded-lg hover:bg-neutral-800 text-neutral-300",
                button_next: "p-2 rounded-lg hover:bg-neutral-800 text-neutral-300",
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
  element,
  value,
  onChange,
}: {
  element: Textarea;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={element.placeholder}
        maxLength={element.maxLength}
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
  element,
  value,
  onChange,
}: {
  element: Email;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <input
        type="email"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={element.placeholder || "jusu@epasts.lv"}
        className={inputBaseClass}
        autoComplete="email"
      />
    </div>
  );
}

function PhoneElement({
  element,
  value,
  onChange,
}: {
  element: Phone;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className={questionLabelClass}>{element.question}</label>
      <input
        type="tel"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={element.placeholder || "+371 20000000"}
        className={inputBaseClass}
        autoComplete="tel"
      />
    </div>
  );
}

function DropdownElement({
  element,
  value,
  onChange,
}: {
  element: Dropdown;
  value: string;
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
            className="z-50 overflow-hidden rounded-lg bg-neutral-900 border border-neutral-700 shadow-xl"
            position="popper"
            sideOffset={4}
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
  element,
  value,
  onChange,
}: {
  element: YesNo;
  value: string;
  onChange: (val: string) => void;
}) {
  const yesLabel = element.yesLabel || "Jā";
  const noLabel = element.noLabel || "Nē";

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
  element,
  value,
  onChange,
}: {
  element: FileUpload;
  value: File | null;
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
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          dragOver
            ? "border-primary bg-primary/10"
            : "border-neutral-700 bg-neutral-800/30 hover:border-neutral-600 hover:bg-neutral-800/50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={element.allowedTypes}
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
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
  element,
  value,
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
                value={values[String(field.id)] || ""}
                onChange={(e) => updateField(String(field.id), e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className={cn(inputBaseClass, "min-h-[100px] resize-y max-w-md")}
              />
            ) : (
              <input
                type={field.type === "phone" ? "tel" : field.type}
                value={values[String(field.id)] || ""}
                onChange={(e) => updateField(String(field.id), e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                autoComplete={
                  field.type === "email" ? "email" : field.type === "phone" ? "tel" : undefined
                }
                className={cn(inputBaseClass, "max-w-md")}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
