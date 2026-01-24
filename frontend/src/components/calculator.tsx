"use client";

import type { CalculatorProps } from "@/types";

export function Calculator(props: Readonly<CalculatorProps>) {
  console.log("Calculator data:", props);
  return null;
}
