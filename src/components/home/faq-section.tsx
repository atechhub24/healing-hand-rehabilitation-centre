"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calendar,
  Activity,
  Clock,
  Users,
  Phone,
  FileText,
} from "lucide-react";

const faqs = [
  {
    question: "How do I schedule my first rehabilitation assessment?",
    answer:
      "Getting started is easy! Contact us to schedule your initial assessment where our rehabilitation team will evaluate your condition, discuss your goals, and create a personalized treatment plan tailored to your specific needs.",
    icon: Calendar,
  },
  {
    question: "What types of rehabilitation services do you offer?",
    answer:
      "We offer comprehensive rehabilitation services including physical therapy, occupational therapy, speech-language therapy, cardiac rehabilitation, neurological rehabilitation, and specialized programs for stroke recovery, sports injuries, and post-surgical rehabilitation.",
    icon: Activity,
  },
  {
    question: "How long does a typical rehabilitation program last?",
    answer:
      "The duration varies based on your condition and goals. Some patients see improvement in a few weeks, while others may need several months of therapy. We continuously assess your progress and adjust your treatment plan accordingly.",
    icon: Clock,
  },
  {
    question: "Do you work with families and caregivers?",
    answer:
      "Absolutely! We believe family involvement is crucial for successful rehabilitation. We provide training and education to family members and caregivers to support your recovery at home and ensure continuity of care.",
    icon: Users,
  },
  {
    question: "What should I do if I need urgent rehabilitation support?",
    answer:
      "For urgent rehabilitation needs, please contact our clinic directly. We offer emergency consultations and can provide guidance on immediate care. For life-threatening emergencies, always call emergency services first.",
    icon: Phone,
  },
  {
    question: "How do I track my rehabilitation progress?",
    answer:
      "We use advanced tracking systems to monitor your progress throughout your rehabilitation journey. You'll receive regular progress reports, and our therapists will discuss your improvements and adjust your treatment plan during regular assessments.",
    icon: FileText,
  },
];

export function FAQSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Common questions about our rehabilitation services and programs
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg border border-gray-200"
              >
                <AccordionTrigger className="px-6 text-left">
                  <div className="flex items-center gap-3">
                    <faq.icon className="h-5 w-5 text-green-600 shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pl-14">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
