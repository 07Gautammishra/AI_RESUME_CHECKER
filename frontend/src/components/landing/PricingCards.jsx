import React, { useState } from "react";
import { motion } from "framer-motion";

const plans = [
  {
    id: "basic",
    name: "Starter",
    price: 100,
    period: "/month",
    description: "Perfect for individuals and small personal projects.",
    features: [
      "1,000 AI Credits per month",
      "Standard response speed",
      "Access to basic models",
      "Community support",
      "Single user workspace",
    ],
    ctaText: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    price: 300,
    period: "/month",
    description: "Ideal for power users, creators, and growing teams.",
    popular: true,
    features: [
      "10,000 AI Credits per month",
      "Priority response speed",
      "Access to advanced AI models",
      "Email & chat support",
      "Up to 3 team members",
      "Custom prompt templates",
    ],
    ctaText: "Upgrade to Pro",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 500,
    period: "/month",
    description: "For businesses needing maximum scale and dedicated support.",
    features: [
      "Unlimited AI Credits",
      "Ultra-fast dedicated speed",
      "Access to fine-tuned models",
      "24/7 Priority support",
      "Unlimited team members",
      "API access & webhooks",
      "Dedicated account manager",
    ],
    ctaText: "Get Enterprise",
  },
];

export const PricingCards = () => {
  const [selectedPlan, setSelectedPlan] = useState("pro");

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12" id="pricing">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span
          className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border"
          style={{
            backgroundColor: "var(--accent-soft)",
            borderColor: "var(--border)",
            color: "var(--accent-strong)",
          }}
        >
          Pricing Plans
        </span>
        <h2
          className="text-3xl sm:text-4xl font-bold mt-4 mb-3 tracking-tight"
          style={{ color: "var(--ink)" }}
        >
          Flexible Plans for Every Need
        </h2>
        <p className="text-base" style={{ color: "var(--ink-muted)" }}>
          Choose the right plan to power your workflow with AI capabilities.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative flex flex-col justify-between rounded-2xl p-6 sm:p-8 cursor-pointer border transition-all duration-300"
              style={{
                background: plan.popular
                  ? `linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%)`
                  : "var(--surface)",
                borderColor: plan.popular
                  ? "var(--accent)"
                  : isSelected
                  ? "var(--accent-strong)"
                  : "var(--border)",
                boxShadow: plan.popular
                  ? "var(--shadow-hover)"
                  : "var(--shadow-card)",
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "var(--surface)",
                      borderColor: "var(--accent-strong)",
                    }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              {/* Top Details */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "var(--ink)" }}
                  >
                    {plan.name}
                  </h3>
                </div>

                <p
                  className="text-sm mb-6 min-h-[40px]"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline mb-6">
                  <span
                    className="text-4xl font-extrabold tracking-tight"
                    style={{ color: "var(--ink)" }}
                  >
                    ₹{plan.price}
                  </span>
                  <span
                    className="text-sm ml-1.5 font-medium"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    INR {plan.period}
                  </span>
                </div>

                <div
                  className="w-full h-px mb-6"
                  style={{ backgroundColor: "var(--border)" }}
                />

                {/* Feature List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm gap-3">
                      <div
                        className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: "var(--accent-soft)",
                          color: "var(--success)",
                        }}
                      >
                        ✓
                      </div>
                      <span style={{ color: "var(--ink)" }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 border shadow-sm"
                style={
                  plan.popular || isSelected
                    ? {
                        backgroundColor: "var(--accent-hero)",
                        color: "#FFFFFF",
                        borderColor: "var(--accent-hero-2)",
                      }
                    : {
                        backgroundColor: "var(--surface-2)",
                        color: "var(--ink)",
                        borderColor: "var(--border)",
                      }
                }
              >
                {plan.ctaText}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingCards;