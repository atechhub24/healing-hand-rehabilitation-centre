"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Start Your Recovery Journey Today
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Take the first step towards regaining your strength, mobility, and independence.
            Our expert rehabilitation team is here to guide you every step of the way.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/register/customer">
              <Button
                size="lg"
                variant="secondary"
                className="font-semibold hover:bg-white/90"
              >
                Schedule Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white"
              >
                Contact Us
                <MessageCircle className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
