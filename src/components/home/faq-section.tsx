"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calendar,
  Users,
  Shield,
  UserPlus,
  Phone,
  FileText,
} from "lucide-react";

const faqs = [
  {
    question: "How do I book an appointment?",
    answer:
      "Booking an appointment is easy! Simply log in to your account, select your preferred healthcare provider, choose an available time slot, and confirm your booking. You'll receive an email confirmation with all the details.",
    icon: Calendar,
  },
  {
    question: "What types of healthcare providers are available?",
    answer:
      "We have a diverse network of healthcare providers including doctors, specialists, paramedics, and laboratory services. All providers are verified and certified in their respective fields.",
    icon: Users,
  },
  {
    question: "How secure is my medical information?",
    answer:
      "Your privacy is our top priority. We use industry-standard encryption and security measures to protect your medical information. Only authorized healthcare providers can access your records with your permission.",
    icon: Shield,
  },
  {
    question: "Can I manage my family's healthcare through one account?",
    answer:
      "Yes! Our family management feature allows you to add family members to your account and manage their appointments, medical records, and prescriptions all in one place.",
    icon: UserPlus,
  },
  {
    question: "What should I do in case of an emergency?",
    answer:
      "For medical emergencies, always call your local emergency services first. Our platform offers 24/7 support for urgent but non-emergency medical consultations through our network of healthcare providers.",
    icon: Phone,
  },
  {
    question: "How do I access my test results?",
    answer:
      "Test results are automatically uploaded to your secure patient portal once they're available. You'll receive a notification, and you can view, download, or share them with your healthcare providers directly through the platform.",
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
            Find answers to common questions about our healthcare platform
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
                    <faq.icon className="h-5 w-5 text-blue-600 shrink-0" />
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
